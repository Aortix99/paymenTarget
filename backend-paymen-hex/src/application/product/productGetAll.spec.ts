import { Product } from 'src/domain/product';
import { ProductRepository } from 'src/domain/product.repository';
import { ProductGetAll } from './productGetAll';

class FakeRepo implements ProductRepository {
  constructor(private readonly data: Product[]) { }
  async getAll(): Promise<Product[]> {
    return this.data;
  }
  async decrementStock(id: number, quantity: number): Promise<void> {}
  async findOne(): Promise<Product[]> {
    return this.data;
  }
}

describe('ProductGetAll', () => {
  it('returns all products from repository', async () => {
    const now = new Date();
    const products = [
      new Product(1, 'A', 'Desc A', 'img', 10.5, 5, now),
      new Product(2, 'B', 'Desc B', 'img', 20, 0, now),
    ];
    const repo = new FakeRepo(products);
    const useCase = new ProductGetAll(repo);

    const result = await useCase.run();

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('A');
    expect(result[1].price).toBe(20);
  });
});
