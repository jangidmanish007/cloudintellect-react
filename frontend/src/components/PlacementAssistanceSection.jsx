import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

const IMAGE_BASE = '/images/Placement Assistance'

const FALLBACK_ITEMS = [
  'Resume building workshops',
  'Interview preparation & grooming',
  'Alumni referral support',
  'Mock interviews (HR & Technical)',
  'Direct referrals to partner companies',
]

function toSrc(path) {
  if (!path) return ''
  const full = path.startsWith('/') ? path : `${IMAGE_BASE}/${path}`
  return getImageUrl(full)
}

function PlacementAssistanceSection() {
  const { content } = usePageContentContext()
  const data = content?.placementAssistance || {}
  const headingLine1 = data.headingLine1 ?? 'Dedicated Placement Assistance'
  const headingStrong = data.headingStrong ?? 'Until You Get Hired'
  const description = data.description ?? 'Placements are an integral part of the Cloud Intellect learning journey.'
  const supportHeadingLight = data.supportHeadingLight ?? 'Placement support'
  const supportHeadingBold = data.supportHeadingBold ?? 'includes'
  const items = Array.isArray(data.items) && data.items.length > 0 ? data.items : FALLBACK_ITEMS
  const iconPath = data.icon || `${IMAGE_BASE}/Icon.svg`
  const imagePath = data.image || `${IMAGE_BASE}/Container (20).webp`
  const checkPath = `${IMAGE_BASE}/check_circle.svg`

  return (
    <section className="placement-assistance-section">
      <div className="placement-assistance-inner">
        <div className="placement-assistance-card">
          <div className="placement-assistance-left">
            <div className="placement-assistance-icon-wrap">
              <img
                src={toSrc(iconPath)}
                alt=""
                width={48}
                height={48}
                className="placement-assistance-icon"
                aria-hidden
              />
            </div>
            <h2 className="placement-assistance-title">
              {headingLine1} <span>{headingStrong}</span>
            </h2>
            <p className="placement-assistance-description">{description}</p>
            <div className="placement-support-container">
              <h4 className="placement-assistance-support-heading">
                <span className="placement-support-heading-light">{supportHeadingLight}</span>{' '}
                <span className="placement-support-heading-bold">{supportHeadingBold}</span>
              </h4>
              <div className="placement-assistance-features">
                {items.map((feature, i) => (
                  <div key={i} className="placement-assistance-feature">
                    <div className="placement-assistance-check-wrap">
                      <img
                        src={toSrc(checkPath)}
                        alt=""
                        width={20}
                        height={20}
                        className="placement-assistance-check"
                        aria-hidden
                      />
                    </div>
                    <span className="placement-assistance-feature-text">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="placement-assistance-right">
            <div className="placement-assistance-image-wrap">
              <img
                src={toSrc(imagePath)}
                alt="Placement assistance"
                width={400}
                height={500}
                className="placement-assistance-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PlacementAssistanceSection
