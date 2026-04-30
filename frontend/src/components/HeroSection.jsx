import { useState } from 'react'
import HeroContent from './HeroContent'
import StatsCarousel from './StatsCarousel'
import PersonImage from './PersonImage'
import ApplicationForm from './ApplicationForm'

function HeroSection({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  const currentSlideData = slides[currentSlide]

  return (
    <section className="hero-section">
      <div className="hero-background">
        <img 
          src="https://api.builder.io/api/v1/image/assets/TEMP/bc710c19b88f39b0dc5b4c0d9d86fec694bae53f?width=3840" 
          alt="Background" 
          className="bg-image"
        />
        <div className="bg-overlay"></div>
      </div>

      <div className="hero-container">
        <div className="hero-content">
          <HeroContent />
          <StatsCarousel 
            slides={slides} 
            currentSlide={currentSlide}
            onSlideChange={setCurrentSlide}
            isAutoPlay={isAutoPlay}
            setIsAutoPlay={setIsAutoPlay}
          />
        </div>
        <PersonImage 
          currentSlideData={currentSlideData} 
          currentSlide={currentSlide}
        />
        <ApplicationForm />
      </div>
    </section>
  )
}

export default HeroSection
