
import { Category } from './Category';

export class Product {
  id: string;  
  name: string;
  sku: string;
  description: string | null;
  price: number;
  stock: number;
  category?: Category;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date

  constructor(data: Product) {
    this.id = data.id;
    this.name = data.name;
    this.sku = data.sku;
    this.description = data.description;
    this.price = data.price;
    this.stock = data.stock;
    this.category = data.category;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
