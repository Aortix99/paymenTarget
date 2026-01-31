import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { validateDeliveryForm as validateDelivery } from '@/utils/cardValidation'

/**
 * Composable para formulario de entrega (Composition API).
 */
export function useDeliveryForm() {
  const store = useStore()
  const errors = ref({})

  const delivery = computed({
    get: () => store.state.deliveryForm,
    set: (v) => store.commit('SET_DELIVERY_FORM', v),
  })
  console.log('si ando algo reactivo delivery', delivery);
  function validate() {
    errors.value = validateDelivery(store.state.deliveryForm)
    return Object.keys(errors.value).length === 0
  }

  return {
    delivery,
    errors,
    validate,
  }
}
