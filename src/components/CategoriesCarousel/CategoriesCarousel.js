'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './CategoriesCarousel.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUtensils,faBreadSlice,faCakeCandles,faMugHot,faBottleWater,
  faListUl,faPlus,faPenFancy,} from '@fortawesome/free-solid-svg-icons';

const categories = [
  { label: 'كل المنتجات', icon: faListUl, },
  { label: 'الأطباق الرئيسية', icon: faUtensils },
  { label: 'مخبوزات', icon: faBreadSlice },
  { label: 'حلويات', icon: faCakeCandles },
  { label: 'مشروبات باردة', icon: faBottleWater },
  { label: 'مشروبات ساخنة', icon: faMugHot },
  { label: 'إضافات', icon: faPlus },
  { label: 'طلب خاص', icon: faPenFancy },
];


export default function CategoriesCarousel() {
  return (
    <div dir="rtl" className="my-12 flex flex-col items-center justify-center">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-red-500">فئات المنتجات</h2>
        <div className="w-20 h-1 bg-red-500 mt-2 mx-auto rounded-full" />
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        grabCursor={true}
        slidesPerView={4}
        breakpoints={{
          0: { slidesPerView: 1.5 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="w-full max-w-6xl px-4"
      >
        {categories.map((cat, idx) => (
          <SwiperSlide key={idx} className="pb-4">
            <div
              className={`category-item flex flex-col items-center justify-center min-h-[160px] px-6 py-8 rounded-xl shadow-md bg-white transition-all duration-200
                ${cat.highlighted ? 'text-red-500 font-bold' : 'text-gray-800'}
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
