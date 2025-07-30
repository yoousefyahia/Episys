'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Toast.css';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300); // وقت الانتقال
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return faCheckCircle;
      case 'error':
        return faExclamationCircle;
      default:
        return faCheckCircle;
    }
  };

  const getToastClass = () => {
    return `toast toast-${type} ${isVisible ? 'toast-show' : 'toast-hide'}`;
  };

  return (
    <div className={getToastClass()}>
      <div className="toast-content">
        <FontAwesomeIcon icon={getIcon()} className="toast-icon" />
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={() => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300);
      }}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

export default Toast; 