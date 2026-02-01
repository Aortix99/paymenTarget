import { describe, it, expect } from 'vitest'
import router from './index'

describe('Router index', () => {
  it('should export a router instance', () => {
    expect(router).toBeDefined()
    expect(router.hasRoute('Product')).toBe(true)
    expect(router.hasRoute('Checkout')).toBe(true)
    expect(router.hasRoute('Resumen')).toBe(true)
    expect(router.hasRoute('Resultado')).toBe(true)
  })

  it('should have correct route configuration', () => {
    const productRoute = router.getRoutes().find(r => r.name === 'Product')

    expect(productRoute).toBeDefined()
    expect(productRoute?.path).toBe('/')
    expect(productRoute?.meta.step).toBe('product')
  })
})
