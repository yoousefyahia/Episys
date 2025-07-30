'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBell, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import Navbar from '@/components/Navbar/Navbar';
import './CallWaiter.css';

export default function CallWaiter() {
  const { t, language } = useLanguage();
  const { success } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const goBack = () => {
    window.history.back();
  };

  const handleTableSelect = (tableNumber) => {
    setSelectedTable(tableNumber);
  };

  const handleCallWaiter = async () => {
    if (!selectedTable) {
      return;
    }

    setIsCalling(true);
    
    // محاكاة استدعاء النادل
    setTimeout(() => {
      setIsCalling(false);
      success(t('waiterCalledSuccessfully'));
      setSelectedTable(null);
    }, 2000);
  };

  if (!isClient) {
    return (
      <div className="call-waiter-container">
        <div className="loading-placeholder">
          <div className="loading-spinner"></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // إنشاء مصفوفة الطاولات (1-20)
  const tables = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className="call-waiter-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <div className="call-waiter-content-wrapper">
        <div className="call-waiter-header">
          <button className="back-button" onClick={goBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="call-waiter-title">{t('callWaiter')}</h1>
        </div>

        <div className="call-waiter-content">
          <div className="hero-section">
            <div className="hero-icon">
              <FontAwesomeIcon icon={faBell} />
            </div>
            <h2 className="hero-title">{t('selectYourTable')}</h2>
            <p className="hero-subtitle">{t('chooseTableToCallWaiter')}</p>
          </div>

          <div className="tables-grid">
            {tables.map((tableNumber) => (
              <button
                key={tableNumber}
                className={`table-button ${selectedTable === tableNumber ? 'selected' : ''}`}
                onClick={() => handleTableSelect(tableNumber)}
              >
                <span className="table-number">{tableNumber}</span>
                {selectedTable === tableNumber && (
                  <div className="selected-indicator">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="call-action">
            <button
              className={`call-waiter-btn ${!selectedTable ? 'disabled' : ''} ${isCalling ? 'calling' : ''}`}
              onClick={handleCallWaiter}
              disabled={!selectedTable || isCalling}
            >
              {isCalling ? (
                <>
                  <div className="calling-spinner"></div>
                  <span>{t('callingWaiter')}</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faBell} />
                  <span>{t('callWaiter')}</span>
                </>
              )}
            </button>
          </div>

          {selectedTable && (
            <div className="selected-table-info">
              <p className="selected-table-text">
                {t('selectedTable')}: <span className="table-number-highlight">{selectedTable}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 