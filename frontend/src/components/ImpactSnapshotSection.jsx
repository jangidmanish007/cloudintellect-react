import { usePageContentContext } from '../contexts/PageContentContext'

const FALLBACK_METRICS = [
  { value: '5000+', label: 'LEARNERS TRAINED' },
  { value: '1400+', label: 'SUCCESSFUL PLACEMENTS' },
  { value: '20+', label: 'CERTIFIED INDUSTRY MENTORS' },
  { value: '11+', label: 'YEARS EXPERIENCE' },
]

function ImpactSnapshotSection() {
  const { content } = usePageContentContext()
  const data = content?.impactSnapshot || {}
  const headingLight = data.headingLight ?? 'CI Impact'
  const headingBold = data.headingBold ?? 'Snapshot'
  const metrics = Array.isArray(data.metrics) && data.metrics.length > 0 ? data.metrics : FALLBACK_METRICS
  const tagline = data.tagline ?? 'CHOOSING CLOUD INTELLECT MEANS CHOOSING PRACTICAL LEARNING'
  const ctaHeading = data.ctaHeading ?? 'industry exposure, and long-term career growth.'
  const ctaDescription = data.ctaDescription ?? 'With structured training, real project experience, and placement support until hiring, we empower learners to confidently step into the Salesforce ecosystem.'
  const ctaText = data.ctaText ?? 'Apply Today'
  const ctaHref = data.ctaHref ?? '#apply'

  return (
    <section className="impact-snapshot-section">
      <div className="impact-snapshot-inner">
        <h2 className="impact-snapshot-title">
          <span className="impact-snapshot-title-light">{headingLight}</span>{' '}
          <span className="impact-snapshot-title-bold">{headingBold}</span>
        </h2>

        <div className="impact-snapshot-metrics">
          {metrics.map((metric, i) => (
            <div key={i} className="impact-snapshot-metric">
              {i > 0 && <div className="impact-snapshot-divider" aria-hidden />}
              <div className="impact-snapshot-metric-content">
                <span className="impact-snapshot-value">{metric.value}</span>
                <span className="impact-snapshot-label">{metric.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="impact-snapshot-cta-card">
          <div className="impact-snapshot-tagline">
            <span className="impact-snapshot-tagline-dot" aria-hidden />
            <span>{tagline}</span>
          </div>
          <h3 className="impact-snapshot-cta-heading">{ctaHeading}</h3>
          <p className="impact-snapshot-cta-description">{ctaDescription}</p>
          <a href={ctaHref} className="impact-snapshot-cta-button">
            {ctaText}
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default ImpactSnapshotSection
