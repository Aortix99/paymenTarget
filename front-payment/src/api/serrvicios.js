
const getBaseUrl = () => import.meta.env.VITE_API_URL

const URL_BACKEND = `${getBaseUrl()}`

import { request } from './index.js'

export async function getProducts() {
  return await request(`${URL_BACKEND}` + 'products')
}

export async function postPayment(paymentData) {
  return await request(`${URL_BACKEND}` + `transactions`, {
    method: 'POST',
    body: JSON.stringify(paymentData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export async function validateCard(cardData) {
  return await request(`${URL_BACKEND}` + `transactions/validate-card`, {
    method: 'POST',
    body: JSON.stringify(cardData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export default { getProducts, postPayment, validateCard }