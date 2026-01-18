import { PrismaClient } from '@prisma/client';

/**
 * Prisma Connection Singleton
 * Manages database connection with proper lifecycle handling
 */
class PrismaConnection {
  private static instance: PrismaClient | null = null;

  /**
   * Get Prisma Client instance (Singleton pattern)
   */
  static getInstance(): PrismaClient {
    if (!PrismaConnection.instance) {
      PrismaConnection.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' 
          ? ['query', 'error', 'warn'] 
          : ['error'],
        errorFormat: 'pretty',
      });

      // Handle graceful shutdown
      process.on('beforeExit', async () => {
        await PrismaConnection.disconnect();
      });

      process.on('SIGINT', async () => {
        await PrismaConnection.disconnect();
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        await PrismaConnection.disconnect();
        process.exit(0);
      });
    }

    return PrismaConnection.instance;
  }

  /**
   * Disconnect from database
   */
  static async disconnect(): Promise<void> {
    if (PrismaConnection.instance) {
      await PrismaConnection.instance.$disconnect();
      PrismaConnection.instance = null;
    }
  }

  /**
   * Check database connection health
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const client = PrismaConnection.getInstance();
      await client.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  /**
   * Connect to database
   */
  static async connect(): Promise<void> {
    const client = PrismaConnection.getInstance();
    try {
      await client.$connect();
      console.log('✅ Connected to PostgreSQL database');
    } catch (error) {
      console.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }
}

export default PrismaConnection;
