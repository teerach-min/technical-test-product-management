import { PrismaClient } from '@prisma/client';

interface CategorySeedData {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
}

const categoriesData: CategorySeedData[] = [
  {
    name: 'อาหาร',
    slug: 'food',
    description: 'อาหารและของกิน',
    isActive: true,
  },
  {
    name: 'เครื่องดื่ม',
    slug: 'beverages',
    description: 'เครื่องดื่มต่างๆ',
    isActive: true,
  },
  {
    name: 'ของใช้',
    slug: 'household-items',
    description: 'ของใช้ในบ้าน',
    isActive: true,
  },
  {
    name: 'เสื้อผ้า',
    slug: 'clothing',
    description: 'เสื้อผ้าและแฟชั่น',
    isActive: true,
  },
];

export async function seedCategories(prisma: PrismaClient) {
  console.log('📁 Seeding categories...');

  const seededCategories: Record<string, { id: string }> = {};

  for (const categoryData of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData,
    });

    // Store category by slug for easy access
    seededCategories[categoryData.slug] = { id: category.id };
  }

  console.log('✅ Categories seeded successfully');
  
  return {
    food: seededCategories.food,
    beverages: seededCategories.beverages,
    householdItems: seededCategories['household-items'],
    clothing: seededCategories.clothing,
  };
}
