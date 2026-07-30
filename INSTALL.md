# Install & Run — from a zip file to a working app

This walks through everything needed to take this project folder (e.g. received as a `.zip`) and get it running on a fresh Windows/Mac/Linux PC, then deploying it live. Follow it in order the first time.

## 1. Prerequisites

- **Node.js 20+** — check with `node --version`. Get it from [nodejs.org](https://nodejs.org) if missing.
- **npm** (comes with Node). This project was originally built against **Bun**, but Bun isn't required — npm works fine with the steps below.

## 2. Install dependencies

From inside this folder (`apps/web`):

```
npm install --legacy-peer-deps
```

`--legacy-peer-deps` is required — without it, npm refuses to resolve a peer-dependency conflict between `react-router-hono-server` and this project's React types.

**If you see an error about `hono` not being found** when you later run the dev server, install it explicitly (it's a peer dependency of `@hono/auth-js` that npm's legacy resolution sometimes skips):

```
npm install hono@4.12.3 --legacy-peer-deps
```

## 3. Set up the database (Neon)

The app needs a Postgres database. This project uses [Neon](https://neon.tech) (serverless Postgres) — it's already the database client used in the code (`@neondatabase/serverless`), and has a free tier that needs no credit card.

1. Sign up at **console.neon.tech** (email or GitHub login — this can be a different account than whatever you use for this project's own GitHub repo).
2. Click **New Project**, give it a name (e.g. `deliva`), pick a region, create it.
3. In the project's **Connection Details** panel, copy the connection string that has **`-pooler`** in the hostname (the pooled connection — this app opens many short-lived connections, which pooling is built for). It looks like:
   ```
   postgresql://user:password@ep-xxxx-pooler.region.aws.neon.tech/neondb?sslmode=require
   ```
4. In Neon's dashboard, open the **SQL Editor**, paste the *entire contents* of [`db/schema.sql`](./db/schema.sql), and run it once. This creates all 7 tables the app needs.
5. Confirm it worked — still in the SQL Editor, run:
   ```sql
   SELECT tablename FROM pg_tables WHERE schemaname = 'public'; if this doesn't work then run:


   SELECT tablename FROM pg_tables WHERE schemaname = 'public'

   ```
   
   You should see: `auth_users`, `auth_accounts`, `auth_sessions`, `auth_verification_token`, `riders_profile`, `deliveries`, `customer_messages`.

(If you have `psql` installed instead, `psql "$DATABASE_URL" -f db/schema.sql` does the same thing from a terminal.)

## 4. Environment variables

**If you already have a `.env` file with real values in it, do not run the command below** — it overwrites the whole file. Just open your existing `.env` and add whichever of the variables below are missing.

On a truly fresh setup with no `.env` yet, copy the example file:

```
cp .env.example .env
```

- `DATABASE_URL` — the pooled Neon connection string from step 3.
- `AUTH_SECRET` — a random secret for signing session cookies. Generate one with:
  ```
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- `AUTH_URL` — the full URL to this app's auth routes, which **must end in `/api/auth`** (that's where they're mounted — leaving this off causes a "Bad Request" / `UnknownAction` error on sign up or sign in). Locally: `http://localhost:4000/api/auth` (adjust the port to whatever the dev server actually prints — see step 5). In production: your real domain + `/api/auth`, e.g. `https://deliva.onrender.com/api/auth`.
- `NEXT_PUBLIC_LOCATIONIQ_API_KEY` — powers the pickup/delivery address autocomplete. Free, no card needed:
  1. Sign up at [locationiq.com](https://locationiq.com) (email only).
  2. Copy the token from your dashboard's **Access Tokens** page.
  3. Optionally restrict it to your domain(s) in the token settings.

**Never commit `.env`** — it's already git-ignored (see `.gitignore`). `.env.example` (which has no real secrets) is the tracked template.

## 5. Run it

```
npm run dev
```

It prints the URL to open, e.g. `http://localhost:4000` — if that port is busy, Vite automatically tries 4001, 4002, etc., and prints whichever one it actually used. Open that URL in your browser.

**Gotcha:** a Vite plugin in this project automatically **kills the dev server whenever `.env` changes** (a safety measure so stale env vars never get used). It does not restart itself — if you edit `.env` while the server is running, you must manually run `npm run dev` again afterward.

## 6. Verify it actually works

- Sign up a test account at `/account/signup`. Confirm a row appears in `auth_users` (check via Neon's SQL Editor).
- Book a test delivery at `/booking`, typing a real address into the pickup/delivery fields to confirm autocomplete suggestions appear (this needs `NEXT_PUBLIC_LOCATIONIQ_API_KEY` to be set).
- Submit the contact form at `/contact`, confirm a row appears in `customer_messages`.
- To test the admin views: in Neon's SQL Editor, run `UPDATE auth_users SET role = 'admin' WHERE email = 'your-test-account-email';` on your test account, then visit `/dashboard/admin` — you should see the Active Rides panel and Feedback & Reports inbox.

## 7. Building & running in production mode locally (recommended before hosting)

```
npm run build
npm run start
```

This compiles the app the same way Render will and runs it with `node`, catching any build issues in an environment you control before pushing.

## 8. Putting this on GitHub

This project has no `.git` yet on purpose — set it up under whichever GitHub account you intend to use for this project (this may be different from any account already configured elsewhere on your machine):

```
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Double check `git status` before the first commit — `.env` should **not** appear in the list of files to be committed (it's git-ignored). If it does appear, stop and check your `.gitignore` before committing.

## 9. Hosting on Render

Render deploys straight from a GitHub repo, so step 8 needs to happen first.

1. Go to [render.com](https://render.com), sign up/log in, **New → Web Service**.
2. Connect your GitHub account and pick the repo you pushed in step 8.
3. Environment: **Node**.
4. Build Command: `npm install --legacy-peer-deps && npm run build`
5. Start Command: `npm run start`
6. Under **Environment Variables**, add: `DATABASE_URL` (same Neon pooled string, or a separate production Neon project if you want to keep test data separate), `AUTH_SECRET` (generate a *new* one, don't reuse your local one), `AUTH_URL` (your Render URL, e.g. `https://deliva.onrender.com`), `NEXT_PUBLIC_LOCATIONIQ_API_KEY` (same key, or a second one restricted to your production domain).
7. Deploy. Every future `git push` to the connected branch triggers a new deploy automatically — no further manual steps.

## Known gotchas already hit while setting this up on Windows

These are already fixed in this codebase — listed here so you understand what changed and why, in case you ever pull a fresh copy of the original template:

- **`vite-plugin-babel` version drift**: a newer resolved version than this project was built against broke TypeScript parsing for `root.tsx`/`routes.ts`. Pinned to `1.5.1` in `package.json`.
- **Every single API route silently failing** — the biggest one. `__create/route-builder.ts` (the file that auto-discovers `route.js` files and wires them up to the server) builds file paths with Node's `path.join`, which produces backslash-separated paths on Windows. Two places in that file assumed forward slashes: (1) constructing a dynamic `import()` URL, and (2) splitting the path into route segments. Both silently failed on Windows — every API request fell through to a generic "page not found" handler instead of reaching your actual route code, with no error visible unless you inspected the response body. Fixed by converting to a proper `file://` URL before importing, and splitting on both `/` and `\`.
- **`AUTH_URL` missing `/api/auth`** — Auth.js derives where its own routes live from `AUTH_URL`'s path. Set it to just the domain (e.g. `http://localhost:4000`) and every sign-up/sign-in request fails with a confusing `UnknownAction`/"Bad Request", because Auth.js ends up looking for its routes at the wrong path. It must include `/api/auth` at the end.
- **Session cookie silently not persisting in the browser** — the auth cookies (`sessionToken`, `csrfToken`, `callbackUrl`) were hardcoded to `secure: true, sameSite: 'none'`. Browsers refuse to store a `Secure` cookie over plain `http://` (which is how local dev runs), so sign-up/sign-in would appear to succeed (redirect happens, no error shown) but the session would never actually stick — the next page load looks logged out again. Fixed by deriving both from whether `AUTH_URL` is actually `https://` (`__create/index.ts`), so local dev gets a normal `Lax` cookie and production keeps the stricter `None`/`Secure` pair.
- **A missing shared platform folder** (`shared/design-mode.ts`, referenced one directory above `apps/`) — this powers a visual editor toolbar specific to the hosted Anything.com platform and isn't part of the app itself; a no-op stub was added so local dev doesn't crash on the missing import.
