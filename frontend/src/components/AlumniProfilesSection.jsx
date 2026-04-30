import { useEffect, useState } from 'react'
import { alumniAPI } from '../services/api'

function AlumniProfilesSection() {
  const [alumni, setAlumni] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await alumniAPI.getAll()
        setAlumni(response.data || [])
      } catch (error) {
        console.error('Error fetching alumni:', error)
        // Fallback to empty array if API fails
        setAlumni([])
      } finally {
        setLoading(false)
      }
    }

    fetchAlumni()
  }, [])

  if (loading) {
    return (
      <section className="alumni-profiles-section">
        <div className="alumni-profiles-container">
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading alumni...</div>
        </div>
      </section>
    )
  }

  if (alumni.length === 0) {
    return null
  }

  return (
    <section className="alumni-profiles-section">
      <div className="alumni-profiles-container">
        <div className="alumni-profiles-grid">
          {alumni.map((alumnus) => (
            <div key={alumnus._id} className="alumni-profile-card">
              <div className="alumni-profile-header">
                <img
                  src={alumnus.image}
                  alt={alumnus.name}
                  className="alumni-profile-image"
                />
                <div className="alumni-profile-info">
                  <h3 className="alumni-profile-name">{alumnus.name}</h3>
                  <p className="alumni-profile-company">{alumnus.company}</p>
                </div>
              </div>
              <div className="alumni-profile-tag">
                {alumnus.specialization}
              </div>
              <p className="alumni-profile-description">
                {alumnus.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AlumniProfilesSection
