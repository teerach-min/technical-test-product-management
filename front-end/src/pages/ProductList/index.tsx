import { useState } from 'react';
import { Product, Category } from '../../types/Product';
import { mockProducts } from '../../data/mockProducts';
import AddProductForm from '../../components/AddProductForm';
import './style.css';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');

  const categories: (string | Category)[] = ['ทั้งหมด', 'อาหาร', 'เครื่องดื่ม', 'ของใช้', 'เสื้อผ้า'];

  const getFilteredProducts = (): Product[] => {
    if (selectedCategory === 'ทั้งหมด') {
      return products;
    }
    return products.filter(product => product.category === selectedCategory);
  };

  const filteredProducts = getFilteredProducts();

  const calculateTotalValue = (): number => {
    return filteredProducts.reduce((total, product) => {
      return total + (product.price * product.stock);
    }, 0);
  };

  const handleSell = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) {
      alert('ไม่พบสินค้า');
      return;
    }
    
    if (product.stock <= 0) {
      alert('สินค้าหมด ไม่สามารถขายได้');
      return;
    }
    
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === productId
          ? { ...p, stock: p.stock - 1 }
          : p
      )
    );
    alert('ขายสินค้าสำเร็จ!');
  };

  const handleAddProduct = (newProduct: Omit<Product, 'id' | 'createdAt'>) => {
    const product: Product = {
      ...newProduct,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setProducts(prevProducts => [...prevProducts, product]);
  };

  const formatPrice = (price: number): string => {
    return price.toFixed(2);
  };

  const isStockLow = (stock: number): boolean => {
    return stock < 10 && stock > 0;
  };

  const isStockEmpty = (stock: number): boolean => {
    return stock === 0;
  };

  return (
    <div className="product-list-container">
      <h1>รายการสินค้า</h1>
      
      <div className="filter-section">
        <label htmlFor="category-filter">กรองตามหมวดหมู่: </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>รหัสสินค้า (SKU)</th>
              <th>ชื่อสินค้า</th>
              <th>หมวดหมู่</th>
              <th>ราคา (บาท)</th>
              <th>สต็อก</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr
                key={product.id}
                className={isStockEmpty(product.stock) ? 'row-empty' : ''}
              >
                <td>{product.sku}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{formatPrice(product.price)}</td>
                <td>
                  <span
                    className={
                      isStockLow(product.stock) ? 'stock-low' : ''
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleSell(product.id)}
                    disabled={isStockEmpty(product.stock)}
                    className="sell-button"
                  >
                    ขาย
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="summary-section">
        <div className="summary-item">
          <strong>จำนวนสินค้าทั้งหมด:</strong> {filteredProducts.length} รายการ
        </div>
        <div className="summary-item">
          <strong>มูลค่ารวม:</strong> {formatPrice(calculateTotalValue())} บาท
        </div>
      </div>

      <AddProductForm
        onAddProduct={handleAddProduct}
        existingSkus={products.map(p => p.sku)}
      />
    </div>
  );
};

export default ProductList;
