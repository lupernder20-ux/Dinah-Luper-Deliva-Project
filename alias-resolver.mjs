// The actual resolve hook, run in Node's module-loader thread via
// register-aliases.mjs. Mirrors vite.config.ts's `resolve.alias` table —
// __create/route-builder.ts dynamically imports API route source files at
// runtime (by design, so routes hot-reload in dev), and those files (plus
// whatever they transitively import, e.g. src/auth.js) use the same aliases
// Vite resolves at dev/build time. Plain Node has no idea what they mean
// without this. Keep this list in sync with vite.config.ts's alias table.
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const EXTENSIONS = ['.ts', '.js', '.tsx', '.jsx'];
const cwdUrl = pathToFileURL(`${process.cwd()}/`);

// Probes EXTENSIONS against `basePathNoExt` (no extension) and returns the
// first existing file's URL, or the bare (unresolved) URL as a fallback so
// Node's own error message names the path that was actually tried.
function resolveWithExtension(basePathNoExt) {
  for (const ext of EXTENSIONS) {
    const candidate = new URL(basePathNoExt + ext, cwdUrl);
    if (existsSync(fileURLToPath(candidate))) {
      return candidate.href;
    }
  }
  return new URL(basePathNoExt, cwdUrl).href;
}

// Ordered most-specific-first so e.g. `@auth/create/react` is checked
// before the shorter `@auth/create`.
const PACKAGE_ALIASES = [
  ['@auth/create/react', '@hono/auth-js/react'],
  ['npm:stripe', 'stripe'],
  ['lodash', 'lodash-es'],
];
// Bare specifier maps directly to one file (no subpath ever used for these).
const FILE_ALIASES = [
  ['@auth/create', 'src/__create/@auth/create'],
  ['stripe', 'src/__create/stripe'],
];

export async function resolve(specifier, context, nextResolve) {
  for (const [find, replacement] of PACKAGE_ALIASES) {
    if (specifier === find || specifier.startsWith(`${find}/`)) {
      return nextResolve(replacement + specifier.slice(find.length), context);
    }
  }

  for (const [find, filePath] of FILE_ALIASES) {
    if (specifier === find) {
      return nextResolve(resolveWithExtension(filePath), context);
    }
  }

  if (specifier === '@' || specifier.startsWith('@/')) {
    const rest = specifier.slice(1); // keep the leading '/', e.g. '@/auth' -> '/auth'
    return nextResolve(resolveWithExtension(`src${rest}`), context);
  }

  return nextResolve(specifier, context);
}
