'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faHeart,
  faUtensils,
  faUsers,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar/Navbar';
import './AboutUs.css';

export default function AboutUs() {
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
      <div className="about-us-container">
        <div className="loading-placeholder">
          <div className="loading-spinner"></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="about-us-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <div className="about-us-content-wrapper">
        <div className="about-us-header">
          <button className="back-button" onClick={goBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="about-us-title">{t('aboutUs')}</h1>
        </div>

        <div className="about-us-content">
          <div className="hero-section">
            <div className="hero-icon">
              <FontAwesomeIcon icon={faHeart} />
            </div>
            <h2 className="hero-title">{t('welcomeToOurRestaurant')}</h2>
            <p className="hero-subtitle">{t('whereGreatFoodMeetsGoodVibes')}</p>
          </div>

          <div className="content-card">
            <div className="paragraph-section">
              <div className="paragraph-icon">
                <FontAwesomeIcon icon={faUtensils} />
              </div>
              <p className="about-paragraph">{t('aboutParagraph1')}</p>
            </div>

            <div className="paragraph-section">
              <div className="paragraph-icon">
                <FontAwesomeIcon icon={faStar} />
              </div>
              <p className="about-paragraph">{t('aboutParagraph2')}</p>
            </div>

            <div className="paragraph-section">
              <div className="paragraph-icon">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <p className="about-paragraph">{t('aboutParagraph3')}</p>
            </div>

            <div className="paragraph-section">
              <div className="paragraph-icon">
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <p className="about-paragraph">{t('aboutParagraph4')}</p>
            </div>
          </div>

          <div className="closing-message">
            <p className="closing-text">{t('seeYouSoon')}</p>
            <div className="closing-emojis">
              <span>🙌</span>
              <span>✨</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
