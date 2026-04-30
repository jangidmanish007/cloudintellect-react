import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

const DEFAULT_FEATURES = [
  { label: 'Resume Building' },
  { label: 'Mock Interviews' },
  { label: 'HR & Tech Prep' },
  { label: 'Direct Referrals' },
]

const DEFAULT_SERVICE_ITEMS = [
  { text: 'End-to-end Salesforce career enablement' },
  { text: 'Practical learning on real Salesforce orgs' },
  { text: 'Real-world project exposure' },
  { text: 'Certification-aligned preparation' },
  { text: 'Dedicated placement assistance' },
]

function resolveUrl(path) {
  const p = (path || '').trim()
  if (!p) return ''
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  return getImageUrl(p.startsWith('/') ? p : `/${p}`)
}

function CheckCircleIcon({ className }) {
  return (
    <span className={className} aria-hidden>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22a10 10 0 110-20 10 10 0 010 20z" stroke="currentColor" strokeWidth="2" />
        <path d="M8.2 12.2l2.4 2.4 5.2-5.2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

function TrainingPlacementModelSection() {
  const { content } = usePageContentContext()
  const d = content?.trainingPlacementModel || {}

  const badgeText = d.badgeText ?? 'UNIQUE OPPORTUNITY'
  const headingLine1 = d.headingLine1 ?? 'Training + Placement'
  const headingLine2 = d.headingLine2 ?? 'Model'

  const intro =
    d.intro ??
    'At Cloud Intellect, training and placement are linked.'
  const description =
    d.description ??
    'Placement support is not optional or an add-on — it is an integral part of our programs. Learners receive guidance and support until they are placement-ready and successfully hired.'

  const featuresRaw = Array.isArray(d.features) && d.features.length > 0 ? d.features : DEFAULT_FEATURES
  const features = featuresRaw
    .filter((f) => f && String(f.label || '').trim())
    .map((f) => ({ label: String(f.label).trim(), icon: resolveUrl(f.icon) }))

  const panelTitle = d.panelTitle ?? 'What Services Do We Provide?'
  const panelSubtitle = d.panelSubtitle ?? ''

  const serviceItemsRaw = Array.isArray(d.serviceItems) && d.serviceItems.length > 0 ? d.serviceItems : DEFAULT_SERVICE_ITEMS
  const serviceItems = serviceItemsRaw
    .filter((x) => x && String(x.text || '').trim())
    .map((x) => ({ text: String(x.text).trim(), icon: resolveUrl(x.icon) }))

  return (
    <section className="tpm-section" aria-label="Training and placement model">
      <div className="tpm-container">
        <div className="tpm-left">
          <div className="tpm-badge">
            <span className="tpm-badge-dot" aria-hidden />
            <span className="tpm-badge-text">{badgeText}</span>
          </div>

          <h2 className="tpm-heading">
            <span className="tpm-heading-line">{headingLine1}</span>
            <br />
            <span className="tpm-heading-line">{headingLine2}</span>
          </h2>

          <p className="tpm-intro">{intro}</p>
          <p className="tpm-desc">{description}</p>

          {features.length > 0 ? (
            <div className="tpm-feature-grid" role="list" aria-label="Placement features">
              {features.map((f) => (
                <div key={f.label} className="tpm-feature" role="listitem">
                  {f.icon ? (
                    <img className="tpm-feature-icon-img" src={f.icon} alt="" decoding="async" />
                  ) : (
                    <CheckCircleIcon className="tpm-feature-icon" />
                  )}
                  <span className="tpm-feature-label">{f.label}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="tpm-right">
          <div className="tpm-panel">
            <div className="tpm-panel-header">
              <span className="tpm-panel-header-icon" aria-hidden />
              <div>
                <h3 className="tpm-panel-title">{panelTitle}</h3>
                {panelSubtitle ? <p className="tpm-panel-subtitle">{panelSubtitle}</p> : null}
              </div>
            </div>

            <div className="tpm-panel-items" role="list">
              {serviceItems.map((item) => (
                <div key={item.text} className="tpm-panel-item" role="listitem">
                  <span className="tpm-panel-item-icon" aria-hidden>
                    {item.icon ? (
                      <img className="tpm-panel-item-icon-img" src={item.icon} alt="" decoding="async" />
                    ) : (
                      <CheckCircleIcon className="tpm-panel-item-icon-svg" />
                    )}
                  </span>
                  <span className="tpm-panel-item-text">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrainingPlacementModelSection
