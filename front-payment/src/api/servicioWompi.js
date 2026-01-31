const getBaseUrlWompi = () => import.meta.env.VITE_URL_WOMPI
const publicKey = () => import.meta.env.VITE_PUBLIC_KEY

const URL_BACKEND = `${getBaseUrlWompi()}`

import { request } from './index.js'

export async function tokenCard(paymentData) {
    const response = await request(`${URL_BACKEND}` + 'tokens/cards', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${publicKey()}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
    })
    const {data: {id}} = response;
    return { id }
}
export async function tokensAutAcep() {
    const response = await request(`${URL_BACKEND}` + `merchants/${publicKey()}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${publicKey()}`,
            'Content-Type': 'application/json',
        },
    })
    const {
        data: {
            presigned_acceptance,
            presigned_personal_data_auth,
        }
    } = response;
    return {
        presigned_acceptance,
        presigned_personal_data_auth,
    }
}

export async function cardAvailable() {
    const response = await request(`${URL_BACKEND}` + `payment_sources`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${publicKey()}`,
            'Content-Type': 'application/json',
        },
    })
    const {
        data: {
            presigned_acceptance,
            presigned_personal_data_auth,
        }
    } = response;
    return {
        presigned_acceptance,
        presigned_personal_data_auth,
    }
}

export default { tokenCard, tokensAutAcep, cardAvailable }