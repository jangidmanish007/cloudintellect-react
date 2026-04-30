import { usePageContentContext } from '../contexts/PageContentContext'

const DEFAULT_STATS = [
  { value: '5000+', label: 'Learners Trained' },
  { value: '1400+', label: 'Placed' },
  { value: '90%', label: 'Satisfaction' },
  { value: '100%', label: 'Compliance' },
]

function PlacementsStatsSection() {
  const { content } = usePageContentContext()
  const statsSection = content?.stats || content?.statistics || {}
  
  // Get stats array from content or use defaults
  const stats = statsSection.stats && Array.isArray(statsSection.stats) && statsSection.stats.length > 0
    ? statsSection.stats
    : DEFAULT_STATS

  return (
    <section className="placements-stats-section">
      <div className="placements-stats-container">
        <div className="placements-stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="placements-stat-card">
              <div className="placements-stat-value">
                {stat.value}
              </div>
              <div className="placements-stat-label">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PlacementsStatsSection
