import { NextResponse } from "next/server";
import { findUserByEmail, createEmailVerificationToken } from "../../../../models/user.js";
import { CourierClient } from "@trycourier/courier";

// Initialize Courier client with error handling
let courier;
try {
  const authToken = process.env.COURIER_AUTH_TOKEN;
  if (!authToken) {
    console.warn("[COURIER] COURIER_AUTH_TOKEN not set - email sending will fail");
  }
  courier = new CourierClient({ authorizationToken: authToken });
} catch (err) {
  console.error("[COURIER] Failed to initialize Courier client:", err);
}

/** POST /api/auth/resend
 * body: { email }
 * Always returns a 200 success message to avoid user enumeration.
 */
export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "missing_email" }, { status: 400 });
    }

    // find user and, if present, create + send verification token
    try {
      const user = await findUserByEmail(email);
      if (user) {
        // Check required environment variables
        const courierAuth = process.env.COURIER_AUTH_TOKEN;
        const verifySecret = process.env.VERIFY_TOKEN_SECRET;
        
        if (!courierAuth || !courier) {
          console.error("[PROD ERROR] Courier not available - cannot resend verification email");
          return NextResponse.json({ ok: true }); // Still return success to avoid enumeration
        }
        
        if (!verifySecret) {
          console.error("[PROD ERROR] VERIFY_TOKEN_SECRET not set - verification will not work");
          return NextResponse.json({ ok: true });
        }

        const result = await createEmailVerificationToken(email);
        if (result) {
          const { token, expires } = result;
          
          // Ensure base URL is properly formatted
          let base = process.env.RESET_URL_BASE || process.env.NEXTAUTH_URL || "http://localhost:3000";
          if (base && !base.startsWith('http://') && !base.startsWith('https://')) {
            base = 'https://' + base;
          }
          if (base === 'https//mymovement.vercel.app') {
            base = 'https://mymovement.vercel.app';
          }
          
          const verifyUrl = `${base.replace(/\/$/, "")}/api/auth/verify?token=${encodeURIComponent(token)}`;
          const templateId = process.env.COURIER_VERIFY_TEMPLATE_ID;

          console.log(`[VERIFY DEBUG] Generated verification URL: ${verifyUrl}`);
          console.log(`[VERIFY DEBUG] Token expires: ${expires}`);
          console.log(`[VERIFY DEBUG] Token length: ${token.length} chars`);
          console.log(`[VERIFY DEBUG] Using base URL: ${base}`);
          console.log(`[VERIFY DEBUG] Environment: ${process.env.NODE_ENV}`);

          const dataPayload = {
            verifyUrl,
            verify_url: verifyUrl,
            verifyLink: verifyUrl,
            verify_link: verifyUrl,
            email,
            user_email: email,
            siteName: process.env.SITE_NAME || "MyMovement",
            verifyExpiresIso: expires,
          };

          if (templateId) {
            const sendRes = await courier.send({ message: { to: { email }, template: templateId, data: dataPayload } });
            console.log("courier send result (template):", JSON.stringify(sendRes));
          } else {
            const sendRes = await courier.send({ message: { to: { email }, content: { title: "Verify your email", body: `Click to verify your email:\n\n${verifyUrl}\n\nThis link expires at ${expires}.` } } });
            console.log("courier send result (fallback):", JSON.stringify(sendRes));
          }
        }
      }
    } catch (mailErr) {
      console.error("resend verification email error", mailErr);
      // swallow errors — always return generic success
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("resend route error", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
