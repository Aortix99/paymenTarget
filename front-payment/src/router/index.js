import { createRouter, createWebHistory } from 'vue-router'
import ProductPage from '@/views/ProductPage/ProductPage.vue'
import CheckoutPage from '@/views/CheckoutPage/CheckoutPage.vue'
import ResumenPage from '@/views/ResumenPage/ResumenPage.vue'
import ResultadoPage from '@/views/ResultadoPage/ResultadoPage.vue'

const routes = [
  { path: '/', name: 'Product', component: ProductPage, meta: { step: 'product' } },
  { path: '/checkout', name: 'Checkout', component: CheckoutPage, meta: { step: 'checkout' } },
  { path: '/resumen', name: 'Resumen', component: ResumenPage, meta: { step: 'resumen' } },
  { path: '/resultado', name: 'Resultado', component: ResultadoPage, meta: { step: 'resultado' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
