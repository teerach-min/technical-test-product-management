import { IProductRepository } from '../repositories/IProduct.repository';
import { Product } from 'entities/Product';

export class GetAllProductsUseCase {
  constructor(
    private productRepository: IProductRepository
  ) {}

  async execute(categoryName?: string): Promise<Product[]> {
    return await this.productRepository.findAll(categoryName);
  }
}
