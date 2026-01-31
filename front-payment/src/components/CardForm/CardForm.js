import CardLogos from '@/components/CardLogos/CardLogos.vue'
import { useCardForm } from '@/composables'

export default {
  name: 'CardForm',
  components: { CardLogos },
  setup() {
    const { card, errors, onCardNumberInput, onExpiryInput, onCvcInput, validate } = useCardForm()
    return { card, errors, onCardNumberInput, onExpiryInput, onCvcInput, validate }
  },
}
