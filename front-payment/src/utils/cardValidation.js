/**
 * Card validation helpers. Data must be fake but structurally valid.
 * Detects VISA and MasterCard.
 */

export function getCardBrand(number) {
  const n = (number || '').replace(/\s/g, '')
  if (/^4\d{12}(\d{3})?$/.test(n)) return 'visa'
  if (/^(5[1-5]\d{14}|2(22[1-9]|2[3-9]\d|3[0-6]\d|37\d)\d{12})$/.test(n)) return 'mastercard'
  return null
}

export function formatCardNumber(value) {
  const v = value.replace(/\D/g, '').slice(0, 16)
  const parts = v.match(/.{1,4}/g) || []
  return parts.join(' ').trim()
}

export function formatExpiry(value) {
  const v = value.replace(/\D/g, '').slice(0, 4)
  if (v.length >= 2) return `${v.slice(0, 2)}/${v.slice(2)}`
  return v
}

export function formatCvc(value) {
  return value.replace(/\D/g, '').slice(0, 4)
}

export function validateCardNumber(number) {
  console.log('antes', number);
  const n = (number || '').replace(/\s/g, '')
  console.log('despues de limpiar', n.length);
  if (n.length < 13 || n.length > 19) return false
  const brand = getCardBrand(n)
  if (brand === 'visa' && (n.length !== 13 && n.length !== 16)) return false
  if (brand === 'mastercard' && n.length !== 16) return false
  return luhnCheck(n)
}

function luhnCheck(str) {
  let sum = 0
  let even = false
  for (let i = str.length - 1; i >= 0; i--) {
    let n = parseInt(str[i], 10)
    if (even) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    even = !even
  }
  return sum % 10 === 0
}

export function validateExpiry(expiry) {
  const [mm, yy] = (expiry || '').split('/').map((s) => s.trim())
  if (!mm || !yy || mm.length !== 2 || yy.length !== 2) return false
  const m = parseInt(mm, 10)
  const y = parseInt(yy, 10)
  if (m < 1 || m > 12) return false
  const now = new Date()
  const currentYear = now.getFullYear() % 100
  const currentMonth = now.getMonth() + 1
  if (y < currentYear) return false
  if (y === currentYear && m < currentMonth) return false
  return true
}

export function validateCvc(cvc, cardNumber) {
  const c = (cvc || '').replace(/\D/g, '')
  const brand = getCardBrand((cardNumber || '').replace(/\s/g, ''))
  const len = brand === 'amex' ? 4 : 3
  return c.length === len && /^\d+$/.test(c)
}

export function validateCardForm({ number, holder, expiry, cvc }) {
  const errors = {}
  if (!validateCardNumber(number)) errors.number = 'NUmero de tarjeta invalido'
  if (!(holder || '').trim() || (holder || '').trim().length < 3) errors.holder = 'Nombre en tarjeta requerido'
  if (!validateExpiry(expiry)) errors.expiry = 'Fecha de vencimiento inválida'
  if (!validateCvc(cvc, number)) errors.cvc = 'CVC inválido'
  return errors
}

export function validateDeliveryForm({ address, city, country, email, fullName, document }) {
  const errors = {}
  if (!(address || '').trim()) errors.address = 'Dirección requerida'
  if (!(city || '').trim()) errors.city = 'Ciudad requerida'
  if (!(country || '').trim()) errors.country = 'País requerido'
  if (!(email || '').trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Correo inválido'
  if (!(fullName || '').trim()) errors.fullName = 'Nombre completo requerido'
  if (!(document || '').trim()) errors.document = 'Documento requerido'
  return errors
}
