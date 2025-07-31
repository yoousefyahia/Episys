'use client';
import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import '../Carousel/Carousel.css';

function Carousel({ slides }) {
  const [current, setCurrent] = useState(0);
  const startX = useRef(null);
  const dragging = useRef(false);

  // سحب بالماوس أو التاتش
  const handleDragStart = e => {
    dragging.current = true;
    startX.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  };
  const handleDragMove = e => {
    if (!dragging.current) return;
    const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    if (startX.current - x > 50) {
      next();
      dragging.current = false;
    } else if (x - startX.current > 50) {
      prev();
      dragging.current = false;
    }
  };
  const handleDragEnd = () => {
    dragging.current = false;
  };

  const goTo = idx => setCurrent(idx);
  const prev = () =>
    setCurrent(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  const next = () =>
    setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));

  return (
    <div
      className="carousel"
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      <button
        className="carousel__arrow left"
        onClick={prev}
        aria-label="السابق"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <div className="carousel__slide">
        {slides.length > 0 && slides[current].image ? (
          <Image
            src={slides[current].image}
            alt={slides[current].title || `slide-${current + 1}`}
            width={800}
            height={400}
            className="carousel__img"
            style={{ objectFit: 'cover' }}
            priority={current === 0} // إضافة priority للصورة الأولى (LCP)
            sizes="(max-width: 768px) 100vw, 800px"
          />
        ) : (
          <div className="carousel__img carousel__img--placeholder"></div>
        )}
      </div>
      <button
        className="carousel__arrow right"
        onClick={next}
        aria-label="التالي"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
      <div className="carousel__indicators">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={
              'carousel__indicator' + (idx === current ? ' active' : '')
            }
            onClick={() => goTo(idx)}
            aria-label={`اذهب للسلايد رقم ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
