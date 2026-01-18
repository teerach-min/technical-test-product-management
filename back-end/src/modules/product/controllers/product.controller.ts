import { Request, Response } from 'express';
import { GetAllProductsUseCase } from '../use-cases/getAllProducts.useCase';
import { CreateProductUseCase } from '../use-cases/createProduct.useCase';
import { SellProductUseCase } from '../use-cases/sellProduct.useCase';
import { SearchProductsUseCase } from '../use-cases/searchProducts.useCase';
import { BulkPriceUpdateUseCase } from '../use-cases/bulkPriceUpdate.useCase';
import { CreateProductControllerDTO } from '../dtos/controllers/createProduct.controller.dto';
import { SellProductControllerDTO } from '../dtos/controllers/sellProduct.controller.dto';
import { BulkPriceUpdateControllerDTO } from '../dtos/controllers/bulkPriceUpdate.controller.dto';
import { CreateProductUseCaseDTO } from '../dtos/use-cases/createProduct.useCase.dto';
import { SellProductUseCaseDTO } from '../dtos/use-cases/sellProduct.useCase.dto';
import { BulkPriceUpdateUseCaseDTO } from '../dtos/use-cases/bulkPriceUpdate.useCase.dto';
import { ValidationError } from '@shared/errors/ValidationError';

export class ProductController {
  constructor(
    private getAllProductsUseCase: GetAllProductsUseCase,
    private createProductUseCase: CreateProductUseCase,
    private sellProductUseCase: SellProductUseCase,
    private searchProductsUseCase: SearchProductsUseCase,
    private bulkPriceUpdateUseCase: BulkPriceUpdateUseCase
  ) {}

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const categoryName = req.query.category as string | undefined;
      const products = await this.getAllProductsUseCase.execute(categoryName);
      
      const formattedProducts = products.map(product => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        stock: product.stock,
        category: product.category?.name || '',
        createdAt: product.createdAt.toISOString()
      }));

      res.json(formattedProducts);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const createProductDTO: CreateProductControllerDTO = req.body;
      const useCaseDTO = new CreateProductUseCaseDTO(createProductDTO);
      const { product, categoryName } = await this.createProductUseCase.execute(useCaseDTO);
      
      res.status(201).json({
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        stock: product.stock,
        category: categoryName,
        createdAt: product.createdAt.toISOString()
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          errors: error.errors
        });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async sellProduct(req: Request, res: Response): Promise<void> {
    try {
      const sellProductDTO: SellProductControllerDTO = req.body;
      const useCaseDTO = new SellProductUseCaseDTO(sellProductDTO);
      const product = await this.sellProductUseCase.execute(useCaseDTO);
      
      res.json({
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        stock: product.stock,
        category: product.category?.name || '',
        createdAt: product.createdAt.toISOString()
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          errors: error.errors
        });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const keyword = req.query.keyword as string;
      
      if (!keyword || keyword.trim().length === 0) {
        res.status(400).json({
          errors: ['กรุณาระบุ keyword สำหรับค้นหา']
        });
        return;
      }

      const products = await this.searchProductsUseCase.execute(keyword.trim());
      
      const formattedProducts = products.map(product => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        stock: product.stock,
        category: product.category?.name || '',
        createdAt: product.createdAt.toISOString()
      }));

      res.json(formattedProducts);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async bulkPriceUpdate(req: Request, res: Response): Promise<void> {
    try {
      const bulkPriceUpdateDTO: BulkPriceUpdateControllerDTO = req.body;
      const useCaseDTO = new BulkPriceUpdateUseCaseDTO({ products: bulkPriceUpdateDTO });
      const result = await this.bulkPriceUpdateUseCase.execute(useCaseDTO);
      
      res.json({
        successCount: result.successCount,
        totalCount: result.totalCount,
        message: `อัพเดทราคาสำเร็จ ${result.successCount} จาก ${result.totalCount} รายการ`
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          errors: error.errors
        });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
