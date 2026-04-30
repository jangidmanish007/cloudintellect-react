import { usePageContentContext } from '../contexts/PageContentContext'
import AppLink from './AppLink'

function WebinarsHeroSection() {
  const { content } = usePageContentContext()
  const hero = content?.hero || {}
  return (
    <section className="webinars-hero-outer">
      <div className="webinars-hero-bg" aria-hidden />
      <div className="webinars-hero-container">
        <div className="webinars-hero-content">
          <div className="webinars-hero-tag">
            <span className="webinars-hero-tag-dot" aria-hidden />
            <span>{hero.tag ?? 'LIVE SESSIONS'}</span>
          </div>
          <h1 className="webinars-hero-heading">
            {hero.heading ?? 'Live Sessions Salesforce Technical Webinars 2026'}
          </h1>
          <p className="webinars-hero-description">
            {hero.description ?? 'Join live sessions to learn Salesforce, choose your track, and start with confidence.'}
          </p>
          <div className="webinars-hero-buttons">
            <AppLink href={hero.primaryButtonHref ?? '#programs'} className="webinars-hero-btn webinars-hero-btn-primary">
              {hero.primaryButtonText ?? 'Explore Programs'}
              <span aria-hidden>→</span>
            </AppLink>
            <AppLink href={hero.secondaryButtonHref ?? '#placements'} className="webinars-hero-btn webinars-hero-btn-secondary">
              {hero.secondaryButtonText ?? 'View Placements'}
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WebinarsHeroSection
