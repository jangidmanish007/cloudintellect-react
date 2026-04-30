import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

const DEFAULT_IMAGE = '/images/career-culture.webp'

function url(path) {
  if (!path) return ''
  if (path.startsWith('/')) return getImageUrl(path)
  if (path.includes('images/')) return getImageUrl(path)
  return path
}

const DEFAULT_BULLETS = [
  'Fast-learning, execution-focused environment',
  'Direct exposure to real industry projects',
  'Open communication with leadership',
  'Skill growth + career growth together',
  'Performance-driven recognition',
  'Transparent dialogue with management',
]

function CheckIcon({ iconUrl }) {
  if (iconUrl) {
    return (
      <span className="career-culture-check" aria-hidden>
        <img src={iconUrl} alt="" className="career-culture-check-icon" />
      </span>
    )
  }
  return (
    <span className="career-culture-check" aria-hidden>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="9" r="8" fill="#0F172A" />
        <path d="M5 9.25L7.25 11.5L13 6.5" stroke="#38BDF8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

function CareerCultureSection() {
  const { content } = usePageContentContext()
  const d = content?.culture || {}
  const heading = d.heading ?? 'A Team That Grows Together'
  const description =
    d.description ??
    'We believe that a strong culture is the foundation of great work. At Cloud Intellect, we nurture an environment that rewards initiative and fosters continuous learning.'
  const panelTitle = d.panelTitle ?? 'Our Culture'
  const bullets = Array.isArray(d.bullets) && d.bullets.length > 0 ? d.bullets : DEFAULT_BULLETS
  const bulletIconPath = d.bulletIcon || ''
  const bulletIconUrl = bulletIconPath ? url(bulletIconPath) : ''
  const imagePath = d.image || DEFAULT_IMAGE
  const imageUrl = url(imagePath)

  return (
    <section className="career-culture-section">
      <div className="career-culture-inner">
        <div className="career-culture-card">
          <div className="career-culture-left">
            <h2 className="career-culture-heading">{heading}</h2>
            <p className="career-culture-description">{description}</p>
            <div className="career-culture-panel">
              <h3 className="career-culture-panel-title">{panelTitle}</h3>
              <ul className="career-culture-list">
                {bullets.filter(Boolean).map((item, i) => (
                  <li key={i} className="career-culture-list-item">
                    <CheckIcon iconUrl={bulletIconUrl} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="career-culture-right">
            <div className="career-culture-image-wrap">
              {imageUrl && <div className="career-culture-image" style={{ backgroundImage: `url(${imageUrl})` }} aria-hidden />}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CareerCultureSection

