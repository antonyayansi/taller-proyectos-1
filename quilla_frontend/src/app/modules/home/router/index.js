export default {
    name: 'home',
    path: '/',
    component: () => import('../layouts/Layout.vue'),
    children: [
        {
            name: 'home.index',
            path: '/',
            component: () => import('../views/Home.vue')
        }
    ]
}