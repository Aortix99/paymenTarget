import { describe, expect } from 'vitest';
import CardLogos from './CardLogos.vue'
import { mount } from '@vue/test-utils'
// vi.mock('vue', () => ({
//     computed: () => ('saad')
// }));
vi.mock('vuex', () => ({
    useStore: () => ({
        getters: {
            cardBrand: 'visa'
        }
    })
}));
describe('CardLogos', () => {
    it('renders card logos based on brand', () => {
        const wrapper = mount(CardLogos);
        expect(wrapper.text()).toContain('VISAMC')
    })
});