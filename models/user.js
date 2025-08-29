import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "crypto";
import clientPromise from "@/lib/mongodb";

function escapeRegex(str = "") {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getUserCollection() {
    return clientPromise.then((client) => client.db().collection("users"));
}

export async function createUser({ email, name, password }) {
    const col = await getUserCollection();
    const doc = { email, name, createdAt: new Date() };

    if (password) {
        const salt = randomBytes(16).toString("hex");
        const hash = scryptSync(password, salt, 64).toString("hex");
        doc.password = `${salt}:${hash}`;
        doc.provider = "local";
    } else {
        // created via OAuth provider (e.g. google)
        doc.provider = "google";
    }

    const res = await col.insertOne(doc);
    return res.insertedId;
}

export async function findUserByEmail(email) {
  if (!email) return null;
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || undefined);
  const users = db.collection("users");
  const q = { email: { $regex: `^${escapeRegex(email)}$`, $options: "i" } };
  return users.findOne(q);
}

/** Verify a supplied password against stored "salt:hash" string */
export function verifyPassword(storedPassword, suppliedPassword) {
    if (!storedPassword || !suppliedPassword) return false;
    const parts = storedPassword.split(":");
    if (parts.length !== 2) return false;
    const [salt, key] = parts;
    const derived = scryptSync(suppliedPassword, salt, 64);
    const keyBuf = Buffer.from(key, "hex");
    if (keyBuf.length !== derived.length) return false;
    return timingSafeEqual(keyBuf, derived);
}

/**
 * Find existing user by email or create a Google-backed user record.
 * Returns the full user document.
 */
export async function upsertGoogleUser({ email, name, googleId }) {
    const col = await getUserCollection();
    const existing = await col.findOne({ email });
    if (existing) {
        // ensure googleId and provider are recorded
        const update = {};
        // If the user was created locally or provider isn't google, switch to google
        if (existing.provider !== "google") update.provider = "google";
        // Set or update the googleId if provided
        if (googleId && existing.googleId !== googleId) update.googleId = googleId;
        if (Object.keys(update).length) {
            await col.updateOne({ _id: existing._id }, { $set: update });
            const updated = await col.findOne({ _id: existing._id });
            try { (await import('../lib/userCache.js')).clearUserCache(email); } catch (e) {}
            return updated;
        }
        return existing;
    }

    const doc = {
        email,
        name,
        provider: "google",
        googleId,
        createdAt: new Date(),
    };
    const res = await col.insertOne(doc);
    const created = await col.findOne({ _id: res.insertedId });
    try { (await import('../lib/userCache.js')).clearUserCache(email); } catch (e) {}
    return created;
}

/**
 * Update a user's profile fields by their current email.
 * Accepts an object with optional { name, newEmail, image }.
 * Returns the updated user document or throws on conflict.
 */
export async function updateUserProfileByEmail(currentEmail, { name, newEmail, image }) {
    const col = await getUserCollection();
    const user = await col.findOne({ email: currentEmail });
    if (!user) return null;

    const update = {};
    if (name && name !== user.name) update.name = name;
    if (typeof image !== 'undefined') update.image = image;

    if (newEmail && newEmail !== currentEmail) {
        // ensure newEmail isn't already used by another account
        const existing = await col.findOne({ email: newEmail });
        if (existing) {
            const err = new Error('email_in_use');
            err.code = 'email_in_use';
            throw err;
        }
        update.email = newEmail;
    }

    if (Object.keys(update).length === 0) return await col.findOne({ _id: user._id });

    await col.updateOne({ _id: user._id }, { $set: update });
    const updated = await col.findOne({ _id: user._id });
    try { (await import('../lib/userCache.js')).clearUserCache(currentEmail); } catch (e) {}
    if (newEmail) {
        try { (await import('../lib/userCache.js')).clearUserCache(newEmail); } catch (e) {}
    }
    return updated;
}

/**
 * Create a password reset token for the user with the given email.
 * Stores the token and expiry on the user document and returns the token.
 */
export async function createPasswordResetToken(email) {
    const col = await getUserCollection();
    const user = await col.findOne({ email });
    if (!user) return null;
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    // store only an HMAC of the token in the database for security
    const secret = process.env.RESET_TOKEN_SECRET;
    if (!secret) throw new Error("RESET_TOKEN_SECRET environment variable is required to create reset tokens");
    const tokenHash = createHmac("sha256", secret).update(token).digest("hex");
    await col.updateOne(
        { _id: user._id },
        { $set: { resetTokenHash: tokenHash, resetTokenExpires: expires } }
    );
    // return token and expiry so callers can include expiry in communications
    return { token, expires: expires.toISOString() };
}

/* Added: createEmailVerificationToken & verifyEmailToken */
export async function createEmailVerificationToken(email) {
    const col = await getUserCollection();
    const user = await col.findOne({ email });
    if (!user) return null;
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const secret = process.env.VERIFY_TOKEN_SECRET;
    if (!secret) throw new Error("VERIFY_TOKEN_SECRET environment variable is required to create verification tokens");
    const tokenHash = createHmac("sha256", secret).update(token).digest("hex");
    await col.updateOne(
        { _id: user._id },
        { $set: { verifyTokenHash: tokenHash, verifyTokenExpires: expires, emailVerified: false } }
    );
    return { token, expires: expires.toISOString() };
}

export async function verifyEmailToken(token) {
    const col = await getUserCollection();
    const secret = process.env.VERIFY_TOKEN_SECRET;
    if (!secret) throw new Error("VERIFY_TOKEN_SECRET environment variable is required to verify tokens");
    const tokenHash = createHmac("sha256", secret).update(token).digest("hex");
    const user = await col.findOne({ verifyTokenHash: tokenHash, verifyTokenExpires: { $gt: new Date() } });
    if (!user) return null;
    await col.updateOne(
        { _id: user._id },
        { $set: { emailVerified: true }, $unset: { verifyTokenHash: "", verifyTokenExpires: "" } }
    );
    return true;
}

/**
 * Reset a user's password using a valid token. Returns true on success.
 */
export async function resetPassword(token, newPassword) {
    const col = await getUserCollection();
    // compare HMAC of supplied token to stored hash using same server secret
    const secret = process.env.RESET_TOKEN_SECRET;
    if (!secret) throw new Error("RESET_TOKEN_SECRET environment variable is required to verify reset tokens");
    const tokenHash = createHmac("sha256", secret).update(token).digest("hex");
    const user = await col.findOne({ resetTokenHash: tokenHash, resetTokenExpires: { $gt: new Date() } });
    if (!user) return null;
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(newPassword, salt, 64).toString("hex");
    const password = `${salt}:${hash}`;
    await col.updateOne(
        { _id: user._id },
        { $set: { password }, $unset: { resetTokenHash: "", resetTokenExpires: "" } }
    );
    return true;
}