import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

const DEFAULT_LEFT_BULLETS = [
  'Multiple career paths (Admin, Developer, Consultant, SFMC)',
  'Long-term career growth and stability',
  'Strong demand in India & international markets',
]

const DEFAULT_RIGHT_BULLETS = [
  'Actively working on real projects',
  'Strong market understanding',
  'Deep knowledge of best practices',
]

function resolveUrl(path) {
  const p = (path || '').trim()
  if (!p) return ''
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  return getImageUrl(p.startsWith('/') ? p : `/${p}`)
}

function IconFallback() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M7 18h10.5a3.5 3.5 0 003.3-4.7A4.5 4.5 0 0014 8.7 6 6 0 004.5 17"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Bullet({ children, variant }) {
  return (
    <li className={`wsm-bullet wsm-bullet--${variant}`}>
      <span className={`wsm-bullet-dot wsm-bullet-dot--${variant}`} aria-hidden />
      <span>{children}</span>
    </li>
  )
}

function WhySalesforceMentorsSection() {
  const { content } = usePageContentContext()
  const d = content?.whySalesforceMentors || {}

  const left = d.leftCard || {}
  const right = d.rightCard || {}

  const sectionBg = d.backgroundColor || '#fbf5ef'

  const leftIconUrl = resolveUrl(left.icon)
  const leftTitle = left.title ?? 'Why Salesforce?'
  const leftDescription =
    left.description ??
    "Salesforce is the world's leading CRM platform with strong global demand. We focus exclusively on Salesforce because it offers:"
  const leftBullets = Array.isArray(left.bullets) && left.bullets.length > 0 ? left.bullets : DEFAULT_LEFT_BULLETS
  const leftNote = left.note ?? 'Our training is aligned strictly with real Salesforce job roles, not generic IT learning.'

  const rightIconUrl = resolveUrl(right.icon)
  const rightTitle = right.title ?? 'Industry-Experienced Mentors'
  const rightDescription =
    right.description ??
    'Our mentors are experienced, working professionals, not just trainers.'
  const rightBullets = Array.isArray(right.bullets) && right.bullets.length > 0 ? right.bullets : DEFAULT_RIGHT_BULLETS

  return (
    <section className="wsm-section" style={{ background: sectionBg }} aria-label="Why Salesforce and mentors">
      <div className="wsm-container">
        <article className="wsm-card wsm-card--light">
          <div className="wsm-card-icon">
            {leftIconUrl ? (
              <img className="wsm-card-icon-img" src={leftIconUrl} alt="" decoding="async" />
            ) : (
              <IconFallback />
            )}
          </div>
          <h3 className="wsm-card-title">{leftTitle}</h3>
          <p className="wsm-card-desc">{leftDescription}</p>
          <ul className="wsm-list" aria-label="Why Salesforce points">
            {leftBullets
              .filter((x) => String(x).trim())
              .map((item) => (
                <Bullet key={item} variant="light">
                  {item}
                </Bullet>
              ))}
          </ul>
          {leftNote ? <p className="wsm-card-note">{leftNote}</p> : null}
        </article>

        <article className="wsm-card wsm-card--dark">
          <div className="wsm-card-icon wsm-card-icon--dark">
            {rightIconUrl ? (
              <img className="wsm-card-icon-img" src={rightIconUrl} alt="" decoding="async" />
            ) : (
              <IconFallback />
            )}
          </div>
          <h3 className="wsm-card-title wsm-card-title--dark">{rightTitle}</h3>
          <p className="wsm-card-desc wsm-card-desc--dark">{rightDescription}</p>
          <ul className="wsm-list" aria-label="Mentor highlights">
            {rightBullets
              .filter((x) => String(x).trim())
              .map((item) => (
                <Bullet key={item} variant="dark">
                  {item}
                </Bullet>
              ))}
          </ul>
        </article>
      </div>
    </section>
  )
}

export default WhySalesforceMentorsSection
