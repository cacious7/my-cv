import { config } from '@vue/test-utils'
import { Quasar } from 'quasar'

// Install Quasar plugin globally for all tests
config.global.plugins = [Quasar]

// Mock Nuxt's auto-imports
global.defineNuxtConfig = () => ({})
global.useHead = () => ({})
global.navigateTo = () => Promise.resolve()
