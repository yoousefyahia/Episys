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
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="my-12 flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-red-500">{t('productCategories')}</h2>
          <div className="w-20 h-1 bg-red-500 mt-2 mx-auto rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="categories-carousel flex flex-col items-center justify-center">
      <div className="text-center categories-title">
        <h2 className="text-3xl font-bold text-red-500">{t('productCategories')}</h2>
        <div className="w-20 h-1 bg-red-500 mt-2 mx-auto rounded-full" />
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        grabCursor={true}
        slidesPerView={4}
        breakpoints={{
          0: { slidesPerView: 2.5, spaceBetween: 8 },
          360: { slidesPerView: 2.8, spaceBetween: 10 },
          480: { slidesPerView: 3.2, spaceBetween: 12 },
          768: { slidesPerView: 3.5, spaceBetween: 14 },
          1024: { slidesPerView: 4, spaceBetween: 16 },
        }}
        className="w-full max-w-6xl px-4"
      >
        {getCategories(t).map((cat, idx) => (
          <SwiperSlide key={idx} className="pb-4">
            <div
              onClick={() => onCategorySelect && onCategorySelect(cat.value)}
              className={`category-item flex flex-col items-center justify-center min-h-[160px] px-6 py-8 rounded-xl shadow-md bg-white transition-all duration-200 cursor-pointer
                ${selectedCategory === cat.value ? 'text-red-500 font-bold border-2 border-red-500' : 'text-gray-800 hover:text-red-500'}
              `}
            >
              <span className="text-4xl mb-4">
                <FontAwesomeIcon icon={cat.icon} />
              </span>
              <span className="text-center text-lg leading-snug">{cat.label}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
