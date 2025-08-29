import { NextResponse } from "next/server";
import { verifyEmailToken } from "../../../../models/user.js";

/**
 * GET /api/auth/verify?token=...
 * Verifies the token and redirects to a friendly UI at /verify-email
 */
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) {
      return NextResponse.redirect("/verify-email?result=failure");
    }

    const ok = await verifyEmailToken(token);
    if (ok) {
      return NextResponse.redirect("/verify-email?result=success");
    }

    return NextResponse.redirect("/verify-email?result=failure");
  } catch (err) {
    console.error("verify token error", err);
    return NextResponse.redirect("/verify-email?result=failure");
  }
}
