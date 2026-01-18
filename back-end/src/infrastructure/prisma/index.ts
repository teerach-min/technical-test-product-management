// Export Prisma connection utilities
export { default as PrismaConnection } from './PrismaConnection';

// Export Prisma Client instance
import PrismaConnection from './PrismaConnection';
export const prisma = PrismaConnection.getInstance();
