import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

const ICON_BASE = '/images/SFMC_SFDC_Apply'
const CHECK_ICON = `${ICON_BASE}/SVG (5).svg`

function toSrc(path) {
  if (!path) return ''
  const full = path.startsWith('/') ? path : `${ICON_BASE}/${path}`
  return getImageUrl(full)
}

const FALLBACK_CARDS = [
  { title: 'Engineering & Freshers', icon: 'dashboard_2_gear.svg', bullets: ['BE / BTech / Diploma students', 'Final-year (BCA, MCA, BSC IT-CS)'] },
  { title: 'Non-Tech Graduates', icon: 'psychology.svg', bullets: ['BBA, B.Com, BA, BSc backgrounds', 'Interested in Marketing Automation & CRM'] },
  { title: 'Working Professionals', icon: 'person.svg', bullets: ['Looking to upskill/switch', '0-10+ years experience'] },
  { title: 'Career Switchers', icon: 'business_center.svg', bullets: ['Transitioning from non-IT to IT', 'Strong learning intent required'] },
]
const FALLBACK_SFMC_NOTES = ['Freshers are NOT allowed in the SFMC Track.', 'Minimum 3 Years Experience required in any field.', 'Pass-out year should be 2023 or earlier.']

function WhoCanApplySection() {
  const { content } = usePageContentContext()
  const data = content?.whoCanApply || {}
  const headingLine1 = data.headingLine1 ?? 'Who'
  const headingStrong = data.headingStrong ?? 'Can Apply?'
  const cards = Array.isArray(data.cards) && data.cards.length > 0 ? data.cards : FALLBACK_CARDS
  const notesSfmc = data.notesSfmc && typeof data.notesSfmc === 'object' ? data.notesSfmc : { title: 'Notes For SFMC', icon: `${ICON_BASE}/offline_bolt.svg`, items: FALLBACK_SFMC_NOTES }
  const notesSfdc = data.notesSfdc && typeof data.notesSfdc === 'object' ? data.notesSfdc : { title: 'Notes For SFDC', icon: `${ICON_BASE}/offline_bolt.svg`, items: [] }
  const sfmcItems = Array.isArray(notesSfmc.items) ? notesSfmc.items : FALLBACK_SFMC_NOTES
  const sfdcItems = Array.isArray(notesSfdc.items) ? notesSfdc.items : []

  return (
    <section className="who-apply-section">
      <div className="who-apply-inner">
        <h2 className="who-apply-heading">{headingLine1} <span>{headingStrong}</span></h2>

        <div className="who-apply-layout">
          <div className="who-apply-cards">
            {cards.map((card, i) => (
              <div key={i} className="who-apply-card">
                <div className="who-apply-card-header">
                  <div className="who-apply-card-icon-wrap">
                    <img
                      src={toSrc(card.icon)}
                      alt=""
                      width={32}
                      height={32}
                      className="who-apply-card-icon"
                      aria-hidden
                    />
                  </div>
                  <h3 className="who-apply-card-title">{card.title}</h3>
                </div>
                <ul className="who-apply-card-list">
                  {(Array.isArray(card.bullets) ? card.bullets : []).map((bullet, j) => (
                    <li key={j}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="who-apply-notes">
            <div className="who-apply-notes-block">
              <h3 className="who-apply-notes-title">
                <img src={toSrc(notesSfmc.icon)} alt="" width={22} height={22} className="who-apply-notes-icon" aria-hidden />
                {notesSfmc.title || 'Notes For SFMC'}
              </h3>
              <ul className="who-apply-notes-list">
                {sfmcItems.map((note, i) => (
                  <li key={i}>
                    <img src={toSrc(CHECK_ICON)} alt="" width={22} height={22} className="who-apply-notes-check" aria-hidden />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="who-apply-notes-block">
              <h3 className="who-apply-notes-title">
                <img src={toSrc(notesSfdc.icon)} alt="" width={22} height={22} className="who-apply-notes-icon" aria-hidden />
                {notesSfdc.title || 'Notes For SFDC'}
              </h3>
              {sfdcItems.length > 0 && (
                <ul className="who-apply-notes-list">
                  {sfdcItems.map((note, i) => (
                    <li key={i}>
                      <img src={toSrc(CHECK_ICON)} alt="" width={22} height={22} className="who-apply-notes-check" aria-hidden />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhoCanApplySection
