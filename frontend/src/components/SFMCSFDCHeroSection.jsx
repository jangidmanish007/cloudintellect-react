import { usePageContentContext } from '../contexts/PageContentContext'
import AppLink from './AppLink'

function SFMCSFDCHeroSection() {
  const { content } = usePageContentContext()
  const hero = content?.hero || {}
  return (
    <section className="sfmc-sfdc-hero-outer">
      <div className="sfmc-sfdc-hero-bg" aria-hidden />
      <div className="sfmc-sfdc-hero-container">
        <div className="sfmc-sfdc-hero-content">
          <div className="sfmc-sfdc-hero-tag">
            <span className="sfmc-sfdc-hero-tag-dot" aria-hidden />
            <span>{hero.tag ?? 'PROGRAM OVERVIEW'}</span>
          </div>
          <h1 className="sfmc-sfdc-hero-heading">
            {hero.heading ?? 'Master the'}<br />
            <span className="sfmc-sfdc-hero-heading-accent">{hero.headingAccent ?? 'Salesforce Ecosystem'}</span>
          </h1>
          <p className="sfmc-sfdc-hero-description">
            {hero.description ?? 'Salesforce is a global cloud CRM for sales, marketing, and support. Cloud Intellect specializes in the two most critical career tracks.'}
          </p>
          <div className="sfmc-sfdc-hero-buttons">
            <AppLink href={hero.primaryButtonHref ?? '#programs'} className="sfmc-sfdc-hero-btn sfmc-sfdc-hero-btn-primary">
              {hero.primaryButtonText ?? 'Explore Programs'}
              <span aria-hidden>→</span>
            </AppLink>
            <AppLink href={hero.secondaryButtonHref ?? '#brochure'} className="sfmc-sfdc-hero-btn sfmc-sfdc-hero-btn-secondary">
              {hero.secondaryButtonText ?? 'Download Brochure'}
              <span className="sfmc-sfdc-hero-btn-icon" aria-hidden>↓</span>
            </AppLink>
          </div>
        </div>
        <div className="sfmc-sfdc-hero-visual" />
      </div>
    </section>
  )
}

export default SFMCSFDCHeroSection
