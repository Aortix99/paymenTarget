import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ProductsRepository } from '../typeOrm/products.repository';
import { ProductGetAll } from "src/application/product/productGetAll";
import { ProductController } from "./product.controller";
import { PRODUCTS_REPOSITORY, GET_ALL_PRODUCTS } from "./tokens";
import { ProductsEntity } from "../typeOrm/products.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ProductsEntity])],
    controllers: [ProductController],
    providers: [{
        provide: PRODUCTS_REPOSITORY,
        useClass: ProductsRepository,
    },
     {
         provide: GET_ALL_PRODUCTS,
        //  provide: ProductsRepository,
         useFactory: (productsRepository: ProductsRepository) => new ProductGetAll(productsRepository),
         inject: [PRODUCTS_REPOSITORY],
        //  inject: [ProductsRepository],
     }

  ],
  exports: [PRODUCTS_REPOSITORY],
})
export class ProductModule {}