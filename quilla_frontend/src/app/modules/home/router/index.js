export default {
    name: 'home',
    path: '/',
    component: () => import('../layouts/Layout.vue'),
    children: [
        {
            name: 'home.index',
            path: '/',
            component: () => import('../views/Home.vue')
        },
        {
            name: 'home.sitio',
            path: '/sitio/:id',
            component: () => import('../views/SitioDetail.vue')
        },
        {
            name: 'home.sitio.navigate',
            path: '/sitio/:id/navigate',
            component: () => import('../views/SitioNavigate.vue')
        }
    ]
}