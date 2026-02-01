import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { request } from './index.js'

describe('api/request', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns parsed JSON when response is ok', async () => {
    const data = { id: 1, name: 'test' }
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(data),
    })

    const result = await request('https://api.test/products')

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith('https://api.test/products', expect.any(Object))
    expect(result).toEqual(data)
  })

  it('throws when response not ok with HTTP status message', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
    })

    await expect(request('https://api.test/404')).rejects.toThrow('HTTP 404')
  })

  it('passes method, body and headers to fetch', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) })

    await request('https://api.test/transactions', {
      method: 'POST',
      body: JSON.stringify({ amount: 100 }),
      headers: { 'Content-Type': 'application/json' },
    })

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test/transactions',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ amount: 100 }),
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    )
  })
})
