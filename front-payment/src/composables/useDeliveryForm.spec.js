import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createStore } from 'vuex'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { useDeliveryForm } from './useDeliveryForm.js'

function createMockStore() {
  return createStore({
    state: {
      deliveryForm: { address: '', city: '', country: '', fullName: '', document: '', email: '' },
    },
    mutations: {
      SET_DELIVERY_FORM: vi.fn(function (state, payload) {
        state.deliveryForm = { ...state.deliveryForm, ...payload }
      }),
    },
  })
}

describe('useDeliveryForm', () => {
  let store
  let wrapper

  const TestWrapper = {
    setup() {
      return useDeliveryForm()
    },
    render() {
      return h('div')
    },
  }

  beforeEach(() => {
    store = createMockStore()
    wrapper = mount(TestWrapper, {
      global: { plugins: [store] },
    })
  })

  it('delivery getter returns store.state.deliveryForm', async () => {
    store.state.deliveryForm = { address: 'Calle 1', city: 'Bogotá', country: 'CO' }
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.delivery.address).toBe('Calle 1')
    expect(wrapper.vm.delivery.city).toBe('Bogotá')
  })

  it('validate returns true when form valid', () => {
    store.state.deliveryForm = {
      address: 'Calle 1',
      city: 'Bogotá',
      country: 'Colombia',
      fullName: 'Juan Pérez',
      document: '123456',
      email: 'a@b.co',
    }
    const result = wrapper.vm.validate()
    expect(result).toBe(true)
    expect(Object.keys(wrapper.vm.errors).length).toBe(0)
  })

  it('validate returns false when address empty and sets errors', () => {
    store.state.deliveryForm = { address: '', city: 'Bogotá', country: 'CO', fullName: '', document: '', email: '' }
    const result = wrapper.vm.validate()
    expect(result).toBe(false)
    expect(wrapper.vm.errors.address).toBeDefined()
  })
})
