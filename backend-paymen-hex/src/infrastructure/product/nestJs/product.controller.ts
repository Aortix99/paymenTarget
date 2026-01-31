import { Controller, Get, Inject } from "@nestjs/common";
import { ProductGetAll } from "src/application/product/productGetAll";
import { GET_ALL_PRODUCTS } from "./tokens";
import { ProductDto } from "./product.dto";
import { Product } from "src/domain/product";

@Controller('products')
export class ProductController {
    constructor(
        @Inject(GET_ALL_PRODUCTS) private readonly getAllProducts: ProductGetAll,
    ) {}

    @Get()
    async getAll(): Promise<ProductDto[]> {
        const products = await this.getAllProducts.run();
        return products.map(mapToDto);
    }
}

function mapToDto(p: Product): ProductDto {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    img: p.img,
    price: p.price,
    stock: p.stock,
    createdAt: p.createdAt.toISOString(),
  };
}