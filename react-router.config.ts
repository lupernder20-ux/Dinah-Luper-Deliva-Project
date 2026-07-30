import type { Config } from '@react-router/dev/config';

export default {
	appDirectory: './src/app',
	ssr: true,
	prerender: ['/*?'],
	buildDirectory: process.env.BUILD_TARGET === 'vercel' ? 'build-vercel' : 'build',
} satisfies Config;
