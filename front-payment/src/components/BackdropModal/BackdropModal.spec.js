import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BackdropModal from './BackdropModal.vue'

describe('BackdropModal', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders when show is true', async () => {
    const wrapper = mount(BackdropModal, {
      props: { show: true },
      slots: { default: '<p>Contenido del modal</p>' },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()
    const modal = document.body.querySelector('.backdrop-modal')
    expect(modal).toBeTruthy()
    expect(modal?.textContent).toContain('Contenido del modal')
    wrapper.unmount()
  })

  it('does not render when show is false', () => {
    const wrapper = mount(BackdropModal, {
      props: { show: false },
      attachTo: document.body,
    })
    const modal = document.body.querySelector('.backdrop-modal')
    expect(modal).toBeFalsy()
    wrapper.unmount()
  })

  it('renders title when provided', async () => {
    const wrapper = mount(BackdropModal, {
      props: { show: true, title: 'Título del modal' },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()
    const title = document.body.querySelector('.backdrop-modal__title')
    expect(title?.textContent).toBe('Título del modal')
    wrapper.unmount()
  })

  it('emits close when close button clicked', async () => {
    const wrapper = mount(BackdropModal, {
      props: { show: true, title: 'Test' },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()
    const closeBtn = document.body.querySelector('button[aria-label="Cerrar"]')
    await closeBtn?.click()
    expect(wrapper.emitted('close')).toHaveLength(1)
    wrapper.unmount()
  })

  it('emits close when backdrop (self) clicked', async () => {
    const wrapper = mount(BackdropModal, {
      props: { show: true },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()
    const modal = document.body.querySelector('.backdrop-modal')
    await modal?.click()
    expect(wrapper.emitted('close')).toHaveLength(1)
    wrapper.unmount()
  })
})
