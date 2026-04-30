import { usePageContentContext } from '../contexts/PageContentContext'
import AppLink from './AppLink'

function SalesforceDeveloperHeroSection() {
  const { content } = usePageContentContext()
  const hero = content?.hero || {}
  return (
    <section className="salesforce-dev-hero-outer">
      <div className="salesforce-dev-hero-container">
        <div className="salesforce-dev-hero-content">
          <div className="salesforce-dev-hero-tag">
            <span className="salesforce-dev-hero-tag-icon" aria-hidden />
            <span>{hero.tag ?? 'SPECIALIZATION PROGRAM'}</span>
          </div>
          <h1 className="salesforce-dev-hero-heading">
            {hero.heading ?? 'Salesforce Developer Cloud'}
          </h1>
          <p className="salesforce-dev-hero-description">
            {hero.description ?? 'Master the Salesforce ecosystem from basics to advanced development and deployment.'}
          </p>
          <div className="salesforce-dev-hero-buttons">
            <AppLink href={hero.primaryButtonHref ?? '#programs'} className="salesforce-dev-hero-btn salesforce-dev-hero-btn-primary">
              {hero.primaryButtonText ?? 'Explore Programs'}
              <span aria-hidden>→</span>
            </AppLink>
            <AppLink href={hero.secondaryButtonHref ?? '#brochure'} className="salesforce-dev-hero-btn salesforce-dev-hero-btn-secondary">
              {hero.secondaryButtonText ?? 'Download Brochure'}
              <span aria-hidden>↓</span>
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SalesforceDeveloperHeroSection
