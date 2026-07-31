import { createRequestHandler } from 'react-router';
// @ts-expect-error -- virtual module provided by @react-router/dev's vite
// plugin during the server build; has no ambient type declaration.
import * as build from 'virtual:react-router/server-build';
import app from './app';

// Deliberately does NOT use react-router-hono-server's adapters. The `node`
// adapter calls serve() from @hono/node-server, which binds a port and starts
// a long-lived listener — right for Render, fatal here (a serverless function
// has no port to bind and just hangs until it's killed). The `cloudflare`
// adapter avoids serve() but makes the SSR build resolve react-dom's browser
// entry, which lacks renderToPipeableStream. So mount React Router's request
// handler onto the shared Hono app ourselves and export the plain app for
// hono/vercel to wrap.
const requestHandler = createRequestHandler(build, 'production');

// Registered last, so the API routes and auth handler mounted in app.ts take
// precedence; everything else falls through to React Router SSR.
app.all('*', (c) => requestHandler(c.req.raw));

export default app;
