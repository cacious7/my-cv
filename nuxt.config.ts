// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-10-27',

	devtools: { enabled: true },

	ssr: false,

	modules: [
		'nuxt-quasar-ui'
	],

	quasar: {
		plugins: [
			'Notify',
			'Dialog',
			'Loading'
		],
		iconSet: 'mdi-v7',
		extras: {
			font: null,
			fontIcons: ['mdi-v7']
		},
		config: {
			brand: {
				primary: '#025E73', // Dark Teal - primary brand color
				secondary: '#03A688', // Bright Teal - secondary elements
				accent: '#F2668B', // Pink/Rose - accents and highlights
				dark: '#011F26', // Deep Dark - dark backgrounds
				positive: '#03A688', // Bright Teal - success states
				negative: '#C10015', // Keep default red for errors
				info: '#026873', // Medium Teal - info messages
				warning: '#F2C037' // Keep default yellow for warnings
			}
		}
	},

	css: [
		'~/assets/styles/main.css'
	],

	typescript: {
		strict: true,
		typeCheck: false
	},

	vite: {
		build: {
			target: 'esnext'
		}
	},

	app: {
		head: {
			title: 'Cacious Siamunyanga - Senior Software Developer',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ name: 'description', content: 'Senior Software Developer and Developer Department Head with expertise in Vue, Nuxt, TypeScript, and Node.js' },
				{ name: 'keywords', content: 'Software Developer, Vue.js, Nuxt.js, TypeScript, Node.js, Full Stack Developer' }
			],
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
			]
		}
	}
})
