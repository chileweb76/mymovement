import { NextResponse } from "next/server";
import { CourierClient } from "@trycourier/courier";
import { createPasswordResetToken } from "../../../../models/user.js";

const courier = new CourierClient({ authorizationToken: process.env.COURIER_AUTH_TOKEN });

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "missing_email" }, { status: 400 });

  const result = await createPasswordResetToken(email);
  if (!result) return NextResponse.json({ error: "user_not_found" }, { status: 404 });

  const { token, expires } = result;

  // Build reset link
  const base = process.env.RESET_URL_BASE || "http://localhost:3000";
  const resetUrl = `${base.replace(/\/$/, "")}/reset?token=${encodeURIComponent(token)}`;

    // Send email via Courier using a template ID and template data.
    // Provide COURIER_RESET_TEMPLATE_ID in env to use a template; otherwise fall back to a simple message.
    try {
      const templateId = process.env.COURIER_RESET_TEMPLATE_ID;
      if (templateId) {
        // pass expiry information to the template (ISO string + minutes)
        const expiresIso = expires;
        const expiresMinutes = Math.round((new Date(expiresIso) - new Date()) / 60000);
        try {
          const dataPayload = {
            // multiple aliases so template variables map regardless of naming convention
            resetUrl,
            reset_url: resetUrl,
            resetLink: resetUrl,
            reset_link: resetUrl,
            email,
            user_email: email,
            siteName: process.env.SITE_NAME || "MyMovement",
            site_name: process.env.SITE_NAME || "MyMovement",
            resetExpiresIso: expiresIso,
            reset_expires_iso: expiresIso,
            resetExpiresMinutes: expiresMinutes,
            reset_expires_minutes: expiresMinutes,
          };
          const result = await courier.send({
            message: {
              to: { email },
              template: templateId,
              data: dataPayload,
            },
          });
          console.log('courier send result:', JSON.stringify(result));
        } catch (err) {
          console.error('courier send error:', err);
          throw err;
        }
      } else {
        try {
          const result = await courier.send({
            message: {
              to: { email },
              content: {
                title: "Reset your password",
                body: `You requested a password reset. Click the link below to choose a new password:\n\n${resetUrl}\n\nThis link expires at ${expires}. If you did not request this, you can safely ignore this email.`,
              },
            },
          });
          console.log('courier send result (fallback):', JSON.stringify(result));
        } catch (err) {
          console.error('courier send error (fallback):', err);
          throw err;
        }
      }
    } catch (sendErr) {
      console.error("courier send error", sendErr);
      // continue — we don't want to leak internal errors to clients
    }

  // Do not return the token in API responses. Email contains the reset link.
  // Return expiry minutes to improve client UX without exposing tokens.
  const resetExpiresMinutes = Math.round((new Date(expires) - new Date()) / 60000);
  return NextResponse.json({ ok: true, resetExpiresMinutes }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
