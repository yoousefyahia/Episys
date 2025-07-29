'use client';
import React, { useState, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import '../Carousel/Carousel.css';

function Carousel({ slides }) {
  const [current, setCurrent] = useState(0);
  const startX = useRef(null);
  const dragging = useRef(false);

  // سحب بالماوس أو التاتش
  const handleDragStart = (e) => {
    dragging.current = true;
    startX.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  };
  const handleDragMove = (e) => {
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

  const goTo = (idx) => setCurrent(idx);
  const prev = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const next = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  return (
    <div
      className="carousel tw-mx-4 tw-mt-16"
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      <button className="carousel__arrow left tw-bg-white tw-shadow-md tw-rounded-full tw-p-2 tw-ml-2 hover:tw-bg-pink-100" onClick={prev} aria-label="السابق">
        <ChevronLeftIcon className="tw-w-7 tw-h-7 tw-text-pink-400" />
      </button>
      <div className="carousel__slide">
        {slides.length > 0 && slides[current].image ? (
          <img
            src={slides[current].image}
            alt={slides[current].title || `slide-${current+1}`}
            className="carousel__img"
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="carousel__img carousel__img--placeholder"></div>
        )}
      </div>
      <button className="carousel__arrow right tw-bg-white tw-shadow-md tw-rounded-full tw-p-2 tw-mr-2 hover:tw-bg-pink-100" onClick={next} aria-label="التالي">
        <ChevronRightIcon className="tw-w-7 tw-h-7 tw-text-pink-400" />
      </button>
      <div className="carousel__indicators">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={"carousel__indicator" + (idx === current ? " active" : "")}
            onClick={() => goTo(idx)}
            aria-label={`اذهب للسلايد رقم ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel; 