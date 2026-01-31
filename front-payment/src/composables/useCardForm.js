import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import {
  formatCardNumber as formatNum,
  formatExpiry as formatExp,
  formatCvc as formatCvcVal,
  validateCardForm as validateCard,
} from '@/utils/cardValidation'

/**
 * Composable para formulario de tarjeta (Composition API).
 */
export function useCardForm() {
  const store = useStore()
  const errors = ref({})

  const card = computed({
    get: () => store.state.cardForm,
    set: (v) => store.commit('SET_CARD_FORM', v),
  })

  function onCardNumberInput(e) {
    store.commit('SET_CARD_FORM', { ...store.state.cardForm, number: formatNum(e.target.value) })
  }

  function onExpiryInput(e) {
    store.commit('SET_CARD_FORM', { ...store.state.cardForm, expiry: formatExp(e.target.value) })
  }

  function onCvcInput(e) {
    store.commit('SET_CARD_FORM', { ...store.state.cardForm, cvc: formatCvcVal(e.target.value) })
  }

  function validate() {
    errors.value = validateCard(store.state.cardForm)
    return Object.keys(errors.value).length === 0
  }

  return {
    card,
    errors,
    onCardNumberInput,
    onExpiryInput,
    onCvcInput,
    validate,
  }
}
