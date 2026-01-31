import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionsEntity } from "../typeOrm/transactions.entity";
import { DeliveryEntity } from "src/infrastructure/delivery/typeOrm/delivery.entity";
import { DeliverysRepository } from "src/infrastructure/delivery/typeOrm/deliverys.repository";
import { CREATE_TRANSACTION, DELIVERY_REPOSITORY, TRANSACTIONS_REPOSITORY, WEBHOOK_HANDLER } from "./tokens";
import { TransactionsController } from "./transactions.controller";
import { WebhookController } from "./webhook.controller";
import { TransactionsSave } from "src/application/transactions/transactionSave";
// import { HandleWompiWebhook } from "src/application/webhooks/handleWompiWebhook";
import { TypeOrmTransactionsRepository } from "../typeOrm/transactions.repository";
import { ProductModule } from "src/infrastructure/product/nestJs/product.module";
import { PRODUCTS_REPOSITORY } from "src/infrastructure/product/nestJs/tokens";
import { ProductRepository } from "src/domain/product.repository";

@Module({
  imports: [TypeOrmModule.forFeature([TransactionsEntity, DeliveryEntity]), ProductModule],
  controllers: [TransactionsController, WebhookController],
  providers: [
    {
      provide: TRANSACTIONS_REPOSITORY,
      useClass: TypeOrmTransactionsRepository,
    },
    {
      provide: DELIVERY_REPOSITORY,
      useClass: DeliverysRepository,
    },
    {
      provide: CREATE_TRANSACTION,
      useFactory: (
        transactionsRepository: TypeOrmTransactionsRepository,
        deliveryRepository: DeliverysRepository,
        productRepository: ProductRepository,
      ) => new TransactionsSave(transactionsRepository, deliveryRepository, productRepository),
      inject: [TRANSACTIONS_REPOSITORY, DELIVERY_REPOSITORY, PRODUCTS_REPOSITORY],
    },
    // {
    //   provide: WEBHOOK_HANDLER,
    //   useFactory: (
    //     transactionsRepository: TypeOrmTransactionsRepository,
    //     productRepository: import("src/domain/product.repository").ProductRepository,
    //   ) => new HandleWompiWebhook(transactionsRepository, productRepository),
    //   inject: [TRANSACTIONS_REPOSITORY, PRODUCTS_REPOSITORY],
    // },
  ],
})
export class TransactionsModule {}
