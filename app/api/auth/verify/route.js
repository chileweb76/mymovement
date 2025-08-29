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
    const base = process.env.RESET_URL_BASE || process.env.NEXTAUTH_URL || "http://localhost:3000";
    
    console.log(`[VERIFY DEBUG] Received token: ${token ? `${token.substring(0, 10)}...${token.substring(token.length - 10)}` : 'null'}`);
    console.log(`[VERIFY DEBUG] Token length: ${token ? token.length : 0} chars`);
    
    if (!token) {
      console.log("[VERIFY DEBUG] No token provided");
      return NextResponse.redirect(new URL("/verify-email?result=failure", base));
    }

    const ok = await verifyEmailToken(token);
    console.log(`[VERIFY DEBUG] Token verification result: ${ok ? 'SUCCESS' : 'FAILED'}`);
    
    if (ok) {
      return NextResponse.redirect(new URL("/verify-email?result=success", base));
    }

    return NextResponse.redirect(new URL("/verify-email?result=failure", base));
  } catch (err) {
    console.error("verify token error", err);
    const base = process.env.RESET_URL_BASE || process.env.NEXTAUTH_URL || "http://localhost:3000";
    return NextResponse.redirect(new URL("/verify-email?result=failure", base));
  }
}
