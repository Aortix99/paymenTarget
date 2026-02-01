import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createStore } from 'vuex'
import { createRouter, createMemoryHistory } from 'vue-router'
import { mount, flushPromises } from '@vue/test-utils'
import ProductPage from './ProductPage.vue'

function createTestStore(initialState = {}) {
  return createStore({
    state: {
      products: [],
      product: { id: null, name: '', description: '', price: 0, stock: 0, img: '' },
      ...initialState,
    },
    getters: { canRecoverProgress: () => false },
    mutations: {
      SET_PRODUCT: vi.fn(),
      SET_PRODUCTS: vi.fn(),
      SET_STEP: vi.fn(),
    },
    actions: {
      fetchProducts: vi.fn().mockResolvedValue([]),
      initProduct: vi.fn(),
      clearCheckout: vi.fn(),
    },
  })
}

describe('ProductPage', () => {
  let store
  let router

  beforeEach(() => {
    store = createTestStore()
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'Product', component: { template: '<div>Home</div>' } },
        { path: '/checkout', component: { template: '<div>Checkout</div>' } },
      ],
    })
  })

  it('renders loading message while loading', async () => {
    store.state.products = []
    const wrapper = mount(ProductPage, {
      global: {
        plugins: [store, router],
      },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toMatch(/Cargando|productos/)
  })

  it('renders product list when products loaded', async () => {
    const products = [
      { id: 1, name: 'P1', description: 'D1', price: 100, stock: 5, img: '' },
    ]
    store.dispatch = vi.fn().mockResolvedValue(products)
    store.state.products = products
    const wrapper = mount(ProductPage, {
      global: {
        plugins: [store, router],
      },
    })
    await router.isReady()
    await flushPromises()
    expect(wrapper.findAllComponents({ name: 'ProductCard' }).length).toBe(1)
  })

  it('shows empty message when products empty and not loading', async () => {
    store.dispatch = vi.fn().mockResolvedValue([])
    const wrapper = mount(ProductPage, {
      global: {
        plugins: [store, router],
      },
    })
    await router.isReady()
    await flushPromises()
    expect(wrapper.text()).toContain('No hay productos')
  })
})
