import { Product } from 'entities/Product';

export interface IProductRepository {
  findAll(categoryName?: string): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(product: Product): Promise<Product>;
  findBySku(sku: string): Promise<Product | null>;
  updateStock(id: string, newStock: number): Promise<Product>;
  updatePrice(id: string, newPrice: number): Promise<Product>;
  searchByKeyword(keyword: string): Promise<Product[]>;
}
