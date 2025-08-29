import { NextResponse } from "next/server";
import { upsertGoogleUser } from "../../../../models/user.js";
import { OAuth2Client } from "google-auth-library";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
if (!CLIENT_ID) console.warn("google route: GOOGLE_CLIENT_ID is not set (try NEXT_PUBLIC_GOOGLE_CLIENT_ID)");
const oauthClient = new OAuth2Client(CLIENT_ID || "");

/** POST /api/auth/google
 * body: { id_token }
 */
export async function POST(req) {
  try {
    const { id_token } = await req.json();
    if (!id_token) {
      return NextResponse.json({ error: "missing_id_token" }, { status: 400 });
    }

    // Verify ID token using Google OAuth2 client
    const ticket = await oauthClient.verifyIdToken({
      idToken: id_token,
      audience: CLIENT_ID, // ensures token was issued for our client id
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json({ error: "invalid_token_payload" }, { status: 401 });
    }

    const { email, name, sub: googleId, email_verified } = payload;
    if (!email || !googleId) {
      return NextResponse.json({ error: "invalid_token_payload" }, { status: 400 });
    }

    // Optionally enforce email_verified:
    // if (email_verified !== true) { ... }

    const user = await upsertGoogleUser({ email, name: name || email, googleId });

    return NextResponse.json({ user: { id: user._id.toString(), email: user.email, name: user.name } }, { status: 200 });
  } catch (err) {
    console.error("google signin error", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}