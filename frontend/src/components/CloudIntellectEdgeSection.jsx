import { usePageContentContext } from '../contexts/PageContentContext'

const ICON_BASE = '/images/About Us Icons'

function url(path) {
  return path ? encodeURI(path) : ''
}

const DEFAULT_CARDS = [
  { title: 'Industry Alignment', description: 'Training mapped to real Salesforce job roles and certifications.', icon: `${ICON_BASE}/SVG (5).svg` },
  { title: 'Real Project Exposure', description: 'Hands-on experience via Ridge Partner consulting projects.', icon: `${ICON_BASE}/SVG (5) copy.svg` },
  { title: 'Global Ecosystem', description: 'Learning aligned with international project standards.', icon: `${ICON_BASE}/SVG (5) copy 2.svg` },
  { title: 'Career-Focused', description: 'Role-based paths: Admin, Developer, Consultant.', icon: `${ICON_BASE}/SVG (5) copy 3.svg` },
  { title: 'Industry Mentorship', description: 'Guidance from certified professionals working in top MNCs.', icon: `${ICON_BASE}/SVG (5) copy 4.svg` },
  { title: 'High Career ROI', description: 'Strong placement support and future-ready skills.', icon: `${ICON_BASE}/SVG (5) copy 5.svg` },
]

function CloudIntellectEdgeSection() {
  const { content } = usePageContentContext()
  const d = content?.cloudIntellectEdge || {}
  const heading = d.heading ?? 'The Cloud Intellect'
  const headingBold = d.headingBold ?? 'Edge'
  const cards = Array.isArray(d.cards) && d.cards.length > 0 ? d.cards : DEFAULT_CARDS

  return (
    <section className="edge-section">
      <div className="edge-section-inner">
        <h2 className="edge-heading">
          {heading} <strong className="edge-heading-bold">{headingBold}</strong>
        </h2>
        <div className="edge-grid">
          {cards.map((card, i) => (
            <div key={i} className="edge-card">
              <div className="edge-card-icon-wrap">
                <img src={url(card.icon)} alt="" width={32} height={32} className="edge-card-icon" aria-hidden />
              </div>
              <h3 className="edge-card-title">{card.title}</h3>
              <p className="edge-card-desc">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CloudIntellectEdgeSection
