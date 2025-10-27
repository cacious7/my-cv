import { config } from '@vue/test-utils'
import { Quasar } from 'quasar'
import { vi } from 'vitest'

// Install Quasar plugin globally for all tests
config.global.plugins = [Quasar]

// Mock Nuxt's auto-imports
;(globalThis as any).defineNuxtConfig = () => ({})
;(globalThis as any).useHead = () => ({})
;(globalThis as any).navigateTo = () => Promise.resolve()

// Mock console methods to reduce noise in tests
global.console = {
	...console,
	error: vi.fn(),
	warn: vi.fn()
}
