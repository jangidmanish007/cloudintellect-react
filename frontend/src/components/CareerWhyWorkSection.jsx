import { usePageContentContext } from '../contexts/PageContentContext'

const ICON_BASE = '/images/career-icons'

function url(path) {
  if (!path) return ''
  if (path.startsWith('/')) return path
  return `${ICON_BASE}/${path}`
}

const DEFAULT_CARDS = [
  {
    title: 'Career Impact',
    description: 'We work on real student outcomes.',
    icon: `${ICON_BASE}/target.svg`,
  },
  {
    title: 'Industry Exposure',
    description: 'Hands-on work in the Salesforce ecosystem.',
    icon: `${ICON_BASE}/building.svg`,
  },
  {
    title: 'Ownership Culture',
    description: 'Ideas > hierarchy. Execution > excuses.',
    icon: `${ICON_BASE}/globe.svg`,
  },
]

function CareerWhyWorkSection() {
  const { content } = usePageContentContext()
  const d = content?.whyWork || {}
  const headingLine1 = d.headingLine1 ?? 'Why Work With'
  const headingStrong = d.headingStrong ?? 'Cloud Intellect?'
  const cards = Array.isArray(d.cards) && d.cards.length > 0 ? d.cards : DEFAULT_CARDS

  return (
    <section className="career-why-section">
      <div className="career-why-inner">
        <h2 className="career-why-heading">
          {headingLine1} <span>{headingStrong}</span>
        </h2>
        <div className="career-why-grid">
          {cards.map((card, i) => (
            <article key={i} className="career-why-card">
              <div className="career-why-icon-wrap">
                {card.icon && (
                  <img
                    src={url(card.icon)}
                    alt=""
                    width={28}
                    height={28}
                    className="career-why-icon"
                    aria-hidden
                  />
                )}
              </div>
              <h3 className="career-why-title">{card.title}</h3>
              <p className="career-why-text">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CareerWhyWorkSection

