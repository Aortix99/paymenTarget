import { ProductRepository } from 'src/domain/product.repository';
import { DeliveryRepository } from 'src/domain/delivery.repository';
import { Payload, TransactionRepository } from 'src/domain/transactions.repository';
import { TransactionsSave } from './transactionSave';

describe('TransactionsSave', () => {
    let repository: jest.Mocked<TransactionRepository>;
    let deliveryRepository: jest.Mocked<DeliveryRepository>;
    let productRepository: jest.Mocked<ProductRepository>;
    let useCase: TransactionsSave;

    beforeEach(() => {
        repository = {
            saveTransaction: jest.fn(),
            updateTransaction: jest.fn(),
            validateCard: jest.fn(),
            transactions: jest.fn(),
            validatePayment: jest.fn()
        } as jest.Mocked<TransactionRepository>;
        deliveryRepository = {
            saveDelivery: jest.fn(),
        } as jest.Mocked<DeliveryRepository>;
        productRepository = {
            getAll: jest.fn(),
            decrementStock: jest.fn(),
            findOne: jest.fn(),
        } as jest.Mocked<ProductRepository>;

        useCase = new TransactionsSave(repository, deliveryRepository, productRepository);
    });

    it('should called transactions: ', async () => {
        const payload = {
            reference: 'stri8ng',
            amount: 1,
            status: 'stri8ng',
            wompiTransactionId: 'stri8ng',
            productId: 1,
            customerId: 1,
            deliveryId: 1,
        }
        productRepository.findOne.mockResolvedValueOnce({
            id: 1,
            name: 'Product 1',
            stock: 10,
        });
        await useCase.run('string', 1, 'string', 'string', 1, 1,
            { country: 'string', city: 'string', address: 'string' });
        const deliveryPayload: any = {
            country: 'string',
            city: 'string',
            address: 'string'
        }
        await deliveryRepository.saveDelivery(deliveryPayload);
        await repository.saveTransaction(payload);
        repository.validateCard.mockResolvedValueOnce({
            id: 1,
            public_data: {
                bin: 'string',
                last_four: 'string',
                card_holder: 'string',
                validity_ends_at: 'string',
                type: 'string'
            },
            token: 'string',
            type: 'string',
            status: 'string',
            customer_email: 'string',
        });
        repository.transactions.mockResolvedValueOnce({
            id: 'string',
            created_at: 'string',
            finalized_at: 'any',
            amount_in_cents: 1,
            reference: 'string',
            customer_email: 'string',
            currency: 'string',
            payment_method_type: 'string',
            payment_method: 'any',
            status: 'string',
            status_message: 'any',
            billing_data: 'any',
            shipping_address: 'any',
            redirect_url: 'any',
            payment_source_id: 1,
            payment_link_id: 'any',
            customer_data: 'any',
            bill_id: 'any',
            taxes: ['any[]'],
            tip_in_cents: 'any'
        });
        repository.validatePayment.mockResolvedValueOnce({
            data: { status: 'PENDING' }
        });

        await useCase.validateCard(deliveryPayload);
        useCase.generateSignature('string', 1, 'COP');
    });
    it('should called transactions: ', async () => {
        const payload = {
            reference: 'stri8ng',
            amount: 1,
            status: 'stri8ng',
            wompiTransactionId: 'stri8ng',
            productId: 1,
            customerId: 1,
            deliveryId: 1,
        }
        await useCase.run('string', 1, 'string', 'string', 1, 1,
            { country: 'string', city: 'string', address: 'string' });
        const deliveryPayload: any = {
            country: 'string',
            city: 'string',
            address: 'string'
        }
        await deliveryRepository.saveDelivery(deliveryPayload);
        await repository.saveTransaction(payload);
        repository.validateCard.mockResolvedValueOnce({
            id: 1,
            public_data: {
                bin: 'string',
                last_four: 'string',
                card_holder: 'string',
                validity_ends_at: 'string',
                type: 'string'
            },
            token: 'string',
            type: 'string',
            status: 'string',
            customer_email: 'string',
        });
        repository.transactions.mockResolvedValueOnce({
            id: 'string',
            created_at: 'string',
            finalized_at: 'any',
            amount_in_cents: 1,
            reference: 'string',
            customer_email: 'string',
            currency: 'string',
            payment_method_type: 'string',
            payment_method: 'any',
            status: 'string',
            status_message: 'any',
            billing_data: 'any',
            shipping_address: 'any',
            redirect_url: 'any',
            payment_source_id: 1,
            payment_link_id: 'any',
            customer_data: 'any',
            bill_id: 'any',
            taxes: ['any[]'],
            tip_in_cents: 'any'
        });
        repository.validatePayment.mockResolvedValueOnce({
            data: { status: 'PENDING' }
        });

        await expect(
            useCase.validateCard(deliveryPayload),
        ).rejects.toThrow('Producto agotado');
        useCase.generateSignature('string', 1);
    });
});