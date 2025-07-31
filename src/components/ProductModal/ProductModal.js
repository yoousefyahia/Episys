'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import './ProductModal.css';

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) {
  const { t, language } = useLanguage();
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  if (!isOpen || !product) return null;

  const handleSizeSelect = size => {
    setSelectedSize(size);
  };

  const handleAddonQuantityChange = (addon, change) => {
    setSelectedAddons(prev => {
      const existingAddon = prev.find(item => item.id === addon.id);
      
      if (existingAddon) {
        const newQuantity = existingAddon.quantity + change;
        if (newQuantity <= 0) {
          // Remove addon if quantity becomes 0
          return prev.filter(item => item.id !== addon.id);
        } else {
          // Update quantity
          return prev.map(item =>
            item.id === addon.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }
      } else if (change > 0) {
        // Add new addon with quantity 1
        return [...prev, { ...addon, quantity: 1 }];
      }
      
      return prev;
    });
  };

  const getAddonQuantity = (addonId) => {
    const addon = selectedAddons.find(item => item.id === addonId);
    return addon ? addon.quantity : 0;
  };

  const handleQuantityChange = change => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const calculateTotalPrice = () => {
    const basePrice = selectedSize?.price || product.price;
    const addonsPrice = selectedAddons.reduce(
      (sum, addon) => sum + ((addon.price || 0) * addon.quantity),
      0
    );
    return (basePrice + addonsPrice) * quantity;
  };

  const handleAddToCart = () => {
    const productWithOptions = {
      ...product,
      selectedSize,
      selectedAddons,
      quantity,
      notes: notes.trim(),
      totalPrice: calculateTotalPrice(),
    };

    onAddToCart(productWithOptions);
    onClose();

    // Reset state
    setSelectedSize(product?.sizes?.[0] || null);
    setSelectedAddons([]);
    setQuantity(1);
    setNotes('');
  };

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="product-info">
            <div className="product-image">
              <Image
                src={product.image}
                alt={product.name}
                width={60}
                height={60}
                style={{ 
                  objectFit: 'contain',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px'
                }}
              />
            </div>
            <div className="product-details">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-category">{product.category}</p>
              <p className="product-price">
                {selectedSize?.price || product.price} SAR
              </p>
            </div>
          </div>

          <div className="modal-controls">
            <div className="quantity-selector">
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span className="quantity-value">{quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <button className="close-btn" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        {/* Sizes Section */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="modal-section">
            <h4 className="section-title">{t('availableSizes')}</h4>
            <div className="sizes-grid">
              {product.sizes.map(size => (
                <button
                  key={size.id}
                  className={`size-btn ${selectedSize?.id === size.id ? 'selected' : ''}`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size.name} - {size.price} SAR
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add-ons Section */}
        {product.addons && product.addons.length > 0 && (
          <div className="modal-section">
            <h4 className="section-title">{t('orderAddons')}</h4>
            <div className="addons-grid">
              {product.addons.map(addon => {
                const addonQuantity = getAddonQuantity(addon.id);
                return (
                  <div key={addon.id} className="addon-item">
                    <div className="addon-info">
                      <span className="addon-name">{addon.name}</span>
                      <span className="addon-price">
                        {addon.price > 0 ? `+${addon.price} SAR` : t('free')}
                      </span>
                    </div>
                    <div className="addon-quantity-controls">
                      <button
                        className="addon-quantity-btn"
                        onClick={() => handleAddonQuantityChange(addon, -1)}
                        disabled={addonQuantity <= 0}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <span className="addon-quantity-value">{addonQuantity}</span>
                      <button
                        className="addon-quantity-btn"
                        onClick={() => handleAddonQuantityChange(addon, 1)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Notes Section */}
        <div className="modal-section">
          <h4 className="section-title">{t('specialNotes')}</h4>
          <div className="notes-input-container">
            <textarea
              className="notes-textarea"
              placeholder={t('addSpecialNotes')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              maxLength="200"
            />
            <div className="notes-character-count">
              {notes.length}/200
            </div>
          </div>
        </div>

        {/* Total and Add Button */}
        <div className="modal-footer">
          <div className="total-price">
            <span className="total-label">{t('total')}:</span>
            <span className="total-value">{calculateTotalPrice()} SAR</span>
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            {t('addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}
