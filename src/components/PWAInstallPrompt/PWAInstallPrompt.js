'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTimes, faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import './PWAInstallPrompt.css';

export default function PWAInstallPrompt() {
  const { t, language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if app was previously installed
    if (localStorage.getItem('pwa-installed') === 'true') {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed the prompt
    if (localStorage.getItem('pwa-prompt-dismissed') === 'true') {
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show prompt after 2 seconds if conditions are met
    const timer = setTimeout(() => {
      if (!isInstalled && !localStorage.getItem('pwa-prompt-dismissed')) {
        setShowInstallPrompt(true);
        
        // Auto hide after 5 seconds
        const autoHideTimer = setTimeout(() => {
          setShowInstallPrompt(false);
          localStorage.setItem('pwa-prompt-dismissed', 'true');
        }, 5000);
        
        return () => clearTimeout(autoHideTimer);
      }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    }
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showInstallPrompt || isInstalled) {
    return null;
  }

  return (
    <div 
      className="pwa-install-prompt"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="pwa-prompt-content">
        <div className="pwa-prompt-icon">
          <FontAwesomeIcon icon={faMobileAlt} />
        </div>
        <div className="pwa-prompt-text">
          <h3 className="pwa-prompt-title">
            {t('installApp')}
          </h3>
          <p className="pwa-prompt-description">
            {t('installAppDescription')}
          </p>
        </div>
        <div className="pwa-prompt-actions">
          <button 
            className="pwa-install-btn"
            onClick={handleInstallClick}
          >
            <FontAwesomeIcon icon={faDownload} />
            <span>{t('install')}</span>
          </button>
          <button 
            className="pwa-dismiss-btn"
            onClick={handleDismiss}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    </div>
  );
} 