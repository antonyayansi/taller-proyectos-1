import routerHome from '../modules/home/router';

export default {
  name: 'app',
  path: '/',
  component: () => import('../layouts/Layout.vue'),
  children: [
    {
      name: 'home',
      path: '',
      ...routerHome
    },
    {
      name: 'search',
      path: '/search',
      component: () => import('../modules/search/views/viewSearch.vue'),
    },
    {
      name: 'tops',
      path: '/tops',
      component: () => import('../modules/tops/view/viewTop.vue'),
    },
    {
      name: 'profile',
      path: '/profile',
      component: () => import('../modules/profile/view/viewProfile.vue'),
    },
  ],
}
