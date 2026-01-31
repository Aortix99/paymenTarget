import { useDeliveryForm } from '@/composables'

export default {
  name: 'DeliveryForm',
  setup() {
    const { delivery, errors, validate } = useDeliveryForm()
    return { delivery, errors, validate }
  },
}
