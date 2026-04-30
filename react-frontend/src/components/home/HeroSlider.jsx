'use client';

import React, { useEffect, useCallback } from 'react';

export default function HeroSlider({ slides, currentSlide, onSlideChange }) {
  const next = useCallback(() => onSlideChange((p) => (p + 1) % slides.length), [slides.length, onSlideChange]);
  const prev = useCallback(
    () => onSlideChange((p) => (p - 1 + slides.length) % slides.length),
    [slides.length, onSlideChange],
  );

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const current = slides[currentSlide];

  return (
    <div className="stats-section">
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-name">
            <span className="name-bold">{current.name}</span>
            {current.lastName && ` ${current.lastName}`}
          </div>
          <div className="stat-label">{current.designation}</div>
        </div>

        <div className="divider" />

        <div className="stat-item">
          <div className="stat-value">
            <span className="value-bold">{current.package}</span> LPA
          </div>
          <div className="stat-label">Package</div>
        </div>

        <div className="divider" />

        <div className="logo-container">
          <span className="company-logo">{current.logo}</span>
        </div>
      </div>

      <div className="navigation-controls">
        <button className="nav-button prev" onClick={prev} aria-label="Previous slide">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="white" fillOpacity="0.05" />
            <path
              d="M15.4 16L19.3 12.1C19.483 11.917 19.575 11.684 19.575 11.4C19.575 11.117 19.483 10.884 19.3 10.7C19.117 10.517 18.883 10.426 18.6 10.426C18.317 10.426 18.083 10.517 17.9 10.7L13.3 15.3C13.2 15.4 13.129 15.509 13.088 15.626C13.046 15.742 13.025 15.867 13.025 16C13.025 16.134 13.046 16.259 13.088 16.376C13.129 16.492 13.2 16.6 13.3 16.7L17.9 21.3C18.083 21.484 18.317 21.576 18.6 21.576C18.883 21.576 19.117 21.484 19.3 21.3C19.483 21.117 19.575 20.884 19.575 20.6C19.575 20.317 19.483 20.084 19.3 19.9L15.4 16Z"
              fill="white"
            />
          </svg>
        </button>
        <button className="nav-button next" onClick={next} aria-label="Next slide">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#009FFF" />
            <path
              d="M16.6 16L12.7 12.1C12.517 11.917 12.425 11.684 12.425 11.4C12.425 11.117 12.517 10.884 12.7 10.7C12.883 10.517 13.117 10.426 13.4 10.426C13.683 10.426 13.917 10.517 14.1 10.7L18.7 15.3C18.8 15.4 18.871 15.509 18.912 15.626C18.954 15.742 18.975 15.867 18.975 16C18.975 16.134 18.954 16.259 18.912 16.376C18.871 16.492 18.8 16.6 18.7 16.7L14.1 21.3C13.917 21.484 13.683 21.576 13.4 21.576C13.117 21.576 12.883 21.484 12.7 21.3C12.517 21.117 12.425 20.884 12.425 20.6C12.425 20.317 12.517 20.084 12.7 19.9L16.6 16Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
