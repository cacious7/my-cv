import lang from "quasar/lang/en-US.js"
import iconSet from "quasar/icon-set/mdi-v7.js"
import { Notify,Dialog,Loading } from "quasar"


export const componentsWithDefaults = {  }

export const appConfigKey = "nuxtQuasar"

export const quasarNuxtConfig = {
  lang,
  iconSet,
  components: {"defaults":{},"autoImport":true},
  plugins: {Notify,Dialog,Loading},
  config: {"brand":{"primary":"#025E73","secondary":"#03A688","accent":"#F2668B","dark":"#011F26","positive":"#03A688","negative":"#C10015","info":"#026873","warning":"#F2C037"}}
}