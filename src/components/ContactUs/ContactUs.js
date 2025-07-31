'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faMapMarkerAlt,
  faEnvelope,
  faPhone,
  faClock,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar/Navbar';
import './ContactUs.css';

export default function ContactUs() {
  const { t, language } = useLanguage();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const goBack = () => {
    window.history.back();
  };

  if (!isClient) {
    return (
      <div className="contact-us-container">
        <div className="loading-placeholder">
          <div className="loading-spinner"></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="contact-us-container"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Navbar />
      <div className="contact-us-content-wrapper">
        <div className="contact-us-header">
          <button className="back-button" onClick={goBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="contact-us-title">{t('contactUs')}</h1>
        </div>

        <div className="contact-us-content">
          <div className="hero-section">
            <div className="hero-icon">
              <FontAwesomeIcon icon={faPhone} />
            </div>
            <h2 className="hero-title">{t('getInTouch')}</h2>
            <p className="hero-subtitle">{t('weAreHereToHelp')}</p>
          </div>

          <div className="contact-card">
            <div className="contact-section">
              <div className="contact-icon">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
              <div className="contact-info">
                <h3 className="contact-label">{t('ourAddress')}</h3>
                <p className="contact-value">{t('restaurantAddress')}</p>
              </div>
            </div>

            <div className="contact-section">
              <div className="contact-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <div className="contact-info">
                <h3 className="contact-label">{t('ourEmail')}</h3>
                <p className="contact-value">
                  <a
                    href="mailto:mahmoud.hanafy.nu1.1+1@gmail.com"
                    className="contact-link"
                  >
                    mahmoud.hanafy.nu1.1+1@gmail.com
                  </a>
                </p>
              </div>
            </div>

            <div className="contact-section">
              <div className="contact-icon">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div className="contact-info">
                <h3 className="contact-label">{t('callUs')}</h3>
                <p className="contact-value">
                  <a href="tel:+201272268023" className="contact-link">
                    +20 127 226 8023
                  </a>
                </p>
              </div>
            </div>

            <div className="contact-section">
              <div className="contact-icon">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div className="contact-info">
                <h3 className="contact-label">{t('workingHours')}</h3>
                <p className="contact-value">{t('dailyHours')}</p>
              </div>
            </div>

            <div className="contact-section">
              <div className="contact-icon">
                <FontAwesomeIcon icon={faGlobe} />
              </div>
              <div className="contact-info">
                <h3 className="contact-label">{t('website')}</h3>
                <p className="contact-value">
                  <a
                    href="https://episys.com"
                    className="contact-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.episys.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="closing-message">
            <p className="closing-text">{t('weLookForwardToHearingFromYou')}</p>
            <div className="closing-emojis">
              <span>📞</span>
              <span>💬</span>
              <span>📧</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
