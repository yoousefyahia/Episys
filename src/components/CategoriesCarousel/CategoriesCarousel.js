'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './CategoriesCarousel.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUtensils,faBreadSlice,faCakeCandles,faMugHot,faBottleWater,
  faListUl} from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/contexts/LanguageContext';

const getCategories = (t) => [
  { label: t('allProducts'), icon: faListUl, value: t('allProducts') },
  { label: t('mainDishes'), icon: faUtensils, value: t('mainDishes') },
  { label: t('coldDrinks'), icon: faBottleWater, value: t('coldDrinks') },
  { label: t('hotDrinks'), icon: faMugHot, value: t('hotDrinks') },
  { label: t('pastries'), icon: faBreadSlice, value: t('pastries') },
  { label: t('desserts'), icon: faCakeCandles, value: t('desserts') },
];

export default function CategoriesCarousel({ onCategorySelect, selectedCategory }) {
  const { t, language } = useLanguage();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="categories-container">
        <div className="categories-header">
          <h2 className="categories-title">{t('productCategories')}</h2>
          <div className="categories-underline" />
        </div>
      </div>
    );
  }

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="categories-container">
      <div className="categories-header">
        <h2 className="categories-title">{t('productCategories')}</h2>
        <div className="categories-underline" />
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={12}
        grabCursor={true}
        slidesPerView="auto"
        className="categories-swiper"
        breakpoints={{
          320: { spaceBetween: 8 },
          480: { spaceBetween: 10 },
          768: { spaceBetween: 12 },
          1024: { spaceBetween: 16 },
          1440: { spaceBetween: 20 },
        }}
      >
        {getCategories(t).map((cat, idx) => (
          <SwiperSlide key={idx} className="category-slide">
            <div
              onClick={() => onCategorySelect && onCategorySelect(cat.value)}
              className={`category-card ${selectedCategory === cat.value ? 'category-card--active' : ''}`}
            >
              <div className="category-icon">
                <FontAwesomeIcon icon={cat.icon} />
              </div>
              <div className="category-label">{cat.label}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
