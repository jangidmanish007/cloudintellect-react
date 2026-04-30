import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'
import AppLink from './AppLink'

const DEFAULT_STATS = [
  { value: '5000+', label: 'Learners Trained' },
  { value: '1400+', label: 'Placed' },
  { value: '90%', label: 'Satisfaction' },
  { value: '100%', label: 'Compliance' },
]

function PlacementsHeroSection() {
  const { content } = usePageContentContext()
  const hero = content?.hero || {}
  const statsSection = content?.stats || content?.statistics || {}
  
  // Background image: admin value uses backend URL; fallback uses frontend public so it always shows
  const imagePath = (hero.backgroundImage || hero.bgImage || '').trim() || null
  const defaultFallbackPath = '/images/BG.webp' // from public/ – loads from same origin as the app
  const resolvedUrl =
    imagePath
      ? imagePath.startsWith('http://') || imagePath.startsWith('https://')
        ? imagePath
        : getImageUrl(imagePath)
      : ''
  const backgroundImageUrl = resolvedUrl || defaultFallbackPath
  const tag = hero.tag || hero.label || '100% PLACEMENT SUPPORT'
  const heading = hero.heading || hero.title || 'Our Students Work at Top Companies.'
  const description = hero.description || hero.subtitle || 'Meet our recent students now working in real Salesforce roles at leading companies.'
  const primaryButtonText = hero.primaryButtonText || hero.primaryBtnText || 'Explore Programs'
  const primaryButtonHref = hero.primaryButtonHref || hero.primaryBtnHref || '#programs'
  const secondaryButtonText = hero.secondaryButtonText || hero.secondaryBtnText || 'View Placements'
  const secondaryButtonHref = hero.secondaryButtonHref || hero.secondaryBtnHref || '#placements'

  // Get stats array from content or use defaults
  const stats = statsSection.stats && Array.isArray(statsSection.stats) && statsSection.stats.length > 0
    ? statsSection.stats
    : DEFAULT_STATS

  return (
    <section className="placements-hero-section">
      <div 
        className="placements-hero-background"
        style={{
          backgroundImage: backgroundImageUrl ? `url(${encodeURI(backgroundImageUrl)})` : undefined,
        }}
        aria-hidden="true"
      />
      <div className="placements-hero-overlay" />
      <div className="placements-hero-container">
        <div className="placements-hero-layout">
          <div className="placements-hero-content">
            <div className="placements-hero-tag">
              <span className="placements-hero-tag-dot" aria-hidden />
              <span>{tag}</span>
            </div>
            <h1 className="placements-hero-heading">
              {heading}
            </h1>
            <p className="placements-hero-description">
              {description}
            </p>
            <div className="placements-hero-buttons">
              <AppLink href={primaryButtonHref} className="placements-hero-btn placements-hero-btn-primary">
                {primaryButtonText}
                <span aria-hidden>→</span>
              </AppLink>
              <AppLink href={secondaryButtonHref} className="placements-hero-btn placements-hero-btn-secondary">
                {secondaryButtonText}
              </AppLink>
            </div>
          </div>
          <div className="placements-hero-stats">
            <div className="placements-hero-stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="placements-hero-stat-card">
                  <div className="placements-hero-stat-value">
                    {stat.value}
                  </div>
                  <div className="placements-hero-stat-caption">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PlacementsHeroSection
