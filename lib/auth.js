import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { findUserByEmail, createUser, verifyPassword, upsertGoogleUser } from "../models/user.js";
import { getCachedUser, setCachedUser, clearUserCache } from "./userCache.js";

/**
 * authOptions used by NextAuth and getServerSession
 */
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await findUserByEmail(credentials.email);
        if (!user) return null;
        const ok = verifyPassword(user.password, credentials.password);
        if (!ok) return null;
        return { id: user._id.toString(), email: user.email, name: user.name };
      },
    }),
    // Diagnostic: log Google env presence (masked) to help debug runtime config
    (function createGoogleProvider() {
      const resolvedClientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
      if (!resolvedClientId) {
        console.warn("[auth] GOOGLE_CLIENT_ID / NEXT_PUBLIC_GOOGLE_CLIENT_ID not set");
      } else {
        // mask middle of client id for logs
        const masked = `${resolvedClientId.slice(0, 10)}...${resolvedClientId.slice(-8)}`;
        console.info(`[auth] Google client id resolved: ${masked}`);
      }
      return GoogleProvider({
        clientId: resolvedClientId,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      });
    })(),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // when signing in with Google, ensure user record exists/upsert
      if (account?.provider === "google") {
        const googleId = profile?.sub || profile?.id;
        const email = profile?.email;
        const name = profile?.name || email;
        if (email && googleId) {
          await upsertGoogleUser({ email, name, googleId });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // On initial sign-in NextAuth provides `user`. Persist a compact user shape.
      if (user) {
        token.user = {
          id: user.id || user._id || token.sub,
          email: user.email,
          name: user.name,
          image: user.image || null,
        };
        return token;
      }
      // For subsequent requests, ensure token.user is in-sync with the DB
      // If the DB record differs (name/email/image), update token.user so the
      // returned session reflects profile changes without requiring a re-login.
      try {
        const emailToLookup = (token.user && token.user.email) || token.email;
        if (emailToLookup) {
          // consult cache first
          let dbUser = getCachedUser(emailToLookup);
          if (!dbUser) {
            dbUser = await findUserByEmail(emailToLookup);
            if (dbUser) setCachedUser(emailToLookup, dbUser);
          }

          if (dbUser) {
            const dbUserShape = {
              id: dbUser._id?.toString?.() || dbUser._id,
              email: dbUser.email,
              name: dbUser.name,
              image: dbUser.image || null,
            };

            // only refresh token.user if it's missing or stale
            const now = Date.now();
            const refreshInterval = parseInt(process.env.TOKEN_REFRESH_INTERVAL_MS) || 30 * 1000; // default 30s
            const lastRefreshed = token.lastRefreshed || 0;
            const isStale = now - lastRefreshed > refreshInterval;

            const needsRefresh = !token.user || isStale ||
              token.user.name !== dbUserShape.name ||
              token.user.email !== dbUserShape.email ||
              token.user.image !== dbUserShape.image;

            if (needsRefresh) {
              token.user = dbUserShape;
              token.lastRefreshed = now;
            }
          }
        }
      } catch (err) {
        console.error("jwt callback: failed to load user for session", err);
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = {
          ...token.user,
          // ensure there's always a sensible avatar fallback
          image: token.user.image || "/img/user.png",
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};