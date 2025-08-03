'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faTrash,
  faPlus,
  faMinus,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '@/components/Navbar/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './Cart.css';

export default function Cart() {
  const { t, language } = useLanguage();
  const { cartItems, orderType, orderDetails, removeFromCart, updateQuantity, clearCart, updateOrderType, updateOrderDetails } = useCart();
  const { success, error } = useToast();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');



  const getItemTotalPrice = item => {
    if (item.totalPrice) {
      return item.totalPrice;
    }
    
    // Calculate price based on size and addons
    const basePrice = item.selectedSize?.price || item.price;
    const addonsPrice = item.selectedAddons?.reduce((sum, addon) => sum + (addon.price || 0), 0) || 0;
    const unitPrice = basePrice + addonsPrice;
    return unitPrice * item.quantity;
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + getItemTotalPrice(item),
    0
  );
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

    cartItems.forEach(item => {
      if (item.quantity <= 0) {
        errors.push(`${t('invalidQuantityFor')} ${item.name}`);
      }
    });

    if (finalTotal <= 0) {
      errors.push(t('invalidTotalPrice'));
    }

    // Validate order details based on order type
    if (orderType === 'hall' && !orderDetails.tableNumber) {
      errors.push(t('tableNumber') + ' ' + t('required'));
    }

    if (orderType === 'takeaway') {
      if (!orderDetails.customerName) {
        errors.push(t('customerName') + ' ' + t('required'));
      }
      if (!orderDetails.phoneNumber) {
        errors.push(t('phoneNumber') + ' ' + t('required'));
      }
    }

    if (orderType === 'delivery') {
      if (!orderDetails.customerName) {
        errors.push(t('customerName') + ' ' + t('required'));
      }
      if (!orderDetails.phoneNumber) {
        errors.push(t('phoneNumber') + ' ' + t('required'));
      }
      if (!orderDetails.deliveryAddress) {
        errors.push(t('deliveryAddress') + ' ' + t('required'));
      }
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

  // Generate table numbers for hall selection
  const tableNumbers = Array.from({ length: 20 }, (_, i) => i + 1);

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
          <div className="empty-cart-message">{t('cartEmptyMessage')}</div>
        )}

        {/* قائمة المنتجات */}
        {cartItems.length > 0 && (
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={100}
                    style={{ 
                      objectFit: 'contain',
                      objectPosition: 'center',
                      borderRadius: '10px',
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                  <div className="item-price">
                    {getItemTotalPrice(item).toFixed(2)} {t('currency')}
                    {item.quantity > 1 && (
                      <span className="unit-price">
                        ({((getItemTotalPrice(item) / item.quantity)).toFixed(2)} {t('currency')} {t('each')})
                      </span>
                    )}
                  </div>

                  {/* عرض الخيارات المحددة */}
                  {item.selectedSize && (
                    <div className="selected-options">
                      <span className="option-tag">
                        {item.selectedSize.name}
                      </span>
                    </div>
                  )}

                  {item.selectedAddons && item.selectedAddons.length > 0 && (
                    <div className="selected-options">
                      {item.selectedAddons.map((addon, index) => (
                        <span key={index} className="option-tag">
                          {addon.name} (x{addon.quantity || 1}){' '}
                          {addon.price > 0 ? `(+${(addon.price * (addon.quantity || 1)).toFixed(2)} SAR)` : '(Free)'}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Display Notes */}
                  {item.notes && item.notes.trim() && (
                    <div className="item-notes">
                      <span className="notes-label">{t('notes')}:</span>
                      <span className="notes-text">{item.notes}</span>
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
              onChange={e => setNotes(e.target.value)}
              className="notes-textarea"
              rows="3"
            />
          </div>
        </div>

        {/* قسم نوع الطلب */}
        <div className="order-type-section">
          <div className="section-divider"></div>
          <div className="order-type-group">
            <label className="order-type-label">{t('orderType')}</label>
            <div className="order-type-options">
              <button
                className={`order-type-btn ${orderType === 'hall' ? 'active' : ''}`}
                onClick={() => updateOrderType('hall')}
              >
                <span className="order-type-icon">🍽️</span>
                <span className="order-type-text">{t('hall')}</span>
              </button>
              <button
                className={`order-type-btn ${orderType === 'takeaway' ? 'active' : ''}`}
                onClick={() => updateOrderType('takeaway')}
              >
                <span className="order-type-icon">📦</span>
                <span className="order-type-text">{t('takeaway')}</span>
              </button>
              <button
                className={`order-type-btn ${orderType === 'delivery' ? 'active' : ''}`}
                onClick={() => updateOrderType('delivery')}
              >
                <span className="order-type-icon">🚚</span>
                <span className="order-type-text">{t('delivery')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* قسم تفاصيل الطلب */}
        {orderType && (
          <div className="order-details-section">
            <div className="section-divider"></div>
            <div className="order-details-group">
              <label className="order-details-label">{t('orderDetails')}</label>
              
              {/* تفاصيل الصالة */}
              {orderType === 'hall' && (
                <div className="order-details-content">
                  <div className="input-group">
                    <label className="input-label">{t('tableNumber')}</label>
                    <select
                      value={orderDetails.tableNumber}
                      onChange={(e) => updateOrderDetails('tableNumber', e.target.value)}
                      className="order-input"
                    >
                      <option value="">{t('selectTable')}</option>
                      {tableNumbers.map(num => (
                        <option key={num} value={num}>
                          {t('tableNumber')} {num}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* تفاصيل التيك أواي */}
              {orderType === 'takeaway' && (
                <div className="order-details-content">
                  <div className="input-group">
                    <label className="input-label">{t('customerName')}</label>
                    <input
                      type="text"
                      placeholder={t('enterCustomerName')}
                      value={orderDetails.customerName}
                      onChange={(e) => updateOrderDetails('customerName', e.target.value)}
                      className="order-input"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">{t('phoneNumber')}</label>
                    <PhoneInput
                      international
                      defaultCountry="EG"
                      placeholder={t('enterPhoneNumber')}
                      value={orderDetails.phoneNumber}
                      onChange={(value) => updateOrderDetails('phoneNumber', value)}
                      className="phone-input-component"
                    />
                  </div>
                </div>
              )}

              {/* تفاصيل التوصيل */}
              {orderType === 'delivery' && (
                <div className="order-details-content">
                  <div className="input-group">
                    <label className="input-label">{t('customerName')}</label>
                    <input
                      type="text"
                      placeholder={t('enterCustomerName')}
                      value={orderDetails.customerName}
                      onChange={(e) => updateOrderDetails('customerName', e.target.value)}
                      className="order-input"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">{t('phoneNumber')}</label>
                    <PhoneInput
                      international
                      defaultCountry="EG"
                      placeholder={t('enterPhoneNumber')}
                      value={orderDetails.phoneNumber}
                      onChange={(value) => updateOrderDetails('phoneNumber', value)}
                      className="phone-input-component"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">{t('deliveryAddress')}</label>
                    <textarea
                      placeholder={t('enterDeliveryAddress')}
                      value={orderDetails.deliveryAddress}
                      onChange={(e) => updateOrderDetails('deliveryAddress', e.target.value)}
                      className="order-input order-textarea"
                      rows="3"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* قسم الكوبون */}
        <div className="coupon-section">
          <div className="section-divider"></div>
          <div className="coupon-input-group">
            <input
              type="text"
              placeholder={t('couponCode')}
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
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
            <span>
              {subtotal.toFixed(2)} {t('currency')}
            </span>
          </div>
          <div className="summary-item discount">
            <span>{t('discount')}</span>
            <span>
              -{discount.toFixed(2)} {t('currency')}
            </span>
          </div>
          <div className="summary-item">
            <span>{t('serviceCharge')} (10%)</span>
            <span>
              +{serviceCharge.toFixed(2)} {t('currency')}
            </span>
          </div>
          <div className="summary-item">
            <span>{t('tax')} (14%)</span>
            <span>
              +{tax.toFixed(2)} {t('currency')}
            </span>
          </div>
          <div className="section-divider"></div>
          <div className="summary-item final-total">
            <span>{t('finalTotal')}</span>
            <span>
              {finalTotal.toFixed(2)} {t('currency')}
            </span>
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
