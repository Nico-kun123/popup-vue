import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/main'
    },
    {
      path: '/main',
      name: 'main',
      component: HomeView
    },
    {
      path: '/another',
      name: 'another',
      component: () => import('../views/OtherView.vue')
    }
  ]
})

export default router
