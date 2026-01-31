import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThanOrEqual, Repository } from "typeorm";
import { Product } from "src/domain/product";
import { ProductRepository } from "src/domain/product.repository";
import { ProductsEntity } from "./products.entity";

@Injectable()
export class ProductsRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductsEntity)
    private readonly ormRepo: Repository<ProductsEntity>,
  ) { }

  async getAll(): Promise<Product[]> {
    const rows = await this.ormRepo.find();
    return rows.map(
      (r) =>
        new Product(
          r.id,
          r.name,
          r.description,
          r.img,
          typeof r.price === "string" ? Number(r.price) : r.price,
          r.stock,
          r.createdAt,
        ),
    );
  }

  async decrementStock(productId: number, quantity: number): Promise<void> {
    await this.ormRepo.decrement({ id: productId }, 'stock', quantity);
  }
  async findOne(idProduct: number): Promise<any> {
    return this.ormRepo.findOne({
      where: {
        id: idProduct,
        stock: MoreThanOrEqual(1)
      }
    });
  }
}
