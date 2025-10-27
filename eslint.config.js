import eslintConfigPrettier from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'

export default [
	{
		ignores: [
			'node_modules/**',
			'dist/**',
			'.nuxt/**',
			'.output/**',
			'nuxt-cv-backup/**'
		]
	},
	{
		files: ['**/*.{js,ts,vue}'],
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				parser: tsParser,
				ecmaVersion: 'latest',
				sourceType: 'module'
			}
		},
		plugins: {
			'@typescript-eslint': tseslint,
			vue: pluginVue
		},
		rules: {
			// No semicolons except in CSS
			semi: ['error', 'never'],
			// No trailing spaces
			'no-trailing-spaces': 'error',
			// Enforce tabs
			indent: ['error', 'tab', { SwitchCase: 1 }],
			// Vue specific rules
			'vue/html-indent': ['error', 'tab'],
			'vue/script-indent': ['error', 'tab', { baseIndent: 1 }],
			'vue/multi-word-component-names': 'error',
			'vue/component-name-in-template-casing': ['error', 'PascalCase'],
			'vue/require-default-prop': 'error',
			'vue/require-prop-types': 'error',
			// TypeScript rules
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
		}
	},
	eslintConfigPrettier
]
