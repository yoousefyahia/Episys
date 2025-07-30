'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faClock, faBell, faPlus, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import './ProductsSection.css';

// بيانات المنتجات - يمكن نقلها لملف منفصل لاحقاً
const getProductsData = (t) => [
  // الأطباق الرئيسية
  {
    id: 1,
    name: t('burger'),
    category: t('mainDishes'),
    image: "/logo.png",
    preparationTime: `15 ${t('minutes')}`,
    price: `45 ${t('riyal')}`
  },
  {
    id: 2,
    name: t('pizza'),
    category: t('mainDishes'),
    image: "/logo.png",
    preparationTime: `20 ${t('minutes')}`,
    price: `55 ${t('riyal')}`
  },
  // المشروبات الباردة
  {
    id: 3,
    name: t('orangeJuice'),
    category: t('coldDrinks'),
    image: "/logo.png",
    preparationTime: `3 ${t('minutes')}`,
    price: `18 ${t('riyal')}`
  },
  // المشروبات الساخنة
  {
    id: 4,
    name: t('cappuccino'),
    category: t('hotDrinks'),
    image: "/logo.png",
    preparationTime: `5 ${t('minutes')}`,
    price: `25 ${t('riyal')}`
  },
  {
    id: 5,
    name: t('espresso'),
    category: t('hotDrinks'),
    image: "/logo.png",
    preparationTime: `3 ${t('minutes')}`,
    price: `20 ${t('riyal')}`
  },
  {
    id: 6,
    name: t('latte'),
    category: t('hotDrinks'),
    image: "/logo.png",
    preparationTime: `6 ${t('minutes')}`,
    price: `28 ${t('riyal')}`
  },
  {
    id: 7,
    name: t('mocha'),
    category: t('hotDrinks'),
    image: "/logo.png",
    preparationTime: `7 ${t('minutes')}`,
    price: `30 ${t('riyal')}`
  },
  // المخبوزات
  {
    id: 8,
    name: t('croissant'),
    category: t('pastries'),
    image: "/logo.png",
    preparationTime: `2 ${t('minutes')}`,
    price: `12 ${t('riyal')}`
  },
  // الحلويات
  {
    id: 9,
    name: t('cheesecake'),
    category: t('desserts'),
    image: "/logo.png",
    preparationTime: `5 ${t('minutes')}`,
    price: `22 ${t('riyal')}`
  },
  {
    id: 10,
    name: t('chocolateCake'),
    category: t('desserts'),
    image: "/logo.png",
    preparationTime: `5 ${t('minutes')}`,
    price: `25 ${t('riyal')}`
  }
];

export default function ProductsSection({ selectedCategory: propSelectedCategory }) {
  const { t, language } = useLanguage();
  const { addToCart, getCartCount } = useCart();
  const { success } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // فلترة المنتجات حسب البحث والفئة
  useEffect(() => {
    if (!isClient) return;
    
    const productsData = getProductsData(t);
    let filtered = productsData;

    // فلترة حسب الفئة
    if (propSelectedCategory && propSelectedCategory !== t('allProducts')) {
      filtered = filtered.filter(product => product.category === propSelectedCategory);
    }

    // فلترة حسب البحث
    if (searchTerm.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, propSelectedCategory, isClient, t, language]);

  // تجميع المنتجات حسب الفئة
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  const handleCallWaiter = () => {
    window.location.href = '/call-waiter';
  };

  const handleAddToCart = (product) => {
    // تحويل السعر من نص إلى رقم
    const price = parseFloat(product.price.split(' ')[0]);
    const productWithPrice = {
      ...product,
      price: price
    };
    addToCart(productWithPrice);
    success(`تم إضافة ${product.name} إلى السلة!`);
  };

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="products-section">
      {/* قسم البحث */}
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-button">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>

      {/* عرض المنتجات */}
      {Object.keys(groupedProducts).length > 0 ? (
        Object.entries(groupedProducts).map(([category, products]) => (
          <div key={category} className="category-section">
            <h2 className="category-title">{category}</h2>
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/logo.png';
                      }}
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="preparation-time">
                      <FontAwesomeIcon icon={faClock} />
                      <span>{product.preparationTime}</span>
                    </div>
                    <div className="product-actions">
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        {t('addToCart')}
                      </button>
                      <button 
                        className="call-waiter-btn"
                        onClick={handleCallWaiter}
                      >
                        <FontAwesomeIcon icon={faBell} />
                        {t('callWaiterBtn')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="no-results">
          <p>{t('noResults')}</p>
        </div>
      )}

      {/* زر السلة */}
      <button 
        className="cart-button"
        onClick={() => window.location.href = '/cart'}
      >
        <FontAwesomeIcon icon={faShoppingCart} />
        {getCartCount() > 0 && (
          <span className="cart-count">{getCartCount()}</span>
        )}
      </button>
    </div>
  );
} 