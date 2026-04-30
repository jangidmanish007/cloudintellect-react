import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

const CHECK_ICON = '/images/check_circle.svg'

const FALLBACK_PORTAL = {
  title: 'Smart Student Portal Access',
  description: 'A powerful dashboard built specially for Cloud Intellect learners to manage learning and career in one place.',
  items: ['Book mock interview slots', 'Schedule 1:1 mentor sessions', 'Access assignments & submit projects', 'Download notes & recordings anytime', 'Track course progress step-by-step', 'Receive placement & interview updates'],
}
const FALLBACK_PLACEMENT = {
  title: 'Dedicated Placement Assistance',
  description: 'Complete career support to help students move from training to real Salesforce jobs.',
  items: ['Professional resume preparation', 'Mock interviews with expert feedback', 'Soft-skill & communication training', 'Daily job openings & referrals', 'Interview scheduling guidance', 'Continuous mentor support till placement'],
}

function CompleteSupportEcosystemSection() {
  const { content } = usePageContentContext()
  const data = content?.completeSupportEcosystem || {}
  const headingLine1 = data.headingLine1 ?? 'Complete'
  const headingStrong = data.headingStrong ?? 'Support Ecosystem'
  const portalCard = data.portalCard && typeof data.portalCard === 'object' ? { ...FALLBACK_PORTAL, ...data.portalCard } : FALLBACK_PORTAL
  const placementCard = data.placementCard && typeof data.placementCard === 'object' ? { ...FALLBACK_PLACEMENT, ...data.placementCard } : FALLBACK_PLACEMENT
  const portalItems = Array.isArray(portalCard.items) ? portalCard.items : FALLBACK_PORTAL.items
  const placementItems = Array.isArray(placementCard.items) ? placementCard.items : FALLBACK_PLACEMENT.items
  const checkSrc = getImageUrl(CHECK_ICON)

  return (
    <section className="support-ecosystem-section">
      <div className="support-ecosystem-inner">
        <h2 className="support-ecosystem-heading">
          {headingLine1} <span>{headingStrong}</span>
        </h2>

        <div className="support-ecosystem-grid">
          <div className="support-ecosystem-card">
            <div className="support-ecosystem-card-accent support-ecosystem-card-accent-dark" />
            <h3 className="support-ecosystem-card-title">{portalCard.title}</h3>
            <p className="support-ecosystem-card-description">{portalCard.description}</p>
            <ul className="support-ecosystem-card-list">
              {portalItems.map((item, i) => (
                <li key={i}>
                  <img src={checkSrc} alt="" width={22} height={22} className="support-ecosystem-card-check" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="support-ecosystem-card">
            <div className="support-ecosystem-card-accent support-ecosystem-card-accent-bright" />
            <h3 className="support-ecosystem-card-title">{placementCard.title}</h3>
            <p className="support-ecosystem-card-description">{placementCard.description}</p>
            <ul className="support-ecosystem-card-list">
              {placementItems.map((item, i) => (
                <li key={i}>
                  <img src={checkSrc} alt="" width={22} height={22} className="support-ecosystem-card-check" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CompleteSupportEcosystemSection
