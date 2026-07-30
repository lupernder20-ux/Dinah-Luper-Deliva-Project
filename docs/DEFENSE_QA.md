# Deliva — Defense Q&A (this session's additions)

Covers the database, admin monitoring, customer messaging, hosting, and the Windows bug found while building all of it. For the booking-form/autocomplete Q&A, see the earlier export in `../Dinah Luper Deliva Project/`. Each answer is collapsed — try answering from memory first.

## Database

<details>
<summary>Why no CREATE TABLE / migration files existed before this session?</summary>

Nobody had ever connected a real database to this checkout (`DATABASE_URL` was unset) — every table was reverse-engineered from the actual SQL queries scattered across the API routes and the two Auth.js adapters, since there was no schema file anywhere to read instead. `db/schema.sql` is now the single source of truth going forward.
</details>

<details>
<summary>Why one <code>customer_messages</code> table instead of separate tables for contact messages, feedback, and reports?</summary>

The admin needs one inbox showing all three chronologically with the same reply/resolve workflow, and a customer needs one query for their own history. A <code>type</code> discriminator column plus a nullable <code>delivery_id</code> gets both with a single indexed query; three tables would force a <code>UNION ALL</code> on every read and triple the route code, for no benefit at this project's scale.
</details>

<details>
<summary>Why can anonymous visitors submit a contact message but not feedback or a report?</summary>

Feedback and reports are tied to a specific delivery a customer owns — that requires knowing who the customer is. General contact messages don't need an account (a real product would still want to let a prospective customer ask a question before signing up), so <code>customer_id</code> is nullable and the API only requires a session for the other two types.
</details>

<details>
<summary>Why generate <code>tracking_id</code> with <code>Math.random</code> instead of a proper UUID?</summary>

That was a pre-existing choice, not something this session added — flag it as a known weakness if asked: it's not collision-proof (no uniqueness check before insert relies on the DB's own <code>UNIQUE</code> constraint and would need a retry-on-conflict loop for full correctness at scale).
</details>

## Admin live monitoring

<details>
<summary>Why polling instead of WebSockets or Server-Sent Events?</summary>

The app had zero realtime infrastructure before this — the only WebSocket usage anywhere is internal to the Postgres driver's connection pool, not an app-level channel. Adding one means a new persistent-connection route, reconnect/backoff handling, and idle-timeout behavior to manage on the hosting platform, for a dashboard realistically viewed by one admin at a time. React Query's <code>refetchInterval</code> was already the app's data-fetching pattern; using it with an interval is a two-line change with none of that added surface area.
</details>

<details>
<summary>What happens if the admin dashboard is open in a background tab?</summary>

React Query's default is <code>refetchIntervalInBackground: false</code> — polling pauses automatically when the tab isn't focused, so it isn't hammering the database from tabs nobody's looking at. That's a free win of using the library's default rather than something hand-rolled.
</details>

<details>
<summary>Why 15 seconds for active rides but 30 for the feedback inbox?</summary>

Active deliveries are operationally time-sensitive (an admin wants to notice a stuck order quickly); a support message being 15 seconds "stale" matters far less. Both are arbitrary defaults, easy to tune later — the point being made is that the two views don't need the same freshness guarantee.
</details>

## The Windows routing bug

<details>
<summary>Walk through what the bug actually was.</summary>

The framework's file-based API router (<code>__create/route-builder.ts</code>) discovers every <code>route.js</code> file with Node's <code>path.join</code>, which produces backslash-separated paths on Windows. Two places assumed forward slashes: building a dynamic <code>import()</code> URL (a raw Windows path isn't a valid import specifier, so every import silently failed and was just logged, not thrown), and splitting the path into route segments on <code>/</code> only (which never matched anything on a backslash path, collapsing every route to the same empty path). Net effect: on Windows, no API route was ever reachable — every request fell through to the page router's catch-all instead.
</details>

<details>
<summary>Why didn't this throw an obvious error?</summary>

Both failure points were inside <code>try/catch</code> blocks that log and continue (so one bad route file can't take down the whole server) — so the failure was silent from the outside. A request to a broken API route returned a 200 with an HTML page body instead of an error, which looks like success unless you actually inspect the response body rather than just the status code.
</details>

<details>
<summary>What's the actual fix, and why does it work cross-platform?</summary>

<code>pathToFileURL(routeFile).href</code> converts the OS-native path into a proper <code>file://</code> URL before it's used as an import specifier — valid on every platform. The path-splitting regex changed from <code>split('/')</code> to <code>split(/[\\/]/)</code>, matching either separator regardless of OS.
</details>

<details>
<summary>What's the broader lesson here, beyond this one bug?</summary>

Code that manipulates file paths as plain strings tends to implicitly assume one OS's conventions. It'll work perfectly in whatever environment it was written and tested in, then fail — sometimes loudly, sometimes completely silently — the moment that assumption stops holding. The fix here specifically favored URL-safe/regex-based handling over assuming a separator, which is the general pattern for avoiding this class of bug.
</details>

## Hosting & GitHub

<details>
<summary>Why Render specifically?</summary>

It deploys directly from a connected GitHub repo with auto-deploy on push, needs no Dockerfile or extra config beyond a build/start command, and has a free tier — a good fit for a handover where the next maintainer may not want to manage infrastructure.
</details>

<details>
<summary>Why did <code>package.json</code> need new <code>build</code>/<code>start</code> scripts?</summary>

The project only had <code>dev</code> and <code>typecheck</code> before — both are dev-only (Vite's dev server, which isn't meant for production). <code>react-router build</code> produces the static client bundle and a server bundle; <code>node ./build/server/index.js</code> is <code>react-router-hono-server</code>'s documented way to run that server bundle in production.
</details>

<details>
<summary>Why wasn't <code>.env</code> already git-ignored, and why does that matter?</summary>

The project had no <code>.git</code> at all before this session, so it had never been committed anywhere — but the existing <code>.gitignore</code> template didn't list <code>.env</code>, which would have let a real database URL and auth secret get committed the moment the first commit happened. Fixed before any commit was made, alongside adding a tracked <code>.env.example</code> that documents the required variable *names* without real values.
</details>

<details>
<summary>Why does the plan explicitly avoid running <code>git init</code>/<code>push</code> automatically?</summary>

The handover is intentionally going to a different GitHub account than whatever might already be configured in this environment. Initializing and pushing on someone's behalf, potentially under the wrong identity or to the wrong remote, is exactly the kind of action that should wait for an explicit, confirmed target repository URL rather than being assumed.
</details>

## General

<details>
<summary>Is this app production-ready as it stands after this session's work?</summary>

Closer, but no — be honest about this. Server-side validation still needs duplicating, the admin self-promotion gap is unresolved, there are no automated tests for the new features, and delivery pricing still doesn't use the real coordinates it now persists. See "Known limitations" in <code>docs/TECHNICAL_DOCUMENTATION.md</code> for the full list.
</details>
