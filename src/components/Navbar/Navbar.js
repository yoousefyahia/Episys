'use client';

import React, { useState, useRef, useEffect, useCallback } from "react";
import "../Navbar/Navbar.css";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";

const LOCATIONS = [
  { name: "degla" },
  { name: "nasrCity" },
  { name: "alexandria" },
];

function Navbar() {
  const { language, changeLanguage, t } = useLanguage();
  const { getCartCount } = useCart();
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0].name);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const dropdownRef = useRef(null);
  const drawerRef = useRef(null);



  const goToHome = () => {
    window.location.href = '/';
  };

  const goToHomeAndCloseDrawer = () => {
    goToHome();
    setDrawerOpen(false);
  };

  const handleLocationChange = useCallback((newLocation) => {
    setSelectedLocation(newLocation);
    setDropdownOpen(false);
    setMobileDropdownOpen(false);
    setForceUpdate(prev => prev + 1);
  }, []);

  // Close dropdown and drawer when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Close desktop dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
      
      // Close mobile dropdown
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target) &&
        !event.target.classList.contains("navbar__hamburger")
      ) {
        setMobileDropdownOpen(false);
      }
      
      // Close drawer
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target) &&
        !event.target.classList.contains("navbar__hamburger")
      ) {
        setDrawerOpen(false);
      }
    }
    
    if (dropdownOpen || mobileDropdownOpen || drawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
        <div className="navbar__logo">
          <Image src="/logo.png" alt="Logo" width={40} height={40} style={{marginRight: 8}} />
          <span className="navbar__brand">EPISYS</span>
        </div>
        <div className="navbar__location navbar__hide-mobile" ref={dropdownRef}>
          <button
            key={`desktop-location-${selectedLocation}`}
            className={`navbar__location-btn${dropdownOpen ? " active" : ""}`}
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <span className="navbar__location-icon">📍</span>
            <span className="location-text">{t(selectedLocation)}</span>
            <span className="navbar__dropdown">▼</span>
          </button>
          {dropdownOpen && (
            <div className="navbar__location-dropdown">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.name}
                  className={`navbar__location-option${
                    selectedLocation === loc.name ? " selected" : ""
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
          <li onClick={goToHome} style={{ cursor: 'pointer' }}>{t('home')}</li>
          <li onClick={() => window.location.href = '/book-table'} style={{ cursor: 'pointer' }}>{t('bookTable')}</li>
          <li onClick={() => window.location.href = '/about-us'} style={{ cursor: 'pointer' }}>{t('aboutUs')}</li>
          <li onClick={() => window.location.href = '/contact-us'} style={{ cursor: 'pointer' }}>{t('contactUs')}</li>
        </ul>
        <div className="navbar__actions navbar__hide-mobile">
          <select 
            className="navbar__lang-select"
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="en">{t('english')}</option>
            <option value="ar">{t('arabic')}</option>
          </select>
          <button className="navbar__call-waiter" onClick={() => window.location.href = '/call-waiter'}>
            <span className="navbar__bell">🔔</span> {t('callWaiter')}
          </button>
          <div className="navbar__cart" onClick={() => window.location.href = '/cart'}>
            <span className="navbar__cart-icon">🛒</span>
            <span className="navbar__cart-badge">{getCartCount()}</span>
          </div>
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
              <div className="navbar__logo">
                <Image src="/logo.png" alt="Logo" width={40} height={40} style={{marginRight: 8}} />
                <span className="navbar__brand">EPISYS</span>
              </div>
              <button
                className="navbar__drawer-close"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>
            <ul className="navbar__drawer-links">
              <li onClick={goToHomeAndCloseDrawer} style={{ cursor: 'pointer' }}>{t('home')}</li>
              <li onClick={() => {
                window.location.href = '/book-table';
                setDrawerOpen(false);
              }} style={{ cursor: 'pointer' }}>{t('bookTable')}</li>
              <li onClick={() => {
                window.location.href = '/call-waiter';
                setDrawerOpen(false);
              }} style={{ cursor: 'pointer' }}>{t('callWaiter')}</li>
              <li onClick={() => {
                window.location.href = '/about-us';
                setDrawerOpen(false);
              }} style={{ cursor: 'pointer' }}>{t('aboutUs')}</li>
              <li onClick={() => {
                window.location.href = '/contact-us';
                setDrawerOpen(false);
              }} style={{ cursor: 'pointer' }}>{t('contactUs')}</li>
            </ul>
            <div className="navbar__drawer-location">
              <div className="navbar__location" style={{marginLeft:0}}>
                <button
                  key={`mobile-location-${selectedLocation}-${forceUpdate}`}
                  className={`navbar__location-btn ${mobileDropdownOpen ? " active" : ""}`}
                  onClick={() => setMobileDropdownOpen((open) => !open)}
                >
                  <span className="navbar__location-icon">📍</span>
                  <span className="location-text">{t(selectedLocation)}</span>
                  <span className={`navbar__dropdown ${mobileDropdownOpen ? " rotated" : ""}`}>▼</span>
                </button>
                {mobileDropdownOpen && (
                  <div className="navbar__location-dropdown mobile-dropdown">
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc.name}
                        className={`navbar__location-option${
                          selectedLocation === loc.name ? " selected" : ""
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
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="en">{t('english')}</option>
              <option value="ar">{t('arabic')}</option>
            </select>
            <button className="navbar__drawer-call-waiter" onClick={() => {
              window.location.href = '/call-waiter';
              setDrawerOpen(false);
            }}>
              <span className="navbar__bell">🔔</span> {t('callWaiter')}
            </button>
            <div className="navbar__drawer-cart" onClick={() => window.location.href = '/cart'}>
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