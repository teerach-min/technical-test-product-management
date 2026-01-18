// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
const envPath = path.resolve(process.cwd(), '.env');
const envResult = dotenv.config({ path: envPath });

if (envResult.error) {
  console.warn('⚠️  Warning: .env file not found at:', envPath);
  console.warn('   Please create .env file with DATABASE_URL');
}

import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import productRoutes from 'routes/productRoutes';
import { errorHandler } from '@shared/presentation/middleware/errorHandler';
import { PrismaConnection } from '@shared/infrastructure/database/prismaClient';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
PrismaConnection.connect().catch((error) => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});

// Routes
app.get('/health', async (req, res) => {
  const dbHealth = await PrismaConnection.healthCheck();
  res.json({ 
    status: 'ok', 
    message: 'Store API is running',
    database: dbHealth ? 'connected' : 'disconnected'
  });
});

app.use('/api/products', productRoutes);

// Error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await PrismaConnection.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await PrismaConnection.disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Store API ready`);
  console.log(`Database: PostgreSQL (port 54329)`);
});

export default app;
