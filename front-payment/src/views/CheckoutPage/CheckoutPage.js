import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import PageHeader from '@/components/PageHeader/PageHeader.vue'
import CardForm from '@/components/CardForm/CardForm.vue'
import DeliveryForm from '@/components/DeliveryForm/DeliveryForm.vue'

export default {
  name: 'CheckoutPage',
  components: { PageHeader, CardForm, DeliveryForm },
  setup() {
    const router = useRouter()
    const store = useStore()
    const cardFormRef = ref(null)
    const deliveryFormRef = ref(null)

    function goBack() {
      router.push('/')
      store.dispatch('clearCheckout')
    }

    function goToResumen() {
      const cardOk = cardFormRef.value?.validate?.()
      const deliveryOk = deliveryFormRef.value?.validate?.()
      if (!cardOk || !deliveryOk) return
      store.commit('SET_STEP', 'resumen')
      router.push('/resumen')
    }

    onMounted(() => {
      store.commit('SET_STEP', 'checkout')
    })

    return {
      cardFormRef,
      deliveryFormRef,
      goBack,
      goToResumen,
    }
  },
}
