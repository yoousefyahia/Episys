'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orderType, setOrderType] = useState('hall'); // Default to hall
  const [orderDetails, setOrderDetails] = useState({
    // Hall details
    tableNumber: '',
    
    // Takeaway details
    customerName: '',
    phoneNumber: '',
    
    // Delivery details
    deliveryAddress: '',
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        // Silently handle localStorage error
      }
    }
    
    // Load order type from localStorage if available
    const savedOrderType = localStorage.getItem('orderType');
    if (savedOrderType) {
      setOrderType(savedOrderType);
    }

    // Load order details from localStorage if available
    const savedOrderDetails = localStorage.getItem('orderDetails');
    if (savedOrderDetails) {
      try {
        setOrderDetails(JSON.parse(savedOrderDetails));
      } catch (error) {
        // Silently handle localStorage error
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isClient]);

  // Save order type to localStorage whenever it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('orderType', orderType);
    }
  }, [orderType, isClient]);

  // Save order details to localStorage whenever it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    }
  }, [orderDetails, isClient]);

  // Generate unique ID for cart items with different options
  const generateCartItemId = (product) => {
    const sizeId = product.selectedSize?.id || 'default';
    const addonsIds = product.selectedAddons?.map(addon => `${addon.id}:${addon.quantity || 1}`).sort().join(',') || 'none';
    const notesHash = product.notes ? btoa(unescape(encodeURIComponent(product.notes))).slice(0, 8) : 'none';
    return `${product.id}-${sizeId}-${addonsIds}-${notesHash}`;
  };

  const addToCart = product => {
    setCartItems(prev => {
      // Generate unique ID for this specific product configuration
      const cartItemId = generateCartItemId(product);
      
      const existingItem = prev.find(item => {
        const itemId = generateCartItemId(item);
        return itemId === cartItemId;
      });

      if (existingItem) {
        return prev.map(item => {
          const itemId = generateCartItemId(item);
          if (itemId === cartItemId) {
            return { 
              ...item, 
              quantity: item.quantity + (product.quantity || 1),
              totalPrice: (item.totalPrice || item.price * item.quantity) + (product.totalPrice || product.price * (product.quantity || 1))
            };
          }
          return item;
        });
      } else {
        return [...prev, { 
          ...product, 
          quantity: product.quantity || 1,
          totalPrice: product.totalPrice || product.price * (product.quantity || 1)
        }];
      }
    });
  };

  const removeFromCart = productId => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const removeFromCartById = (productId, selectedSize = null, selectedAddons = [], notes = '') => {
    setCartItems(prev => {
      return prev.filter(item => {
        const itemSizeId = item.selectedSize?.id || 'default';
        const itemAddonsIds = item.selectedAddons?.map(addon => `${addon.id}:${addon.quantity || 1}`).sort().join(',') || 'none';
        const itemNotesHash = item.notes ? btoa(unescape(encodeURIComponent(item.notes))).slice(0, 8) : 'none';
        
        const targetSizeId = selectedSize?.id || 'default';
        const targetAddonsIds = selectedAddons?.map(addon => `${addon.id}:${addon.quantity || 1}`).sort().join(',') || 'none';
        const targetNotesHash = notes ? btoa(unescape(encodeURIComponent(notes))).slice(0, 8) : 'none';
        
        return !(item.id === productId && itemSizeId === targetSizeId && itemAddonsIds === targetAddonsIds && itemNotesHash === targetNotesHash);
      });
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const basePrice = item.selectedSize?.price || item.price;
          const addonsPrice = item.selectedAddons?.reduce((sum, addon) => sum + (addon.price || 0), 0) || 0;
          const unitPrice = basePrice + addonsPrice;
          return { 
            ...item, 
            quantity: newQuantity,
            totalPrice: unitPrice * newQuantity
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateOrderType = (newOrderType) => {
    setOrderType(newOrderType);
  };

  const updateOrderDetails = (field, value) => {
    setOrderDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.totalPrice || item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const value = {
    cartItems,
    orderType,
    orderDetails,
    addToCart,
    removeFromCart,
    removeFromCartById,
    updateQuantity,
    clearCart,
    updateOrderType,
    updateOrderDetails,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
