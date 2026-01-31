import { TransactionRepository, RequestTransaction, Payload, ResponseTransactionsCard } from "src/domain/transactions.repository";
import { DeliveryRepository, DeliveryInterface } from "src/domain/delivery.repository";
import * as crypto from 'node:crypto';
import { ProductRepository } from "src/domain/product.repository";

export interface DeliveryData {
    country: string;
    city: string;
    address: string;
}
const STOCK_DECREMENT = 1;
export class TransactionsSave {
    constructor(
        private readonly repository: TransactionRepository,
        private readonly deliveryRepository: DeliveryRepository,
        private readonly productRepository: ProductRepository,
        // private readonly baseUrl = 'https://api-sandbox.co.uat.wompi.dev/v1'
    ) { }
    private readonly stockDecrement: number = STOCK_DECREMENT;

    async run(
        reference: string,
        amount: number,
        status: string,
        wompiTransactionId: string,
        productId: number,
        customerId: number,
        delivery: DeliveryData
    ): Promise<number> {
        const deliveryPayload: DeliveryInterface = {
            country: delivery.country,
            city: delivery.city,
            address: delivery.address,
        };
        const deliveryId = await this.deliveryRepository.saveDelivery(deliveryPayload);

        const payload: RequestTransaction = {
            reference,
            amount,
            status,
            wompiTransactionId,
            productId,
            customerId,
            deliveryId,
        };
        return this.repository.saveTransaction(payload);
    }

    async validateCard(payloadOfCard: Payload): Promise<ResponseTransactionsCard> {
        const product = await this.productRepository.findOne(payloadOfCard.idPrroduct);
        if (!product) throw new Error('Producto agotado');

        const card = await this.repository.validateCard(payloadOfCard);
        const tx = await this.repository.transactions({
            amount: payloadOfCard.amount,
            idTransaction: payloadOfCard.idTransaction,
            customer_email: card.customer_email,
            payment_source_id: card.id,
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        const validPay = await this.repository.validatePayment(tx.id);
        if (validPay.data.status == 'APPROVED') {
            console.log('averd', validPay);
            await this.repository.updateTransaction(payloadOfCard.idTransaction, validPay.data.status, tx.id);
            console.log('aqui anda pros', product);
            await this.productRepository.decrementStock(
                product.id,
                this.stockDecrement,
            );
        }
        return validPay.data;
    }



    generateSignature(reference: string, amount: number, currency = 'COP') {
        const payload = `${reference}${amount}${currency}${process.env.INTEGIT_KEY}`;
        return crypto.createHash('sha256').update(payload).digest('hex');
    }
}