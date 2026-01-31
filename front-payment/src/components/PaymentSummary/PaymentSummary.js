export default {
  name: 'PaymentSummary',
  props: {
    productName: { type: String, default: '' },
    productPrice: { type: [Number, String], default: 0 },
    baseCharge: { type: [Number, String], default: 0 },
    shippingCost: { type: [Number, String], default: 0 },
    totalAmount: { type: [Number, String], default: 0 },
    formatPrice: { type: Function, required: true },
  },
  setup() {
    return {}
  },
}
