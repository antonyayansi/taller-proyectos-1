import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip';

import App from './App.vue'
import { Quilla } from './themes/Quilla'
import router from './router'

import './assets/main.css'
import 'primeicons/primeicons.css'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Quilla,
    options: {
      darkModeSelector: '.dark',
    },
  },
})
  .use(router)
  .directive('tooltip', Tooltip)
  .use(createPinia())
  .mount('#app')
