import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

const DEFAULT_CARDS = () => [
  {
    headerColor: '#1a365d',
    icon: '',
    title: 'Cloud Intellect Academy',
    description:
      'Focused on Salesforce training, skill development, and career preparation. Recognized as an official Salesforce Workforce Development Partner.',
    bullets: [
      'Career-oriented training programs',
      'Practical learning on real Salesforce orgs',
      'Certification-aligned preparation',
    ],
  },
  {
    headerColor: '#009fff',
    icon: '',
    title: 'Cloud Intellect Systems',
    description:
      'A Salesforce Ridge Consulting Partner, actively working on real client projects across industries, providing real-world project exposure.',
    bullets: [
      'Salesforce CRM implementation',
      'Marketing automation solutions (SFMC)',
      'Real project workflows & use cases',
    ],
  },
]

function IconAcademy() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M4.5 10.5L12 7l7.5 3.5L12 14 4.5 10.5z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M4.5 10.5V16.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path
        d="M9 12.5v4c0 .5.3 1 .8 1.2l2.7 1.1M19.5 10.5V16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconCloud() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
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

function resolveIconUrl(path) {
  const p = (path || '').trim()
  if (!p) return ''
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  return getImageUrl(p.startsWith('/') ? p : `/${p}`)
}

function CloudIntellectAdvantageSection() {
  const { content } = usePageContentContext()
  const d = content?.cloudIntellectAdvantage || {}

  const headingLine1 = d.headingLine1 ?? 'The Cloud Intellect'
  const headingBold = d.headingBold ?? 'Advantage'

  const rawCards = Array.isArray(d.cards) && d.cards.length > 0 ? d.cards : DEFAULT_CARDS()
  let cards = rawCards.filter((c) => c && (c.title || c.description))
  if (cards.length === 0) cards = DEFAULT_CARDS()

  return (
    <section className="cia-advantage-section" aria-labelledby="cia-advantage-heading">
      <div className="cia-advantage-container">
        <h2 id="cia-advantage-heading" className="cia-advantage-title">
          {headingLine1}{' '}
          <strong className="cia-advantage-title-strong">{headingBold}</strong>
        </h2>
        <div className="cia-advantage-grid">
          {cards.map((card, index) => {
            const headerColor = card.headerColor || (index === 0 ? '#1a365d' : '#009fff')
            const iconUrl = resolveIconUrl(card.icon)
            const bullets = Array.isArray(card.bullets)
              ? card.bullets.filter((b) => String(b).trim())
              : []

            return (
              <article key={`${card.title}-${index}`} className="cia-advantage-card">
                <div
                  className="cia-advantage-card-head"
                  style={{ backgroundColor: headerColor }}
                >
                  <div className="cia-advantage-card-icon-box">
                    {iconUrl ? (
                      <img src={iconUrl} alt="" className="cia-advantage-card-icon-img" decoding="async" />
                    ) : index % 2 === 0 ? (
                      <IconAcademy />
                    ) : (
                      <IconCloud />
                    )}
                  </div>
                </div>
                <div className="cia-advantage-card-body">
                  <h3 className="cia-advantage-card-title">{card.title}</h3>
                  <p className="cia-advantage-card-desc">{card.description}</p>
                  {bullets.length > 0 ? (
                    <ul className="cia-advantage-card-list">
                      {bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CloudIntellectAdvantageSection
