import { Test, TestingModule } from '@nestjs/testing';
import { ProductModule } from './product.module';
import { GET_ALL_PRODUCTS, PRODUCTS_REPOSITORY } from './tokens';
import { ProductGetAll } from 'src/application/product/productGetAll';
import { ProductsRepository } from '../typeOrm/products.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsEntity } from '../typeOrm/products.entity';

describe('ProductModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ProductModule],
    })
      .overrideProvider(getRepositoryToken(ProductsEntity))
      .useValue({
      })
      .compile();
  });

  it('should compile module', () => {
    expect(module).toBeDefined();
  });

  it('should resolve ProductGetAll with correct repository', () => {
    const useCase = module.get<ProductGetAll>(GET_ALL_PRODUCTS);
    const repo = module.get<ProductsRepository>(PRODUCTS_REPOSITORY);

    expect(useCase).toBeInstanceOf(ProductGetAll);
    expect(repo).toBeInstanceOf(ProductsRepository);
  });
});
