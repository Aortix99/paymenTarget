import { useResultado } from '@/composables'

export default {
  name: 'ResultadoPage',
  setup() {
    const { isApproved, isDeclined, transactionId, goToProduct } = useResultado()
    return { isApproved, isDeclined, transactionId, goToProduct }
  },
}
