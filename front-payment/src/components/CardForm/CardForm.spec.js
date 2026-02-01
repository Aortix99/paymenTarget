import { mount } from '@vue/test-utils';
import CardForm from './CardForm.vue'
vi.mock('@/composables', () => ({
    useCardForm: () => ({
        card: {
            number: '',
            expiry: '',
            cvc: '',
        },
        errors: {number: '1', cvc: 'qw', expiry: 'as'},
        onCardNumberInput: vi.fn(),
        onExpiryInput: vi.fn(),
        onCvcInput: vi.fn(),
        validate: vi.fn(),
    }),
}))
describe('CardForm', () => {
    it('renders card form inputs', async () => {
        const wrapper = mount(CardForm, {
            global: {
                stubs: {
                    CardLogos: true,
                },
            },
        });
        expect(wrapper.find('#card-number').exists()).toBe(true)
        expect(wrapper.find('#card-holder').exists()).toBe(true)
        expect(wrapper.find('#card-expiry').exists()).toBe(true)
        expect(wrapper.find('#card-cvc').exists()).toBe(true)
        await wrapper.find('#card-number').trigger('input')
        await wrapper.find('#card-expiry').trigger('input')
        await wrapper.find('#card-cvc').trigger('input')
        await wrapper.find('#card-holder').trigger('input')
    })
});