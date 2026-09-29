# A Life Of True Worship — Youth Day 2026

Next.js 14 (App Router) + Convex + Monnify. This is the real, working codebase
that follows the design preview you approved.

## 1. Install

```
npm install
```

## 2. Set up Convex

```
npx convex dev
```

This logs you into (or creates) a Convex account, creates a project, pushes
`convex/schema.ts`, generates `convex/_generated/*`, and prints a deployment
URL. Leave this command running while you develop — it keeps your schema and
functions in sync.

Copy the printed URL into `.env.local` as `NEXT_PUBLIC_CONVEX_URL`.

## 3. Environment variables

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_CONVEX_URL` — from step 2
- `NEXT_PUBLIC_MONNIFY_API_KEY`, `MONNIFY_SECRET_KEY`, `NEXT_PUBLIC_MONNIFY_CONTRACT_CODE` — from your Monnify dashboard (sandbox keys first, live keys later)
- `MONNIFY_BASE_URL` — `https://sandbox.monnify.com` for testing, `https://api.monnify.com` once you go live
- `ADMIN_SESSION_SECRET` — any long random string (e.g. `openssl rand -hex 32`)

## 4. Create your first admin login

Passwords are stored hashed, never in plain text. Generate a hash locally:

```
node -e "console.log(require('bcryptjs').hashSync('your-password-here', 10))"
```

Then, with `npx convex dev` running, create the admin user via the Convex
dashboard's function runner (or `npx convex run adminUsers:create`), passing
your email and the hash you just generated.

## 5. Run it

```
npm run dev
```

Visit `http://localhost:3000` for the site and `http://localhost:3000/admin`
for the dashboard.

## 6. Monnify webhook

In your Monnify dashboard, set the webhook URL to:

```
https://<your-deployed-domain>/api/monnify/webhook
```

This is what actually confirms a donation — the browser callback alone is
never trusted. Until this is set (and your domain is live), donations will
stay "pending" in the admin Donations tab even after a successful test payment.

## 7. Deploy

- Push this repo to GitHub, import it into Vercel.
- Add all the env vars from `.env.local` to the Vercel project settings.
- Run `npx convex deploy` when you're ready to push your Convex functions to production (separate from your dev deployment).
- Point the Monnify webhook at your live Vercel URL.

## What's built vs what's left

**Working now:** the full public page (hero, countdown, about, goal +
breakdown, program, meetings, donate with live Monnify checkout + verified-
webhook confirmation, past events, gallery, live stream embed, footer), and
an admin dashboard (schedule, meetings, past events with photo upload,
gallery, donations list, settings) behind a password-protected login.

**Worth adding next, when you're ready:**
- Nicer styling for the admin dashboard itself (it's plain and functional right now, not branded)
- Drag-to-reorder for schedule/gallery items instead of the fixed add-order
- Email receipts to donors after a confirmed payment
- A second admin role or invite flow, if more than one or two people need logins
