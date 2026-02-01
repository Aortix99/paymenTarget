import DeliveryForm from './DeliveryForm.vue'
import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
vi.mock('@/composables', () => ({
    useDeliveryForm: () => ({
        delivery: {},
        errors: {
            country: 1,
            city: 1,
            address: 1,
            fullName: 1,
            document: 1,
            email: 1
        },
        validate: vi.fn()
    })
}));
describe('DeliveryForm', () => {
    it('renders delivery form inputs', async () => {
        const wrapper = mount(DeliveryForm);
        await wrapper.find('#country').trigger('input')
        await wrapper.find('#city').trigger('input')
        await wrapper.find('#address').trigger('input')
        await wrapper.find('#fullName').trigger('input')
        await wrapper.find('#document').trigger('input')
        await wrapper.find('#email').trigger('input')
    })
});