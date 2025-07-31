'use client';

import { useState, useEffect } from 'react';
import Carousel from '@/components/Carousel/Carousel';
import Navbar from '@/components/Navbar/Navbar';
import CategoriesCarousel from '@/components/CategoriesCarousel/CategoriesCarousel';
import ProductsSection from '@/components/ProductsSection/ProductsSection';
import Footer from '@/components/Footer/Footer';
import BackToTop from '@/components/BackToTop/BackToTop';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import PWAInstallPrompt from '@/components/PWAInstallPrompt/PWAInstallPrompt';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setSelectedCategory(t('allProducts'));
    }
  }, [t, isClient]);

  const handleCategorySelect = category => {
    setSelectedCategory(category);
  };

  return (
    <ErrorBoundary>
      <div>
        <Navbar />
        <Carousel
          slides={[
            { image: '/images/Banner1.png', title: 'banner1' },
            { image: '/images/banner2.png', title: 'banner2' },
            { image: '/images/banner3.png', title: 'banner3' },
          ]}
        />
        <CategoriesCarousel
          onCategorySelect={handleCategorySelect}
          selectedCategory={isClient ? selectedCategory : 'All Products'}
        />
        <ProductsSection
          selectedCategory={isClient ? selectedCategory : 'All Products'}
        />
        <Footer />
        <BackToTop />
        <PWAInstallPrompt />
      </div>
    </ErrorBoundary>
  );
}
