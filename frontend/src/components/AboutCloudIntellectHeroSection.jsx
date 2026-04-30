import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'
import AppLink from './AppLink'

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

function resolveBackgroundUrl(hero) {
  const raw = (
    hero.backgroundImage ||
    hero.bgImage ||
    hero.sideImage ||
    hero.heroImage ||
    ''
  ).trim()
  if (!raw) return ''
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  const path = raw.startsWith('/') ? raw : `/${raw}`
  return getImageUrl(path)
}

function AboutCloudIntellectHeroSection() {
  const { content } = usePageContentContext()
  const hero = content?.hero || {}

  const tag = hero.tag ?? 'SALESFORCE WORKFORCE PARTNER'
  const heading = hero.heading ?? 'Building Industry-Ready Salesforce Professionals'
  const headingAccent = (hero.headingAccent || '').trim()
  const description =
    hero.description ??
    'We combine Salesforce education with placement support to ensure you are job-ready.'
  const descriptionEmphasis = hero.descriptionEmphasis ?? ''

  const primaryText = hero.primaryButtonText ?? 'Explore Programs'
  const primaryHref = hero.primaryButtonHref ?? '/salesforce-developer'
  const secondaryText = hero.secondaryButtonText ?? 'Download Brochure'
  const secondaryHref = hero.secondaryButtonHref ?? '#brochure'

  const backgroundUrl = resolveBackgroundUrl(hero)

  return (
    <section
      className={`aci-hero-outer${backgroundUrl ? ' aci-hero-outer--has-photo' : ''}`}
      aria-label="About Cloud Intellect hero"
    >
      {backgroundUrl ? (
        <div
          className="aci-hero-photo"
          style={{ backgroundImage: `url(${encodeURI(backgroundUrl)})` }}
          aria-hidden
        />
      ) : null}
      <div className="aci-hero-base" aria-hidden />
      <div className="aci-hero-scrim" aria-hidden />
      <div className="aci-hero-inner">
        <div className="aci-hero-copy">
          <div className="aci-hero-tag">
            <span className="aci-hero-tag-dot" aria-hidden />
            <span>{tag}</span>
          </div>
          <h1 className="aci-hero-heading">
            {headingAccent ? (
              <>
                {heading}
                <br />
                <span className="aci-hero-heading-accent">{headingAccent}</span>
              </>
            ) : (
              heading
            )}
          </h1>
          <p className="aci-hero-description">
            {renderDescription(description, descriptionEmphasis)}
          </p>
          <div className="aci-hero-buttons">
            <AppLink href={primaryHref} className="aci-hero-btn aci-hero-btn-primary">
              {primaryText}
              <span aria-hidden>→</span>
            </AppLink>
            <AppLink href={secondaryHref} className="aci-hero-btn aci-hero-btn-secondary">
              {secondaryText}
              <span className="aci-hero-btn-download-icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 19h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutCloudIntellectHeroSection
