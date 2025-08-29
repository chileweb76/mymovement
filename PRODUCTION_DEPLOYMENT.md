# Production Deployment Guide - Email Verification

## Required Environment Variables for Production

Set these in your Vercel dashboard under Project Settings > Environment Variables:

### Required Variables
```bash
COURIER_AUTH_TOKEN=pk_prod_xxx... # Your Courier production API key
VERIFY_TOKEN_SECRET=your-long-random-secret-here # 32+ character random string
RESET_URL_BASE=https://yourdomain.com # Your production domain
NEXTAUTH_SECRET=your-nextauth-secret # NextAuth secret
MONGODB_URI=mongodb+srv://... # Your MongoDB connection string
```

### Optional Variables
```bash
COURIER_VERIFY_TEMPLATE_ID=tmpl_xxx # If using Courier templates
SITE_NAME=YourAppName # Used in email content
NODE_ENV=production # Usually set by Vercel automatically
```

## Common Production Issues

### 1. Environment Variables Missing
- Check Vercel dashboard for all required env vars
- Ensure `COURIER_AUTH_TOKEN` is set to production key
- Verify `RESET_URL_BASE` points to your production domain

### 2. Courier API Key Issues
- Use production Courier API key (starts with `pk_prod_`)
- Not development/sandbox key (starts with `pk_test_`)
- Check Courier dashboard for API key validity

### 3. Domain/URL Issues
- `RESET_URL_BASE` must match your production domain
- Don't include trailing slash in `RESET_URL_BASE`
- Ensure HTTPS is used for production

### 4. MongoDB Connection
- Use production MongoDB cluster
- Ensure IP whitelist includes Vercel's IPs (or use 0.0.0.0/0)
- Check connection string format

## Debugging Production Issues

### Check Vercel Logs
```bash
npx vercel logs --project=your-project-name
```

### Test Production API
```bash
curl -X POST https://yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test","password":"test123"}'
```

### Expected Log Output (Success)
```
[VERIFY DEBUG] Generated verification URL: https://yourdomain.com/api/auth/verify?token=...
[VERIFY DEBUG] Token expires: 2025-08-29T...
[VERIFY DEBUG] Token length: 64 chars
[VERIFY DEBUG] Using base URL: https://yourdomain.com
[VERIFY DEBUG] Environment: production
courier send result (template): {"requestId":"1-xxx..."}
```

### Error Indicators
```
[PROD ERROR] COURIER_AUTH_TOKEN not set - emails will not be sent
[PROD ERROR] VERIFY_TOKEN_SECRET not set - verification will not work
[PROD ERROR] Courier client not initialized - emails will not be sent
[COURIER] Failed to initialize Courier client: Error...
```

## Vercel Environment Variable Setup

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable for Production environment
5. Redeploy your application

## Testing Checklist

- [ ] User registration completes successfully
- [ ] Verification email is sent (check Courier dashboard)
- [ ] Verification link uses correct production domain
- [ ] Clicking verification link works
- [ ] User can sign in after verification
- [ ] No error logs in Vercel Functions logs

## Local vs Production Configuration

### Local (.env)
```bash
RESET_URL_BASE=http://localhost:3000
COURIER_AUTH_TOKEN=pk_test_xxx... # Sandbox key
```

### Production (Vercel)
```bash
RESET_URL_BASE=https://mymovement.vercel.app
COURIER_AUTH_TOKEN=pk_prod_xxx... # Production key
```

## Quick Fix Commands

### Update Vercel Environment Variables
```bash
npx vercel env add RESET_URL_BASE production
# Enter: https://yourdomain.com

npx vercel env add COURIER_AUTH_TOKEN production  
# Enter: pk_prod_your_key_here

npx vercel env add VERIFY_TOKEN_SECRET production
# Enter: your-32-char-random-secret
```

### Force Redeploy
```bash
npx vercel --prod
```
