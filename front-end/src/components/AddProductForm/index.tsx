import { useState } from 'react';
import { Category } from '../../types/Product';
import './style.css';

interface AddProductFormProps {
  onAddProduct: (product: {
    name: string;
    sku: string;
    price: number;
    stock: number;
    category: Category;
  }) => void;
  existingSkus: string[];
}

interface FormErrors {
  name?: string;
  sku?: string;
  price?: string;
  stock?: string;
  category?: string;
}

const AddProductForm = ({ onAddProduct, existingSkus }: AddProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    category: '' as Category | '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const categories: Category[] = ['อาหาร', 'เครื่องดื่ม', 'ของใช้', 'เสื้อผ้า'];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (formData.name.length < 3) {
      newErrors.name = 'ชื่อสินค้าต้องมีอย่างน้อย 3 ตัวอักษร';
    }

    // Validate SKU
    if (!formData.sku.trim()) {
      newErrors.sku = 'กรุณากรอกรหัสสินค้า';
    } else if (existingSkus.includes(formData.sku)) {
      newErrors.sku = 'รหัสสินค้านี้ซ้ำกับที่มีอยู่แล้ว';
    }

    // Validate price
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      newErrors.price = 'ราคาต้องมากกว่า 0';
    }

    // Validate stock
    const stock = parseInt(formData.stock);
    if (isNaN(stock) || stock < 0) {
      newErrors.stock = 'สต็อกต้องมากกว่าหรือเท่ากับ 0';
    }

    // Validate category
    if (!formData.category) {
      newErrors.category = 'กรุณาเลือกหมวดหมู่';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddProduct({
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category as Category,
      });
      
      // Reset form
      setFormData({
        name: '',
        sku: '',
        price: '',
        stock: '',
        category: '' as Category | '',
      });
      setErrors({});
    }
  };

  const isFormValid = (): boolean => {
    return (
      formData.name.length >= 3 &&
      formData.sku.trim() !== '' &&
      !existingSkus.includes(formData.sku) &&
      !isNaN(parseFloat(formData.price)) &&
      parseFloat(formData.price) > 0 &&
      !isNaN(parseInt(formData.stock)) &&
      parseInt(formData.stock) >= 0 &&
      formData.category !== ''
    );
  };

  return (
    <div className="add-product-form-container">
      <h2>เพิ่มสินค้าใหม่</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">
            ชื่อสินค้า <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="sku">
            รหัสสินค้า (SKU) <span className="required">*</span>
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className={errors.sku ? 'input-error' : ''}
          />
          {errors.sku && <span className="error-message">{errors.sku}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">
              ราคา (บาท) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              className={errors.price ? 'input-error' : ''}
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="stock">
              สต็อก <span className="required">*</span>
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              step="1"
              className={errors.stock ? 'input-error' : ''}
            />
            {errors.stock && <span className="error-message">{errors.stock}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">
            หมวดหมู่ <span className="required">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? 'input-error' : ''}
          >
            <option value="">-- เลือกหมวดหมู่ --</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>

        <button
          type="submit"
          disabled={!isFormValid()}
          className="submit-button"
        >
          เพิ่มสินค้า
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
