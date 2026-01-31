import { Body, Controller, Inject, Post } from "@nestjs/common";
import { CREATE_TRANSACTION } from "./tokens";
import { TransactionsSave } from "src/application/transactions/transactionSave";

@Controller('transactions')
export class TransactionsController {
    constructor(@Inject(CREATE_TRANSACTION) private readonly createTransaction: TransactionsSave) {}

    @Post()
    async createTransactionService(@Body() body: CreateTransactionBody) {
        const transactionId = await this.createTransaction.run(
            body.reference,
            body.amount,
            body.status,
            body.wompiTransactionId,
            body.productId,
            body.customerId,
            {
                country: body.delivery.country,
                city: body.delivery.city,
                address: body.delivery.address,
            }
        );
        return { transactionId };
    }

    @Post('/validate-card')
    async validateCardService(@Body() body: any) {
        const response = await this.createTransaction.validateCard(body);
        return response;
    }
}

interface CreateTransactionBody {
    reference: string;
    amount: number;
    status: string;
    wompiTransactionId: string;
    productId: number;
    customerId: number;
    delivery: {
        country: string;
        city: string;
        address: string;
    };
}   
