import AppLink from './AppLink'
import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

const DEFAULT_IMAGE = '/images/career-hero.webp'

function url(path) {
  if (!path) return ''
  if (path.startsWith('/')) return getImageUrl(path)
  if (path.includes('images/')) return getImageUrl(path)
  return path
}

function CareerHeroSection() {
  const { content } = usePageContentContext()
  const hero = content?.hero && typeof content.hero === 'object' ? content.hero : {}
  const tag = hero.tag ?? 'LIVE SESSIONS'
  const headingLine1 = hero.headingLine1 ?? 'Elevate Your Career'
  const headingLine2 = hero.headingLine2 ?? 'and Empower Others'
  const description =
    hero.description ??
    'Join Cloud Intellect for impactful education and accelerate your tech career in the Salesforce world.'
  const primaryText = hero.primaryButtonText ?? 'View Open Positions'
  const primaryHref = hero.primaryButtonHref ?? '#open-positions'
  const secondaryText = hero.secondaryButtonText ?? 'Apply Now'
  const secondaryHref = hero.secondaryButtonHref ?? '#apply'
  const heroImage = hero.heroImage || DEFAULT_IMAGE
  const heroImageUrl = url(heroImage)
  const bgStyle = heroImageUrl
    ? {
        backgroundImage: `url(${heroImageUrl})`,
      }
    : undefined

  const handleHeroApplyClick = () => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('career-openings-apply', {
        detail: {
          source: 'career-hero',
          title: headingLine1 && headingLine2 ? `${headingLine1} ${headingLine2}` : 'General Application',
          identifier: 'career-hero-apply',
        },
      })
      window.dispatchEvent(event)
    }
    const target = document.getElementById('open-positions')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="career-hero-section" style={bgStyle}>
      <div className="career-hero-inner">
        <div className="career-hero-grid">
          <div className="career-hero-left">
            <div className="career-hero-tag">
              <span className="career-hero-tag-dot" aria-hidden />
              <span>{tag}</span>
            </div>
            <h1 className="career-hero-heading">
              {headingLine1}
              <br />
              {headingLine2}
            </h1>
            <p className="career-hero-description">{description}</p>
            <div className="career-hero-buttons">
              <AppLink href={primaryHref} className="career-hero-btn career-hero-btn-primary">
                {primaryText}
              </AppLink>
              <button
                type="button"
                className="career-hero-btn career-hero-btn-secondary"
                onClick={handleHeroApplyClick}
              >
                {secondaryText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CareerHeroSection

