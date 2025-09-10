# MyMovement

A Next.js app for tracking daily movement, food, mood and meds entries with user authentication and optional email delivery. It allows for checking of possible correlation of different factors that might lead to intenstinal distress.

## Project overview

- Framework: Next.js (App Router)
- React: 19.x
- Authentication: NextAuth + custom API routes
- Database: MongoDB (via `lib/mongodb.js`)
- Styling: Tailwind CSS

The app stores user activity and supports features like email verification, password reset, and Google sign-in.

## Quick start (local)

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the project root with environment variables (see the "Environment variables" section below).

3. Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## NPM scripts

- `npm run dev` — start Next.js in development mode
- `npm run dev:quiet` — start dev with npm in silent mode
- `npm run build` — build the production app
- `npm run start` — run the production server after build
- `npm run lint` — run Next.js linting

These are defined in `package.json`.

## Environment variables

Create `.env.local` with at least the following keys used by the app:

- `MONGODB_URI` — MongoDB connection string (required)
- `NEXTAUTH_URL` — base URL for auth callbacks (e.g. `http://localhost:3000`)
- `NEXTAUTH_SECRET` (or `AUTH_SECRET`) — secret used by NextAuth
- `VERIFY_TOKEN_SECRET` — secret used to sign verification tokens
- `RESET_TOKEN_SECRET` — secret used to sign reset tokens

Optional / provider-related variables:

- `GOOGLE_CLIENT_ID` / `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — Google OAuth client id (optional)
- `GOOGLE_CLIENT_SECRET` — Google OAuth client secret (optional)
- `COURIER_AUTH_TOKEN` — Courier API token for transactional email (optional)
- `COURIER_VERIFY_TEMPLATE_ID`, `COURIER_RESET_TEMPLATE_ID` — Courier template IDs (optional)
- `MONGODB_DB` — optional database name
- `RESET_URL_BASE` — base URL used to construct reset/verify links
- `SITE_NAME` — site name shown in emails

Note: missing required variables such as `MONGODB_URI` or `NEXTAUTH_SECRET` will cause the server to log errors or throw on start.

## Database

The app uses MongoDB. Provide `MONGODB_URI`. The connection helper is `lib/mongodb.js` and queries live in `lib/queries/`.

## Email delivery

The project includes integration with Courier for transactional emails. If `COURIER_AUTH_TOKEN` is not provided, the code often falls back to logging the generated verification/reset links for local/testing purposes.

## Google sign-in

If you enable Google sign-in, set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Ensure OAuth redirect URIs in Google Cloud Console include your `NEXTAUTH_URL`.

## Deployment

Recommended: Vercel (native Next.js support).

General steps:

1. Push the repo to GitHub.
2. Create a Vercel project from the repo.
3. Set environment variables in the Vercel dashboard (match `.env.local`).
4. Let Vercel build and deploy using `npm run build`.

For other hosts, make sure the host can run a Next.js server (set `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, and `MONGODB_URI` in the environment).

## Troubleshooting

- If the server complains about `MONGODB_URI`, confirm the connection string and network rules (MongoDB Atlas IP allowlist).
- If verification/reset tokens are not working, confirm `VERIFY_TOKEN_SECRET` and `RESET_TOKEN_SECRET` are set consistently.
- If emails aren't sent, verify `COURIER_AUTH_TOKEN` and template ids; otherwise check server logs where the app may print fallback links.
