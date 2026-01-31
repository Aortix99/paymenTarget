export default {
  name: 'PageHeader',
  props: {
    title: { type: String, default: '' },
    backLabel: { type: String, default: 'Volver' },
  },
  emits: ['back'],
  setup(_, { emit }) {
    return { emit }
  },
}
