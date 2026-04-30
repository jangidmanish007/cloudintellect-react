import { usePageContentContext } from '../contexts/PageContentContext'
import AppLink from './AppLink'

function SalesforceMarketingCloudHeroSection() {
  const { content } = usePageContentContext()
  const hero = content?.hero || {}
  return (
    <section className="salesforce-mc-hero-outer">
      <div className="salesforce-mc-hero-container">
        <div className="salesforce-mc-hero-content">
          <div className="salesforce-mc-hero-tag">
            <span className="salesforce-mc-hero-tag-icon" aria-hidden />
            <span>{hero.tag ?? 'SPECIALIZATION PROGRAM'}</span>
          </div>
          <h1 className="salesforce-mc-hero-heading">
            {hero.heading ?? 'Salesforce Marketing Cloud'}
          </h1>
          <p className="salesforce-mc-hero-description">
            {hero.description ?? 'Master automated marketing, customer journeys, and data-driven campaigns with our SFMC curriculum.'}
          </p>
          <div className="salesforce-mc-hero-buttons">
            <AppLink href={hero.primaryButtonHref ?? '#programs'} className="salesforce-mc-hero-btn salesforce-mc-hero-btn-primary">
              {hero.primaryButtonText ?? 'Explore Programs'}
              <span aria-hidden>→</span>
            </AppLink>
            <AppLink href={hero.secondaryButtonHref ?? '#brochure'} className="salesforce-mc-hero-btn salesforce-mc-hero-btn-secondary">
              {hero.secondaryButtonText ?? 'Download Brochure'}
              <span aria-hidden>↓</span>
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SalesforceMarketingCloudHeroSection
