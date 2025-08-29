import { NextResponse } from "next/server";
import { findUserByEmail, createEmailVerificationToken } from "../../../../models/user.js";
import { CourierClient } from "@trycourier/courier";

const courier = new CourierClient({ authorizationToken: process.env.COURIER_AUTH_TOKEN });

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
        const result = await createEmailVerificationToken(email);
        if (result) {
          const { token, expires } = result;
          const base = process.env.RESET_URL_BASE || "http://localhost:3000";
          const verifyUrl = `${base.replace(/\/$/, "")}/api/auth/verify?token=${encodeURIComponent(token)}`;
          const templateId = process.env.COURIER_VERIFY_TEMPLATE_ID;

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
            await courier.send({ message: { to: { email }, template: templateId, data: dataPayload } });
          } else {
            await courier.send({ message: { to: { email }, content: { title: "Verify your email", body: `Click to verify your email:\n\n${verifyUrl}\n\nThis link expires at ${expires}.` } } });
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
