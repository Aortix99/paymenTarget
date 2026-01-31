import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TransactionsEntity, TransactionStatus } from "./transactions.entity";
import axios from "axios";
import * as crypto from "node:crypto";

import { TransactionRepository, RequestTransaction, Payload, ResponseCard, ResponseTransactionsCard, CreateTransactionPayload } from "src/domain/transactions.repository";

@Injectable()
export class TypeOrmTransactionsRepository implements TransactionRepository {
    private readonly baseUrl = process.env.WOMPI_BASE_URL;
    private readonly privateKey = process.env.WOMPI_PRIVATE_KEY;
    private readonly headers = {
        headers: {
            Authorization: `Bearer ${this.privateKey}`,
        },
    };
    constructor(
        @InjectRepository(TransactionsEntity)
        private readonly repo: Repository<TransactionsEntity>
    ) { }

    async saveTransaction(tx: RequestTransaction): Promise<number> {
        const statusEnum = (Object.values(TransactionStatus) as string[]).includes(tx.status)
            ? (tx.status as TransactionStatus)
            : TransactionStatus.PENDING;

        const entity = this.repo.create({
            reference: tx.reference,
            amount: tx.amount,
            status: statusEnum,
            wompiTransactionId: tx.wompiTransactionId,
            productId: tx.productId,
            customerId: tx.customerId,
            deliveryId: tx.deliveryId,
        });

        const saved = await this.repo.save(entity);
        return saved.id;
    }

    async updateTransaction(id: number, status: string, idPay: string): Promise<void> {
        await this.repo.update(id, { status: status as TransactionStatus, wompiTransactionId: idPay });
    }

    async findById(id: number): Promise<{ productId: number } | null> {
        const row = await this.repo.findOne({ where: { id }, select: ["productId"] });
        return row ? { productId: row.productId } : null;
    }



    async validateCard(data: Payload): Promise<ResponseCard> {
        const response = await axios.post(
            `${this.baseUrl}/payment_sources`,
            data.validateCard,
            this.headers,
        );
        return response.data.data as ResponseCard;
    }

    async transactions(payload: CreateTransactionPayload): Promise<ResponseTransactionsCard> {
        const reference = `pay-${payload.idTransaction}`;
        const body = {
            amount_in_cents: payload.amount,
            currency: "COP",
            signature: this.generateSignature(reference, payload.amount, "COP"),
            customer_email: payload.customer_email,
            payment_method: { installments: 2 },
            reference,
            payment_source_id: payload.payment_source_id,
        };

        const response = await axios.post(
            `${this.baseUrl}/transactions`,
            body,
            this.headers
        );
        return response.data.data as ResponseTransactionsCard;
    }

    async validatePayment(idTransaction: string): Promise<any> {
        const response = await axios.get(
            `${this.baseUrl}/transactions/${idTransaction}`,
            {},
        );
        return response.data;
    }

    private generateSignature(reference: string, amount: number, currency: string) {
        const payload = `${reference}${amount}${currency}${process.env.INTEGIT_KEY}`;
        return crypto.createHash("sha256").update(payload).digest("hex");
    }

}
