export class Transactions {
    id: number;
    reference: string;
    amount: number;
    status: string;
    wompiTransactionId: string;
    productId: number;
    customerId: number;
    deliveryId: number;
    createdAt: Date;
    constructor(
        id: number,
        reference: string,
        amount: number,
        status: string,
        wompiTransactionId: string,
        productId: number,
        customerId: number,
        deliveryId: number,
        createdAt: Date
    ) {
        this.id = id;
        this.reference = reference;
        this.amount = amount;
        this.status = status;
        this.wompiTransactionId = wompiTransactionId;
        this.productId = productId;
        this.customerId = customerId;
        this.deliveryId = deliveryId;
        this.createdAt = createdAt;
    }
}
