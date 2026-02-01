import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageHeader from './PageHeader.vue'

describe('PageHeader', () => {
  it('renders back button with default label', () => {
    const wrapper = mount(PageHeader)
    const backBtn = wrapper.find('button[aria-label="Volver"]')
    expect(backBtn.exists()).toBe(true)
    expect(backBtn.text()).toContain('Volver')
  })

  it('renders custom backLabel', () => {
    const wrapper = mount(PageHeader, {
      props: { backLabel: 'Atrás' },
    })
    expect(wrapper.find('button').text()).toContain('Atrás')
  })

  it('renders title when provided', () => {
    const wrapper = mount(PageHeader, {
      props: { title: 'Checkout' },
    })
    expect(wrapper.find('.page-header__title').text()).toBe('Checkout')
  })

  it('emits back when back button clicked', async () => {
    const wrapper = mount(PageHeader)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('back')).toHaveLength(1)
  })
})
