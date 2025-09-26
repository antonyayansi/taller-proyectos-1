import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import 'mapbox-gl/dist/mapbox-gl.css';

import App from './App.vue'
import { Quilla } from './themes/Quilla'
import router from './router'

const app = createApp(App)

app
  .use(PrimeVue, {
    theme: {
      preset: Quilla,
      options: {
        darkModeSelector: '.dark',
      },
    },
  })
  .use(router)
  .use(createPinia())
  .mount('#app')
