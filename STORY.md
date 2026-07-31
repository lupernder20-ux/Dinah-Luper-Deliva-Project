# The Story of Deliva — How This Was Built

This is the plain-language version of how Deliva came together, step by step, in the order it actually happened. For the technical version, see `docs/TECHNICAL_DOCUMENTATION.md`.

## 1. The idea

Deliva is a delivery-booking app — like Bolt or Uber, but you're booking a courier to move a package instead of a car to move a person. There are three kinds of people who use it: a **customer** who wants something delivered, a **rider** who delivers it, and an **admin** who watches over the whole operation.

## 2. Building the pages people actually see

I started with the front end — the part people click on. It's built with **React**, which lets you build a page out of small, reusable pieces called components, instead of writing one long HTML file. Each page — the homepage, the booking form, the rider dashboard, the admin dashboard — is its own file. For styling, instead of writing plain CSS by hand, I used **Tailwind CSS**, which works by adding small utility classes (like `rounded-xl` or `bg-blue-500`) directly onto elements, so the design stays consistent everywhere without a separate stylesheet to keep in sync.

Under the hood, all of this runs on **React Router** (in "framework mode") and is built with **Vite**, which compiles everything and runs a fast local dev server while working on it. The nice part of this setup: the folder structure *is* the site structure. Make a folder called `booking` with a `page.jsx` inside, and `/booking` exists as a page — no separate list of routes to maintain by hand.

## 3. Making the booking form actually useful — the address search

The booking form needed one thing to feel like a real Bolt/Uber-style app: when you start typing a pickup address, it should suggest real places, the same way Uber's app does, and remember the exact map location you picked.

My first plan was **Google Maps' Places API**, since that's literally what Uber and Bolt use. That plan hit a wall immediately — Google requires a billing card on file before it'll let you use it at all, even to stay within the free usage tier, and the card kept getting rejected. Rather than get stuck, I switched to **LocationIQ**, a service built on OpenStreetMap data that does the same job — turn typed text into a list of real places with coordinates — and only needs a free email sign-up, no card.

I built a small reusable component for it that:
- waits a fraction of a second after you stop typing before actually asking the server for suggestions (so it's not firing a request on every single keystroke — this is called "debouncing"),
- cancels any old, still-in-progress request the moment a newer one starts (so a slow response for what you typed three letters ago can't overwrite what you're seeing now),
- and, the moment you pick a suggestion, remembers both the address text *and* its latitude/longitude, so the exact point on the map is saved, not just the words.

Once that worked, I also added proper validation to the form — phone numbers have to match a real Nigerian format (11 digits starting with 0, or the same number with +234), and names need to actually look like a first and last name — with a friendly warning message if something doesn't match, instead of silently accepting anything.

## 4. Writing it all down for the defense

Once the core app worked, I put together two documents explaining it: one that walks through the code itself (what every important piece does and why), and one full of likely defense questions with answers, organized by topic. Those became the seed of the `docs/` folder this project now has.

## 5. Giving it a real memory — the database

Up to this point, nothing was actually being *saved* anywhere permanently in a way I fully controlled. The next big step was standing up a real database.

I chose **Neon**, a Postgres database that runs "serverless" (no server to set up or maintain yourself) and has a free tier. I wrote out the full database design by hand — one table for user accounts, one for login sessions, one for deliveries, one for rider profiles, and a new one for customer messages/feedback/reports — and documented every column. Passwords are never stored as plain text; they're run through **argon2**, a one-way hashing algorithm, so even the database itself never holds a password anyone could read.

## 6. Building the admin's live view and the feedback loop

With a real database in place, I could build the features that needed one:

- An **Active Rides** panel on the admin dashboard that quietly refreshes itself every 15 seconds, so an admin always sees what's currently in progress without having to hit refresh.
- A **Feedback & Reports inbox**, also on the admin dashboard, where every message a customer sends — a general question, feedback on a delivery, or a problem report — shows up, and the admin can reply or mark it resolved right there.
- On the customer's side, the contact form (which used to just fake a "message sent!" screen with no actual backend) now really saves to the database, and customers can see their own past messages — and any reply — on their dashboard.

For the "live" parts, I deliberately didn't reach for anything fancy like WebSockets. A dashboard that refreshes itself every 15–30 seconds is simple, reliable, and completely sufficient for how this app is actually used — adding a persistent live-connection layer would have been solving a problem this project doesn't actually have.

## 7. The bug that was hiding the whole time

While wiring up all of this, I found something that had actually been broken from the very start of building on this particular computer, without anyone noticing: **every single request to the server's API was silently failing**, on this Windows machine specifically. The part of the code that automatically finds and connects each API file to the server was written assuming file paths look the way they do on Mac/Linux (with forward slashes), and Windows paths use backslashes instead — so on Windows, that matching silently broke, and every request quietly fell back to a generic "page not found" instead of ever reaching the real code, with no obvious error to explain why. I tracked it down and fixed the two spots responsible, and after that, everything that had looked like it "sort of worked" before actually started working properly, end to end.

## 8. Where the look of the app comes from

Nothing visual in this project was drawn by hand, and it's worth being plain about where each piece comes from:

- **The icons** — the little truck, package, shield, user, bell, and so on — all come from **Lucide** (the `lucide-react` package), a free, open-source icon library. Each icon is imported by name (`<Truck />`, `<Package />`, `<ShieldCheck />`) and dropped into the page like any other component. The larger colorful symbols (🚚 📦 💰 ⭐ 👑) are not images at all — they're ordinary emoji characters, the same ones a phone keyboard types, rendered by the operating system.
- **The styling** — every color, gradient, rounded corner, and shadow — is **Tailwind CSS**: instead of writing separate stylesheet files, each element carries small utility classes (`rounded-3xl`, `shadow-xl`, `font-black`) directly in the markup. The signature blue-to-purple gradients are inline CSS gradients built on a small fixed palette (`#0A84FF` blue, `#7C3AED` purple, `#00C853` green, `#FF6D00` orange).
- **The font** is **Poppins**, loaded from Google Fonts — a build step scans the code for font classes and injects the right Google Fonts link automatically.
- **The charts** on the admin dashboard (the revenue line and the delivery-volume bars) are drawn by **Recharts**, a React charting library — the app feeds it the real monthly numbers from the database and it handles the axes, tooltips, and curves.
- **The small animations** — cards lifting on hover, the success screen popping in — come from **Motion** (the successor to Framer Motion).
- **The address search** on the booking form is powered by **LocationIQ**'s API, as covered earlier.
- **The overall skeleton** of the app — the file-based routing, the auth wiring, the error pages — began life as a scaffold from the **Anything.com (create.xyz) app builder platform**, which this project was originally generated on before being extracted, repaired, and made to run standalone. The `__create` folders still visible in the codebase are that scaffold's plumbing.

So when the app is described as "built," what that honestly means is: the pages, flows, database design, and logic were designed and written for this project specifically, on top of freely available building blocks — icons from Lucide, styling from Tailwind, charts from Recharts, motion from Motion, fonts from Google Fonts — the same way essentially all modern web apps are put together.

## 9. Getting it ready to hand over

The last stretch was about making sure someone else could pick this project up from scratch: a proper install guide, a documented database setup process, build/start scripts so it can run in production (not just in dev mode), and a plan for putting it on GitHub and hosting it on Render — written so that connecting a GitHub account and deploying it live is a short, clear checklist rather than something you have to figure out.

## Where it stands now

A working three-role delivery app with live address search, a real database, working accounts, an admin dashboard that updates itself, and a two-way feedback/messaging system between customers and admin — documented well enough that someone new could read `INSTALL.md`, follow it top to bottom, and end up with the exact same app running on their own machine.
