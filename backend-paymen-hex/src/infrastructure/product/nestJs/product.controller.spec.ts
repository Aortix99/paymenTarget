import { ProductController } from "./product.controller";
import { ProductGetAll } from "src/application/product/productGetAll";
import { Product } from "src/domain/product";

describe('ProductController', () => {
    let getAllProducts: jest.Mocked<ProductGetAll>;
    let controller: ProductController;

    beforeEach(() => {
        getAllProducts = {
            run: jest.fn(),
        } as unknown as jest.Mocked<ProductGetAll>;

        controller = new ProductController(getAllProducts);
    });

    it('should return all products mapped to DTO', async () => {
        const createdAt = new Date('2025-01-01T12:00:00.000Z');
        const products: Product[] = [{
            id: 1,
            name: 'Product 1',
            description: 'Desc 1',
            img: 'img1.jpg',
            price: 100,
            stock: 10,
            createdAt,
        }];
        getAllProducts.run.mockResolvedValueOnce(products);

        const result = await controller.getAll();

        expect(getAllProducts.run).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            id: 1,
            name: 'Product 1',
            description: 'Desc 1',
            img: 'img1.jpg',
            price: 100,
            stock: 10,
            createdAt: createdAt.toISOString(),
        });
    });
});