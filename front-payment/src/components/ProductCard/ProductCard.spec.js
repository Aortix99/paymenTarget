import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductCard from './ProductCard.vue'

describe('ProductCard', () => {
  const formatPrice = (n) => `$${n}`
  const showImage = () => true
  const onImageError = () => {}

  it('renders product name and description', () => {
    const product = {
      id: 1,
      name: 'Producto Test',
      description: 'Descripción test',
      price: 10000,
      stock: 5,
      img: 'img.jpg',
    }
    const wrapper = mount(ProductCard, {
      props: {
        product,
        formatPrice,
        showImage,
        onImageError,
      },
    })
    expect(wrapper.text()).toContain('Producto Test')
    expect(wrapper.text()).toContain('Descripción test')
  })

  it('displays formatted price and stock', () => {
    const product = {
      id: 1,
      name: 'P1',
      description: 'D',
      price: 10000,
      stock: 3,
      img: '',
    }
    const wrapper = mount(ProductCard, {
      props: {
        product,
        formatPrice: (n) => `$${n}`,
        showImage,
        onImageError,
      },
    })
    expect(wrapper.text()).toContain('$10000')
    expect(wrapper.text()).toContain('Stock: 3 unidades')
  })

  it('emits select with product when button clicked', async () => {
    const product = { id: 1, name: 'P1', description: 'D', price: 100, stock: 1, img: '' }
    const wrapper = mount(ProductCard, {
      props: { product, formatPrice, showImage, onImageError },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('select')).toHaveLength(1)
    expect(wrapper.emitted('select')[0]).toEqual([product])
  })

  it('disables button when stock is 0', () => {
    const product = { id: 1, name: 'P1', description: 'D', price: 100, stock: 0, img: '' }
    const wrapper = mount(ProductCard, {
      props: { product, formatPrice, showImage, onImageError },
    })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })
})
