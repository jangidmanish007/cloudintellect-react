import { usePageContentContext } from '../contexts/PageContentContext'
import AppLink from './AppLink'

function WhyChooseUsHeroSection() {
  const { content } = usePageContentContext()
  const hero = content?.hero || {}
  return (
    <section className="why-choose-hero-outer">
      <div className="why-choose-hero-container">
        <div className="why-choose-hero-content">
          <div className="why-choose-hero-tag">
            <span className="why-choose-hero-tag-icon" aria-hidden />
            <span>{hero.tag ?? 'A COMPLETE SALESFORCE ECOSYSTEM'}</span>
          </div>
          <h1 className="why-choose-hero-heading">
            {hero.heading ?? 'Why Choose'}<br />
            <span className="why-choose-hero-heading-accent">{hero.headingAccent ?? 'Cloud Intellect'}</span>
          </h1>
          <p className="why-choose-hero-description">
            {hero.description ?? 'Cloud Intellect delivers hands-on Salesforce training with real career outcomes.'}
          </p>
          <div className="why-choose-hero-buttons">
            <AppLink href={hero.primaryButtonHref ?? '#programs'} className="why-choose-hero-btn why-choose-hero-btn-primary">
              {hero.primaryButtonText ?? 'Explore Programs'}
              <span aria-hidden>→</span>
            </AppLink>
            <AppLink href={hero.secondaryButtonHref ?? '#placements'} className="why-choose-hero-btn why-choose-hero-btn-secondary">
              {hero.secondaryButtonText ?? 'View Placements'}
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUsHeroSection
