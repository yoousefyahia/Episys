'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faClock,
  faBell,
  faPlus,
  faMinus,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { ProductGridSkeleton } from '@/components/Skeleton/Skeleton';
import './ProductsSection.css';

// Dynamic import for ProductModal
const ProductModal = dynamic(
  () => import('@/components/ProductModal/ProductModal'),
  {
    loading: () => <div className="modal-loading">جاري التحميل...</div>,
    ssr: false,
  }
);

const getProductsData = t => [
  {
    id: 1,
    name: t('burger'),
    category: t('mainDishes'),
    image: '/images/p1.jpg',
    preparationTime: `15 ${t('minutes')}`,
    price: 45,
    sizes: [
      { id: 1, name: 'Small', price: 35 },
      { id: 2, name: 'Medium', price: 45 },
      { id: 3, name: 'Large', price: 55 },
    ],
    addons: [
      { id: 1, name: 'Extra Cheese', price: 5 },
      { id: 2, name: 'Extra Meat', price: 8 },
      { id: 3, name: 'Extra Sauce', price: 3 },
      { id: 4, name: 'No Onion', price: 0 },
      { id: 5, name: 'Spicy', price: 0 },
      { id: 6, name: 'No Pickles', price: 0 },
    ],
  },
  {
    id: 2,
    name: t('pizza'),
    category: t('mainDishes'),
    image: '/images/p2.webp',
    preparationTime: `20 ${t('minutes')}`,
    price: 55,
    sizes: [
      { id: 1, name: 'Small', price: 45 },
      { id: 2, name: 'Medium', price: 55 },
      { id: 3, name: 'Large', price: 70 },
    ],
    addons: [
      { id: 1, name: 'Extra Cheese', price: 5 },
      { id: 2, name: 'Extra Meat', price: 8 },
      { id: 3, name: 'Extra Sauce', price: 3 },
      { id: 4, name: 'No Onion', price: 0 },
      { id: 5, name: 'Spicy', price: 0 },
      { id: 6, name: 'No Pickles', price: 0 },
    ],
  },
  {
    id: 3,
    name: t('orangeJuice'),
    category: t('coldDrinks'),
    image: '/images/p3.jpg',
    preparationTime: `3 ${t('minutes')}`,
    price: 18,
    sizes: [
      { id: 1, name: 'Small', price: 15 },
      { id: 2, name: 'Medium', price: 18 },
      { id: 3, name: 'Large', price: 22 },
    ],
    addons: [
      { id: 1, name: 'Extra Ice', price: 0 },
      { id: 2, name: 'No Sugar', price: 0 },
      { id: 3, name: 'Extra Pulp', price: 2 },
    ],
  },
  {
    id: 4,
    name: t('cappuccino'),
    category: t('hotDrinks'),
    image: '/images/p1.jpg',
    preparationTime: `5 ${t('minutes')}`,
    price: 25,
    sizes: [
      { id: 1, name: 'Small', price: 20 },
      { id: 2, name: 'Medium', price: 25 },
      { id: 3, name: 'Large', price: 30 },
    ],
    addons: [
      { id: 1, name: 'Extra Shot', price: 3 },
      { id: 2, name: 'Extra Milk', price: 2 },
      { id: 3, name: 'No Sugar', price: 0 },
      { id: 4, name: 'Extra Hot', price: 0 },
    ],
  },
  {
    id: 5,
    name: t('espresso'),
    category: t('hotDrinks'),
    image: '/images/p2.webp',
    preparationTime: `3 ${t('minutes')}`,
    price: 20,
    sizes: [
      { id: 1, name: 'Single Shot', price: 18 },
      { id: 2, name: 'Double Shot', price: 20 },
      { id: 3, name: 'Triple Shot', price: 25 },
    ],
    addons: [
      { id: 1, name: 'Extra Hot', price: 0 },
      { id: 2, name: 'No Sugar', price: 0 },
    ],
  },
  {
    id: 6,
    name: t('latte'),
    category: t('hotDrinks'),
    image: '/images/p3.jpg',
    preparationTime: `6 ${t('minutes')}`,
    price: 28,
    sizes: [
      { id: 1, name: 'Small', price: 24 },
      { id: 2, name: 'Medium', price: 28 },
      { id: 3, name: 'Large', price: 32 },
    ],
    addons: [
      { id: 1, name: 'Extra Shot', price: 3 },
      { id: 2, name: 'Extra Milk', price: 2 },
      { id: 3, name: 'No Sugar', price: 0 },
      { id: 4, name: 'Extra Hot', price: 0 },
    ],
  },
  {
    id: 7,
    name: t('mocha'),
    category: t('hotDrinks'),
    image: '/images/p1.jpg',
    preparationTime: `7 ${t('minutes')}`,
    price: 30,
    sizes: [
      { id: 1, name: 'Small', price: 26 },
      { id: 2, name: 'Medium', price: 30 },
      { id: 3, name: 'Large', price: 35 },
    ],
    addons: [
      { id: 1, name: 'Extra Shot', price: 3 },
      { id: 2, name: 'Extra Chocolate', price: 2 },
      { id: 3, name: 'Extra Milk', price: 2 },
      { id: 4, name: 'No Sugar', price: 0 },
    ],
  },
  {
    id: 8,
    name: t('croissant'),
    category: t('pastries'),
    image: '/images/p2.webp',
    preparationTime: `2 ${t('minutes')}`,
    price: 12,
    addons: [
      { id: 1, name: 'Extra Butter', price: 1 },
      { id: 2, name: 'Extra Jam', price: 2 },
      { id: 3, name: 'Extra Honey', price: 2 },
    ],
  },
  {
    id: 9,
    name: t('cheesecake'),
    category: t('desserts'),
    image: '/images/p3.jpg',
    preparationTime: `5 ${t('minutes')}`,
    price: 22,
    addons: [
      { id: 1, name: 'Extra Cream', price: 3 },
      { id: 2, name: 'Extra Berries', price: 4 },
      { id: 3, name: 'Extra Chocolate', price: 2 },
    ],
  },
  {
    id: 10,
    name: t('chocolateCake'),
    category: t('desserts'),
    image: '/images/p1.jpg',
    preparationTime: `5 ${t('minutes')}`,
    price: 25,
    addons: [
      { id: 1, name: 'Extra Cream', price: 3 },
      { id: 2, name: 'Extra Chocolate', price: 2 },
      { id: 3, name: 'Extra Nuts', price: 4 },
    ],
  },
];

export default function ProductsSection({
  selectedCategory: propSelectedCategory,
}) {
  const { t, language } = useLanguage();
  const { addToCart, getCartCount, cartItems } = useCart();
  const { success } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [modalProduct, setModalProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [productQuantities, setProductQuantities] = useState({});

  useEffect(() => {
    setIsClient(true);
  }, []);

  // فلترة المنتجات حسب البحث والفئة
  useEffect(() => {
    if (!isClient) return;

    const productsData = getProductsData(t);
    let filtered = productsData;

    if (propSelectedCategory && propSelectedCategory !== t('allProducts')) {
      filtered = filtered.filter(
        product => product.category === propSelectedCategory
      );
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, propSelectedCategory, isClient, t, language]);

  const groupedProducts = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});
  }, [filteredProducts]);

  // Get quantity for a product (basic version without options)
  const getProductQuantity = (productId) => {
    const basicProduct = cartItems.find(item => 
      item.id === productId && 
      !item.selectedSize && 
      (!item.selectedAddons || item.selectedAddons.length === 0)
    );
    return basicProduct ? basicProduct.quantity : 0;
  };

  const handleQuantityChange = (product, change) => {
    const currentQuantity = getProductQuantity(product.id);
    const newQuantity = currentQuantity + change;
    
    if (newQuantity < 0) return;
    
    if (newQuantity === 0) {
      // Remove from cart if quantity becomes 0
      // This will be handled by the cart context
      return;
    }

    // Add to cart with new quantity
    const productToAdd = {
      ...product,
      quantity: newQuantity,
      totalPrice: product.price * newQuantity
    };

    addToCart(productToAdd);
    
    const message = language === 'ar' 
      ? `تم تحديث كمية ${product.name} إلى ${newQuantity}`
      : `${product.name} quantity updated to ${newQuantity}`;
    success(message);
  };

  const handleCallWaiter = () => {
    // سيتم استخدام Link بدلاً من window.location.href
    // هذا سيتم التعامل معه في الـ JSX
  };

  const handleAddToCart = useCallback(product => {
    setModalProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleModalAddToCart = useCallback(
    productWithOptions => {
      addToCart(productWithOptions);
      const message =
        language === 'ar'
          ? `تم إضافة ${productWithOptions.name} إلى السلة`
          : `${productWithOptions.name} added to cart`;
      success(message);
    },
    [addToCart, language, success]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setModalProduct(null);
  }, []);

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="products-section">
      {/* قسم البحث */}
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-button">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>

      {/* عرض المنتجات */}
      {!isClient ? (
        <ProductGridSkeleton count={6} />
      ) : Object.keys(groupedProducts).length > 0 ? (
        Object.entries(groupedProducts).map(([category, products]) => (
          <div key={category} className="category-section">
            <h2 className="category-title">{category}</h2>
            <div className="products-grid">
              {products.map(product => {
                const currentQuantity = getProductQuantity(product.id);
                return (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={150}
                        height={150}
                        style={{ objectFit: 'cover' }}
                        onError={() => {
                          // Fallback handled by Next.js Image component
                        }}
                      />
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <div className="preparation-time">
                        <FontAwesomeIcon icon={faClock} />
                        <span>{product.preparationTime}</span>
                      </div>
                      <div className="product-price">
                        {product.price} {t('riyal')}
                      </div>
                      <div className="product-actions">
                        {currentQuantity > 0 ? (
                          <div className="quantity-controls">
                            <button
                              className="quantity-btn"
                              onClick={() => handleQuantityChange(product, -1)}
                            >
                              <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <span className="quantity-value">{currentQuantity}</span>
                            <button
                              className="quantity-btn"
                              onClick={() => handleQuantityChange(product, 1)}
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                          </div>
                        ) : (
                          <button
                            className="add-to-cart-btn"
                            onClick={() => handleAddToCart(product)}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                            {t('addToCart')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="no-results">
          <p>{t('noResults')}</p>
        </div>
      )}

      {/* زر السلة */}
      <Link href="/cart">
        <button className="cart-button">
          <FontAwesomeIcon icon={faShoppingCart} />
          {getCartCount() > 0 && (
            <span className="cart-count">{getCartCount()}</span>
          )}
        </button>
      </Link>

      {/* زر استدعاء النادل */}
      <Link href="/call-waiter">
        <button className="call-waiter-fixed-btn" title={t('callWaiter')}>
          <FontAwesomeIcon icon={faBell} />
        </button>
      </Link>

      {/* Product Modal */}
      <ProductModal
        product={modalProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleModalAddToCart}
      />
    </div>
  );
}
