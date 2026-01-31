import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

/**
 * Composable para pantalla de resultado de pago (Composition API).
 */
export function useResultado() {
  const store = useStore()
  const router = useRouter()

  const status = computed(() => store.state.transactionStatus)
  const transactionId = computed(() => store.state.transactionId)
  const isApproved = computed(() => status.value === 'APPROVED')
  const isDeclined = computed(() => status.value === 'DECLINED')

  function goToProduct() {
    store.dispatch('clearCheckout')
    router.push('/')
  }

  onMounted(() => {
    store.commit('SET_STEP', 'resultado')
    if (status.value == null) router.replace('/')
  })

  return {
    status,
    transactionId,
    isApproved,
    isDeclined,
    goToProduct,
  }
}
