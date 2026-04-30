import { useEffect, useState } from 'react'
import { placementsAPI, getImageUrl } from '../services/api'

function PlacementsSection() {
  const [placements, setPlacements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const response = await placementsAPI.getAll()
        setPlacements(response.data || [])
      } catch (error) {
        console.error('Error fetching placements:', error)
        setPlacements([])
      } finally {
        setLoading(false)
      }
    }

    fetchPlacements()
  }, [])

  if (loading) {
    return (
      <section className="placements-section">
        <div className="placements-section-container">
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading placements...</div>
        </div>
      </section>
    )
  }

  if (placements.length === 0) {
    return null
  }

  return (
    <section className="placements-section">
      <div className="placements-section-container">
        <div className="placements-grid">
          {placements.map((placement) => (
            <div key={placement._id} className="placement-card">
              <div className="placement-image-wrapper">
                <img
                  src={`${getImageUrl(placement.image)}?t=${Date.now()}`}
                  alt={placement.name}
                  className="placement-image"
                  onError={(e) => {
                    console.error('Failed to load placement image:', placement.image)
                    e.target.style.display = 'none'
                  }}
                />
              </div>
              <h3 className="placement-name">{placement.name}</h3>
              <div className="placement-role-tag">
                {placement.role}
              </div>
              <div className="placement-details">
                <div className="placement-detail-row">
                  <span className="placement-detail-label">Company</span>
                  <span className="placement-detail-value">{placement.company}</span>
                </div>
                <div className="placement-detail-row">
                  <span className="placement-detail-label">Package</span>
                  <span className="placement-detail-value placement-package">{placement.package}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PlacementsSection
