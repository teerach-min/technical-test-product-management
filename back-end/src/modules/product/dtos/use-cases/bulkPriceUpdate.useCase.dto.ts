export interface ProductPriceUpdate {
  productId: string;
  newPrice: number;
}

export class BulkPriceUpdateUseCaseDTO {
  products: ProductPriceUpdate[];

  constructor(data: BulkPriceUpdateUseCaseDTO) {
    this.products = data.products;
  }
}
