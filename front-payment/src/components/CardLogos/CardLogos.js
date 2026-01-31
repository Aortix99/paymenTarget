import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'CardLogos',
  setup() {
    const store = useStore()
    const brand = computed(() => store.getters.cardBrand)
    return { brand }
  },
}
