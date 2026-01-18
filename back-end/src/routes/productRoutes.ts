import { Router } from 'express';
import { ProductController } from '../modules/product/controllers/product.controller';
import { GetAllProductsUseCase } from '../modules/product/use-cases/getAllProducts.useCase';
import { CreateProductUseCase } from '../modules/product/use-cases/createProduct.useCase';
import { SellProductUseCase } from '../modules/product/use-cases/sellProduct.useCase';
import { SearchProductsUseCase } from '../modules/product/use-cases/searchProducts.useCase';
import { BulkPriceUpdateUseCase } from '../modules/product/use-cases/bulkPriceUpdate.useCase';
import { ProductRepository } from '@shared/infrastructure/database/repositories/productRepository';
import { CategoryRepository } from '@shared/infrastructure/database/repositories/categoryRepository';

const router = Router();
const productRepository = new ProductRepository();
const categoryRepository = new CategoryRepository();

const productController = new ProductController(
  new GetAllProductsUseCase(productRepository),
  new CreateProductUseCase(productRepository, categoryRepository),
  new SellProductUseCase(productRepository),
  new SearchProductsUseCase(productRepository),
  new BulkPriceUpdateUseCase(productRepository)
);

router.get('/', (req, res) => productController.getAllProducts(req, res));
router.get('/search', (req, res) => productController.searchProducts(req, res));
router.post('/', (req, res) => productController.createProduct(req, res));
router.post('/sell', (req, res) => productController.sellProduct(req, res));
router.put('/bulk-price-update', (req, res) => productController.bulkPriceUpdate(req, res));

export default router;
