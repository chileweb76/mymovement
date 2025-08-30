import { NextResponse } from "next/server";
import { CourierClient } from "@trycourier/courier";
import { createPasswordResetToken } from "../../../../models/user.js";

const courier = new CourierClient({ authorizationToken: process.env.COURIER_AUTH_TOKEN });

// Simple GET method to test if route is accessible
export async function GET() {
  return NextResponse.json({ message: "Forgot password endpoint is accessible" }, { status: 200 });
}

export async function POST(req) {
  try {
    const { email } = await req.json();
    console.log('Forgot password request for email:', email);
    
    if (!email) return NextResponse.json({ error: "missing_email" }, { status: 400 });

    // Verify required environment variables
    if (!process.env.COURIER_AUTH_TOKEN) {
      console.error('Missing COURIER_AUTH_TOKEN environment variable');
      return NextResponse.json({ error: "server_configuration_error" }, { status: 500 });
    }

  const result = await createPasswordResetToken(email);
  if (!result) {
    console.log('User not found for email:', email);
    return NextResponse.json({ error: "user_not_found" }, { status: 404 });
  }

  const { token, expires } = result;
  console.log('Password reset token created, expires:', expires);

  // Build reset link with robust URL formatting
  const base = process.env.RESET_URL_BASE || "http://localhost:3000";
  let formattedBase = base;
  
  // Handle malformed URLs like 'https//domain.com'
  if (base.includes('//') && !base.includes('://')) {
    formattedBase = base.replace('//', '://');
  }
  
  const resetUrl = `${formattedBase.replace(/\/$/, "")}/reset?token=${encodeURIComponent(token)}`;
  console.log('Reset URL constructed:', resetUrl);

    // Send email via Courier using a template ID and template data.
    // Provide COURIER_RESET_TEMPLATE_ID in env to use a template; otherwise fall back to a simple message.
    try {
      const templateId = process.env.COURIER_RESET_TEMPLATE_ID;
      console.log('Using Courier template ID:', templateId);
      
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
          
          console.log('Sending Courier email with template data:', {
            to: email,
            templateId,
            dataKeys: Object.keys(dataPayload)
          });
          
          const result = await courier.send({
            message: {
              to: { email },
              template: templateId,
              data: dataPayload,
            },
          });
          console.log('Courier send success:', JSON.stringify(result, null, 2));
        } catch (err) {
          console.error('Courier template send error:', {
            message: err.message,
            code: err.code,
            response: err.response?.data,
            stack: err.stack
          });
          throw err;
        }
      } else {
        try {
          console.log('Using Courier fallback (no template)');
          const result = await courier.send({
            message: {
              to: { email },
              content: {
                title: "Reset your password",
                body: `You requested a password reset. Click the link below to choose a new password:\n\n${resetUrl}\n\nThis link expires at ${expires}. If you did not request this, you can safely ignore this email.`,
              },
            },
          });
          console.log('Courier fallback send success:', JSON.stringify(result, null, 2));
        } catch (err) {
          console.error('Courier fallback send error:', {
            message: err.message,
            code: err.code,
            response: err.response?.data,
            stack: err.stack
          });
          throw err;
        }
      }
    } catch (sendErr) {
      console.error("Courier send failed:", {
        message: sendErr.message,
        code: sendErr.code,
        response: sendErr.response?.data
      });
      // Return error for debugging in development/testing
      if (process.env.NODE_ENV === 'development' || process.env.RETURN_RESET_TOKEN_IN_RESPONSE === '1') {
        return NextResponse.json({ 
          error: "email_send_failed", 
          details: sendErr.message 
        }, { status: 500 });
      }
      // In production, continue silently to avoid leaking internal errors
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
