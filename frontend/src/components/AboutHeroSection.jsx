import { usePageContentContext } from '../contexts/PageContentContext'
import AppLink from './AppLink'

const DEFAULT_STATS = [
  { value: '5000+', label: 'LEARNERS TRAINED' },
  { value: '1400+', label: 'PLACED' },
  { value: '90%', label: 'SATISFACTION' },
  { value: '100%', label: 'COMPLIANCE' },
]

function AboutHeroSection() {
  const { content } = usePageContentContext()
  const hero = content?.hero || {}
  const stats = hero.stats && Array.isArray(hero.stats) ? hero.stats : DEFAULT_STATS

  return (
    <section className="about-hero-outer">
      <div className="about-hero-container">
        <div className="about-hero-content">
          <div className="about-hero-left">
            <div className="about-hero-tag">
              <span className="about-hero-tag-icon" aria-hidden />
              <span>{hero.tag ?? 'SALESFORCE WORKFORCE DEVELOPMENT PARTNER'}</span>
            </div>
            <h1 className="about-hero-heading">
              {hero.heading ?? 'We Are'}<br />
              <span className="about-hero-heading-accent">{hero.headingAccent ?? 'Cloud Intellect.'}</span>
            </h1>
            <p className="about-hero-description">
              {hero.description ?? 'Enabling industry-ready careers through real skills and real projects.'}
            </p>
            <div className="about-hero-buttons">
              <AppLink href={hero.primaryButtonHref ?? '#programs'} className="about-hero-btn about-hero-btn-primary">
                {hero.primaryButtonText ?? 'Explore Programs'}
                <span aria-hidden>→</span>
              </AppLink>
              <AppLink href={hero.secondaryButtonHref ?? '#placements'} className="about-hero-btn about-hero-btn-secondary">
                {hero.secondaryButtonText ?? 'View Placements'}
              </AppLink>
            </div>
          </div>
          <div className="about-hero-right">
            <div className="about-hero-stats">
              {stats.map((stat, i) => (
                <div key={i} className="about-hero-stat-card">
                  <span className="about-hero-stat-value">{stat.value}</span>
                  <span className="about-hero-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutHeroSection
