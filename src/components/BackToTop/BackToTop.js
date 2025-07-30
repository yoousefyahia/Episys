'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import './BackToTop.css';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate scroll progress (0 to 100)
      const progress = Math.min((scrollTop / (documentHeight - windowHeight)) * 100, 100);
      setScrollProgress(progress);
      
      // Show button when scrolled down 300px
      setIsVisible(scrollTop > 300);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial window width
    setWindowWidth(window.innerWidth);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  // Get responsive dimensions based on screen size
  const getResponsiveDimensions = () => {
    if (typeof window === 'undefined') return { size: 60, radius: 25, center: 30 };
    
    if (windowWidth <= 360) return { size: 40, radius: 16, center: 20 };
    if (windowWidth <= 480) return { size: 45, radius: 18, center: 22.5 };
    if (windowWidth <= 768) return { size: 50, radius: 20, center: 25 };
    if (windowWidth <= 1024) return { size: 55, radius: 22, center: 27.5 };
    return { size: 60, radius: 25, center: 30 };
  };

  const dimensions = getResponsiveDimensions();

  return (
    <div className="back-to-top-container">
      <button 
        className="back-to-top-button"
        onClick={scrollToTop}
        aria-label="العودة إلى أعلى الصفحة"
      >
        <svg className="progress-ring" width={dimensions.size} height={dimensions.size}>
          <circle
            className="progress-ring-circle-bg"
            stroke="#e0e0e0"
            strokeWidth="3"
            fill="transparent"
            r={dimensions.radius}
            cx={dimensions.center}
            cy={dimensions.center}
          />
          <circle
            className="progress-ring-circle"
            stroke="#3498db"
            strokeWidth="3"
            fill="transparent"
            r={dimensions.radius}
            cx={dimensions.center}
            cy={dimensions.center}
            style={{
              strokeDasharray: `${2 * Math.PI * dimensions.radius}`,
              strokeDashoffset: `${2 * Math.PI * dimensions.radius * (1 - scrollProgress / 100)}`,
              transform: 'rotate(-90deg)',
              transformOrigin: `${dimensions.center}px ${dimensions.center}px`
            }}
          />
        </svg>
        <FontAwesomeIcon 
          icon={faArrowUp} 
          className="back-to-top-icon"
        />
      </button>
    </div>
  );
} 