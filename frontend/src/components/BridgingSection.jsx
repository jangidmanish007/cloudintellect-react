import { usePageContentContext } from '../contexts/PageContentContext'

const IMG_BASE = '/images'
const DEFAULT_PARTNER_BADGE = `${IMG_BASE}/1734100666165 1 (1).webp`
const DEFAULT_GLOBE_ICON = `${IMG_BASE}/SVG (5).svg`
const DEFAULT_TARGET_ICON = `${IMG_BASE}/SVG (5) copy.svg`
const DEFAULT_CHECK_ICON = `${IMG_BASE}/Overlay (4).svg`

function url(path) {
  return path ? encodeURI(path) : ''
}

const DEFAULT_MISSION_TAGS = ['Industry-aligned training', 'Certification support', 'Real-world projects']

function BridgingSection() {
  const { content } = usePageContentContext()
  const d = content?.bridging || {}
  const headingLine1 = d.headingLine1 ?? 'Education'
  const headingLine2 = d.headingLine2 ?? '& Industry'
  const intro = d.intro ?? "Cloud Intellect is a premier Salesforce Workforce Development Partner. With a learner-centric approach, we combine expert-led instruction, real-time projects, and structured learning paths."
  const visionTitle = d.visionTitle ?? 'Our Vision'
  const visionText = d.visionText ?? "To become India's most trusted Salesforce learning ecosystem by empowering individuals with career-ready Skills."
  const missionTitle = d.missionTitle ?? 'Our Mission'
  const missionTags = Array.isArray(d.missionTags) ? d.missionTags : DEFAULT_MISSION_TAGS
  const partnerBadge = d.partnerBadgeImage ?? DEFAULT_PARTNER_BADGE
  const partnerSubtitle = d.partnerSubtitle ?? 'CLOUD INTELLECT SYSTEMS.'
  const partnerName = d.partnerName ?? 'Ridge Consulting Partner'
  const partnerDesc = d.partnerDesc ?? 'A unique partnership enabling learners to gain hands-on exposure to real-world enterprise projects.'
  const guaranteeTitle = d.guaranteeTitle ?? 'Real Project Experience'
  const guaranteeSub = d.guaranteeSub ?? 'Guaranteed exposure'
  const globeIcon = d.globeIcon ?? DEFAULT_GLOBE_ICON
  const targetIcon = d.targetIcon ?? DEFAULT_TARGET_ICON
  const checkIcon = d.checkIcon ?? DEFAULT_CHECK_ICON

  return (
    <section className="bridging-section">
      <div className="bridging-container">
        <div className="bridging-left">
          <h2 className="bridging-heading">
            Bridging <span className="bridging-heading-line1">{headingLine1}</span><br />
            <span className="bridging-heading-line2">{headingLine2}</span>
          </h2>
          <p className="bridging-intro">{intro}</p>
          <div className="bridging-card bridging-vision">
            <div className="bridging-card-header">
              <h3 className="bridging-card-title">{visionTitle}</h3>
              <img src={url(globeIcon)} alt="" width={24} height={24} className="bridging-card-icon" aria-hidden />
            </div>
            <p className="bridging-card-text">{visionText}</p>
          </div>
          <div className="bridging-card bridging-mission">
            <div className="bridging-card-header">
              <h3 className="bridging-card-title">{missionTitle}</h3>
              <img src={url(targetIcon)} alt="" width={24} height={24} className="bridging-card-icon" aria-hidden />
            </div>
            <div className="bridging-tags">
              {missionTags.map((tag) => (
                <span key={tag} className="bridging-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="bridging-right">
          <div className="bridging-partner-card">
            <div className="bridging-partner-badge">
              <img
                src={url(partnerBadge)}
                alt="Salesforce Ridge Partner"
                className="bridging-partner-badge-img"
                width={180}
                height={80}
                decoding="async"
              />
            </div>
            <p className="bridging-partner-subtitle">{partnerSubtitle}</p>
            <h3 className="bridging-partner-name">{partnerName}</h3>
            <p className="bridging-partner-desc">{partnerDesc}</p>
            <div className="bridging-partner-guarantee">
              <img src={url(checkIcon)} alt="" width={36} height={36} className="bridging-guarantee-icon" aria-hidden />
              <div>
                <span className="bridging-guarantee-title">{guaranteeTitle}</span>
                <span className="bridging-guarantee-sub">{guaranteeSub}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BridgingSection
