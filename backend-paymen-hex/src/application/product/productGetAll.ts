import { Product } from 'src/domain/product';
import { ProductRepository } from 'src/domain/product.repository';

export class ProductGetAll {
  constructor(private readonly repository: ProductRepository) {}

  async run(): Promise<Product[]> {
    return this.repository.getAll();
  }
}