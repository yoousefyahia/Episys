'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faTrash, faPlus, faMinus, faCheck } from '@fortawesome/free-solid-svg-icons';
import Navbar from '@/components/Navbar/Navbar';
import './Cart.css';

export default function Cart() {
  const { t, language } = useLanguage();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { success, error } = useToast();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedAddons, setSelectedAddons] = useState({});
  const [notes, setNotes] = useState('');

  // حساب السعر الإجمالي للمنتج مع الأحجام والإضافات
  const getItemTotalPrice = (item) => {
    const basePrice = item.price;
    const sizePrice = selectedSizes[item.id]?.price || 0;
    const addonsPrice = (selectedAddons[item.id] || []).reduce((sum, addon) => sum + addon.price, 0);
    return (basePrice + sizePrice + addonsPrice) * item.quantity;
  };

  // حساب المجموع الفرعي
  const subtotal = cartItems.reduce((sum, item) => sum + getItemTotalPrice(item), 0);
  
  // رسوم الخدمة 10%
  const serviceCharge = subtotal * 0.1;
  
  // الضريبة 14%
  const tax = subtotal * 0.14;
  
  // المجموع النهائي
  const finalTotal = subtotal - discount + serviceCharge + tax;



  // تطبيق كوبون الخصم
  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'discount10') {
      setDiscount(subtotal * 0.1);
      success(t('couponApplied'));
    } else {
      error(t('invalidCoupon'));
    }
  };

  // التحقق من صحة البيانات قبل إتمام الطلب
  const validateOrder = () => {
    const errors = [];

    // التحقق من وجود منتجات في العربة
    if (cartItems.length === 0) {
      errors.push(t('cartEmpty'));
      return errors;
    }

    // التحقق من اختيار الأحجام لجميع المنتجات
    cartItems.forEach((item, index) => {
      if (!selectedSizes[item.id]) {
        errors.push(`${t('selectSizeFor')} ${item.name}`);
      }
    });

    // التحقق من الكمية (يجب أن تكون أكبر من 0)
    cartItems.forEach((item) => {
      if (item.quantity <= 0) {
        errors.push(`${t('invalidQuantityFor')} ${item.name}`);
      }
    });

    // التحقق من السعر الإجمالي
    if (finalTotal <= 0) {
      errors.push(t('invalidTotalPrice'));
    }

    // التحقق من الملاحظات (اختياري - يمكن أن تكون فارغة)
    // إذا كنت تريد إجبارية الملاحظات، أضف هذا التحقق:
    // if (!notes.trim()) {
    //   errors.push(t('notesRequired'));
    // }

    return errors;
  };

  // إتمام الطلب
  const proceedToOrder = () => {
    // التحقق من صحة البيانات
    const validationErrors = validateOrder();
    
    if (validationErrors.length > 0) {
      // عرض جميع الأخطاء
      validationErrors.forEach(errorMsg => {
        error(errorMsg);
      });
      return;
    }
    
    // تجميع تفاصيل الطلب
    const orderDetails = {
      items: cartItems.map(item => ({
        ...item,
        size: selectedSizes[item.id]?.size || 'small',
        addons: selectedAddons[item.id] || [],
        totalPrice: getItemTotalPrice(item)
      })),
      notes: notes,
      subtotal: subtotal,
      discount: discount,
      serviceCharge: serviceCharge,
      tax: tax,
      finalTotal: finalTotal
    };
    
    console.log('Order Details:', orderDetails);
    success(t('orderPlaced'));
    clearCart();
    setDiscount(0);
    setSelectedSizes({});
    setSelectedAddons({});
    setNotes('');
  };

  // إلغاء الطلب
  const cancelOrder = () => {
    clearCart();
    setDiscount(0);
    setCouponCode('');
    setSelectedSizes({});
    setSelectedAddons({});
    setNotes('');
  };

  // إدارة الأحجام
  const handleSizeSelect = (itemId, size, price) => {
    setSelectedSizes(prev => ({
      ...prev,
      [itemId]: { size, price }
    }));
  };

  // إدارة الإضافات
  const handleAddonToggle = (itemId, addon, price) => {
    setSelectedAddons(prev => {
      const currentAddons = prev[itemId] || [];
      const isSelected = currentAddons.some(a => a.name === addon);
      
      if (isSelected) {
        return {
          ...prev,
          [itemId]: currentAddons.filter(a => a.name !== addon)
        };
      } else {
        return {
          ...prev,
          [itemId]: [...currentAddons, { name: addon, price }]
        };
      }
    });
  };

  // الحصول على أحجام المنتج حسب فئته
  const getSizesByCategory = (category) => {
    // تحويل النص المترجم إلى مفتاح الفئة
    const getCategoryKey = (categoryText) => {
      if (categoryText === t('mainDishes')) return 'mainDishes';
      if (categoryText === t('coldDrinks')) return 'coldDrinks';
      if (categoryText === t('hotDrinks')) return 'hotDrinks';
      if (categoryText === t('pastries')) return 'pastries';
      if (categoryText === t('desserts')) return 'desserts';
      return 'default';
    };

    const categoryKey = getCategoryKey(category);
    
    switch (categoryKey) {
      case 'mainDishes':
        return [
          { size: 'small', label: t('small'), price: 0 },
          { size: 'medium', label: t('medium'), price: 15 },
          { size: 'large', label: t('large'), price: 30 }
        ];
      case 'coldDrinks':
      case 'hotDrinks':
        return [
          { size: 'small', label: t('small'), price: 0 },
          { size: 'medium', label: t('medium'), price: 10 },
          { size: 'large', label: t('large'), price: 20 }
        ];
      case 'pastries':
        return [
          { size: 'small', label: t('small'), price: 0 },
          { size: 'medium', label: t('medium'), price: 8 },
          { size: 'large', label: t('large'), price: 15 }
        ];
      case 'desserts':
        return [
          { size: 'small', label: t('small'), price: 0 },
          { size: 'medium', label: t('medium'), price: 12 },
          { size: 'large', label: t('large'), price: 25 }
        ];
      default:
        return [
          { size: 'small', label: t('small'), price: 0 },
          { size: 'medium', label: t('medium'), price: 10 },
          { size: 'large', label: t('large'), price: 20 }
        ];
    }
  };

  // الحصول على الإضافات حسب فئة المنتج
  const getAddonsByCategory = (category) => {
    // تحويل النص المترجم إلى مفتاح الفئة
    const getCategoryKey = (categoryText) => {
      if (categoryText === t('mainDishes')) return 'mainDishes';
      if (categoryText === t('coldDrinks')) return 'coldDrinks';
      if (categoryText === t('hotDrinks')) return 'hotDrinks';
      if (categoryText === t('pastries')) return 'pastries';
      if (categoryText === t('desserts')) return 'desserts';
      return 'default';
    };

    const categoryKey = getCategoryKey(category);
    
    switch (categoryKey) {
      case 'mainDishes':
        return [
          { name: 'extraCheese', label: t('extraCheese'), price: 5, free: false },
          { name: 'extraSauce', label: t('extraSauce'), price: 3, free: false },
          { name: 'noOnion', label: t('noOnion'), price: 0, free: true },
          { name: 'spicy', label: t('spicy'), price: 0, free: true },
          { name: 'extraMeat', label: t('extraMeat'), price: 8, free: false },
          { name: 'noPickles', label: t('noPickles'), price: 0, free: true }
        ];
      case 'coldDrinks':
        return [
          { name: 'extraIce', label: t('extraIce'), price: 0, free: true },
          { name: 'lessIce', label: t('lessIce'), price: 0, free: true },
          { name: 'extraPulp', label: t('extraPulp'), price: 0, free: true },
          { name: 'mintLeaves', label: t('mintLeaves'), price: 2, free: false },
          { name: 'extraSugar', label: t('extraSugar'), price: 0, free: true },
          { name: 'lessSugar', label: t('lessSugar'), price: 0, free: true }
        ];
      case 'hotDrinks':
        return [
          { name: 'extraSugar', label: t('extraSugar'), price: 0, free: true },
          { name: 'lessSugar', label: t('lessSugar'), price: 0, free: true },
          { name: 'extraMilk', label: t('extraMilk'), price: 2, free: false },
          { name: 'whippedCream', label: t('whippedCream'), price: 3, free: false },
          { name: 'extraHot', label: t('extraHot'), price: 0, free: true },
          { name: 'lessHot', label: t('lessHot'), price: 0, free: true }
        ];
      case 'pastries':
        return [
          { name: 'extraButter', label: t('extraButter'), price: 2, free: false },
          { name: 'warmUp', label: t('warmUp'), price: 0, free: true },
          { name: 'extraJam', label: t('extraJam'), price: 3, free: false },
          { name: 'extraHoney', label: t('extraHoney'), price: 2, free: false },
          { name: 'freshBaked', label: t('freshBaked'), price: 0, free: true }
        ];
      case 'desserts':
        return [
          { name: 'extraCream', label: t('extraCream'), price: 4, free: false },
          { name: 'extraChocolate', label: t('extraChocolate'), price: 3, free: false },
          { name: 'lessSweet', label: t('lessSweet'), price: 0, free: true },
          { name: 'extraNuts', label: t('extraNuts'), price: 5, free: false },
          { name: 'extraFruits', label: t('extraFruits'), price: 4, free: false }
        ];
      default:
        return [
          { name: 'extraPulp', label: t('extraPulp'), price: 0, free: true },
          { name: 'iceCubes', label: t('iceCubes'), price: 0, free: true },
          { name: 'mintLeaves', label: t('mintLeaves'), price: 5, free: false }
        ];
    }
  };

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="cart-container">
      <Navbar />
      <div className="cart-content-wrapper">
        {/* الهيدر */}
        <div className="cart-header">
          <h1 className="cart-title">{t('cart')}</h1>
          <button className="back-button" onClick={() => window.history.back()}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </div>

      {/* رسالة العربة الفارغة */}
      {cartItems.length === 0 && (
        <div className="empty-cart-message">
          {t('cartEmptyMessage')}
        </div>
      )}

      {/* قائمة المنتجات */}
      {cartItems.length > 0 && (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-category">{item.category}</p>
                <div className="item-price">{getItemTotalPrice(item).toFixed(2)} {t('currency')}</div>
                
                {/* خيارات الأحجام - لجميع المنتجات */}
                <div className="size-options">
                  <h4 className="options-title">{t('availableSizes')}</h4>
                  <div className="size-buttons">
                    {getSizesByCategory(item.category).map((sizeOption) => (
                      <button
                        key={sizeOption.size}
                        className={`size-btn ${selectedSizes[item.id]?.size === sizeOption.size ? 'selected' : ''}`}
                        onClick={() => handleSizeSelect(item.id, sizeOption.size, sizeOption.price)}
                      >
                        {sizeOption.label} - {(parseFloat(item.price) + sizeOption.price).toFixed(2)} {t('currency')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* خيارات الإضافات */}
                <div className="addon-options">
                  <h4 className="options-title">{t('orderAddons')}</h4>
                  <div className="addon-list">
                    {getAddonsByCategory(item.category).map((addon) => (
                      <label key={addon.name} className="addon-item">
                        <input
                          type="checkbox"
                          checked={(selectedAddons[item.id] || []).some(a => a.name === addon.name)}
                          onChange={() => handleAddonToggle(item.id, addon.name, addon.price)}
                        />
                        <span className="addon-name">
                          {addon.label} 
                          {addon.free ? ` (${t('free')})` : ` (+${addon.price} ${t('currency')})`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="item-actions">
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* قسم الملاحظات */}
      <div className="notes-section">
        <div className="section-divider"></div>
        <div className="notes-input-group">
          <label className="notes-label">{t('optionalNotes')}</label>
          <textarea
            placeholder={t('addNotesForDish')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="notes-textarea"
            rows="3"
          />
        </div>
      </div>

      {/* قسم الكوبون */}
      <div className="coupon-section">
        <div className="section-divider"></div>
        <div className="coupon-input-group">
          <input
            type="text"
            placeholder={t('couponCode')}
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="coupon-input"
          />
          <button className="apply-coupon-btn" onClick={applyCoupon}>
            {t('apply')}
          </button>
        </div>
      </div>

      {/* ملخص الطلب */}
      <div className="order-summary">
        <div className="section-divider"></div>
        <div className="summary-item">
          <span>{t('subtotal')}</span>
          <span>{subtotal.toFixed(2)} {t('currency')}</span>
        </div>
        <div className="summary-item discount">
          <span>{t('discount')}</span>
          <span>-{discount.toFixed(2)} {t('currency')}</span>
        </div>
        <div className="summary-item">
          <span>{t('serviceCharge')} (10%)</span>
          <span>+{serviceCharge.toFixed(2)} {t('currency')}</span>
        </div>
        <div className="summary-item">
          <span>{t('tax')} (14%)</span>
          <span>+{tax.toFixed(2)} {t('currency')}</span>
        </div>
        <div className="section-divider"></div>
        <div className="summary-item final-total">
          <span>{t('finalTotal')}</span>
          <span>{finalTotal.toFixed(2)} {t('currency')}</span>
        </div>
      </div>

      {/* أزرار الإجراءات */}
      <div className="cart-actions">
        <button className="proceed-btn" onClick={proceedToOrder}>
          {t('proceedToOrder')}
        </button>
        <button className="cancel-btn" onClick={cancelOrder}>
          {t('cancel')}
        </button>
      </div>
      </div>
    </div>
  );
} 