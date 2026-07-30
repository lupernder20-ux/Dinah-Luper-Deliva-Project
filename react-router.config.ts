import type { Config } from '@react-router/dev/config';

const isVercelBuild = process.env.BUILD_TARGET === 'vercel';

export default {
	appDirectory: './src/app',
	ssr: true,
	// Prerendering runs the built server in-process during the build (to
	// render pages ahead of time), which constructs the Neon Pool — and on
	// Vercel's build machine that leaves the process unable to exit,
	// stalling the deploy indefinitely. Skip it for the Vercel build; Vercel
	// does real per-request SSR at runtime regardless, so this isn't needed
	// there. Render's build isn't touched.
	prerender: isVercelBuild ? undefined : ['/*?'],
	buildDirectory: isVercelBuild ? 'build-vercel' : 'build',
} satisfies Config;
