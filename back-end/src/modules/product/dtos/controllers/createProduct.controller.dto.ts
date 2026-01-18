export interface CreateProductControllerDTO {
  name: string;
  sku: string;
  description?: string;
  price: number;
  stock: number;
  categoryName: string;
}
