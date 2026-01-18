import { PrismaClient } from '@prisma/client';

interface CategoryIds {
  food: { id: string };
  beverages: { id: string };
  householdItems: { id: string };
  clothing: { id: string };
}

interface ProductSeedData {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
  categorySlug: 'food' | 'beverages' | 'household-items' | 'clothing';
  isActive: boolean;
}

const productsData: ProductSeedData[] = [
  // ตัวอย่าง products - สามารถลบหรือแก้ไขได้ตามต้องการ
];

export async function seedProducts(prisma: PrismaClient, categoryIds: CategoryIds) {
  console.log('📦 Seeding products...');

  // Map slug to categoryIds key
  const categorySlugMap: Record<string, keyof CategoryIds> = {
    'food': 'food',
    'beverages': 'beverages',
    'household-items': 'householdItems',
    'clothing': 'clothing',
  };

  for (const productData of productsData) {
    const categoryKey = categorySlugMap[productData.categorySlug];
    await prisma.product.upsert({
      where: { id: productData.id },
      update: {},
      create: {
        id: productData.id,
        name: productData.name,
        sku: productData.sku,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        categoryId: categoryIds[categoryKey].id,
        isActive: productData.isActive,
      },
    });
  }

  console.log('✅ Products seeded successfully');
}
