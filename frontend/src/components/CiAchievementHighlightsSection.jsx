import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

const DEFAULT_STATS = [
  { number: '1400+', title: 'SUCCESSFUL CANDIDATE PLACEMENTS', description: 'Across top Salesforce Partner Companies' },
  { number: '5000+', title: 'LEARNERS TRAINED ACROSS INDIA', description: 'Workforce Programs & Online Batches' },
  { number: '11+ Years', title: 'STRONG TRACK RECORD', description: 'in Salesforce Workforce Upskilling' },
  { number: '20 +', title: 'INDUSTRY RECOGNIZED MENTORS & CONSULTANTS', description: 'Training students with real project exposure' },
]

function resolveImageUrl(path) {
  if (!path || typeof path !== 'string') return ''
  const trimmed = path.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http')) return trimmed
  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return getImageUrl(normalized)
}

function CiAchievementHighlightsSection() {
  const { content } = usePageContentContext()
  const raw = content?.achievementHighlights || {}

  const headingLight = raw.headingLight ?? 'CI Achievement'
  const headingBold = raw.headingBold ?? 'Highlights'

  const stats = Array.isArray(raw.stats) && raw.stats.some((s) => s && (s.number || s.title || s.description))
    ? raw.stats.filter((s) => s && (s.number || s.title || s.description))
    : DEFAULT_STATS

  const gallery = Array.isArray(raw.gallery)
    ? raw.gallery.filter((g) => g && (g.image || g.url))
    : []

  const hasGallery = gallery.length > 0

  return (
    <section className="ci-achievement-highlights-section" aria-labelledby="ci-achievement-highlights-heading">
      <div className="ci-achievement-highlights-container">
        <h2 id="ci-achievement-highlights-heading" className="ci-achievement-highlights-title">
          <span className="ci-achievement-highlights-title-light">{headingLight}</span>
          <span className="ci-achievement-highlights-title-bold">{headingBold}</span>
        </h2>

        <div className="ci-achievement-highlights-stats" role="list">
          {stats.map((stat, i) => (
            <div key={i} className="ci-achievement-highlights-stat" role="listitem">
              <p className="ci-achievement-highlights-stat-number">{stat.number}</p>
              <p className="ci-achievement-highlights-stat-title">{stat.title}</p>
              <p className="ci-achievement-highlights-stat-desc">{stat.description}</p>
            </div>
          ))}
        </div>

        {hasGallery && (
          <div className="ci-achievement-highlights-gallery-wrap">
            <div className="ci-achievement-highlights-gallery" role="list">
              {gallery.map((item, i) => {
                const src = resolveImageUrl(item.image || item.url || '')
                return (
                  <div key={i} className="ci-achievement-highlights-gallery-item" role="listitem">
                    {src ? (
                      <img src={src} alt="" className="ci-achievement-highlights-gallery-img" decoding="async" loading="lazy" />
                    ) : (
                      <div className="ci-achievement-highlights-gallery-placeholder" aria-hidden />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default CiAchievementHighlightsSection
