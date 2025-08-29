import { NextResponse } from "next/server";
import { findUserByEmail, createUser } from "../../../../models/user.js";
import { createEmailVerificationToken } from "../../../../models/user.js";
import { CourierClient } from "@trycourier/courier";

const courier = new CourierClient({ authorizationToken: process.env.COURIER_AUTH_TOKEN });

/** POST /api/auth/register
 * body: { email, name, password }
 */
export async function POST(req) {
  try {
    const { email, name, password } = await req.json();
    if (!email || !name || !password) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "user_exists" }, { status: 409 });
    }

    const id = await createUser({ email, name, password });

    // create verification token and send email (do not fail registration on email send errors)
    try {
      const result = await createEmailVerificationToken(email);
      if (result) {
        const { token, expires } = result;
        const base = process.env.RESET_URL_BASE || "http://localhost:3000";
        const verifyUrl = `${base.replace(/\/$/, "")}/api/auth/verify?token=${encodeURIComponent(token)}`;
        const templateId = process.env.COURIER_VERIFY_TEMPLATE_ID;

        console.log(`[VERIFY DEBUG] Generated verification URL: ${verifyUrl}`);
        console.log(`[VERIFY DEBUG] Token expires: ${expires}`);
        console.log(`[VERIFY DEBUG] Token length: ${token.length} chars`);

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
          const sendRes = await courier.send({
            message: {
              to: { email },
              template: templateId,
              data: dataPayload,
            },
          });
          console.log("courier send result (template):", JSON.stringify(sendRes));
        } else {
          // fallback plain message
          const sendRes = await courier.send({
            message: {
              to: { email },
              content: {
                title: "Verify your email",
                body: `Thanks for registering. Click to verify your email:\n\n${verifyUrl}\n\nThis link expires at ${expires}.`,
              },
            },
          });
          console.log("courier send result (fallback):", JSON.stringify(sendRes));
        }
      }
    } catch (mailErr) {
      console.error("verification email send error", mailErr);
      // don't surface to client
    }

    return NextResponse.json({ id: id.toString() }, { status: 201 });
  } catch (err) {
    console.error("register error", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}