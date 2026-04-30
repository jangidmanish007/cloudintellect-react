import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'
import AppLink from './AppLink'

function ContactHeroSection() {
  const { content } = usePageContentContext()
  const hero = content?.hero || {}
  
  // Default background image path
  const backgroundImage = hero.backgroundImage || hero.bgImage || '/images/BG (2).webp'
  const tag = hero.tag || hero.label || 'GET IN TOUCH'
  const heading = hero.heading || hero.title || 'Start Your Journey With Cloud Intellect'
  const description = hero.description || hero.subtitle || 'Whether you have questions about our courses, placements, or just want to say hello, we\'re here to help you navigate your Salesforce career.'
  const primaryButtonText = hero.primaryButtonText || hero.primaryBtnText || 'Explore Programs'
  const primaryButtonHref = hero.primaryButtonHref || hero.primaryBtnHref || '#programs'
  const secondaryButtonText = hero.secondaryButtonText || hero.secondaryBtnText || 'View Placements'
  const secondaryButtonHref = hero.secondaryButtonHref || hero.secondaryBtnHref || '#placements'

  // Get image URL - use getImageUrl for backend-uploaded images
  const imageUrl = backgroundImage.startsWith('/images/') || backgroundImage.includes('images/')
    ? getImageUrl(backgroundImage)
    : backgroundImage

  return (
    <section className="contact-hero-section">
      <div 
        className="contact-hero-background"
        style={{
          backgroundImage: `url(${encodeURI(imageUrl)})`,
        }}
        aria-hidden="true"
      />
      <div className="contact-hero-overlay" />
      <div className="contact-hero-container">
        <div className="contact-hero-content">
          <div className="contact-hero-tag">
            <span className="contact-hero-tag-dot" aria-hidden />
            <span>{tag}</span>
          </div>
          <h1 className="contact-hero-heading">
            {heading}
          </h1>
          <p className="contact-hero-description">
            {description}
          </p>
          <div className="contact-hero-buttons">
            <AppLink href={primaryButtonHref} className="contact-hero-btn contact-hero-btn-primary">
              {primaryButtonText}
              <span aria-hidden>→</span>
            </AppLink>
            <AppLink href={secondaryButtonHref} className="contact-hero-btn contact-hero-btn-secondary">
              {secondaryButtonText}
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactHeroSection
