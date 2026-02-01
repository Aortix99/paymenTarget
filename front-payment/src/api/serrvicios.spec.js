import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as apiIndex from './index.js'
import { getProducts, postPayment, validateCard } from './serrvicios.js'

vi.mock('./index.js', () => ({
  request: vi.fn(),
}))

describe('api/serrvicios', () => {
  beforeEach(() => {
    vi.mocked(apiIndex.request).mockReset()
  })

  it('getProducts calls request with products URL', async () => {
    apiIndex.request.mockResolvedValueOnce([{ id: 1, name: 'P1' }])

    const result = await getProducts()

    expect(apiIndex.request).toHaveBeenCalledTimes(1)
    expect(apiIndex.request).toHaveBeenCalledWith(expect.stringContaining('products'))
    expect(result).toEqual([{ id: 1, name: 'P1' }])
  })

  it('postPayment calls request with transactions URL and payment body', async () => {
    const paymentData = { amount: 10000, productId: 1, delivery: { city: 'Bogotá' } }
    apiIndex.request.mockResolvedValueOnce({ transactionId: 42 })

    const result = await postPayment(paymentData)

    expect(apiIndex.request).toHaveBeenCalledWith(
      expect.stringContaining('transactions'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(paymentData),
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    )
    expect(result).toEqual({ transactionId: 42 })
  })

  it('validateCard calls request with validate-card URL and card body', async () => {
    const cardData = { validateCard: {}, amount: 10000, idTransaction: 1 }
    apiIndex.request.mockResolvedValueOnce({ status: 'VALID' })

    const result = await validateCard(cardData)

    expect(apiIndex.request).toHaveBeenCalledWith(
      expect.stringContaining('validate-card'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(cardData),
      }),
    )
    expect(result).toEqual({ status: 'VALID' })
  })
})
