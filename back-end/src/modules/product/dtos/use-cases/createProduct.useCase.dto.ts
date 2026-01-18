export class CreateProductUseCaseDTO {
    name: string;
    sku: string;
    description?: string;
    price: number;
    stock: number;
    categoryName: string;

    constructor(data: CreateProductUseCaseDTO) {
        this.name = data.name;
        this.sku = data.sku;
        this.description = data.description;
        this.price = data.price;
        this.stock = data.stock;
        this.categoryName = data.categoryName;
    }
  }
