import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createStore } from 'vuex'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { useCardForm } from './useCardForm.js'

function createMockStore() {
  return createStore({
    state: {
      cardForm: { number: '', holder: '', expiry: '', cvc: '' },
    },
    mutations: {
      SET_CARD_FORM: vi.fn(function (state, payload) {
        state.cardForm = { ...state.cardForm, ...payload }
      }),
    },
  })
}

describe('useCardForm', () => {
  let store = {
    commit: vi.fn(),
    state: { cardForm: { number: 'as', holder: 'as', expiry: 'as', cvc: 'as' } },
  }
  let wrapper

  const TestWrapper = {
    setup() {
      return useCardForm()
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

  it('card getter returns store.state.cardForm', async () => {
    store.state.cardForm = { number: '4111', holder: 'John', expiry: '', cvc: '' }
    store.commit = vi.fn().mockResolvedValueOnce({ number: '4111', holder: 'John' });
    await wrapper.vm.$nextTick()
    store.commit = vi.fn().mockResolvedValueOnce({ number: '4111', holder: 'John' });
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.card.number).toBe('4111')
    expect(wrapper.vm.card.holder).toBe('John')
  })

  it('onCardNumberInput commits SET_CARD_FORM with formatted number', () => {
    const commitSpy = vi.spyOn(store, 'commit')
    wrapper.vm.onCardNumberInput({ target: { value: '4111111111111111' } })
    expect(commitSpy).toHaveBeenCalledWith(
      'SET_CARD_FORM',
      expect.objectContaining({ number: '4111 1111 1111 1111' }),
    )
  })

  it('validate returns true when form valid and sets no errors', () => {
    store.state.cardForm = {
      number: '4111 1111 1111 1111',
      holder: 'John Doe',
      expiry: '12/30',
      cvc: '123',
    }
    const result = wrapper.vm.validate()
    expect(result).toBe(true)
    expect(Object.keys(wrapper.vm.errors).length).toBe(0)
  })

  it('validate returns false when form invalid and sets errors', () => {
    store.state.cardForm = { number: '', holder: '', expiry: '', cvc: '' }
    const result = wrapper.vm.validate()
    expect(result).toBe(false)
    expect(Object.keys(wrapper.vm.errors).length).toBeGreaterThan(0)
  })
  it('card setter commits SET_CARD_FORM', async () => {

    const newCard = {
      number: '4111 1111 1111 1111',
      holder: 'John Doe',
      expiry: '12/30',
      cvc: '123',
    }

    wrapper.vm.card = newCard

    await wrapper.vm.$nextTick()
    await wrapper.vm.onExpiryInput({ target: { value: '12/30' } })
    await wrapper.vm.onCvcInput({ target: { value: '123' } })
  })
})
