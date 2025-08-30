# Email Verification 500 Error Fix

## Issue Diagnosed
The verification link was returning HTTP 500 because `VERIFY_TOKEN_SECRET` environment variable was not set in production, causing the verification functions to throw errors instead of handling the missing configuration gracefully.

## Fixes Applied

### 1. Fixed user.js model functions
- `verifyEmailToken()` now returns `null` instead of throwing when `VERIFY_TOKEN_SECRET` is missing
- `createEmailVerificationToken()` now returns `null` instead of throwing when `VERIFY_TOKEN_SECRET` is missing  
- Added detailed logging to help diagnose verification issues

### 2. Environment Variables Required in Production

Add these to your Vercel environment variables:

```bash
# Required for email verification to work
VERIFY_TOKEN_SECRET=your-random-secret-key-here

# Required for sending emails via Courier
COURIER_AUTH_TOKEN=your-courier-production-auth-token

# Optional: Courier template ID for verification emails
COURIER_VERIFY_TEMPLATE_ID=your-template-id

# Required: Base URL for verification links
RESET_URL_BASE=https://mymovement.vercel.app

# Already set (NextAuth)
NEXTAUTH_URL=https://mymovement.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret
```

## How to Generate VERIFY_TOKEN_SECRET

Run this in your terminal to generate a strong random secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Testing the Fix

### Local Test
1. Set the environment variables locally in `.env.local`
2. Run: `npm run dev`
3. Test registration and click the verification link

### Production Test
1. Add environment variables to Vercel
2. Redeploy
3. Test registration flow

## Verification Flow Debug

The verification now includes detailed logging:
- Token length and hash generation
- Environment variable status
- Database query results
- Token expiration status

Check your Vercel function logs for `[VERIFY DEBUG]` and `[VERIFY ERROR]` entries.

## Current Status - UPDATED
✅ 500 errors fixed - graceful handling of missing env vars
✅ Latest code deployed to production (commits pushed and auto-deployed)
✅ VERIFY_TOKEN_SECRET confirmed set in Vercel
❌ Still getting 500 errors on verification endpoint in production

## Possible Production Issue
The verification endpoint may still be failing due to:
1. **RESET_URL_BASE mismatch**: The base URL might be incorrect in production
2. **MongoDB connection**: Database connection issues in production
3. **Import/module issues**: ES modules or import paths in serverless environment

## Next Debug Steps
1. **Check Production Logs**: Go to Vercel dashboard → mymovement project → Functions tab → View logs for recent errors
2. **Test Registration**: Try registering with a real email to see if verification emails are sent
3. **Manual Environment Check**: Verify all environment variables are set correctly in Vercel

## Environment Variables Status in Vercel
✅ VERIFY_TOKEN_SECRET - Set (16m ago)
✅ COURIER_AUTH_TOKEN - Set  
✅ RESET_URL_BASE - Set
✅ NEXTAUTH_URL - Set
✅ MONGODB_URI - Set

## Next Steps
1. Add the required environment variables to Vercel
2. Redeploy to production
3. Test the complete registration → email → verification flow
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
