import { NextResponse } from "next/server";
import { findUserByEmail, verifyPassword } from "../../../../models/user.js";

/** POST /api/auth/login
 * body: { email, password }
 */
export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    // Check if email is verified for local accounts
    if (user.provider === "local" && !user.emailVerified) {
      return NextResponse.json({ error: "email_not_verified" }, { status: 403 });
    }

    const ok = verifyPassword(user.password, password);
    if (!ok) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    // TODO: attach session or JWT. For now return basic user info.
    return NextResponse.json({ user: { id: user._id.toString(), email: user.email, name: user.name } }, { status: 200 });
  } catch (err) {
    console.error("login error", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}