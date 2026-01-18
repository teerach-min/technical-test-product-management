import { IProductRepository } from '../repositories/IProduct.repository';
import { Product } from 'entities/Product';

export class SearchProductsUseCase {
  constructor(
    private productRepository: IProductRepository
  ) {}

  async execute(keyword: string): Promise<Product[]> {
    return await this.productRepository.searchByKeyword(keyword);
  }
}
