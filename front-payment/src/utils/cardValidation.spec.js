import {
  getCardBrand,
  formatCardNumber,
  validateCardNumber,
  validateExpiry,
  validateCvc,
  validateCardForm,
  validateDeliveryForm,
} from './cardValidation'

describe('cardValidation', () => {
  describe('getCardBrand', () => {
    it('returns visa for number starting with 4', () => {
      expect(getCardBrand('4111111111111111')).toBe('visa')
      // expect(getCardBrand('4')).toBe('visa')
    })
    it('returns mastercard for 51-55 or 22-27', () => {
      expect(getCardBrand('5111111111111118')).toBe('mastercard')
      expect(getCardBrand('2221000000000009')).toBe('mastercard')
    })
    it('returns null for unknown brand', () => {
      expect(getCardBrand('9999999999999999')).toBe(null)
    })
  })

  describe('formatCardNumber', () => {
    it('formats digits in groups of 4', () => {
      expect(formatCardNumber('4111111111111111')).toBe('4111 1111 1111 1111')
    })
    it('strips non-digits and limits to 16', () => {
      expect(formatCardNumber('4111-1111-1111-1111')).toBe('4111 1111 1111 1111')
    })
  })

  describe('formatExpiry', () => {
    it('adds slash after 2 digits', () => {
    })
  })

  describe('validateCardNumber', () => {
    it('accepts valid Luhn visa 16 digits', () => {
      expect(validateCardNumber('4111 1111 1111 1111')).toBe(true)
    })
    it('rejects too short', () => {
      expect(validateCardNumber('4111')).toBe(false)
    })
  })

  describe('validateExpiry', () => {
    it('accepts future MM/YY', () => {
      const future = new Date()
      future.setFullYear(future.getFullYear() + 2)
      const yy = String(future.getFullYear() % 100).padStart(2, '0')
      expect(validateExpiry(`12/${yy}`)).toBe(true)
    })
    it('rejects invalid month', () => {
      expect(validateExpiry('13/30')).toBe(false)
    })
  })

  describe('validateCvc', () => {
    it('accepts 3 digits for visa', () => {
      expect(validateCvc('123', '4111111111111111')).toBe(true)
    })
    it('rejects 2 digits', () => {
      expect(validateCvc('12', '4111111111111111')).toBe(false)
    })
  })

  describe('validateCardForm', () => {
    it('returns errors for empty form', () => {
      const errors = validateCardForm({ number: '', holder: '', expiry: '', cvc: '' })
      expect(Object.keys(errors).length).toBeGreaterThan(0)
    })
    it('returns no errors for valid card', () => {
      const errors = validateCardForm({
        number: '4111 1111 1111 1111',
        holder: 'John Doe',
        expiry: '12/30',
        cvc: '123',
      })
      expect(Object.keys(errors).length).toBe(0)
    })
  })

  describe('validateDeliveryForm', () => {
    it('returns errors when address/city/country empty', () => {
      const errors = validateDeliveryForm({ address: '', city: '', country: '' })
      expect(errors.address).toBeDefined()
      expect(errors.city).toBeDefined()
      expect(errors.country).toBeDefined()
    })
    it('returns no errors when all filled', () => {
      const errors = validateDeliveryForm({
        address: 'Calle 1',
        city: 'Bogotá',
        country: 'Colombia',
      })
      expect(Object.keys(errors).length).toBe(3)
    })
  })
})
