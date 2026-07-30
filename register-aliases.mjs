// Teaches plain `node` (running the built production server) how to resolve
// the `@/` import alias that vite.config.ts defines for the dev server and
// build. __create/route-builder.ts dynamically imports API route source
// files at runtime (by design, so routes can hot-reload in dev), and those
// files use `@/...` imports — Vite resolves that transparently, but a raw
// `node build/server/index.js` process has no idea what `@/` means without
// this. Loaded via `node --import ./register-aliases.mjs`.
import { register } from 'node:module';

register('./alias-resolver.mjs', import.meta.url);
