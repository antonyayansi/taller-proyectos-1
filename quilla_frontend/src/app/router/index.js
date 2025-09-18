export default {
    name: 'app',
    path: '/',
    component: () => import('../layouts/Layout.vue'),
    children: [
        {
            name: 'home',
            path: '',
            component: () => import('../modules/home/views/Home.vue')
        }
    ]
}