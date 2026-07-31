import { register } from 'node:module';
import { handle } from 'hono/vercel';

// Must happen before the app module is imported (not after) — that import
// transitively triggers __create/route-builder.ts's top-level route
// registration, which needs this alias resolver already active. A static
// `import app from '../build-vercel/server/index.js'` here would be hoisted
// above this register() call by the ESM spec, running too late; a dynamic
// `import()` runs inline, in the order written.
register('../alias-resolver.mjs', import.meta.url);
const { default: app } = await import('../build-vercel/server/index.js');

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
