// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-10-27',

	devtools: { enabled: true },

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
				primary: '#1976D2',
				secondary: '#26A69A',
				accent: '#9C27B0',
				dark: '#1d1d1d',
				positive: '#21BA45',
				negative: '#C10015',
				info: '#31CCEC',
				warning: '#F2C037'
			}
		}
	},

	css: [
		'~/assets/styles/main.css'
	],

	typescript: {
		strict: true,
		typeCheck: true
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
