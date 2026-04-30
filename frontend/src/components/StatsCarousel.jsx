import { useEffect } from 'react'
import CompanyLogo from './CompanyLogo'

function StatsCarousel({ slides, currentSlide, onSlideChange, isAutoPlay, setIsAutoPlay }) {

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      onSlideChange((prev) => (prev + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlay, slides.length, onSlideChange])

  const nextSlide = () => {
    setIsAutoPlay(false)
    onSlideChange((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setIsAutoPlay(false)
    onSlideChange((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setIsAutoPlay(false)
        onSlideChange((prev) => (prev - 1 + slides.length) % slides.length)
      } else if (e.key === 'ArrowRight') {
        setIsAutoPlay(false)
        onSlideChange((prev) => (prev + 1) % slides.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [slides.length, setIsAutoPlay, onSlideChange])

  const currentSlideData = slides[currentSlide]

  return (
    <div className="stats-section">
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-name">
            <span className="name-bold">{currentSlideData.name}</span>
            {currentSlideData.lastName && ` ${currentSlideData.lastName}`}
          </div>
          <div className="stat-label">{currentSlideData.designation}</div>
        </div>

        <div className="divider"></div>

        <div className="stat-item">
          <div className="stat-value">
            <span className="value-bold">{currentSlideData.package}</span> LPA
          </div>
          <div className="stat-label">Package</div>
        </div>

        <div className="divider"></div>

        <div className="logo-container">
          <CompanyLogo logoName={currentSlideData.logo} />
        </div>
      </div>

      <div className="navigation-controls">
        <button className="nav-button prev" onClick={prevSlide} aria-label="Previous">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="white" fillOpacity="0.05"/>
            <path d="M15.4002 16.0008L19.3002 12.1008C19.4835 11.9174 19.5752 11.6841 19.5752 11.4008C19.5752 11.1174 19.4835 10.8841 19.3002 10.7008C19.1169 10.5174 18.8835 10.4258 18.6002 10.4258C18.3169 10.4258 18.0835 10.5174 17.9002 10.7008L13.3002 15.3008C13.2002 15.4008 13.1294 15.5091 13.0877 15.6258C13.046 15.7424 13.0252 15.8674 13.0252 16.0008C13.0252 16.1341 13.046 16.2591 13.0877 16.3758C13.1294 16.4924 13.2002 16.6008 13.3002 16.7008L17.9002 21.3008C18.0835 21.4841 18.3169 21.5758 18.6002 21.5758C18.8835 21.5758 19.1169 21.4841 19.3002 21.3008C19.4835 21.1174 19.5752 20.8841 19.5752 20.6008C19.5752 20.3174 19.4835 20.0841 19.3002 19.9008L15.4002 16.0008Z" fill="white"/>
          </svg>
        </button>
        <button className="nav-button next" onClick={nextSlide} aria-label="Next">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#009FFF"/>
            <path d="M16.5998 16.0008L12.6998 12.1008C12.5165 11.9174 12.4248 11.6841 12.4248 11.4008C12.4248 11.1174 12.5165 10.8841 12.6998 10.7008C12.8831 10.5174 13.1165 10.4258 13.3998 10.4258C13.6831 10.4258 13.9165 10.5174 14.0998 10.7008L18.6998 15.3008C18.7998 15.4008 18.8706 15.5091 18.9123 15.6258C18.954 15.7424 18.9748 15.8674 18.9748 16.0008C18.9748 16.1341 18.954 16.2591 18.9123 16.3758C18.8706 16.4924 18.7998 16.6008 18.6998 16.7008L14.0998 21.3008C13.9165 21.4841 13.6831 21.5758 13.3998 21.5758C13.1165 21.5758 12.8831 21.4841 12.6998 21.3008C12.5165 21.1174 12.4248 20.8841 12.4248 20.6008C12.4248 20.3174 12.5165 20.0841 12.6998 19.9008L16.5998 16.0008Z" fill="white"/>
          </svg>
        </button>
      </div>

      {/* <div className="carousel-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div> */}
    </div>
  )
}

export default StatsCarousel
