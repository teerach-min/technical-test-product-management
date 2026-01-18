import { Product } from '../types/Product';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'ข้าวผัด',
    sku: 'FOOD-001',
    price: 45,
    stock: 20,
    category: 'อาหาร',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'น้ำส้ม',
    sku: 'DRINK-001',
    price: 25,
    stock: 50,
    category: 'เครื่องดื่ม',
    createdAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    name: 'สบู่',
    sku: 'ITEM-001',
    price: 35,
    stock: 0,
    category: 'ของใช้',
    createdAt: new Date('2024-01-17'),
  },
  {
    id: '4',
    name: 'เสื้อยืด',
    sku: 'CLOTH-001',
    price: 299,
    stock: 5,
    category: 'เสื้อผ้า',
    createdAt: new Date('2024-01-18'),
  },
  {
    id: '5',
    name: 'ข้าวผัดกุ้ง',
    sku: 'FOOD-002',
    price: 55,
    stock: 8,
    category: 'อาหาร',
    createdAt: new Date('2024-01-19'),
  },
];
