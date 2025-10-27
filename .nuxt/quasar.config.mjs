import lang from "quasar/lang/en-US.js"
import iconSet from "quasar/icon-set/material-icons.js"
import { Notify,Dialog,Loading } from "quasar"


export const componentsWithDefaults = {  }

export const appConfigKey = "nuxtQuasar"

export const quasarNuxtConfig = {
  lang,
  iconSet,
  components: {"defaults":{},"autoImport":true},
  plugins: {Notify,Dialog,Loading},
  config: {"brand":{"primary":"#1976D2","secondary":"#26A69A","accent":"#9C27B0","dark":"#1d1d1d","positive":"#21BA45","negative":"#C10015","info":"#31CCEC","warning":"#F2C037"}}
}