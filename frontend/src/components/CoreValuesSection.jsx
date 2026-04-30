import { usePageContentContext } from '../contexts/PageContentContext'

const ICON_BASE = '/images/Core Values'

function url(path) {
  return path ? encodeURI(path) : ''
}

const DEFAULT_VALUES = [
  { title: 'Excellence', subtitle: 'Quality training & real exposure', icon: `${ICON_BASE}/SVG (5).svg` },
  { title: 'Student Success', subtitle: 'Career-first learning', icon: `${ICON_BASE}/SVG (5) copy 3.svg` },
  { title: 'Integrity', subtitle: 'Transparency & ethics', icon: `${ICON_BASE}/SVG (5) copy.svg` },
  { title: 'Two-Pillar Advantage', subtitle: 'Training + Consulting', icon: `${ICON_BASE}/SVG (5) copy 4.svg` },
  { title: 'Innovation', subtitle: 'Modern tools & best practices', icon: `${ICON_BASE}/SVG (5) copy 2.svg` },
  { title: 'Responsibility', subtitle: 'Positive community impact', icon: `${ICON_BASE}/SVG (5) copy 5.svg` },
]

const DEFAULT_ISR_TAGS = ['Skill-to-employment programs', 'Workforce upskilling', 'Career awareness', 'Digital-first learning', 'Inclusive access', 'Career guidance']

function CoreValuesSection() {
  const { content } = usePageContentContext()
  const d = content?.coreValues || {}
  const title = d.title ?? 'Our Core'
  const titleBold = d.titleBold ?? 'Values'
  const values = Array.isArray(d.values) && d.values.length > 0 ? d.values : DEFAULT_VALUES
  const isrTitle = d.isrTitle ?? 'Institutional Social Responsibility'
  const isrDescription = d.isrDescription ?? 'At Cloud Intellect, responsibility goes beyond training. We focus on education-led career empowerment and inclusive growth.'
  const isrTags = Array.isArray(d.isrTags) ? d.isrTags : DEFAULT_ISR_TAGS
  const isrIcon = d.isrIcon ?? `${ICON_BASE}/SVG (5) copy 6.svg`

  return (
    <section className="core-values-section">
      <div className="core-values-inner">
        <h2 className="core-values-title">{title} <span className="core-values-title-bold">{titleBold}</span></h2>

        <div className="core-values-grid">
          {values.map((value, i) => (
            <div key={i} className="core-value-item">
              <div className="core-value-icon-wrap">
                <img src={url(value.icon)} alt="" width={24} height={24} className="core-value-icon" aria-hidden />
              </div>
              <div className="core-value-content">
                <h3 className="core-value-title">{value.title}</h3>
                <p className="core-value-subtitle">{value.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="isr-card">
          <div className="isr-icon-wrap">
            <img src={url(isrIcon)} alt="" width={48} height={48} className="isr-icon" aria-hidden />
          </div>
          <h3 className="isr-title">{isrTitle}</h3>
          <p className="isr-description">{isrDescription}</p>
          <div className="isr-tags">
            {isrTags.map((tag, i) => (
              <span key={i} className="isr-tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CoreValuesSection
