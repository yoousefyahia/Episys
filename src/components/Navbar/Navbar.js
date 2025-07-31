'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../Navbar/Navbar.css';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LOCATIONS = [
  { name: 'degla' },
  { name: 'nasr City' },
  { name: 'alexandria' },
];

function Navbar() {
  const { language, changeLanguage, t } = useLanguage();
  const { getCartCount } = useCart();
  const pathname = usePathname();
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0].name);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const dropdownRef = useRef(null);
  const drawerRef = useRef(null);

  // Function to check if a link is active
  const isActive = path => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const goToHomeAndCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleLocationChange = useCallback(newLocation => {
    setSelectedLocation(newLocation);
    setDropdownOpen(false);
    setMobileDropdownOpen(false);
    setForceUpdate(prev => prev + 1);
  }, []);

  // Close dropdown and drawer when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Close desktop dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }

      // Close mobile dropdown
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target) &&
        !event.target.classList.contains('navbar__hamburger')
      ) {
        setMobileDropdownOpen(false);
      }

      // Close drawer
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target) &&
        !event.target.classList.contains('navbar__hamburger')
      ) {
        setDrawerOpen(false);
      }
    }

    if (dropdownOpen || mobileDropdownOpen || drawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen, mobileDropdownOpen, drawerOpen]);

  // Close mobile dropdown when drawer closes
  useEffect(() => {
    if (!drawerOpen) {
      setMobileDropdownOpen(false);
    }
  }, [drawerOpen]);

  return (
    <>
      <nav className="navbar">
        <Link href="/">
          <div className="navbar__logo">
            <Image
              src="/images/logo.jpg"
              alt="Logo"
              width={40}
              height={40}
              style={{ marginRight: 8 }}
            />
            <span className="navbar__brand">EPISYS</span>
          </div>
        </Link>
        <div className="navbar__location navbar__hide-mobile" ref={dropdownRef}>
          <button
            key={`desktop-location-${selectedLocation}`}
            className={`navbar__location-btn${dropdownOpen ? ' active' : ''}`}
            onClick={() => setDropdownOpen(open => !open)}
          >
            <span className="navbar__location-icon">📍</span>
            <span className="location-text">{t(selectedLocation)}</span>
            <span className="navbar__dropdown">▼</span>
          </button>
          {dropdownOpen && (
            <div className="navbar__location-dropdown">
              {LOCATIONS.map(loc => (
                <button
                  key={loc.name}
                  className={`navbar__location-option${
                    selectedLocation === loc.name ? ' selected' : ''
                  }`}
                  onClick={() => handleLocationChange(loc.name)}
                >
                  <span className="navbar__location-icon">📍</span>
                  {t(loc.name)}
                </button>
              ))}
            </div>
          )}
        </div>
        <ul className="navbar__links navbar__hide-mobile">
          <Link href="/">
            <li
              className={isActive('/') ? 'active' : ''}
              style={{ cursor: 'pointer' }}
            >
              {t('home')}
            </li>
          </Link>
          <Link href="/book-table">
            <li
              className={isActive('/book-table') ? 'active' : ''}
              style={{ cursor: 'pointer' }}
            >
              {t('bookTable')}
            </li>
          </Link>
          <Link href="/about-us">
            <li
              className={isActive('/about-us') ? 'active' : ''}
              style={{ cursor: 'pointer' }}
            >
              {t('aboutUs')}
            </li>
          </Link>
          <Link href="/contact-us">
            <li
              className={isActive('/contact-us') ? 'active' : ''}
              style={{ cursor: 'pointer' }}
            >
              {t('contactUs')}
            </li>
          </Link>
        </ul>
        <div className="navbar__actions navbar__hide-mobile">
          <select
            className="navbar__lang-select"
            value={language}
            onChange={e => changeLanguage(e.target.value)}
          >
            <option value="en">{t('english')}</option>
            <option value="ar">{t('arabic')}</option>
          </select>
          <Link href="/call-waiter">
            <button className="navbar__call-waiter">
              <span className="navbar__bell">🔔</span> {t('callWaiter')}
            </button>
          </Link>
          <Link href="/cart">
            <div className="navbar__cart">
              <span className="navbar__cart-icon">🛒</span>
              <span className="navbar__cart-badge">{getCartCount()}</span>
            </div>
          </Link>
        </div>
        {/* Hamburger icon for mobile */}
        <button
          className="navbar__hamburger navbar__show-mobile"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <span className="navbar__hamburger-icon">&#9776;</span>
        </button>
      </nav>
      {/* Drawer/Sidebar for mobile */}
      {drawerOpen && (
        <div className="navbar__drawer-overlay navbar__show-mobile">
          <div className="navbar__drawer" ref={drawerRef}>
            <div className="navbar__drawer-header">
              <Link href="/">
                <div className="navbar__logo">
                              <Image
              src="/images/logo.jpg"
              alt="Logo"
              width={40}
              height={40}
              style={{ marginRight: 8 }}
            />
                  <span className="navbar__brand">EPISYS</span>
                </div>
              </Link>
              <button
                className="navbar__drawer-close"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>
            <ul className="navbar__drawer-links">
              <Link href="/">
                <li
                  className={isActive('/') ? 'active' : ''}
                  onClick={goToHomeAndCloseDrawer}
                  style={{ cursor: 'pointer' }}
                >
                  {t('home')}
                </li>
              </Link>
              <Link href="/book-table">
                <li
                  className={isActive('/book-table') ? 'active' : ''}
                  onClick={() => setDrawerOpen(false)}
                  style={{ cursor: 'pointer' }}
                >
                  {t('bookTable')}
                </li>
              </Link>
              <Link href="/call-waiter">
                <li
                  className={isActive('/call-waiter') ? 'active' : ''}
                  onClick={() => setDrawerOpen(false)}
                  style={{ cursor: 'pointer' }}
                >
                  {t('callWaiter')}
                </li>
              </Link>
              <Link href="/about-us">
                <li
                  className={isActive('/about-us') ? 'active' : ''}
                  onClick={() => setDrawerOpen(false)}
                  style={{ cursor: 'pointer' }}
                >
                  {t('aboutUs')}
                </li>
              </Link>
              <Link href="/contact-us">
                <li
                  className={isActive('/contact-us') ? 'active' : ''}
                  onClick={() => setDrawerOpen(false)}
                  style={{ cursor: 'pointer' }}
                >
                  {t('contactUs')}
                </li>
              </Link>
            </ul>
            <div className="navbar__drawer-location">
              <div className="navbar__location" style={{ marginLeft: 0 }}>
                <button
                  key={`mobile-location-${selectedLocation}-${forceUpdate}`}
                  className={`navbar__location-btn ${mobileDropdownOpen ? ' active' : ''}`}
                  onClick={() => setMobileDropdownOpen(open => !open)}
                >
                  <span className="navbar__location-icon">📍</span>
                  <span className="location-text">{t(selectedLocation)}</span>
                  <span
                    className={`navbar__dropdown ${mobileDropdownOpen ? ' rotated' : ''}`}
                  >
                    ▼
                  </span>
                </button>
                {mobileDropdownOpen && (
                  <div className="navbar__location-dropdown mobile-dropdown">
                    {LOCATIONS.map(loc => (
                      <button
                        key={loc.name}
                        className={`navbar__location-option${
                          selectedLocation === loc.name ? ' selected' : ''
                        }`}
                        onClick={() => handleLocationChange(loc.name)}
                      >
                        <span className="navbar__location-icon">📍</span>
                        {t(loc.name)}
                        {selectedLocation === loc.name && (
                          <span className="selected-indicator">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <select
              className="navbar__drawer-lang-select"
              value={language}
              onChange={e => changeLanguage(e.target.value)}
            >
              <option value="en">{t('english')}</option>
              <option value="ar">{t('arabic')}</option>
            </select>
            <button
              className="navbar__drawer-call-waiter"
              onClick={() => {
                window.location.href = '/call-waiter';
                setDrawerOpen(false);
              }}
            >
              <span className="navbar__bell">🔔</span> {t('callWaiter')}
            </button>
            <div
              className="navbar__drawer-cart"
              onClick={() => (window.location.href = '/cart')}
            >
              <span className="navbar__cart-icon">🛒</span>
              <span className="navbar__cart-badge">{getCartCount()}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
