import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'
import AppLink from './AppLink'

function TestimonialsHeroSection() {
  const { content } = usePageContentContext()
  const hero = content?.hero || {}
  
  // Default background image path
  const backgroundImage = hero.backgroundImage || hero.bgImage || '/images/BG (2).webp'
  const tag = hero.tag || hero.label || 'SPECIALIZATION PROGRAM'
  const heading = hero.heading || hero.title || 'Real Stories. Real Careers.'
  const description = hero.description || hero.subtitle || 'These are real students from Cloud Intellect who started from different backgrounds and built their careers in Salesforce.'
  const primaryButtonText = hero.primaryButtonText || hero.primaryBtnText || 'Explore Programs'
  const primaryButtonHref = hero.primaryButtonHref || hero.primaryBtnHref || '#programs'
  const secondaryButtonText = hero.secondaryButtonText || hero.secondaryBtnText || 'View Placements'
  const secondaryButtonHref = hero.secondaryButtonHref || hero.secondaryBtnHref || '#placements'

  // Get image URL - use getImageUrl for backend-uploaded images
  const imageUrl = backgroundImage.startsWith('/images/') || backgroundImage.includes('images/')
    ? getImageUrl(backgroundImage)
    : backgroundImage

  return (
    <section className="testimonials-hero-section">
      <div 
        className="testimonials-hero-background"
        style={{
          backgroundImage: `url(${encodeURI(imageUrl)})`,
        }}
        aria-hidden="true"
      />
      <div className="testimonials-hero-overlay" />
      <div className="testimonials-hero-container">
        <div className="testimonials-hero-content">
          <div className="testimonials-hero-tag">
            <span className="testimonials-hero-tag-dot" aria-hidden />
            <span>{tag}</span>
          </div>
          <h1 className="testimonials-hero-heading">
            {heading}
          </h1>
          <p className="testimonials-hero-description">
            {description}
          </p>
          <div className="testimonials-hero-buttons">
            <AppLink href={primaryButtonHref} className="testimonials-hero-btn testimonials-hero-btn-primary">
              {primaryButtonText}
              <span aria-hidden>→</span>
            </AppLink>
            <AppLink href={secondaryButtonHref} className="testimonials-hero-btn testimonials-hero-btn-secondary">
              {secondaryButtonText}
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsHeroSection
