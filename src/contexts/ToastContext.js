'use client';

import { createContext, useContext, useState } from 'react';
import Toast from '@/components/Toast/Toast';
import { useLanguage } from './LanguageContext';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const { language } = useLanguage();

  const showToast = (message, type = 'success', duration = 1000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };

    setToasts(prev => [...prev, newToast]);

    return id;
  };

  const removeToast = id => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message, duration) =>
    showToast(message, 'success', duration);
  const error = (message, duration) => showToast(message, 'error', duration);

  const value = {
    showToast,
    removeToast,
    success,
    error,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
            language={language}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
