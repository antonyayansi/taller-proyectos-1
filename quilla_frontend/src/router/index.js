import routerApp from '@/app/router'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'app',
      path: '/',
      ...routerApp
    }
  ],
})

export default router
