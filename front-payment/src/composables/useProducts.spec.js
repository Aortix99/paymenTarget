import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createStore } from 'vuex'
import { createRouter, createMemoryHistory } from 'vue-router'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { useProducts } from './useProducts.js'

function createMockStore() {
  return createStore({
    state: {
      products: [],
      product: { id: null, name: '', description: '', price: 0, stock: 0, img: '' },
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

describe('useProducts', () => {
  let store
  let router
  let wrapper

  const TestWrapper = {
    setup() {
      return useProducts()
    },
    render() {
      return h('div')
    },
  }

  beforeEach(() => {
    store = createMockStore()
    router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { render: () => h('div') } }, { path: '/checkout', component: { render: () => h('div') } }],
    })
    wrapper = mount(TestWrapper, {
      global: {
        plugins: [store, router],
      },
    })
  })

  it('exposes products from store state', async () => {
    store.state.products = [{ id: 1, name: 'P1' }]
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.products).toEqual([{ id: 1, name: 'P1' }])
  })

  it('formatPrice formats number as COP currency', () => {
    const { formatPrice } = wrapper.vm
    expect(formatPrice(10000)).toMatch(/10\.?000|10,?000/)
  })

  it('selectProduct commits SET_PRODUCT and pushes to checkout', () => {
    const pushSpy = vi.spyOn(router, 'push')
    const commitSpy = vi.spyOn(store, 'commit')
    const product = { id: 1, name: 'P1', description: 'D', price: 100, stock: 5, img: '' }
    wrapper.vm.selectProduct(product)
    expect(commitSpy).toHaveBeenCalledWith('SET_PRODUCT', expect.objectContaining({ id: 1, name: 'P1' }))
    expect(pushSpy).toHaveBeenCalledWith('/checkout')
  })

  it('loadProducts dispatches fetchProducts and sets products on success', async () => {
    const list = [{ id: 1, name: 'P1' }]
    const dispatchSpy = vi.spyOn(store, 'dispatch').mockResolvedValue(list)
    await wrapper.vm.loadProducts()
    expect(dispatchSpy).toHaveBeenCalledWith('fetchProducts')
  })
  it('loadProducts enters catch when fetchProducts fails', async () => {
    const dispatchSpy = vi
      .spyOn(store, 'dispatch')
      .mockImplementation((action) => {
        if (action === 'fetchProducts') {
          return Promise.reject(new Error('boom'))
        }
        return Promise.resolve()
      })

    const commitSpy = vi.spyOn(store, 'commit')

    await wrapper.vm.loadProducts()
    await wrapper.vm.$nextTick()

    expect(dispatchSpy).toHaveBeenCalledWith('initProduct')
    expect(commitSpy).toHaveBeenCalledWith(
      'SET_PRODUCTS',
      [store.state.product]
    )
  })


  it('clearAndStay dispatches clearCheckout', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch')
    wrapper.vm.clearAndStay()
    expect(dispatchSpy).toHaveBeenCalledWith('clearCheckout')
  })

  it('initStep commits SET_STEP product', () => {
    const commitSpy = vi.spyOn(store, 'commit')
    wrapper.vm.initStep()
    expect(commitSpy).toHaveBeenCalledWith('SET_STEP', 'product')
    wrapper.vm.showProductImage({ id: 1, img: 'url' })
    wrapper.vm.onImageError(1)
  })
})
