import '@nuxt/schema'

declare module '@nuxt/schema' {
	interface NuxtConfig {
		quasar?: {
			plugins?: string[]
			iconSet?: string
			extras?: {
				font?: string | null
				fontIcons?: string[]
			}
			config?: Record<string, any>
		}
	}
}

export {}
