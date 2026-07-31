# Deliva

A last-mile delivery booking platform — book a courier the way you'd book a Bolt/Uber ride, but for parcels instead of people. A customer books a delivery with live address autocomplete (just like Bolt/Uber's pickup search), a dispatch rider accepts and progresses the job, and an admin watches everything happen live and handles customer feedback and problem reports.

For the story of how this was actually built, in plain language, see **[STORY.md](./STORY.md)**. For deep technical detail, see **[docs/TECHNICAL_DOCUMENTATION.md](./docs/TECHNICAL_DOCUMENTATION.md)**. To get it running yourself, see **[INSTALL.md](./INSTALL.md)**.

## The three roles

**Customer**
- Books a delivery in three steps (sender → receiver → package), with the pickup/delivery address fields showing live suggestions as they type (address autocomplete, powered by LocationIQ). No payment is taken at booking.
- Pays later, from their dashboard, once the package is **out for delivery** (In Transit): a Pay button appears on the delivery card offering card, bank transfer, or cash on delivery. The checkout is a demonstration — card/transfer mark the booking Paid, cash records Pay on Delivery for the rider to collect — nothing real is charged.
- Tracks every delivery's status (`Pending → Accepted → Picked Up → In Transit → Delivered`) from their dashboard, and by a public tracking link/ID.
- Can send a general message, leave feedback on a specific delivery (with a star rating), or report a problem — and sees the admin's reply once one is posted, right on their dashboard.

**Rider**
- Sees a list of available (unclaimed) jobs and accepts one — accepting is atomic, so two riders can never grab the same job.
- Moves an accepted job through its status steps and earns a cut of the delivery cost once it's marked Delivered.

**Admin**
- A live dashboard: total customers/riders, active order count, revenue, a recent-deliveries table.
- An **Active Rides & Bookings** panel that refreshes automatically every 15 seconds, showing every delivery still in progress.
- A **Feedback & Reports inbox** (refreshes every 30 seconds) — every message/feedback/report a customer has sent, filterable by status, with an inline reply box and a "mark resolved" button.

## Admin access

There are two admin tiers:

- **`admin`** — full access to the admin dashboard: live stats, real monthly revenue/volume charts, the Active Rides panel, and the Feedback & Reports inbox.
- **`super_admin`** — everything `admin` can do, plus a **Manage Admins** panel at the bottom of the same dashboard (`/dashboard/admin`) for appointing and removing admins by email. (The standalone `/admin-setup` page still exists and can additionally set any role, including transferring `super_admin`.) Super admins land on the admin dashboard — there is no separate super-admin page.

Currently seeded:

| Email | Role |
|---|---|
| `lupernder20@gmail.com` | `super_admin` *(must sign up at `/account/signup` first — a role can only be set on an account that already exists; ask whoever set this up to run the promotion once that's done)* |
| `akpamajoseph203@gmail.com` | `admin` |

**To log in as an admin:** sign in normally at `/account/signin` with that account's email/password — there's no separate admin login page. Once signed in, go to `/dashboard/admin`. A non-admin account visiting that URL sees an "Access Denied" screen instead.

**To promote/demote someone else:** sign in as the `super_admin` account, go to `/admin-setup`, enter the target account's email and pick a role, and submit. The target account must already have signed up.

## How the pieces fit together

```
Browser  ──────────────►  React pages (src/app/**/page.jsx)
                                │
                                │  fetch()
                                ▼
                         Hono API routes (src/app/api/**/route.js)
                                │
                    ┌───────────┼────────────────┐
                    ▼           ▼                ▼
              Neon Postgres  Auth.js         LocationIQ
              (db/schema.sql) (sessions,     (address
                               password       autocomplete —
                               hashing)       called directly
                                              from the browser)
```

Pages and API routes both live under `src/app/` and are **file-based**: a folder with `page.jsx` becomes a URL, a folder with `route.js` under `api/` becomes a JSON endpoint. There's no hand-written route list — the folder structure *is* the routing.

## Tech stack

| Layer | Tool | Why |
|---|---|---|
| UI | React 18 + React Router 7 | Component-based UI; file-based routing means a new page is just a new folder. |
| Build | Vite 6 | Fast dev server, modern bundling. |
| Server | Hono, via `react-router-hono-server` | One lightweight server process serves both pages and the API. |
| Styling | Tailwind CSS | Utility classes instead of hand-written CSS files. |
| Database | Neon (serverless Postgres) | Free tier, no server to manage, connects over HTTPS. No ORM — plain tagged-template SQL (`sql\`SELECT ...\``), which safely escapes every value automatically. |
| Auth | Auth.js (`@auth/core`) + `argon2` | Email/password sign-in; passwords are hashed, never stored in plain text. |
| Address autocomplete | LocationIQ REST API | Free, no card required, returns the same kind of address + coordinate data Google Places does. |
| Data fetching | `@tanstack/react-query` | Caches API responses in the browser; also powers the admin dashboard's auto-refreshing panels. |
| Icons / animation | `lucide-react`, `motion` | UI polish. Where every visual piece comes from is spelled out plainly in [STORY.md, section 8](./STORY.md#8-where-the-look-of-the-app-comes-from). |

## Where things live

```
apps/web/
├── src/
│   ├── app/
│   │   ├── booking/page.jsx          # customer: book a delivery
│   │   ├── track/page.jsx            # public: track by ID
│   │   ├── contact/page.jsx          # customer: contact/feedback/report form
│   │   ├── dashboard/
│   │   │   ├── customer/page.jsx     # customer: deliveries + my messages
│   │   │   ├── rider/page.jsx        # rider: available/my/completed jobs
│   │   │   └── admin/page.jsx        # admin: stats, active rides, feedback inbox
│   │   └── api/
│   │       ├── deliveries/route.js
│   │       ├── messages/route.js
│   │       ├── riders/jobs/**
│   │       └── admin/**
│   ├── components/                    # PlaceAutocompleteInput, ActiveRidesPanel,
│   │                                   # FeedbackInbox, MyMessagesCard
│   └── auth.js                        # Auth.js configuration
├── db/schema.sql                      # the full database schema
├── docs/                              # technical documentation + defense Q&A
├── INSTALL.md                         # fresh-PC setup, database, hosting
└── STORY.md                           # how this was built, in plain language
```

## Quick start

This repo has **no `.git` yet** — it's meant to be handed over as a zip and turned into its own repository under a GitHub account of your choosing. Full details in [INSTALL.md](./INSTALL.md).

```
npm install --legacy-peer-deps
# ...set up .env (database + secrets), see INSTALL.md...
npm run dev
```

## Hosting

**Short answer: yes, via GitHub, and yes — once it's hosted, the link works for anyone, no login or special access needed, just like any other website.**

The app is hosted on **[Render](https://render.com)**, which builds and deploys straight from a GitHub repository — every time you push, it redeploys automatically. Here's the flow:

1. **Put the code on GitHub.** This project isn't on GitHub yet on purpose (see [INSTALL.md](./INSTALL.md#8-putting-this-on-github)) — create an empty repo under your own GitHub account, then:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
2. **Create the database it'll use in production.** You can reuse the same Neon database from local development, or create a second Neon project so test data and real data don't mix — either works. See [INSTALL.md](./INSTALL.md#3-set-up-the-database-neon).
3. **Create the Render service.** On [render.com](https://render.com), sign up/log in, **New → Web Service**, connect your GitHub account, and pick the repo you just pushed.
4. **Configure it:**
   - Environment: **Node**
   - Build Command: `npm install --legacy-peer-deps && npm run build`
   - Start Command: `npm run start`
   - Environment Variables: `DATABASE_URL`, `AUTH_SECRET` (generate a fresh one, don't reuse your local one), `AUTH_URL` (your Render URL + `/api/auth`, e.g. `https://deliva.onrender.com/api/auth`), `NEXT_PUBLIC_LOCATIONIQ_API_KEY`.
5. **Deploy.** Render gives you a public URL like `https://deliva.onrender.com` — that's the link. Share it with literally anyone; it's a normal public website, no VPN/login/allowlist required unless you deliberately add one later. From then on, every `git push` to the connected branch redeploys it automatically — no extra steps.

Full step-by-step version (with troubleshooting for things that commonly go wrong) is in [INSTALL.md, section 9](./INSTALL.md#9-hosting-on-render).

## Documentation index

- **Setting up locally / from a zip / hosting it:** [INSTALL.md](./INSTALL.md)
- **How this was built, told simply:** [STORY.md](./STORY.md)
- **Architecture & full code walkthrough:** [docs/TECHNICAL_DOCUMENTATION.md](./docs/TECHNICAL_DOCUMENTATION.md)
- **Defense prep Q&A:** [docs/DEFENSE_QA.md](./docs/DEFENSE_QA.md)
- **Database schema:** [db/schema.sql](./db/schema.sql)

There's also a `Dinah Luper Deliva Project/` folder with earlier PDF/Markdown exports of the project documentation — those are kept as-is; the files above are the current, canonical versions going forward.
