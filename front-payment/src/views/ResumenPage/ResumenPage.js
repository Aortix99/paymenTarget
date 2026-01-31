import PageHeader from '@/components/PageHeader/PageHeader.vue'
import BackdropModal from '@/components/BackdropModal/BackdropModal.vue'
import PaymentSummary from '@/components/PaymentSummary/PaymentSummary.vue'
import { usePayment } from '@/composables'

export default {
  name: 'ResumenPage',
  components: { PageHeader, BackdropModal, PaymentSummary },
  setup() {
    const {
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
    } = usePayment()

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
  },
}
