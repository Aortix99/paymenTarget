import { describe, it, expect, beforeEach, vi } from 'vitest'
import api from '@/api/serrvicios'

import store from './index'
vi.mock('@/api/serrvicios', () => {
  return {
    default: {
      getProducts: vi.fn(),
    },
  }
})

beforeEach(() => {
  vi.stubGlobal('localStorage', {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  })
})
it('calculates baseCharge, shippingCost and totalAmount', () => {
  store.getters.canRecoverProgress
  store.commit('SET_PRODUCT', { price: 1000, stock: 2 })
  store.commit('SET_TRANSACTION', { id: 1000 })
  store.commit('SET_DELIVERY_FORM', { id: 1000 })
  store.commit('SET_PRODUCTS', { id: 1000 })
  store.commit('CLEAR_CHECKOUT', { id: 1000 })
  store.commit('SET_PRODUCTS',)

  expect(store.getters.baseCharge).toBe(500)
  expect(store.getters.shippingCost).toBe(2400) // 2 * 1200
  expect(store.getters.totalAmount).toBe(3900)
  // expect(store.getters.canRecoverProgress).toBe('okay')
  // expect(store.getters.canRecoverProgress).toBe(null)
})
it('detects visa card', () => {
  store.commit('SET_CARD_FORM', { number: '4111 1111 1111 1111' })
  expect(store.getters.cardBrand).toBe('visa')
})

it('detects mastercard', () => {
  store.commit('SET_CARD_FORM', { number: '5105 1051 0510 5100' })
  expect(store.getters.cardBrand).toBe('mastercard')
})
it('sets checkout step', () => {
  store.commit('SET_STEP', 'checkout')
  expect(store.state.step).toBe('checkout')
})
it('restores state from localStorage', async () => {
  localStorage.getItem.mockReturnValue(
  )
  await store.dispatch('restoreFromStorage')
})
it('restores state from localStorage', async () => {
  localStorage.getItem.mockReturnValue('INVALID_JSON')
  await store.dispatch('restoreFromStorage')
})
it('restores state from localStorage', async () => {
  localStorage.getItem.mockReturnValue(
    JSON.stringify({
      step: 'checkout',
      product: { name: 'Test' },
    })
  )

  await store.dispatch('restoreFromStorage')
  expect(store.state.step).toBe('checkout')
  expect(store.state.product.name).toBe('Test')
})
it('persists state to localStorage', async () => {
  await store.dispatch('persistState')

  expect(localStorage.setItem).toHaveBeenCalled()
})
it('fetches products and commits SET_PRODUCTS', async () => {
  const mockProducts = [
    {
      id: 1,
      name: 'Product 1',
      description: 'Desc',
      price: 1000,
      stock: 2,
      img: 'img.png',
    },
  ]

  api.getProducts.mockResolvedValue(mockProducts)

  const result = await store.dispatch('fetchProducts')
  await store.dispatch('setStep')
  await store.dispatch('clearCheckout')
  await store.dispatch('initProduct')

  expect(api.getProducts).toHaveBeenCalled()
  expect(store.state.products).toEqual(mockProducts)
  expect(result).toEqual(mockProducts)
})


