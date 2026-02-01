import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './infrastructure/product/nestJs/product.module';
import { ProductsEntity } from './infrastructure/product/typeOrm/products.entity';
import { TransactionsModule } from './infrastructure/transactions/nestJs/transactions.module';
import { TransactionsEntity } from './infrastructure/transactions/typeOrm/transactions.entity';
import { DeliveryEntity } from './infrastructure/delivery/typeOrm/delivery.entity';
import { CustomerEntity } from './infrastructure/customer/typeOrm/customer.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [ProductsEntity, TransactionsEntity, DeliveryEntity, CustomerEntity],
      synchronize: true,
    }),
    ProductModule,
    TransactionsModule,
  ],
})
export class AppModule {}