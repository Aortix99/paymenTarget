import { TransactionsEntity, TransactionStatus } from './transactions.entity';

function createInMemoryTransactionsRepo() {
    let seq = 1;
    const store = new Map<number, TransactionsEntity>();

    return {
        async save(partial: Partial<TransactionsEntity>): Promise<TransactionsEntity> {
            const entity = new TransactionsEntity();
            entity.id = seq++;
            entity.reference = partial.reference ?? '';
            entity.amount = partial.amount ?? 0;
            entity.status = partial.status ?? TransactionStatus.PENDING;
            entity.wompiTransactionId = partial.wompiTransactionId ?? '';
            entity.productId = partial.productId ?? 0;
            entity.customerId = partial.customerId ?? 0;
            entity.deliveryId = partial.deliveryId ?? 0;
            entity.createdAt = partial.createdAt ?? new Date();
            store.set(entity.id, entity);
            return entity;
        },
        async findOne(opts: { where: { id: number }; select?: string[] }): Promise<TransactionsEntity | null> {
            const entity = store.get(opts.where.id);
            if (!entity) return null;
            if (opts.select?.includes('productId')) {
                return { ...entity, productId: entity.productId } as TransactionsEntity;
            }
            return entity;
        },
        clear() {
            store.clear();
            seq = 1;
        },
    };
}

describe('TransactionsEntity (unit)', () => {
    const repo = createInMemoryTransactionsRepo();

    afterEach(() => {
        repo.clear();
    });

    it('should emulate persisting a transaction correctly', async () => {
        const created = await repo.save({
            reference: 'ref-1',
            amount: 10000,
            status: TransactionStatus.PENDING,
            wompiTransactionId: 'wompi-1',
            productId: 1,
            customerId: 1,
            deliveryId: 1,
            createdAt: new Date(),
        });

        const found = await repo.findOne({ where: { id: created.id } });

        expect(found).toBeDefined();
        expect(found!.reference).toBe('ref-1');
        expect(found!.amount).toBe(10000);
        expect(found!.status).toBe(TransactionStatus.PENDING);
        expect(found!.productId).toBe(1);
        expect(found!.deliveryId).toBe(1);
    });
});
