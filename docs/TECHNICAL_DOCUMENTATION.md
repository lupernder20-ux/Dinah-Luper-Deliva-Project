# Deliva — Technical Documentation

This is the canonical architecture reference for the project (supersedes the earlier exports in `../Dinah Luper Deliva Project/`, which covered the booking/autocomplete feature only). It assumes you've read [../README.md](../README.md) for the one-paragraph overview.

## 1. Stack recap

React 18 + React Router 7 (file-based routing, SSR-capable) on Vite, served by a Hono web server (`react-router-hono-server`), with Neon serverless Postgres as the only datastore (no ORM — tagged-template SQL), Auth.js for authentication, and LocationIQ for address autocomplete. See the table in the README for the full list.

## 2. File-based routing, in both directions

- **Pages**: a folder under `src/app/` containing `page.jsx` becomes a URL at that path. `src/app/routes.ts` walks the folder tree at build time to generate the route table — there's no hand-written route list.
- **API**: a folder under `src/app/api/` containing `route.js`, exporting `GET`/`POST`/`PUT`/etc., becomes a JSON endpoint at that path. This is handled by a *different* mechanism: `__create/route-builder.ts` recursively finds every `route.js` file, dynamically imports it, and registers each exported HTTP method onto a Hono sub-app mounted at `/api`.

### The bug this session found and fixed

`route-builder.ts` builds these file paths with Node's `path.join`, which produces **backslash-separated paths on Windows** (`C:\Users\...\route.js`). Two places in that file assumed forward slashes:

1. It constructed a dynamic `import()` specifier as `` `${routeFile}?update=${timestamp}` `` — a raw Windows path is not a valid import specifier, so every single import silently failed (caught and logged, not thrown), meaning **zero API routes were ever registered** on Windows.
2. Even after fixing that, `getHonoPath()` split the relative path on `/` only, to turn `admin/messages/route.js` into path segments. On Windows that string has no forward slashes at all, so it never split — every route collapsed to the same empty path.

Net effect: on Windows, every request to `/api/**` silently fell through to React Router's own catch-all page handler instead of reaching any route code, returning a 200 (or a confusing "no action for this route" error on POST) instead of real JSON — with no exception anywhere obvious. **This affected every feature in the app that talks to the server**, not just anything built in this session.

Fixed by: converting the path to a proper `file://` URL with `pathToFileURL` before appending the cache-busting query string, and splitting on `/[\\/]/` (both separators) instead of `/` alone. See `__create/route-builder.ts`.

**Why this matters for the defense:** it's a good, concrete example of an environment/portability bug — the code worked fine wherever it was originally built and tested (implicitly POSIX), and broke silently, with no stack trace, the moment the assumption (forward-slash paths) stopped holding.

## 3. Database schema (`db/schema.sql`)

Seven tables, no ORM:

- `auth_users`, `auth_accounts`, `auth_sessions`, `auth_verification_token` — Auth.js's own tables. Column casing (`"userId"`, `"providerAccountId"`, `"sessionToken"`, `"emailVerified"`) is load-bearing: two separate hand-written adapters (`src/auth.js` and `__create/adapter.ts`) query these exact identifiers directly.
- `riders_profile` — one row per rider, tracks `earnings`/`total_jobs`.
- `deliveries` — the core booking record. Includes `pickup_lat/pickup_lng/delivery_lat/delivery_lng` (the coordinates captured by the address autocomplete — previously collected client-side and silently dropped server-side; now persisted).
- `customer_messages` — new this session. One table for contact-form messages, delivery feedback, and problem reports (a `type` column distinguishes them), so both the admin inbox and a customer's own message history are a single indexed query rather than a 3-way `UNION`.

### Why two Auth.js adapters?

`src/auth.js` exports the `auth()` function most page-level API routes call directly. `__create/adapter.ts` backs a *separate* auth middleware mounted inside the Hono server itself (`__create/index.ts`, gated behind `AUTH_SECRET` being set) for session handling at the HTTP layer (cookies, JWT). Both were hand-rolled against the same tables rather than sharing one adapter instance — a known duplication, not something this session's changes altered.

### Delivery status state machine

`Pending → Accepted → Picked Up → In Transit → Delivered`, with `Cancelled` as a terminal state nothing currently sets automatically (it exists in status-color/filter logic but no code path transitions a delivery into it). A rider "accepts" atomically (`UPDATE ... WHERE rider_id IS NULL AND status='Pending'`, so two riders can't claim the same job), and on `Delivered` the rider's `earnings`/`total_jobs` update (80% of `cost`).

## 4. Customer messaging & feedback (new this session)

**Problem it solves:** the contact page was 100% fake (a `setTimeout`, no backend), and there was no way for a customer to report a problem with a specific delivery or for an admin to see/respond to any of it.

**Design:** one table (`customer_messages`, §3), a `type` of `contact`/`feedback`/`report`, optionally linked to a `delivery_id`, with a `status` (`open`/`in_progress`/`resolved`) and an `admin_reply`.

- `POST /api/messages` — creates a message. Anonymous visitors can send `type: 'contact'` only (the contact page's default); `feedback`/`report` require a session, and identity (`customer_id`, `name`, `email`) is taken from the session, never trusted from the request body.
- `GET /api/messages` — a logged-in customer's own messages, newest first.
- `GET /api/admin/messages` (admin-only) — everyone's messages, joined to sender name/email and the related delivery's tracking ID, with optional `?status=`/`?type=` filters.
- `PUT /api/admin/messages/[id]` (admin-only) — sets `admin_reply` and/or `status`.

UI: `src/app/contact/page.jsx` now really submits, and (for logged-in users) offers a type selector, an optional delivery picker, and a star rating for feedback. `src/components/MyMessagesCard.jsx` (on the customer dashboard) shows a customer's own messages and any reply. `src/components/FeedbackInbox.jsx` (on the admin dashboard) is the reply/resolve inbox.

## 5. Admin live monitoring (new this session)

`src/components/ActiveRidesPanel.jsx` shows every delivery not yet `Delivered`/`Cancelled`, polling `GET /api/admin/active-deliveries` every 15 seconds via React Query's `refetchInterval`. `FeedbackInbox.jsx` polls `GET /api/admin/messages` every 30 seconds.

**Why polling, not WebSockets/SSE:** this app had zero realtime infrastructure before (the `ws` package in `package.json` is only used internally by `@neondatabase/serverless`'s connection pool, not an app-level socket). Adding a persistent-connection layer would mean a new route, reconnect/backoff logic, and idle-timeout handling on a hosting platform's free tier — real complexity for a dashboard with, realistically, one admin tab open at a time at this project's scale. `react-query`'s `refetchInterval` was already the app's established data-fetching pattern, just not previously used with an interval, and it already stops polling on an unfocused browser tab for free (`refetchIntervalInBackground: false` by default).

## 6. Environment variables

| Variable | Exposed to browser? | Purpose |
|---|---|---|
| `DATABASE_URL` | No | Neon Postgres connection string |
| `AUTH_SECRET` | No | Signs session cookies |
| `AUTH_URL` | No | Used to decide if the session cookie is marked `secure` |
| `NEXT_PUBLIC_LOCATIONIQ_API_KEY` | **Yes** | Address autocomplete — the request is fired directly from the browser, so this key must be readable client-side |

Only variables prefixed `NEXT_PUBLIC_` are ever readable in browser-side code (enforced by `plugins/nextPublicProcessEnv.ts`) — a deliberate rail so a database credential can never accidentally leak into a client bundle.

## 7. Hosting

Render, deploying from GitHub. `npm run build` (`react-router build`) produces `build/client` (static assets) and `build/server/index.js` (the Hono server bundle); `npm run start` (`node ./build/server/index.js`) runs it. The server already reads `process.env.PORT` with a fallback to 3000 (a `react-router-hono-server` default), which is exactly what Render's dynamically-assigned port needs — no code change required. Full walkthrough: [../INSTALL.md](../INSTALL.md).

## 8. Known limitations

- Server-side validation of phone number/name format (see the booking page's regex validators) isn't duplicated on the API — only enforced client-side today.
- `POST /api/admin/promote` lets any logged-in user self-promote to admin, with no admin-only guard. Pre-existing, not touched by this session's work — flagged here as a known gap.
- No automated tests cover the messaging/admin-monitoring features yet, though `vitest`/`@testing-library/react` are already project dependencies.
- `calculateCost()` on the booking page still assumes a flat 10km distance rather than computing real distance from the now-persisted pickup/delivery coordinates.
