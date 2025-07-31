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
  onAddToCart 
}) {
  const { t, language } = useLanguage();
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddonToggle = (addon) => {
    setSelectedAddons(prev => 
      prev.find(item => item.id === addon.id)
        ? prev.filter(item => item.id !== addon.id)
        : [...prev, addon]
    );
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const calculateTotalPrice = () => {
    const basePrice = selectedSize?.price || product.price;
    const addonsPrice = selectedAddons.reduce((sum, addon) => sum + (addon.price || 0), 0);
    return (basePrice + addonsPrice) * quantity;
  };

  const handleAddToCart = () => {
    const productWithOptions = {
      ...product,
      selectedSize,
      selectedAddons,
      quantity,
      totalPrice: calculateTotalPrice()
    };
    
    onAddToCart(productWithOptions);
    onClose();
    
    // Reset state
    setSelectedSize(product?.sizes?.[0] || null);
    setSelectedAddons([]);
    setQuantity(1);
  };

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
                     <div className="product-info">
                         <div className="product-image">
              <Image 
                src={product.image} 
                alt={product.name}
                width={60}
                height={60}
                style={{ objectFit: 'cover' }}
              />
            </div>
             <div className="product-details">
               <h3 className="product-name">{product.name}</h3>
               <p className="product-category">{product.category}</p>
               <p className="product-price">{selectedSize?.price || product.price} SAR</p>
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
              {product.sizes.map((size) => (
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
              {product.addons.map((addon) => (
                <label key={addon.id} className="addon-item">
                  <input
                    type="checkbox"
                    checked={selectedAddons.some(item => item.id === addon.id)}
                    onChange={() => handleAddonToggle(addon)}
                  />
                  <span className="addon-text">
                    {addon.name} {addon.price > 0 ? `(+${addon.price} SAR)` : '(Free)'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

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