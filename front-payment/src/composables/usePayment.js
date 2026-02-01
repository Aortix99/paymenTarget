import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import api from '@/api/serrvicios'
import api_wompi from '@/api/servicioWompi'

/**
 * Composable para confirmación de pago (Composition API).
 */
export function usePayment() {
  const store = useStore()
  const router = useRouter()
  const loading = ref(false)
  const errorMessage = ref('')

  const product = computed(() => store.state.product)
  const baseCharge = computed(() => store.getters.baseCharge)
  const shippingCost = computed(() => store.getters.shippingCost)
  const totalAmount = computed(() => store.getters.totalAmount)

  function formatPrice(n) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(n)
  }

  async function confirmPayment() {
    loading.value = true
    errorMessage.value = ''
    try {
      const delivery = store.state.deliveryForm
      const total = totalAmount.value
      const productId = product.value.id
      const card = store.state.cardForm
      const [month, year] = card.expiry.split('/')

      const payloadOfCard = {
        number: card.number.replace(/\s+/g, ''),
        exp_month: month,
        exp_year: year,
        cvc: card.cvc,
        card_holder: card.holder,
      }

      const { transactionId } = await api.postPayment({
        reference: 'probando',
        amount: total,
        status: 'PENDING',
        wompiTransactionId: 0,
        productId: productId,
        delivery: {
          ...delivery
        }
      })
      store.commit('SET_TRANSACTION', { id: transactionId, status: 'PENDING' })
      const aut = await api_wompi.tokensAutAcep()
      console.log('si me pasa el test', aut);
      const token = await api_wompi.tokenCard(payloadOfCard)
      const pagar = {
        validateCard: {
          type: 'CARD',
          token: token.id,
          customer_email: delivery.email,
          acceptance_token: aut.presigned_acceptance.acceptance_token,
          accept_personal_auth: aut.presigned_personal_data_auth.acceptance_token
        },
        amount: total,
        idTransaction: transactionId,
      }
      const response = await api.validateCard(pagar);

      store.commit('SET_TRANSACTION', { status: response.status })

      router.push('/resultado')
    } catch (err) {
      console.log('quien es err', err);
      errorMessage.value =
      'Error al procesar el pago. Intenta de nuevo.'
        store.commit('SET_TRANSACTION', { status: 'DECLINED' })
      router.push('/resultado')
    } finally {
      loading.value = false
    }
  }

  function goBack() {
    router.push('/checkout')
  }

  function goToProduct() {
    store.dispatch('clearCheckout')
    router.push('/')
  }

  return {
    loading,
    errorMessage,
    product,
    baseCharge,
    shippingCost,
    totalAmount,
    formatPrice,
    confirmPayment,
    goBack,
    goToProduct,
  }
}
