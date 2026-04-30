import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

const DEFAULT_BULLETS = [
  'Top candidates join Cloud Intellect Systems, our consulting arm.',
  'Direct exposure to real industry projects.',
  'Open communication with leadership.',
]

function resolveImageUrl(path) {
  const p = (path || '').trim()
  if (!p) return ''
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  return getImageUrl(p.startsWith('/') ? p : `/${p}`)
}

function CheckIcon() {
  return (
    <span className="aci-eco-check" aria-hidden>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

function SalesforceEcosystemShowcaseSection() {
  const { content } = usePageContentContext()
  const d = content?.salesforceEcosystemShowcase || {}

  const badgeText = d.badgeText ?? 'UNIQUE OPPORTUNITY'
  const headingLine1 = d.headingLine1 ?? 'The Salesforce'
  const headingLine2 = d.headingLine2 ?? 'Ecosystem'
  const description =
    d.description ??
    'This integrated approach creates a seamless bridge between training, real-world projects, and professional employment.'

  const cultureTitle = d.cultureTitle ?? 'Our Culture'
  const bullets = Array.isArray(d.bullets) && d.bullets.length > 0 ? d.bullets : DEFAULT_BULLETS

  const imageUrl = resolveImageUrl(d.image)

  return (
    <section className="aci-eco-section" aria-label="Salesforce ecosystem">
      <div className="aci-eco-container">
        <div className="aci-eco-left">
          <div className="aci-eco-badge">
            <span className="aci-eco-badge-dot" aria-hidden />
            <span className="aci-eco-badge-text">{badgeText}</span>
          </div>

          <h2 className="aci-eco-heading">
            <span className="aci-eco-heading-line">{headingLine1}</span>
            <br />
            <span className="aci-eco-heading-line">{headingLine2}</span>
          </h2>

          <p className="aci-eco-description">{description}</p>

          <div className="aci-eco-card" role="group" aria-label="Culture">
            <h3 className="aci-eco-card-title">{cultureTitle}</h3>
            <ul className="aci-eco-list">
              {bullets
                .filter((b) => String(b).trim())
                .map((item) => (
                  <li key={item} className="aci-eco-list-item">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="aci-eco-right" aria-hidden={!imageUrl}>
          {imageUrl ? (
            <img className="aci-eco-image" src={imageUrl} alt="" decoding="async" />
          ) : (
            <div className="aci-eco-image-placeholder" />
          )}
        </div>
      </div>
    </section>
  )
}

export default SalesforceEcosystemShowcaseSection
