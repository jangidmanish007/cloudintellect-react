import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

const ICON_BASE = '/images/Trust and Recognition'

const FALLBACK_ITEMS = [
  { text: 'Salesforce Workforce Development Partner', icon: `${ICON_BASE}/verified.svg` },
  { text: 'Training aligned with Salesforce role frameworks', icon: `${ICON_BASE}/book_ribbon.svg` },
  { text: 'Expert trainers from the Salesforce ecosystem', icon: `${ICON_BASE}/group.svg` },
  { text: 'Strong alumni & corporate network', icon: `${ICON_BASE}/account_tree.svg` },
]

function toSrc(path) {
  if (!path) return ''
  return path.startsWith('/') ? getImageUrl(path) : path
}

function TrustRecognitionSection() {
  const { content } = usePageContentContext()
  const data = content?.trustRecognition || {}
  const headingLight = data.headingLight ?? 'Institutional'
  const headingBold = data.headingBold ?? 'Trust & Recognition'
  const items = Array.isArray(data.items) && data.items.length > 0 ? data.items : FALLBACK_ITEMS

  return (
    <section className="trust-recognition-section">
      <div className="trust-recognition-inner">
        <h2 className="trust-recognition-title">
          <span className="trust-recognition-title-light">{headingLight}</span>{' '}
          <span className="trust-recognition-title-bold">{headingBold}</span>
        </h2>

        <div className="trust-recognition-grid">
          {items.map((item, i) => (
            <div key={i} className="trust-recognition-card">
              <div className="trust-recognition-icon-wrap">
                <img
                  src={toSrc(item.icon)}
                  alt=""
                  width={28}
                  height={28}
                  className="trust-recognition-icon"
                  aria-hidden
                />
              </div>
              <p className="trust-recognition-text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustRecognitionSection
