import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'
import AppLink from './AppLink'

const DEFAULT_BG = '/images/BG.webp'

function renderDescription(text, emphasis) {
  const t = (text || '').trim()
  if (!t) return null
  const e = (emphasis || '').trim()
  if (!e) return t
  const i = t.indexOf(e)
  if (i < 0) return t
  return (
    <>
      {t.slice(0, i)}
      <strong>{e}</strong>
      {t.slice(i + e.length)}
    </>
  )
}

function BlogHeroSection() {
  const { content } = usePageContentContext()
  const hero = content?.hero || {}

  const imagePath = (hero.backgroundImage || hero.bgImage || '').trim()
  const resolvedUrl =
    imagePath
      ? imagePath.startsWith('http://') || imagePath.startsWith('https://')
        ? imagePath
        : getImageUrl(imagePath.startsWith('/') ? imagePath : `/${imagePath}`)
      : ''
  const backgroundImageUrl = resolvedUrl || DEFAULT_BG

  const tag = hero.tag ?? 'KNOWLEDGE HUB'
  const heading = hero.heading ?? 'Insights &'
  const headingAccent = hero.headingAccent ?? 'Updates'
  const description =
    hero.description ??
    'Stay ahead in the Salesforce ecosystem with our expert guides, industry trends, and career advice updated for 2025.'
  const descriptionEmphasis = hero.descriptionEmphasis ?? 'Salesforce ecosystem'

  const primaryButtonText = hero.primaryButtonText ?? 'Explore Programs'
  const primaryButtonHref = hero.primaryButtonHref ?? '/salesforce-developer'
  const secondaryButtonText = hero.secondaryButtonText ?? 'View Placements'
  const secondaryButtonHref = hero.secondaryButtonHref ?? '/placements'

  return (
    <section className="blog-hero-section" aria-label="Blog hero">
      <div
        className="blog-hero-background"
        style={{ backgroundImage: `url(${encodeURI(backgroundImageUrl)})` }}
        aria-hidden="true"
      />
      <div className="blog-hero-overlay" aria-hidden="true" />
      <div className="blog-hero-container">
        <div className="blog-hero-content">
          <div className="blog-hero-tag">
            <span className="blog-hero-tag-dot" aria-hidden />
            <span>{tag}</span>
          </div>
          <h1 className="blog-hero-heading">
            <span className="blog-hero-heading-line">{heading}</span>
            {headingAccent ? (
              <>
                <br />
                <span className="blog-hero-heading-line">{headingAccent}</span>
              </>
            ) : null}
          </h1>
          <p className="blog-hero-description">{renderDescription(description, descriptionEmphasis)}</p>
          <div className="blog-hero-buttons">
            <AppLink href={primaryButtonHref} className="blog-hero-btn blog-hero-btn-primary">
              {primaryButtonText}
              <span aria-hidden>→</span>
            </AppLink>
            <AppLink href={secondaryButtonHref} className="blog-hero-btn blog-hero-btn-secondary">
              {secondaryButtonText}
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BlogHeroSection
