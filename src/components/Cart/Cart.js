'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faTrash, faPlus, faMinus, faCheck } from '@fortawesome/free-solid-svg-icons';
import Navbar from '@/components/Navbar/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import './Cart.css';

export default function Cart() {
  const { t, language } = useLanguage();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { success, error } = useToast();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');

  const getItemTotalPrice = (item) => {
    return item.totalPrice || (item.price * item.quantity);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + getItemTotalPrice(item), 0);
  const serviceCharge = subtotal * 0.1;
  const tax = subtotal * 0.14;
  const finalTotal = subtotal - discount + serviceCharge + tax;



  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'discount10') {
      setDiscount(subtotal * 0.1);
      success(t('couponApplied'));
    } else {
      error(t('invalidCoupon'));
    }
  };

  const validateOrder = () => {
    const errors = [];

    if (cartItems.length === 0) {
      errors.push(t('cartEmpty'));
      return errors;
    }

    cartItems.forEach((item) => {
      if (item.quantity <= 0) {
        errors.push(`${t('invalidQuantityFor')} ${item.name}`);
      }
    });

    if (finalTotal <= 0) {
      errors.push(t('invalidTotalPrice'));
    }

    return errors;
  };

  const proceedToOrder = () => {
    const validationErrors = validateOrder();
    
    if (validationErrors.length > 0) {
      validationErrors.forEach(errorMsg => {
        error(errorMsg);
      });
      return;
    }

    success(t('orderPlaced'));
    clearCart();
    setDiscount(0);
    setNotes('');
  };

  const cancelOrder = () => {
    clearCart();
    setDiscount(0);
    setCouponCode('');
    setNotes('');
    // سيتم استخدام Link بدلاً من window.location.href
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
                <Image 
                  src={item.image} 
                  alt={item.name}
                  width={80}
                  height={80}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-category">{item.category}</p>
                <div className="item-price">{getItemTotalPrice(item).toFixed(2)} {t('currency')}</div>
                
                {/* عرض الخيارات المحددة */}
                {item.selectedSize && (
                  <div className="selected-options">
                    <span className="option-tag">{item.selectedSize.name}</span>
                  </div>
                )}
                
                {item.selectedAddons && item.selectedAddons.length > 0 && (
                  <div className="selected-options">
                    {item.selectedAddons.map((addon, index) => (
                      <span key={index} className="option-tag">
                        {addon.name} {addon.price > 0 ? `(+${addon.price} SAR)` : '(Free)'}
                        </span>
                    ))}
                  </div>
                )}
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
        <Link href="/">
        <button className="cancel-btn" onClick={cancelOrder}>
          {t('cancel')}
        </button>
        </Link>
      </div>
      </div>
    </div>
  );
} 