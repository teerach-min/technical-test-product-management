import { PrismaClient } from '@prisma/client';
import { seedCategories } from './seed/categories.seed';
import { seedProducts } from './seed/product.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // await prisma.category.deleteMany();
  // await prisma.product.deleteMany();

  const categoryIds = await seedCategories(prisma);
  await seedProducts(prisma, categoryIds);

  console.log('✅ All seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
