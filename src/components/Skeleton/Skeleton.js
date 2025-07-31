'use client';

import React from 'react';
import './Skeleton.css';

export const ProductSkeleton = () => (
  <div className="product-skeleton">
    <div className="skeleton-image"></div>
    <div className="skeleton-content">
      <div className="skeleton-title"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-price"></div>
      <div className="skeleton-button"></div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 6 }) => (
  <div className="products-grid">
    {Array.from({ length: count }).map((_, index) => (
      <ProductSkeleton key={index} />
    ))}
  </div>
);

export const CartItemSkeleton = () => (
  <div className="cart-item-skeleton">
    <div className="skeleton-cart-image"></div>
    <div className="skeleton-cart-content">
      <div className="skeleton-cart-title"></div>
      <div className="skeleton-cart-text"></div>
      <div className="skeleton-cart-price"></div>
    </div>
  </div>
);

export const ModalSkeleton = () => (
  <div className="modal-skeleton">
    <div className="skeleton-modal-header">
      <div className="skeleton-modal-image"></div>
      <div className="skeleton-modal-info">
        <div className="skeleton-modal-title"></div>
        <div className="skeleton-modal-text"></div>
      </div>
    </div>
    <div className="skeleton-modal-content">
      <div className="skeleton-section"></div>
      <div className="skeleton-section"></div>
    </div>
  </div>
); 