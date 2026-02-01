import { describe, it } from 'vitest'
import PaymentSummary from './PaymentSummary.vue'
import { mount } from '@vue/test-utils'

describe('PaymentSummary', () => {
    it('renders back button with default label', () => {
        const formatPrice = (value) => `$${value}`
        const wrapper = mount(PaymentSummary, {
            props: {
                productName: 'Producto 1',
                productPrice: 1000,
                baseCharge: 800,
                shippingCost: 200,
                totalAmount: 1200,
                formatPrice,
            },
        })
        // wrapper.formatPrice(1000)
    })
})
