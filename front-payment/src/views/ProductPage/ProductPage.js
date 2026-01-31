import { onMounted } from 'vue'
import ProductCard from '@/components/ProductCard/ProductCard.vue'
import { useProducts } from '@/composables'

export default {
  name: 'ProductPage',
  components: { ProductCard },
  setup() {
    const {
      products,
      loading,
      error,
      canRecover,
      formatPrice,
      showProductImage,
      onImageError,
      loadProducts,
      selectProduct,
      clearAndStay,
      initStep,
    } = useProducts()

    onMounted(() => {
      initStep()
      if (products.value.length === 0) loadProducts()
    })

    return {
      products,
      loading,
      error,
      canRecover,
      formatPrice,
      showProductImage,
      onImageError,
      selectProduct,
      clearAndStay,
    }
  },
}
