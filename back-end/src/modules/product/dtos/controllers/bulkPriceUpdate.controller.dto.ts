export interface ProductPriceUpdate {
  productId: string;
  newPrice: number;
}

export interface BulkPriceUpdateControllerDTO extends Array<ProductPriceUpdate> {
}
