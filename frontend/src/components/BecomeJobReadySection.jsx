import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

const DEFAULT_ICON = '/images/person_heart.svg'

function BecomeJobReadySection() {
  const { content } = usePageContentContext()
  const data = content?.becomeJobReady || {}
  const title = data.title ?? 'Become Job-Ready in 3 to 6 Months'
  const description = data.description ?? 'Our training model is designed to bridge the gap between education and employability, providing practical exposure equivalent to industry experience.'
  const iconPath = data.icon || DEFAULT_ICON
  const ctaText = data.ctaText ?? 'Download Brochure'
  const ctaHref = data.ctaHref ?? '#brochure'
  const iconSrc = iconPath.startsWith('/') ? getImageUrl(iconPath) : iconPath

  return (
    <section className="become-job-ready-section">
      <div className="become-job-ready-inner">
        <div className="become-job-ready-card">
          <div className="become-job-ready-icon-wrap">
            <img
              src={iconSrc}
              alt=""
              width={64}
              height={64}
              className="become-job-ready-icon"
              aria-hidden
            />
          </div>
          <h2 className="become-job-ready-title">{title}</h2>
          <p className="become-job-ready-description">{description}</p>
          <a href={ctaHref} className="become-job-ready-btn">{ctaText}</a>
        </div>
      </div>
    </section>
  )
}

export default BecomeJobReadySection
