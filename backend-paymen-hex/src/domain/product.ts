export class Product {
  id: number;
  name: string;
  description: string;
  img: string;
  price: number;
  stock: number;
  createdAt: Date;

  constructor(
    id: number,
    name: string,
    description: string,
    img: string,
    price: number,
    stock: number,
    createdAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.img = img;
    this.price = price;
    this.stock = stock;
    this.createdAt = createdAt;
  }
}
