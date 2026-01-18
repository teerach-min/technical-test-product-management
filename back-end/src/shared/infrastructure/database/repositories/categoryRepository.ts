import { ICategoryRepository } from '@modules/category/repositories/ICategory.repository';
import { Category } from 'entities/Category';
import prisma from '@shared/infrastructure/database/prismaClient';

export class CategoryRepository implements ICategoryRepository {
  constructor(private db = prisma) {}

  async findById(id: string): Promise<Category | null> {
    const category = await this.db.category.findUnique({
      where: { id },
    });

    if (!category) return null;

    return new Category(
      category.id,
      category.name,
      category.slug,
      category.description,
      category.isActive,
      category.createdAt,
      category.updatedAt
    );
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.db.category.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return categories.map((c) =>
      new Category(
        c.id,
        c.name,
        c.slug,
        c.description,
        c.isActive,
        c.createdAt,
        c.updatedAt
      )
    );
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await this.db.category.findUnique({
      where: { name },
    });

    if (!category) return null;

    return new Category(
      category.id,
      category.name,
      category.slug,
      category.description,
      category.isActive,
      category.createdAt,
      category.updatedAt
    );
  }
}
