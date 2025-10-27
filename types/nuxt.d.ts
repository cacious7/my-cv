// Global type declarations for Nuxt auto-imports
import '@nuxt/schema'

declare global {
	// Nuxt auto-imports
	const defineNuxtConfig: typeof import('nuxt/config').defineNuxtConfig
	const useHead: typeof import('@unhead/vue').useHead
	const navigateTo: typeof import('nuxt/app').navigateTo
}

// Extend ImportMeta for Nuxt
declare module 'vite' {
	interface ImportMeta {
		client: boolean
		server: boolean
	}
}

export {}
