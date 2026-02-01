import { ProductsRepository } from './products.repository';
import { Repository } from 'typeorm';
import { ProductsEntity } from './products.entity';
import { Product } from 'src/domain/product';

describe('ProductsRepository', () => {
    let ormRepo: jest.Mocked<Repository<ProductsEntity>>;
    let repository: ProductsRepository;

    beforeEach(() => {
        ormRepo = {
            find: jest.fn(),
            decrement: jest.fn(),
            findOne: jest.fn(),
        } as unknown as jest.Mocked<Repository<ProductsEntity>>;

        repository = new ProductsRepository(ormRepo);
    });

    it('should return all products mapped to domain', async () => {
        const createdAt = new Date();
        const rows: Partial<ProductsEntity>[] = [
            {
                id: 1,
                name: 'P1',
                description: 'D1',
                img: 'img1',
                price: 100,
                stock: 5,
                createdAt,
            },
        ];
        ormRepo.find.mockResolvedValueOnce(rows as ProductsEntity[]);

        const result = await repository.getAll();

        expect(ormRepo.find).toHaveBeenCalledTimes(1);
        expect(ormRepo.find).toHaveBeenCalledWith();
        expect(result).toHaveLength(1);
        expect(result[0]).toBeInstanceOf(Product);
        expect(result[0].id).toBe(1);
        expect(result[0].name).toBe('P1');
        expect(result[0].price).toBe(100);
        expect(result[0].stock).toBe(5);
    });

    it('should decrement stock by quantity', async () => {
        ormRepo.decrement = jest.fn().mockResolvedValueOnce(undefined);

        await repository.decrementStock(1, 2);

        expect(ormRepo.decrement).toHaveBeenCalledTimes(1);
        expect(ormRepo.decrement).toHaveBeenCalledWith({ id: 1 }, 'stock', 2);
    });

    it('should find one product by id with stock >= 1', async () => {
        const entity = { id: 1, name: 'P1', stock: 1 } as ProductsEntity;
        ormRepo.findOne.mockResolvedValueOnce(entity);

        const result = await repository.findOne(1);

        expect(ormRepo.findOne).toHaveBeenCalledTimes(1);
        expect(ormRepo.findOne).toHaveBeenCalledWith({
            where: { id: 1, stock: expect.anything() },
        });
        expect(result).toEqual(entity);
    });
});
