import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionsModule } from './transactions.module';
import {
    CREATE_TRANSACTION,
    DELIVERY_REPOSITORY,
    TRANSACTIONS_REPOSITORY,
} from './tokens';
import { TransactionsSave } from 'src/application/transactions/transactionSave';
import { TypeOrmTransactionsRepository } from '../typeOrm/transactions.repository';
import { DeliverysRepository } from 'src/infrastructure/delivery/typeOrm/deliverys.repository';
import { TransactionsEntity } from '../typeOrm/transactions.entity';
import { DeliveryEntity } from 'src/infrastructure/delivery/typeOrm/delivery.entity';
import { ProductsEntity } from 'src/infrastructure/product/typeOrm/products.entity';

describe('TransactionsModule', () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [TransactionsModule],
        })
            .overrideProvider(getRepositoryToken(TransactionsEntity))
            .useValue({})
            .overrideProvider(getRepositoryToken(DeliveryEntity))
            .useValue({})
            .overrideProvider(getRepositoryToken(ProductsEntity))
            .useValue({})
            .compile();
    });

    it('should compile module', () => {
        expect(module).toBeDefined();
    });

    it('should resolve CREATE_TRANSACTION with TransactionsSave', () => {
        const useCase = module.get<TransactionsSave>(CREATE_TRANSACTION);
        expect(useCase).toBeInstanceOf(TransactionsSave);
    });

    it('should resolve TRANSACTIONS_REPOSITORY with TypeOrmTransactionsRepository', () => {
        const repo = module.get<TypeOrmTransactionsRepository>(TRANSACTIONS_REPOSITORY);
        expect(repo).toBeInstanceOf(TypeOrmTransactionsRepository);
    });

    it('should resolve DELIVERY_REPOSITORY with DeliverysRepository', () => {
        const repo = module.get<DeliverysRepository>(DELIVERY_REPOSITORY);
        expect(repo).toBeInstanceOf(DeliverysRepository);
    });
});
