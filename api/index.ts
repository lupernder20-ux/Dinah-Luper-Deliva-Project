import { register } from 'node:module';
import { handle } from 'hono/vercel';

console.log('[api] module top-level start');

// Must happen before the app module is imported (not after) — that import
// transitively triggers __create/route-builder.ts's top-level route
// registration, which needs this alias resolver already active. A static
// `import app from '../build-vercel/server/index.js'` here would be hoisted
// above this register() call by the ESM spec, running too late; a dynamic
// `import()` runs inline, in the order written.
register('../alias-resolver.mjs', import.meta.url);
console.log('[api] register() returned');

const { default: app } = await import('../build-vercel/server/index.js');
console.log('[api] app import resolved, has fetch:', typeof app?.fetch);

const handler = handle(app);
console.log('[api] handle() wrapped, module ready');

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
