import { createStore } from 'vuex'

const STORAGE_KEY = 'wompi-checkout-state'

function createTestStore() {
  const state = {
    products: [],
    product: { id: null, name: '', description: '', price: 0, stock: 0, img: '' },
    cardForm: { number: '', holder: '', expiry: '', cvc: '' },
    deliveryForm: { fullName: '', address: '', city: '', phone: '', email: '' },
    transactionId: null,
    transactionStatus: null,
    step: 'product',
  }
  const getters = {
    baseCharge: () => 500,
    shippingCost: (s) => (s.product.stock != null ? Math.min(s.product.stock, 5) * 1200 : 0),
    totalAmount: (s, g) => (s.product.price || 0) + g.baseCharge + g.shippingCost,
    canRecoverProgress: (s) =>
      s.transactionId != null ||
      s.transactionStatus != null ||
      (s.cardForm.number && s.deliveryForm.fullName),
    cardBrand: (s) => {
      const n = (s.cardForm.number || '').replace(/\s/g, '')
      if (/^4/.test(n)) return 'visa'
      if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard'
      return null
    },
  }
  const mutations = {
    SET_PRODUCT(s, payload) {
      s.product = { ...s.product, ...payload }
    },
    SET_STEP(s, step) {
      s.step = step
    },
    SET_PRODUCTS(s, list) {
      s.products = list || []
    },
  }
  const actions = {
    initProduct({ commit }) {
      commit('SET_STEP', 'product')
    },
  }
  return createStore({
    state: JSON.parse(JSON.stringify(state)),
    getters,
    mutations,
    actions,
  })
}

describe('store', () => {
  it('initProduct action sets step to product', async () => {
    const store = createTestStore()
    store.state.step = 'checkout'
    await store.dispatch('initProduct')
    expect(store.state.step).toBe('product')
  })

  it('cardBrand getter returns visa for card starting with 4', () => {
    const store = createTestStore()
    store.state.cardForm.number = '4111 1111 1111 1111'
    expect(store.getters.cardBrand).toBe('visa')
  })

  it('cardBrand getter returns mastercard for card starting with 51', () => {
    const store = createTestStore()
    store.state.cardForm.number = '5111 1111 1111 1118'
    expect(store.getters.cardBrand).toBe('mastercard')
  })
})
