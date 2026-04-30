import AppLink from './AppLink'
import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

const DEFAULT_BG = '/images/BG (7).webp'

function LeadershipHeroSection() {
  const { content } = usePageContentContext()
  const hero = content?.hero && typeof content.hero === 'object' ? content.hero : {}
  const tag = hero.tag ?? 'LEADERSHIP MESSAGE'
  const heading = hero.heading ?? 'Leadership at'
  const headingAccent = hero.headingAccent ?? 'Cloud Intellect'
  const description = hero.description ?? 'Vision-driven leadership backed by real industry experience.'
  const primaryText = hero.primaryButtonText ?? 'Explore Programs'
  const primaryHref = hero.primaryButtonHref ?? '#programs'
  const secondaryText = hero.secondaryButtonText ?? 'Download Brochure'
  const secondaryHref = hero.secondaryButtonHref ?? '#brochure'
  const bgPath = hero.backgroundImage || hero.bgImage || DEFAULT_BG
  const bgStyle = bgPath ? { backgroundImage: `url(${bgPath.startsWith('/') ? getImageUrl(bgPath) : getImageUrl('/' + bgPath)})` } : undefined

  return (
    <section className="leadership-hero-outer" style={bgStyle}>
      <div className="leadership-hero-container">
        <div className="leadership-hero-content">
          <div className="leadership-hero-tag">
            <span className="leadership-hero-tag-icon" aria-hidden />
            <span>{tag}</span>
          </div>
          <h1 className="leadership-hero-heading">
            {heading}<br />
            <span className="leadership-hero-heading-accent">{headingAccent}</span>
          </h1>
          <p className="leadership-hero-description">{description}</p>
          <div className="leadership-hero-buttons">
            <AppLink href={primaryHref} className="leadership-hero-btn leadership-hero-btn-primary">
              {primaryText}
              <span aria-hidden>→</span>
            </AppLink>
            <AppLink href={secondaryHref} className="leadership-hero-btn leadership-hero-btn-secondary">
              {secondaryText}
              <span aria-hidden>↓</span>
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LeadershipHeroSection
