import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

function toIconSrc(path) {
  if (!path) return ''
  return path.startsWith('/') ? getImageUrl(path) : path
}

const FALLBACK_PATHS = [
  { id: 'sfdc', icon: '/images/Icon Container.svg', bannerBg: '#1A202C', title: 'Salesforce Developer Cloud (SFDC)', bullets: ['Focuses on CRM configuration, automation, and development.', 'Used mainly for Sales and Service operations.', 'Ideal for those interested in logic, coding, and system architecture.'], batchStart: '17th January', nextBatch: '31st January', linkText: 'Learn Salesforce Development', linkHref: '/salesforce-developer' },
  { id: 'sfmc', icon: '/images/Icon Container copy.svg', bannerBg: '#007BFF', title: 'Salesforce Marketing Cloud (SFMC)', bullets: ['Focuses on marketing automation, customer journeys, and campaigns.', 'Used mainly for digital marketing and customer engagement.', 'Ideal for marketers and tech-savvy creative professionals.'], batchStart: '18th January', nextBatch: '1st February', linkText: 'Explore Marketing Cloud Career', linkHref: '/salesforce-marketing-cloud' },
]

function SelectYourPathSection() {
  const { content } = usePageContentContext()
  const data = content?.selectYourPath || {}
  const headingLine1 = data.headingLine1 ?? 'Select'
  const headingStrong = data.headingStrong ?? 'Your Path'
  const paths = Array.isArray(data.paths) && data.paths.length > 0 ? data.paths : FALLBACK_PATHS

  return (
    <section className="select-path-section">
      <div className="select-path-inner">
        <h2 className="select-path-heading">
          {headingLine1} <span>{headingStrong}</span>
        </h2>

        <div className="select-path-grid">
          {paths.map((path) => (
            <div key={path.id || path.title} className="select-path-card">
              <div
                className="select-path-card-banner"
                style={{ background: path.bannerBg || '#1A202C' }}
              >
                <img
                  src={toIconSrc(path.icon)}
                  alt=""
                  width={40}
                  height={40}
                  className="select-path-card-icon"
                  aria-hidden
                />
              </div>
              <h3 className="select-path-card-title">{path.title}</h3>
              <ul className="select-path-card-list">
                {(Array.isArray(path.bullets) ? path.bullets : []).map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
              <div className="select-path-batch-box">
                <div className="select-path-batch-col">
                  <span className="select-path-batch-label">Batch Start</span>
                  <span className="select-path-batch-date">{path.batchStart}</span>
                  <span className="select-path-batch-tag">Open</span>
                </div>
                <div className="select-path-batch-col">
                  <span className="select-path-batch-label">Next Batch</span>
                  <span className="select-path-batch-date">{path.nextBatch}</span>
                  <a href={path.linkHref || '#'} className="select-path-batch-link">
                    View Details
                  </a>
                </div>
              </div>
              <a href={path.linkHref || '#'} className="select-path-card-cta">
                {path.linkText || 'Learn more'}
                <span aria-hidden>→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SelectYourPathSection
