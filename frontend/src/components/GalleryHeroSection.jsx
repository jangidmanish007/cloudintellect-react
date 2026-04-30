import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'
import AppLink from './AppLink'

function GalleryHeroSection() {
  const { content } = usePageContentContext()
  const hero = content?.hero || {}
  
  // Default background image path
  const backgroundImage = hero.backgroundImage || hero.bgImage || '/images/BG (2).webp'
  const tag = hero.tag || hero.label || 'GLIMPSE OF OUR CAMPUS'
  const heading = hero.heading || hero.title || 'Life at Cloud Intellect'
  const description = hero.description || hero.subtitle || 'A glimpse into our vibrant learning ecosystem. From intense classroom sessions to celebratory moments, see what makes our community special.'
  const primaryButtonText = hero.primaryButtonText || hero.primaryBtnText || 'Explore Programs'
  const primaryButtonHref = hero.primaryButtonHref || hero.primaryBtnHref || '#programs'
  const secondaryButtonText = hero.secondaryButtonText || hero.secondaryBtnText || 'View Placements'
  const secondaryButtonHref = hero.secondaryButtonHref || hero.secondaryBtnHref || '#placements'

  // Get image URL - use getImageUrl for backend-uploaded images
  const imageUrl = backgroundImage.startsWith('/images/') || backgroundImage.includes('images/')
    ? getImageUrl(backgroundImage)
    : backgroundImage

  return (
    <section className="gallery-hero-section">
      <div 
        className="gallery-hero-background"
        style={{
          backgroundImage: `url(${encodeURI(imageUrl)})`,
        }}
        aria-hidden="true"
      />
      <div className="gallery-hero-overlay" />
      <div className="gallery-hero-container">
        <div className="gallery-hero-content">
          <div className="gallery-hero-tag">
            <span className="gallery-hero-tag-dot" aria-hidden />
            <span>{tag}</span>
          </div>
          <h1 className="gallery-hero-heading">
            {heading}
          </h1>
          <p className="gallery-hero-description">
            {description}
          </p>
          <div className="gallery-hero-buttons">
            <AppLink href={primaryButtonHref} className="gallery-hero-btn gallery-hero-btn-primary">
              {primaryButtonText}
              <span aria-hidden>→</span>
            </AppLink>
            <AppLink href={secondaryButtonHref} className="gallery-hero-btn gallery-hero-btn-secondary">
              {secondaryButtonText}
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GalleryHeroSection
