# Email Verification Fix

## Issue
The email verification was failing because `RESET_URL_BASE` in `.env` was pointing to the production Vercel URL instead of localhost for local development.

## Solution
For local development, ensure your `.env` file has:

```bash
RESET_URL_BASE=http://localhost:3000
```

For production (Vercel), it should be:
```bash
RESET_URL_BASE=https://mymovement.vercel.app
```

## Environment Variables Required
- `COURIER_AUTH_TOKEN` - Courier API key for sending emails
- `VERIFY_TOKEN_SECRET` - Secret for HMAC token verification
- `RESET_URL_BASE` - Base URL for verification links
- `COURIER_VERIFY_TEMPLATE_ID` - (Optional) Courier template ID

## Testing Verification Flow
1. Register a new user
2. Check server logs for verification URL
3. Click the verification link or curl it directly
4. Should see "Token verification result: SUCCESS" in logs
5. User will be redirected to success page

## Debug Output
The verification flow now includes detailed debug logging:
- Token generation and length
- Verification URL being sent
- Token validation process
- User verification success/failure
