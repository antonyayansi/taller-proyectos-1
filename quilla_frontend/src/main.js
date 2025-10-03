import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import VueGoogleMaps from '@fawmi/vue-google-maps'

import App from './App.vue'
import { Quilla } from './themes/Quilla'
import router from './router'

const app = createApp(App)

  app.use(PrimeVue, {
    theme: {
      preset: Quilla,
      options: {
        darkModeSelector: '.dark',
      },
    },
  })
  .use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyClgb1ViE6cjIMaDTobCLHxUcJk6AutcLk',
      libraries: 'places',
    },
  })
  .use(router)
  .use(createPinia())
  .mount('#app')
