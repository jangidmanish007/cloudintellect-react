import { useLocation } from 'react-router-dom'
import { usePageContentContext } from '../contexts/PageContentContext'

const DEFAULT_PROFILE_IMAGE = '/images/Rectangle 2.webp'

function url(path) {
  return path ? encodeURI(path) : ''
}

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="leadership-profile-check-icon" aria-hidden>
    <circle cx="12" cy="12" r="10" fill="#009FFF" />
    <path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function BlockIcon({ src, className }) {
  if (!src) return <CheckIcon />
  const finalClass =
    className && className.trim().length
      ? className
      : 'leadership-profile-check-icon leadership-profile-check-icon--img'
  return <img src={url(src)} alt="" className={finalClass} aria-hidden />
}

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

function LeadershipEdgeSection() {
  const { pathname } = useLocation()
  const { content } = usePageContentContext()
  const d = content?.leadershipEdge || {}
  const isLeadershipPage = pathname === '/leadership'
  const theme = d.theme ?? (isLeadershipPage ? 'light' : 'dark')
  const title = d.title ?? (isLeadershipPage ? '' : 'The Cloud Intellect Edge')
  const label = d.label ?? 'LEADERSHIP MESSAGE'
  const quote = d.quote ?? 'Our aim is to create an environment where every learner builds real skills.'
  const quoteHighlight = d.quoteHighlight ?? 'real skills.'
  const defaultParas = isLeadershipPage
    ? [
        'Learning at Cloud Intellect is a transformative journey designed to turn potential into expertise.',
        'Cloud Intellect has been built with a clear vision to bridge the gap between learning and industry.',
        'We believe that the right guidance and leadership can shape the next generation of Salesforce professionals.',
        'Since our inception, we have earned the trust of learners and enterprises alike.',
        'With a future-oriented approach, we remain committed to excellence and innovation.',
      ]
    : [
        'Cloud Intellect was built with a clear goal to bridge the gap between learning and industry.',
        'Through Salesforce partnership and real consulting exposure, we focus on turning learners into confident, job-ready professionals.',
      ]
  const paras = Array.isArray(d.paras) && d.paras.length > 0 ? d.paras : defaultParas
  const stats = Array.isArray(d.stats) && d.stats.length > 0 ? d.stats : [
    { number: '14+', label: 'Years', detail: 'Salesforce Consulting & Architecture' },
    { number: '8+', label: 'Global Certifications', detail: 'Salesforce Ecosystem' },
  ]
  const ctaTitle = d.ctaTitle ?? 'Impact Highlights'
  const ctaSub = d.ctaSub ?? '5000+ Learners • 1400+ Placed'
  const ctaHref = d.ctaHref ?? '#impact-highlights'
  const profileName = d.profileName ?? 'Sumit Mahakalkar'
  const profileTitle = d.profileTitle ?? 'Director & Senior Salesforce Architect'
  const profileImage = d.profileImage ?? DEFAULT_PROFILE_IMAGE
  const linkedInUrl = d.linkedInUrl ?? ''
  const linkedInLabel = d.linkedInLabel ?? 'Connect on LinkedIn'
  const experienceValue = d.experienceValue ?? (stats[0] ? `${stats[0].number} ${(stats[0].label || '').trim()}`.trim() || '14+ Years' : '14+ Years')
  const experienceDetail = d.experienceDetail ?? (stats[0]?.detail ?? 'Salesforce Consulting & Architecture')
  const credentialsValue = d.credentialsValue ?? (stats[1] ? `${stats[1].number} ${(stats[1].label || '').trim()}`.trim() || '8+ Global Certifications' : '8+ Global Certifications')
  const credentialsDetail = d.credentialsDetail ?? (stats[1]?.detail ?? 'Salesforce Ecosystem')
  const blockIcon = d.blockIcon ?? ''
  const achievementsIcon = d.achievementsIcon ?? ''
  const defaultAchievements = [
    'Served as Technical Architect from client location for major enterprise accounts',
    'Successfully trained and mentored global teams (onshore & offshore)',
    'Built training frameworks used across multiple enterprise projects',
    'Delivered high-impact project solutions with measurable outcomes',
  ]
  const achievementsTitle = d.achievementsTitle ?? 'Key Achievements Director'
  const achievements = Array.isArray(d.achievements) && d.achievements.length > 0 ? d.achievements : defaultAchievements

  return (
    <section className={`leadership-edge-section ${theme === 'light' ? 'leadership-edge-section--light' : ''}`}>
      <div className="leadership-edge-inner">
        {title && <h2 className="leadership-edge-title">{title}</h2>}

        <div className="leadership-edge-grid">
          <div className="leadership-edge-left">
            <div className={`leadership-label ${theme === 'light' ? 'leadership-label--heading' : ''}`}>
              {theme !== 'light' && <span className="leadership-label-dot" aria-hidden />}
              <span>{label}</span>
            </div>
            <blockquote className="leadership-quote">
              &ldquo;{quoteHighlight && quote.trim().includes(quoteHighlight.trim()) ? (
                <>{quote.split(quoteHighlight)[0]}<strong className="leadership-quote-highlight">{quoteHighlight}</strong>{quote.split(quoteHighlight)[1] ?? ''}</>
              ) : (
                quote
              )}&rdquo;
              {quoteHighlight && !quote.trim().includes(quoteHighlight.trim()) && (
                <p className="leadership-quote-highlight-block">
                  <strong className="leadership-quote-highlight">{quoteHighlight}</strong>
                </p>
              )}
            </blockquote>
            {paras.map((p, i) => (
              <p key={i} className="leadership-para">{p}</p>
            ))}

            <div className="leadership-achievements-block">
              <h3 className="leadership-achievements-title">{achievementsTitle}</h3>
              <ul className="leadership-achievements-list">
                {achievements.filter(Boolean).map((item, i) => (
                  <li key={i} className="leadership-achievements-item">
                    <BlockIcon src={achievementsIcon || blockIcon} className="leadership-achievements-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {theme !== 'light' && (
              <>
                <div className="leadership-stats">
                  {stats.map((s, i) => (
                    <div key={i} className="leadership-stat-card">
                      <span className="leadership-stat-number">{s.number}</span>
                      <span className="leadership-stat-label">{s.label}</span>
                    </div>
                  ))}
                </div>
                <a href={ctaHref} className="leadership-impact-cta">
                  <div className="leadership-impact-text">
                    <span className="leadership-impact-title">{ctaTitle}</span>
                    <span className="leadership-impact-sub">{ctaSub}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M21.333 9.33325H29.333V17.3333" stroke="white" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M29.3337 9.33325L18.0003 20.6666L11.3337 13.9999L2.66699 22.6666" stroke="white" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </>
            )}
          </div>

          <div className="leadership-edge-right">
            <div className="leadership-profile-card">
              <div
                className="leadership-profile-image-wrap"
                style={{ backgroundImage: `url(${url(profileImage)})` }}
                role="img"
                aria-label={profileName}
              >
                <div className="leadership-profile-overlay">
                  <h3 className="leadership-profile-name">{profileName}</h3>
                  <p className="leadership-profile-title">{profileTitle}</p>
                </div>
              </div>
              <div className="leadership-profile-body">
                <div className="leadership-profile-block">
                  <BlockIcon src={blockIcon} />
                  <div className='iconBoxBelowProfile'>
                    <div className="leadership-profile-block-label">EXPERIENCE</div>
                    <div className="leadership-profile-block-value">{experienceValue}</div>
                    <div className="leadership-profile-block-detail">{experienceDetail}</div>
                  </div>
                </div>
                <div className="leadership-profile-block">
                  <BlockIcon src={blockIcon} />
                  <div>
                    <div className="leadership-profile-block-label">CREDENTIALS</div>
                    <div className="leadership-profile-block-value">{credentialsValue}</div>
                    <div className="leadership-profile-block-detail">{credentialsDetail}</div>
                  </div>
                </div>
                {linkedInUrl && (
                  <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="leadership-profile-linkedin">
                    {/* <LinkedInIcon /> */}
                    <span>{linkedInLabel}</span>
                    <LinkedInIcon />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LeadershipEdgeSection
