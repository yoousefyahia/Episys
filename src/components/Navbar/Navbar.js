'use client';

import React, { useState, useRef, useEffect } from "react";
import "../Navbar/Navbar.css";
import Image from "next/image";

const LOCATIONS = [
  { name: "Degla" },
  { name: "Nasr City" },
  { name: "Alexandria" },
];

function Navbar() {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0].name);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dropdownRef = useRef(null);
  const drawerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Close drawer when clicking outside (mobile menu)
  useEffect(() => {
    function handleDrawerClick(event) {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target) &&
        !event.target.classList.contains("navbar__hamburger")
      ) {
        setDrawerOpen(false);
      }
    }
    if (drawerOpen) {
      document.addEventListener("mousedown", handleDrawerClick);
    } else {
      document.removeEventListener("mousedown", handleDrawerClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleDrawerClick);
    };
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
            className={`navbar__location-btn${dropdownOpen ? " active" : ""}`}
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <span className="navbar__location-icon">📍</span>
            {selectedLocation}
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
                  onClick={() => {
                    setSelectedLocation(loc.name);
                    setDropdownOpen(false);
                  }}
                >
                  <span className="navbar__location-icon">📍</span>
                  {loc.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <ul className="navbar__links navbar__hide-mobile">
          <li>Home</li>
          <li>Book Table</li>
          <li>About Us</li>
          <li>Contact Us</li>
        </ul>
        <div className="navbar__actions navbar__hide-mobile">
          <select className="navbar__lang-select">
            <option>English</option>
            <option>Arabic</option>
          </select>
          <button className="navbar__call-waiter">
            <span className="navbar__bell">🔔</span> Call Waiter
          </button>
          <div className="navbar__cart">
            <span className="navbar__cart-icon">🛒</span>
            <span className="navbar__cart-badge">0</span>
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
                <span className="navbar__brand">DIPNROLL</span>
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
              <li>Home</li>
              <li>Book Table</li>
              <li>About Us</li>
              <li>Contact Us</li>
            </ul>
            <div className="navbar__drawer-location">
              <div className="navbar__location" style={{marginLeft:0}}>
                <button
                  className="navbar__location-btn"
                  onClick={() => setDropdownOpen((open) => !open)}
                >
                  <span className="navbar__location-icon">📍</span>
                  {selectedLocation}
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
                        onClick={() => {
                          setSelectedLocation(loc.name);
                          setDropdownOpen(false);
                        }}
                      >
                        <span className="navbar__location-icon">📍</span>
                        {loc.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <select className="navbar__drawer-lang-select">
              <option>English</option>
              <option>Arabic</option>
            </select>
            <button className="navbar__drawer-call-waiter">
              <span className="navbar__bell">🔔</span> Call Waiter
            </button>
            <div className="navbar__drawer-cart">
              <span className="navbar__cart-icon">🛒</span>
              <span className="navbar__cart-badge">0</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar; 