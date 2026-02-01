import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createStore } from 'vuex'
import { createRouter, createMemoryHistory } from 'vue-router'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { useResultado } from './useResultado.js'

function createMockStore(overrides = {}) {
  return createStore({
    state: {
      transactionStatus: null,
      transactionId: null,
      ...overrides.state,
    },
    actions: {
      clearCheckout: vi.fn(),
      ...overrides.actions,
    },
    mutations: {
      SET_STEP: vi.fn(),
      ...overrides.mutations,
    },
  })
}

describe('useResultado', () => {
  let store
  let router
  let wrapper

  const TestWrapper = {
    setup() {
      return useResultado()
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
        { path: '/resultado', component: { render: () => h('div') } },
      ],
    })
    wrapper = mount(TestWrapper, {
      global: { plugins: [store, router] },
    })
  })

  it('status is computed from store.state.transactionStatus', async () => {
    store.state.transactionStatus = 'APPROVED'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.status).toBe('APPROVED')
  })

  it('isApproved is true when status is APPROVED', async () => {
    store.state.transactionStatus = 'APPROVED'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isApproved).toBe(true)
  })

  it('isDeclined is true when status is DECLINED', async () => {
    store.state.transactionStatus = 'DECLINED'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isDeclined).toBe(true)
  })

  it('goToProduct dispatches clearCheckout and pushes to /', () => {
    const pushSpy = vi.spyOn(router, 'push')
    const dispatchSpy = vi.spyOn(store, 'dispatch')
    wrapper.vm.goToProduct()
    expect(dispatchSpy).toHaveBeenCalledWith('clearCheckout')
    expect(pushSpy).toHaveBeenCalledWith('/')
  })
})
