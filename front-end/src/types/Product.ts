export type Category = "อาหาร" | "เครื่องดื่ม" | "ของใช้" | "เสื้อผ้า";

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: Category;
  createdAt: Date;
}
