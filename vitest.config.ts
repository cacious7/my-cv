import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
	plugins: [vue()],
	test: {
		environment: 'happy-dom',
		globals: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/',
				'src/tests/',
				'*.config.ts',
				'.nuxt/',
				'.output/',
				'nuxt-cv-backup/'
			],
			all: true,
			lines: 80,
			functions: 80,
			branches: 75,
			statements: 80
		},
		include: ['src/tests/**/*.test.ts'],
		setupFiles: ['src/tests/setup.ts']
	},
	resolve: {
		alias: {
			'~': fileURLToPath(new URL('./', import.meta.url)),
			'@': fileURLToPath(new URL('./', import.meta.url))
		}
	}
})
