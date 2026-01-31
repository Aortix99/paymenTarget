// import { TransactionRepository } from "src/domain/transactions.repository";
// import { ProductRepository } from "src/domain/product.repository";
// import { TransactionStatus } from "src/infrastructure/transactions/typeOrm/transactions.entity";

// export interface WompiWebhookPayload {
//   event: string;
//   data: {
//     id: string;
//     reference: string;
//     status: string;
//     amount_in_cents: number;
//     [key: string]: unknown;
//   };
//   sent_at?: string;
// }

// // puedo mandarlo o siempre que se reste uno da casi la misma yuda
// const STOCK_DECREMENT = -1;

// export class HandleWompiWebhook {
//   constructor(
//     private readonly transactionRepository: TransactionRepository,
//     private readonly productRepository: ProductRepository,
//     private readonly stockDecrement: number = STOCK_DECREMENT,
//   ) {}

//   async run(payload: WompiWebhookPayload): Promise<void> {
//     if (payload.event !== "transaction.updated" || payload.data?.status !== "APPROVED") {
//       return;
//     }

//     const reference = payload.data.reference;
//     if (!reference || typeof reference !== "string") return;

//     const match = /^pay-(\d+)$/.exec(reference);
//     if (!match) return;
//     console.log('espero que funcione correctamente, esperamos un numerop para validar la transaction', match);
//     const transactionId = Number.parseInt(match[1], 10);
//     // const transaction = await this.transactionRepository.findById(transactionId);
//     if (!transaction) return;

//     await this.transactionRepository.updateTransaction(
//       transactionId,
//       TransactionStatus.APPROVED,
//       payload.data.id,
//     );

//     await this.productRepository.decrementStock(
//       transaction.productId,
//       this.stockDecrement,
//     );
//   }
// }
