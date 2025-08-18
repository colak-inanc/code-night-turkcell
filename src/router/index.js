import { createRouter, createWebHistory } from 'vue-router'
import WizardView from '../views/WizardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/wizard' },
    { path: '/wizard', name: 'wizard', component: WizardView },
    { path: '/:pathMatch(.*)*', redirect: '/wizard' },
  ],
})

export default router
