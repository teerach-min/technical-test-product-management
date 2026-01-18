import { IProductRepository } from '../repositories/IProduct.repository';
import { Product } from 'entities/Product';
import { SellProductUseCaseDTO } from '../dtos/use-cases/sellProduct.useCase.dto';
import { ValidationError } from '@shared/errors/ValidationError';

export class SellProductUseCase {
  constructor(
    private productRepository: IProductRepository
  ) {}

  async execute(data: SellProductUseCaseDTO): Promise<Product> {
    const product = await this.validate(data);

    const newStock = product.stock - data.quantity;
    const updatedProduct = await this.productRepository.updateStock(data.productId, newStock);

    return updatedProduct;
  }

  private async validate(data: SellProductUseCaseDTO): Promise<Product> {
    const errors: string[] = [];

    if (data.quantity === undefined || data.quantity === null) {
      errors.push('จำนวนที่ต้องการขายต้องระบุ');
    } else if (data.quantity <= 0) {
      errors.push('จำนวนที่ต้องการขายต้องมากกว่า 0');
    }

    if (!data.productId || data.productId.trim().length === 0) {
      errors.push('รหัสสินค้าต้องระบุ');
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    const product = await this.productRepository.findById(data.productId);

    if (!product) {
      throw new ValidationError(['ไม่พบสินค้าในระบบ']);
    }

    if (product.stock < data.quantity) {
      throw new ValidationError([`สินค้าคงคลังไม่เพียงพอ (คงเหลือ: ${product.stock})`]);
    }

    return product;
  }
}
