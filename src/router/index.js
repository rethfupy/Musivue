import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ManageView from '@/views/ManageView.vue'
import useUserStore from '@/stores/user'

const routes = [
    {
        name: 'home',
        alias: '/home',
        path: '/',
        component: HomeView,
    },
    {
        path: '/:catchAll(.*)*',
        redirect: { name: 'home' },
    },
    {
        name: 'manage',
        path: '/manage',
        component: ManageView,
        meta: {
            requiresAuth: true,
        },
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    linkExactActiveClass: '!text-violet-400',
})

router.beforeEach((to, from, next) => {
    if (!to.meta.requiresAuth) {
        next()
        return
    }
    const store = useUserStore()
    store.userLoggedIn ? next() : next({ name: 'home' })
})

export default router
