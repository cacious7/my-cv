import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock Quasar components globally
config.global.stubs = {
	QChip: {
		template: '<div class="q-chip">{{ label }}<slot /></div>',
		props: ['label', 'color', 'textColor', 'outline', 'icon']
	},
	QTooltip: {
		template: '<div class="q-tooltip"><slot /></div>',
		props: ['anchor', 'self']
	},
	QBtn: {
		template: '<button class="q-btn"><slot /></button>',
		props: ['label', 'color', 'flat', 'round', 'icon', 'loading', 'disable']
	},
	QIcon: {
		template: '<i class="q-icon"></i>',
		props: ['name', 'color', 'size']
	},
	QCard: {
		template: '<div class="q-card"><slot /></div>'
	},
	QCardSection: {
		template: '<div class="q-card-section"><slot /></div>'
	}
}

// Mock Nuxt's auto-imports
;(globalThis as any).defineNuxtConfig = () => ({})
;(globalThis as any).useHead = () => ({})
;(globalThis as any).navigateTo = () => Promise.resolve()
