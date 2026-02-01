import { ProductsEntity } from './products.entity';

function createInMemoryProductsRepo() {
    let seq = 1;
    const store = new Map<number, ProductsEntity>();

    return {
        async save(partial: Partial<ProductsEntity>): Promise<ProductsEntity> {
            const entity = new ProductsEntity();
            entity.id = seq++;
            entity.name =  '123 Test St';
            entity.description = 'Bogotá';
            entity.img = 'CO';
            entity.price = 1;
            entity.stock = 0;
            entity.createdAt = new Date();
            store.set(entity.id, entity);
            return entity;
        },
        async findOne(opts: { where: { id: number } }): Promise<ProductsEntity | null> {
            return store.get(opts.where.id) ?? null;
        },
        clear() {
            store.clear();
            seq = 1;
        },
    };
}

describe('ProductsEntity (unit)', () => {
    const repo = createInMemoryProductsRepo();

    afterEach(() => {
        repo.clear();
    });

    it('should emulate persisting a product correctly', async () => {
        const created = await repo.save({
            name: '123 Test St',
            description: 'Bogotá',
            img: 'CO',
            price: 1,
            stock: 0,
            createdAt: new Date(),
        });

        const found = await repo.findOne({ where: { id: created.id } });

        expect(found).toBeDefined();
        expect(found!.name).toBe('123 Test St');
        expect(found!.description).toBe('Bogotá');
        expect(found!.img).toBe('CO');
        expect(found!.price).toBe(1);
        expect(found!.stock).toBe(0);
        expect(found!.createdAt).toBeInstanceOf(Date);
    });
});
