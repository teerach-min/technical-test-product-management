import { IProductRepository } from '../repositories/IProduct.repository';
import { BulkPriceUpdateUseCaseDTO } from '../dtos/use-cases/bulkPriceUpdate.useCase.dto';
import { ValidationError } from '@shared/errors/ValidationError';

export class BulkPriceUpdateUseCase {
  constructor(
    private productRepository: IProductRepository
  ) {}

  async execute(data: BulkPriceUpdateUseCaseDTO): Promise<{ successCount: number; totalCount: number }> {
    if (!data.products || !Array.isArray(data.products) || data.products.length === 0) {
      throw new ValidationError(['กรุณาระบุรายการสินค้าที่ต้องการอัพเดทราคา']);
    }

    const errors: string[] = [];
    let successCount = 0;
    const totalCount = data.products.length;

    for (const productUpdate of data.products) {
      try {
        await this.validate(productUpdate);
        await this.productRepository.updatePrice(productUpdate.productId, productUpdate.newPrice);
        successCount++;
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(...error.errors);
        } else {
          errors.push(`เกิดข้อผิดพลาดในการอัพเดทราคา (productId: ${productUpdate.productId})`);
        }
      }
    }

    if (successCount === 0 && errors.length > 0) {
      throw new ValidationError(errors);
    }

    return {
      successCount,
      totalCount
    };
  }

  private async validate(productUpdate: { productId: string; newPrice: number }): Promise<void> {
    const errors: string[] = [];

    if (!productUpdate.productId || productUpdate.productId.trim().length === 0) {
      errors.push('รหัสสินค้าต้องระบุ');
    }

    if (productUpdate.newPrice === undefined || productUpdate.newPrice === null) {
      errors.push('ราคาใหม่ต้องระบุ');
    } else if (productUpdate.newPrice <= 0) {
      errors.push(`ราคาใหม่ต้องมากกว่า 0 (productId: ${productUpdate.productId})`);
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    const product = await this.productRepository.findById(productUpdate.productId);
    if (!product) {
      throw new ValidationError([`ไม่พบสินค้าในระบบ (productId: ${productUpdate.productId})`]);
    }
  }
}
