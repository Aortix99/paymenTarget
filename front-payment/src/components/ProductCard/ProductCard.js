import { computed } from 'vue'

export default {
  name: 'ProductCard',
  props: {
    product: { type: Object, required: true },
    formatPrice: { type: Function, required: true },
    showImage: { type: Function, required: true },
    onImageError: { type: Function, required: true },
  },
  emits: ['select'],
  setup(props, { emit }) {
    console.log('si me responde: ', emit);
    const stock = computed(() => props.product.stock)
    console.log('la product es: ', stock);
    const img = computed(() => props.product.img)
    return { stock, img, emit }
  },
}
