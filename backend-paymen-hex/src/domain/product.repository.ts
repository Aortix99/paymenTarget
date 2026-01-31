import { Product } from "./product";

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  decrementStock(productId: number, quantity: number): Promise<void>;
  findOne(product: number): Promise<any>;
}