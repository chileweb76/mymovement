import { NextResponse } from "next/server";
import { findUserByEmail, createUser } from "../../../../models/user.js";
import { createEmailVerificationToken } from "../../../../models/user.js";
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
      // Check required environment variables
      const courierAuth = process.env.COURIER_AUTH_TOKEN;
      const verifySecret = process.env.VERIFY_TOKEN_SECRET;
      
      if (!courierAuth) {
        console.error("[PROD ERROR] COURIER_AUTH_TOKEN not set - emails will not be sent");
        return NextResponse.json({ id: id.toString() }, { status: 201 });
      }
      
      if (!verifySecret) {
        console.error("[PROD ERROR] VERIFY_TOKEN_SECRET not set - verification will not work");
        return NextResponse.json({ id: id.toString() }, { status: 201 });
      }

      if (!courier) {
        console.error("[PROD ERROR] Courier client not initialized - emails will not be sent");
        return NextResponse.json({ id: id.toString() }, { status: 201 });
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