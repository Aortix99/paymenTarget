import { Product } from 'src/domain/product';
import { ProductRepository } from 'src/domain/product.repository';
import { ProductGetAll } from './productGetAll';

describe('ProductGetAll', () => {
  let repository: jest.Mocked<ProductRepository>;
  let useCase: ProductGetAll;

  beforeEach(() => {
    repository = {
      getAll: jest.fn(),
      decrementStock: jest.fn(),
      findOne: jest.fn(),
    } as jest.Mocked<ProductRepository>;

    useCase = new ProductGetAll(repository);
  });

  it('should return all products', async () => {
    // Arrange
    const products: Product[] = [
      { id: 1, name: 'Product 1', price: 100, stock: 10, description: 'Description 1', img: 'img1.jpg', createdAt: new Date() },
      { id: 2, name: 'Product 2', price: 200, stock: 5, description: 'Description 2', img: 'img2.jpg', createdAt: new Date() },
    ];

    repository.getAll.mockResolvedValue(products);
    const result = await useCase.run();
    expect(repository.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(products);
  });
});