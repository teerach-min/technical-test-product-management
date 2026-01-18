import { IProductRepository } from '@modules/product/repositories/IProduct.repository';
import { Product } from 'entities/Product';
import { Category } from 'entities/Category';
import prisma from '@shared/infrastructure/database/prismaClient';

export class ProductRepository implements IProductRepository {
  constructor(private db = prisma) {}

  async findById(id: string): Promise<Product | null> {
    const product = await this.db.product.findUnique({
      where: { id },
      include: {
        category: true
      }
    });

    if (!product) return null;

    return new Product({
      id: product.id,
      name: product.name,
      sku: product.sku,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      category: product.category ? new Category(
        product.category.id,
        product.category.name,
        product.category.slug,
        product.category.description,
        product.category.isActive,
        product.category.createdAt,
        product.category.updatedAt
      ) : undefined,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    });
  }

  async findAll(categoryName?: string): Promise<Product[]> {
    const whereClause: any = { isActive: true };
    
    if (categoryName) {
      whereClause.category = {
        name: categoryName,
        isActive: true
      };
    }

    const products = await this.db.product.findMany({
      where: whereClause,
      include: {
        category: true
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((p: any) =>
      new Product({
        id: p.id,
        name: p.name,
        sku: p.sku,
        description: p.description,
        price: Number(p.price),
        stock: p.stock,
        category: p.category ? new Category(
          p.category.id,
          p.category.name,
          p.category.slug,
          p.category.description,
          p.category.isActive,
          p.category.createdAt,
          p.category.updatedAt
        ) : undefined,
        isActive: p.isActive,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      })
    );
  }

  async create(product: Product): Promise<Product> {
    if (!product.category) {
      throw new Error('Category is required to create a product');
    }

    const created = await this.db.product.create({
      data: {
        name: product.name,
        sku: product.sku,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.category.id,
        isActive: product.isActive,
      },
      include: {
        category: true
      }
    });

    return new Product({
      id: created.id,
      name: created.name,
      sku: created.sku,
      description: created.description,
      price: Number(created.price),
      stock: created.stock,
      category: created.category ? new Category(
        created.category.id,
        created.category.name,
        created.category.slug,
        created.category.description,
        created.category.isActive,
        created.category.createdAt,
        created.category.updatedAt
      ) : undefined,
      isActive: created.isActive,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt
    });
  }

  async findBySku(sku: string): Promise<Product | null> {
    const product = await this.db.product.findFirst({
      where: { sku },
      include: {
        category: true
      }
    });

    if (!product) return null;

    return new Product({
      id: product.id,
      name: product.name,
      sku: product.sku,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      category: product.category ? new Category(
        product.category.id,
        product.category.name,
        product.category.slug,
        product.category.description,
        product.category.isActive,
        product.category.createdAt,
        product.category.updatedAt
      ) : undefined,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    });
  }

  async updateStock(id: string, newStock: number): Promise<Product> {
    const updated = await this.db.product.update({
      where: { id },
      data: {
        stock: newStock
      },
      include: {
        category: true
      }
    });

    return new Product({
      id: updated.id,
      name: updated.name,
      sku: updated.sku,
      description: updated.description,
      price: Number(updated.price),
      stock: updated.stock,
      category: updated.category ? new Category(
        updated.category.id,
        updated.category.name,
        updated.category.slug,
        updated.category.description,
        updated.category.isActive,
        updated.category.createdAt,
        updated.category.updatedAt
      ) : undefined,
      isActive: updated.isActive,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt
    });
  }

  async updatePrice(id: string, newPrice: number): Promise<Product> {
    const updated = await this.db.product.update({
      where: { id },
      data: {
        price: newPrice
      },
      include: {
        category: true
      }
    });

    return new Product({
      id: updated.id,
      name: updated.name,
      sku: updated.sku,
      description: updated.description,
      price: Number(updated.price),
      stock: updated.stock,
      category: updated.category ? new Category(
        updated.category.id,
        updated.category.name,
        updated.category.slug,
        updated.category.description,
        updated.category.isActive,
        updated.category.createdAt,
        updated.category.updatedAt
      ) : undefined,
      isActive: updated.isActive,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt
    });
  }

  async searchByKeyword(keyword: string): Promise<Product[]> {
    const products = await this.db.product.findMany({
      where: {
        isActive: true,
        OR: [
          {
            name: {
              contains: keyword,
              mode: 'insensitive'
            }
          },
          {
            sku: {
              contains: keyword,
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        category: true
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((p: any) =>
      new Product({
        id: p.id,
        name: p.name,
        sku: p.sku,
        description: p.description,
        price: Number(p.price),
        stock: p.stock,
        category: p.category ? new Category(
          p.category.id,
          p.category.name,
          p.category.slug,
          p.category.description,
          p.category.isActive,
          p.category.createdAt,
          p.category.updatedAt
        ) : undefined,
        isActive: p.isActive,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      })
    );
  }
}
