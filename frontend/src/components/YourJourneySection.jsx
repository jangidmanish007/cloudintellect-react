import { usePageContentContext } from '../contexts/PageContentContext'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../services/api'

const YOUR_JOURNEY_BASE = '/images/Your_Journey'

const DEFAULT_BENEFITS = [
  { text: 'The right learning path', icon: `${YOUR_JOURNEY_BASE}/psychology.svg` },
  { text: 'Practical exposure', icon: `${YOUR_JOURNEY_BASE}/sensor_occupied.svg` },
  { text: 'Honest guidance', icon: `${YOUR_JOURNEY_BASE}/airline_stops.svg` },
]

function getIconUrl(url) {
  if (!url) return ''
  const clean = `${url}`.trim().replace(/\/+/g, '/')
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean
  const path = clean.startsWith('/') ? clean : `/${clean}`
  const relative = path.replace(/^\/+/, '')
  if (relative.startsWith('images/')) return getImageUrl(path)
  try {
    const segments = path.split('/').map((s) => (s.indexOf('%') >= 0 || /[^\w\s.-]/i.test(s) ? encodeURIComponent(s) : s))
    return segments.join('/')
  } catch {
    return path
  }
}

function YourJourneySection() {
  const { content } = usePageContentContext()
  const section = content?.yourJourney || {}
  const heading = section.heading || section.title || 'Your Journey Can Start Here'
  const tagline = section.tagline || "You don't need a perfect background. You don't need years of experience."
  const benefits = Array.isArray(section.benefits) && section.benefits.length > 0
    ? section.benefits.filter((b) => b.text || b.icon)
    : DEFAULT_BENEFITS
  const conclusion = section.conclusion || "That's how these careers were built. Yours can be next."
  const primaryText = section.primaryButtonText || 'Explore Programs'
  const primaryHref = section.primaryButtonHref || '#programs'
  const secondaryText = section.secondaryButtonText || 'View Placements'
  const secondaryHref = section.secondaryButtonHref || '#placements'

  const isInternal = (href) => href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto') && !href.startsWith('tel')
  const toPath = (href) => (href && href.startsWith('/') ? href : `/${href || ''}`)

  return (
    <section className="your-journey-section">
      <div className="your-journey-container">
        <div className="your-journey-card">
          <h2 className="your-journey-heading">{heading}</h2>
          <p className="your-journey-tagline">{tagline}</p>

          <div className="your-journey-benefits">
            {benefits.map((benefit, i) => (
              <div key={i} className="your-journey-benefit">
                <div className="your-journey-benefit-icon-wrap">
                  <img
                    src={getIconUrl(benefit.icon)}
                    alt=""
                    className="your-journey-benefit-icon"
                    width={20}
                    height={20}
                    aria-hidden
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
                <span className="your-journey-benefit-text">{benefit.text}</span>
              </div>
            ))}
          </div>

          <p className="your-journey-conclusion">{conclusion}</p>

          <div className="your-journey-buttons">
            {isInternal(primaryHref) ? (
              <Link to={toPath(primaryHref)} className="your-journey-btn your-journey-btn-primary">
                {primaryText}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            ) : (
              <a href={primaryHref || '#programs'} className="your-journey-btn your-journey-btn-primary">
                {primaryText}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            )}
            {isInternal(secondaryHref) ? (
              <Link to={toPath(secondaryHref)} className="your-journey-btn your-journey-btn-secondary">
                {secondaryText}
              </Link>
            ) : (
              <a href={secondaryHref || '#placements'} className="your-journey-btn your-journey-btn-secondary">
                {secondaryText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default YourJourneySection
