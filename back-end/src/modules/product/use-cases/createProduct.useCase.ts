import { IProductRepository } from '../repositories/IProduct.repository';
import { Product } from 'entities/Product';
import { Category } from 'entities/Category';
import { CreateProductUseCaseDTO } from '../dtos/use-cases/createProduct.useCase.dto';
import { randomUUID } from 'crypto';
import { ValidationError } from '@shared/errors/ValidationError';
import { ICategoryRepository } from '@modules/category/repositories/ICategory.repository';

export class CreateProductUseCase {
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository
  ) {}

  async execute(data: CreateProductUseCaseDTO): Promise<{ product: Product; categoryName: string }> {
    // Validate business rules
    const category = await this.validate(data);

    const dateNow = new Date();

    const product = new Product({
      id: randomUUID(),
      name: data.name,
      sku: data.sku,
      description: data.description ?? '',
      price: data.price,
      stock: data.stock,
      category: category,
      isActive: true,
      createdAt: dateNow,
      updatedAt: dateNow
    });

    const createdProduct = await this.productRepository.create(product);

    return {
      product: createdProduct,
      categoryName: createdProduct.category?.name || category.name
    };
  }

  private async validate(data: CreateProductUseCaseDTO): Promise<Category> {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('ชื่อสินค้าต้องไม่ว่าง');
    }

    if (!data.sku || data.sku.trim().length === 0) {
      errors.push('รหัสสินค้าต้องไม่ว่าง');
    } else if (data.sku.trim().length < 3) {
      errors.push('รหัสสินค้าต้องมีอย่างน้อย 3 ตัวอักษร');
    } else {
      const existingProduct = await this.productRepository.findBySku(data.sku.trim());
      if (existingProduct) {
        errors.push('รหัสสินค้านี้ถูกใช้งานแล้ว');
      }
    }

    if (data.price === undefined || data.price === null) {
      errors.push('ราคาต้องระบุ');
    } else if (data.price <= 0) {
      errors.push('ราคาต้องมากกว่า 0');
    }

    if (data.stock === undefined || data.stock === null) {
      errors.push('จำนวนสินค้าคงคลังต้องระบุ');
    } else if (data.stock < 0) {
      errors.push('จำนวนสินค้าคงคลังต้องไม่ติดลบ');
    }

    let category = null;
    if (!data.categoryName || data.categoryName.trim().length === 0) {
      errors.push('หมวดหมู่ต้องระบุ');
    } else {
      category = await this.categoryRepository.findByName(data.categoryName.trim());
      if (!category) {
        errors.push('หมวดหมู่ไม่พบในระบบ');
      } else if (!category.isActive) {
        errors.push('หมวดหมู่นี้ไม่สามารถใช้งานได้');
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    if (!category) {
      throw new ValidationError(['หมวดหมู่ไม่พบในระบบ']);
    }

    return category;
  }
}
