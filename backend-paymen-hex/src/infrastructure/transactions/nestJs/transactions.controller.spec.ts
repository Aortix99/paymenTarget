import { TransactionsController } from './transactions.controller';
import { TransactionsSave } from 'src/application/transactions/transactionSave';

describe('TransactionsController', () => {
    let createTransaction: jest.Mocked<TransactionsSave>;
    let controller: TransactionsController;

    beforeEach(() => {
        createTransaction = {
            run: jest.fn(),
            validateCard: jest.fn(),
        } as unknown as jest.Mocked<TransactionsSave>;

        controller = new TransactionsController(createTransaction);
    });

    it('should call createTransaction.run and return transactionId', async () => {
        createTransaction.run.mockResolvedValueOnce(42);

        const body = {
            reference: 'ref-1',
            amount: 10000,
            status: 'PENDING',
            wompiTransactionId: 'wompi-1',
            productId: 1,
            customerId: 1,
            delivery: { country: 'CO', city: 'Bogotá', address: 'Calle 1' },
        };

        const result = await controller.createTransactionService(body);

        expect(createTransaction.run).toHaveBeenCalledTimes(1);
        expect(createTransaction.run).toHaveBeenCalledWith(
            'ref-1',
            10000,
            'PENDING',
            'wompi-1',
            1,
            1,
            { country: 'CO', city: 'Bogotá', address: 'Calle 1' },
        );
        expect(result).toEqual({ transactionId: 42 });
    });

    it('should call createTransaction.validateCard and return response', async () => {
        const cardResponse = { id: 'card-1', status: 'VALID' } as any;
        createTransaction.validateCard.mockResolvedValueOnce(cardResponse);

        const body = { validateCard: {}, idPrroduct: 1 };
        const result = await controller.validateCardService(body);

        expect(createTransaction.validateCard).toHaveBeenCalledTimes(1);
        expect(createTransaction.validateCard).toHaveBeenCalledWith(body);
        expect(result).toEqual(cardResponse);
    });
});
