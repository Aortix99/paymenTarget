import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createStore } from 'vuex'
import { createRouter, createMemoryHistory } from 'vue-router'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { usePayment } from './usePayment.js'
import api from '@/api/serrvicios'
import api_wompi from '@/api/servicioWompi'


vi.mock('@/api/serrvicios.js', () => ({
  default: {
    postPayment: vi.fn(),
    validateCard: vi.fn(),
  },
}))
vi.mock('@/api/servicioWompi.js', () => ({
  default: {
    tokensAutAcep: vi.fn().mockResolvedValue({ presigned_acceptance: { acceptance_token: 't' }, presigned_personal_data_auth: { acceptance_token: 't2' } }),
    tokenCard: vi.fn().mockResolvedValue({
      number: '4111 1111 1111 1111',
      exp_month: '12',
      exp_year: '12',
      cvc: '123',
      card_holder: 't3'
    }),
  },
}))

function createMockStore() {
  return createStore({
    state: {
      product: { id: 1, name: 'P1', price: 10000 },
      cardForm: { number: '4111 1111 1111 1111', holder: 'J', expiry: '12/30', cvc: '123' },
      deliveryForm: { address: 'Calle 1', city: 'Bogotá', country: 'CO', email: 'a@b.co' },
    },
    getters: {
      baseCharge: () => 500,
      shippingCost: () => 1200,
      totalAmount: () => 116700,
    },
    mutations: {
      SET_TRANSACTION: vi.fn(),
    },
    actions: {
      clearCheckout: vi.fn(),
    },
  })
}

describe('usePayment', () => {
  let store
  let router
  let wrapper

  const TestWrapper = {
    setup() {
      return usePayment()
    },
    render() {
      return h('div')
    },
  }

  beforeEach(() => {
    store = createMockStore()
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { render: () => h('div') } },
        { path: '/checkout', component: { render: () => h('div') } },
        { path: '/resultado', component: { render: () => h('div') } },
      ],
    })
    wrapper = mount(TestWrapper, {
      global: { plugins: [store, router] },
    })
  })

  it('exposes product, baseCharge, shippingCost, totalAmount from store', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.product.id).toBe(1)
    expect(wrapper.vm.baseCharge).toBe(500)
    expect(wrapper.vm.shippingCost).toBe(1200)
    expect(wrapper.vm.totalAmount).toBe(116700)
  })

  it('formatPrice formats number as COP', () => {
    const { formatPrice } = wrapper.vm
    expect(formatPrice(10000)).toMatch(/10\.?000|10,?000/)
  })

  it('goBack pushes to checkout', () => {
    const pushSpy = vi.spyOn(router, 'push')
    const { goBack } = wrapper.vm
    goBack()
    expect(pushSpy).toHaveBeenCalledWith('/checkout')
  })

  it('goToProduct dispatches clearCheckout and pushes to 1/', () => {
    const pushSpy = vi.spyOn(router, 'push')
    const dispatchSpy = vi.spyOn(store, 'dispatch')
    wrapper.vm.goToProduct()
    expect(dispatchSpy).toHaveBeenCalledWith('clearCheckout')
    expect(pushSpy).toHaveBeenCalledWith('/')
  })
  //aquie ntras al cacho del test
  it('goToProduct dispatches clearCheckout and pushes to 2/', async () => {
    await wrapper.vm.confirmPayment();
    await wrapper.vm.$nextTick()

  })
  it('confirmPayment executes wompi flow successfully', async () => {
    api.postPayment.mockResolvedValue({
      transactionId: 123,
    })

    api.validateCard.mockResolvedValue({
      status: 'APPROVED',
    })
    await wrapper.vm.confirmPayment()
    await wrapper.vm.$nextTick()

    expect(api_wompi.tokensAutAcep).toHaveBeenCalled()
  })
})
