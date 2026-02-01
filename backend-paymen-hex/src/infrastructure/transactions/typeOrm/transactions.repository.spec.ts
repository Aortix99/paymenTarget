import { TypeOrmTransactionsRepository } from './transactions.repository';
import { Repository } from 'typeorm';
import { TransactionsEntity, TransactionStatus } from './transactions.entity';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TypeOrmTransactionsRepository', () => {
    let repo: jest.Mocked<Repository<TransactionsEntity>>;
    let repository: TypeOrmTransactionsRepository;

    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv, WOMPI_BASE_URL: 'https://api.test', WOMPI_PRIVATE_KEY: 'key', INTEGIT_KEY: 'int-key' };
        repo = {
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
        } as unknown as jest.Mocked<Repository<TransactionsEntity>>;

        repository = new TypeOrmTransactionsRepository(repo);
    });

    afterEach(() => {
        process.env = originalEnv;
        jest.clearAllMocks();
    });

    it('should create entity, save and return id', async () => {
        const entity = { id: 1, reference: 'ref-1' } as TransactionsEntity;
        const created = { ...entity };
        repo.create.mockReturnValue(created);
        repo.save.mockResolvedValueOnce(created);

        const result = await repository.saveTransaction({
            reference: 'ref-1',
            amount: 10000,
            status: 'PENDING',
            wompiTransactionId: 'wompi-1',
            productId: 1,
            customerId: 1,
            deliveryId: 1,
        });

        expect(repo.create).toHaveBeenCalledWith({
            reference: 'ref-1',
            amount: 10000,
            status: TransactionStatus.PENDING,
            wompiTransactionId: 'wompi-1',
            productId: 1,
            customerId: 1,
            deliveryId: 1,
        });
        expect(repo.save).toHaveBeenCalledWith(created);
        expect(result).toBe(1);
    });

    it('should map unknown status to PENDING', async () => {
        const entity = { id: 2 } as TransactionsEntity;
        repo.create.mockReturnValue(entity);
        repo.save.mockResolvedValueOnce(entity);

        await repository.saveTransaction({
            reference: 'ref-2',
            amount: 20000,
            status: 'UNKNOWN_STATUS',
            wompiTransactionId: 'wompi-2',
            productId: 2,
            customerId: 2,
            deliveryId: 2,
        });

        expect(repo.create).toHaveBeenCalledWith(
            expect.objectContaining({ status: TransactionStatus.PENDING }),
        );
    });

    it('should call repo.update with id, status and wompiTransactionId', async () => {
        repo.update.mockResolvedValueOnce(undefined as any);

        await repository.updateTransaction(1, 'APPROVED', 'pay-123');

        expect(repo.update).toHaveBeenCalledTimes(1);
        expect(repo.update).toHaveBeenCalledWith(1, {
            status: TransactionStatus.APPROVED,
            wompiTransactionId: 'pay-123',
        });
    });

    it('should return { productId } when row exists', async () => {
        const row = { productId: 5 } as TransactionsEntity;
        repo.findOne.mockResolvedValueOnce(row);

        const result = await repository.findById(1);

        expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, select: ['productId'] });
        expect(result).toEqual({ productId: 5 });
    });

    it('should return null when row not found', async () => {
        repo.findOne.mockResolvedValueOnce(null);

        const result = await repository.findById(999);

        expect(result).toBeNull();
    });

    it('should post to payment_sources and return response data', async () => {
        const cardData = { type: 'CARD', token: 'tok', customer_email: 'a@b.co', acceptance_token: 'acc', accept_personal_auth: 'Y' };
        const responseData = { id: 1, public_data: {}, token: 't', type: 'CARD', status: 'VALID', customer_email: 'a@b.co' };
        mockedAxios.post.mockResolvedValueOnce({ data: { data: responseData } });

        const result = await repository.validateCard({ validateCard: cardData, amount: 0, idTransaction: 0, idPrroduct: 0 });

        expect(mockedAxios.post).toHaveBeenCalledWith(
            'https://api.test/payment_sources',
            cardData,
            expect.objectContaining({ headers: { Authorization: 'Bearer key' } }),
        );
        expect(result).toEqual(responseData);
    });

    it('should get transaction by id and return response data', async () => {
        const axiosResponse = { data: { status: 'APPROVED' } };
        mockedAxios.get.mockResolvedValueOnce(axiosResponse);

        const result = await repository.validatePayment('tx-123');

        expect(mockedAxios.get).toHaveBeenCalledWith('https://api.test/transactions/tx-123', {});
        expect(result).toEqual(axiosResponse.data);
    });

    it('', async () => {
         mockedAxios.post.mockResolvedValueOnce({ data: { data: 'responseData' } });
        await repository.transactions({
            amount: 15000,
            idTransaction: 1,
            customer_email: 'acoc@gmail.com',
            payment_source_id: 1
        });
    }
    );
});
