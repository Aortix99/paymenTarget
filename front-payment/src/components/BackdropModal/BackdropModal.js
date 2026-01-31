export default {
  name: 'BackdropModal',
  props: {
    show: { type: Boolean, default: false },
    title: { type: String, default: '' },
  },
  emits: ['close'],
  setup(_, { emit }) {
    return { emit }
  },
}
