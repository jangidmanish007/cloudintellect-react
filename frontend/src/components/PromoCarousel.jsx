import { useState, useEffect } from 'react';

const DEFAULT_IMAGES = [
  { src: '/images/Banner.webp', alt: 'Promo 1' },
  { src: '/images/Property 1=Variant2 (1).webp', alt: 'Promo 2' },
];

function PromoCarousel({ images = DEFAULT_IMAGES }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = images.length > 0 ? images : DEFAULT_IMAGES;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="promo-carousel-section">
      <div className="promo-carousel-wrapper">
        <div className="promo-slide-image-wrap">
          {slides.map((img, index) => (
            <img
              key={index}
              src={img.src}
              alt={img.alt || `Slide ${index + 1}`}
              className={`promo-slide-img ${index === currentIndex ? 'active' : ''}`}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>
        <div className="promo-dots" role="tablist" aria-label="Carousel slides">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Slide ${index + 1}`}
              className={`promo-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PromoCarousel;
