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
  scrollBehavior(to, from, savedPosition) {
    // Si se cambia de ruta siempre tomara la posición superior
    return { top: 0 };
  },
})

export default router
