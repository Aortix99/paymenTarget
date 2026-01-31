import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

/**
 * Composable para lista de productos, carga y selección (Composition API).
 */
export function useProducts() {
  const store = useStore()
  const router = useRouter()
  const loading = ref(false)
  const error = ref('')
  const imageLoadErrors = reactive({})

  const products = computed(() => store.state.products)
  const canRecover = computed(() => store.getters.canRecoverProgress)

  function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(price || 0)
  }

  function showProductImage(product) {
    const url = product.img
    return url && !imageLoadErrors[product.id]
  }

  function onImageError(productId) {
    imageLoadErrors[productId] = true
  }

  async function loadProducts() {
    loading.value = true
    error.value = ''
    try {
      await store.dispatch('fetchProducts')
    } catch (e) {
      error.value = e?.message || 'No se pudieron cargar los productos.'
      store.dispatch('initProduct')
      store.commit('SET_PRODUCTS', [store.state.product])
    } finally {
      loading.value = false
    }
  }

  function selectProduct(p) {
    store.commit('SET_PRODUCT', {
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      img: p.img,
    })
    router.push('/checkout')
  }

  function clearAndStay() {
    store.dispatch('clearCheckout')
  }

  function initStep() {
    store.commit('SET_STEP', 'product')
  }

  return {
    products,
    loading,
    error,
    canRecover,
    formatPrice,
    showProductImage,
    onImageError,
    loadProducts,
    selectProduct,
    clearAndStay,
    initStep,
  }
}
