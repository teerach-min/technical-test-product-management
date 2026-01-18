import PrismaConnection from "./prismaConnection";
// Note: dotenv is already loaded in PrismaConnection.ts

// Export Prisma Client instance (Singleton)
const prisma = PrismaConnection.getInstance();

// Export for backward compatibility
export default prisma;

// Export PrismaConnection for advanced usage
export { default as PrismaConnection } from "./prismaConnection";
