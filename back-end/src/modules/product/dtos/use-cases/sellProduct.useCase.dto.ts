export class SellProductUseCaseDTO {
  productId: string;
  quantity: number;

  constructor(data: SellProductUseCaseDTO) {
    this.productId = data.productId;
    this.quantity = data.quantity;
  }
}
