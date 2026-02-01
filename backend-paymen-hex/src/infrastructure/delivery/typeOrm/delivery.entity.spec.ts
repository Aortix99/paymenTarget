import { DeliveryEntity } from './delivery.entity';

function createInMemoryDeliveryRepo() {
    let seq = 1;
    const store = new Map<number, DeliveryEntity>();

    return {
        async save(partial: Partial<DeliveryEntity>): Promise<DeliveryEntity> {
            const entity = new DeliveryEntity();
            entity.id = seq++;
            entity.address = partial.address ?? '';
            entity.city = partial.city ?? '';
            entity.country = partial.country ?? '';
            store.set(entity.id, entity);
            return entity;
        },
        async findOne(opts: { where: { id: number } }): Promise<DeliveryEntity | null> {
            return store.get(opts.where.id) ?? null;
        },
        clear() {
            store.clear();
            seq = 1;
        },
    };
}

describe('DeliveryEntity (unit)', () => {
    const repo = createInMemoryDeliveryRepo();

    afterEach(() => {
        repo.clear();
    });

    it('should emulate persisting a delivery correctly', async () => {
        const created = await repo.save({
            address: '123 Test St',
            city: 'Bogotá',
            country: 'CO',
        });

        const found = await repo.findOne({ where: { id: created.id } });

        expect(found).toBeDefined();
        expect(found!.address).toBe('123 Test St');
        expect(found!.city).toBe('Bogotá');
        expect(found!.country).toBe('CO');
    });
});
