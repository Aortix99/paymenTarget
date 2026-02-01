import { createStore } from 'vuex'

const STORAGE_KEY = 'wompi-checkout-state'
const BASE_CHARGE = 500
const SHIPPING_PER_UNIT = 1200

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    console.log('estamos tomando...', raw);
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}
// intentamos guardar status xd
function saveState(state) {
  // try {
  const toSave = {
    product: state.product,
    cardForm: state.cardForm,
    deliveryForm: state.deliveryForm,
    transactionId: state.transactionId,
    transactionStatus: state.transactionStatus,
    step: state.step,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  // } catch (_) {}
}

export default createStore({
  state: {
    products: [], // lista desde GET /products
    product: {
      id: null,
      name: '',
      description: '',
      price: 0,
      stock: 0,
      img: '',
    },
    cardForm: {
      number: '',
      holder: '',
      expiry: '',
      cvc: '',
    },
    deliveryForm: {
      country: '',
      city: '',
      address: '',
      fullName: '',
      document: '',
      email: ''
    },
    transactionId: null,
    transactionStatus: null,
    step: 'product',
  },

  getters: {
    baseCharge: () => BASE_CHARGE,
    shippingCost: (state) => state.product.stock * SHIPPING_PER_UNIT,
    totalAmount: (state, getters) =>
      (state.product.price) + getters.baseCharge + getters.shippingCost,
    canRecoverProgress: (state) =>
      state.transactionId != null ||
      state.transactionStatus != null ||
      (state.cardForm.number),
    cardBrand: (state) => {
      const n = (state.cardForm.number || '').replace(/\s/g, '')
      if (/^4/.test(n)) return 'visa'  // que me diferencia una visa de una mastercard
      if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard'
      return null
    },
  },

  mutations: {
    SET_PRODUCT(state, payload) {
      state.product = { ...state.product, ...payload }
    },
    SET_CARD_FORM(state, payload) {
      state.cardForm = { ...state.cardForm, ...payload }
    },
    SET_DELIVERY_FORM(state, payload) {
      state.deliveryForm = { ...state.deliveryForm, ...payload }
    },
    SET_TRANSACTION(state, { id, status }) {
      if (id != null) state.transactionId = id
      if (status != null) state.transactionStatus = status
    },
    SET_STEP(state, step) {
      state.step = step
    },
    SET_PRODUCTS(state, list) {
      state.products = list || []
    },
    RESTORE_STATE(state, payload) {
      console.log('restaurando...', state, payload);
      if (payload.product) state.product = { ...state.product, ...payload.product }
      if (payload.cardForm) state.cardForm = { ...payload.cardForm }
      if (payload.deliveryForm) state.deliveryForm = { ...payload.deliveryForm }
      if (payload.transactionId != null) state.transactionId = payload.transactionId
      if (payload.transactionStatus != null) state.transactionStatus = payload.transactionStatus
      if (payload.step) state.step = payload.step
    },
    CLEAR_CHECKOUT(state) {
      state.cardForm = { number: '', holder: '', expiry: '', cvc: '' }
      state.deliveryForm = { country: '', city: '', address: '', fullName: '', document: '', email: '' }
      state.transactionId = null
      state.transactionStatus = null
      state.step = 'product'
    },
  },

  actions: {
    async fetchProducts({ commit }) {
      const api = (await import('@/api/serrvicios')).default
      const list = await api.getProducts()
      const normalized = (list || []).map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        img: p.img,
      }))
      commit('SET_PRODUCTS', normalized)
      return normalized
    },
    restoreFromStorage({ commit }) {
      const saved = loadState()
      if (saved) commit('RESTORE_STATE', saved)
    },
    persistState({ state }) {
      saveState(state)
    },
    setStep({ commit }, step) {
      commit('SET_STEP', step)
    },
    clearCheckout({ commit, state }) {
      commit('CLEAR_CHECKOUT')
      saveState(state)
    },
    initProduct({ commit }) {
      commit('SET_STEP', 'product')
    },
  },

  plugins: [
    (store) => {
      store.subscribe((_mutation, state) => {
        saveState(state)
      })
    },
  ],
})
// await this.$store.dispatch('clearCheckout')


