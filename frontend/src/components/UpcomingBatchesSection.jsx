import { useEffect, useState } from 'react'
import { batchesAPI } from '../services/api'
import { usePageContentContext } from '../contexts/PageContentContext'

function url(path) {
  return encodeURI(path)
}

function UpcomingBatchesSection() {
  const { content } = usePageContentContext()
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)

  // Get heading from page content, with fallback
  const sectionContent = content?.upcomingBatches || {}
  const heading = sectionContent.heading || sectionContent.title || 'Upcoming Salesforce Batches'

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await batchesAPI.getAll()
        setBatches(response.data || [])
      } catch (error) {
        console.error('Error fetching batches:', error)
        // Fallback to empty array if API fails
        setBatches([])
      } finally {
        setLoading(false)
      }
    }

    fetchBatches()
  }, [])

  if (loading) {
    return (
      <section className="upcoming-batches-section">
        <div className="upcoming-batches-inner">
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading batches...</div>
        </div>
      </section>
    )
  }

  // Show section even if no batches - display heading and empty state
  // This ensures the section is visible and can be managed from admin panel

  return (
    <section className="upcoming-batches-section">
      <div className="upcoming-batches-inner">
        <h2 className="upcoming-batches-heading">
          {heading}
        </h2>

        {batches.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: '#666',
            fontSize: '16px'
          }}>
            <p>No batches available at the moment.</p>
            <p style={{ fontSize: '14px', marginTop: '8px', color: '#999' }}>
              Add batches from the admin panel to display them here.
            </p>
          </div>
        ) : (
          <div className="upcoming-batches-grid">
            {batches.map((batch) => (
              <div key={batch._id || batch.id} className="upcoming-batches-card">
                <div
                  className="upcoming-batches-card-banner"
                  style={{ background: batch.bannerBg }}
                >
                  <img
                    src={url(batch.icon)}
                    alt=""
                    width={40}
                    height={40}
                    className="upcoming-batches-card-icon"
                    aria-hidden
                    onError={(e) => {
                      console.error('Failed to load batch icon:', batch.icon)
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
                <h3 className="upcoming-batches-card-title">{batch.title}</h3>
                <p className="upcoming-batches-card-description">{batch.description}</p>
                <div className="upcoming-batches-batch-box">
                  <div className="upcoming-batches-batch-col">
                    <span className="upcoming-batches-batch-label">Batch Start</span>
                    <span className="upcoming-batches-batch-date">{batch.batchStart}</span>
                    {batch.isOpen && <span className="upcoming-batches-batch-tag">Open</span>}
                  </div>
                  <div className="upcoming-batches-batch-col">
                    <span className="upcoming-batches-batch-label">Next Batch</span>
                    <span className="upcoming-batches-batch-date">{batch.nextBatch}</span>
                    <a href={batch.linkHref} className="upcoming-batches-batch-link">
                      View Details
                    </a>
                  </div>
                </div>
                <a href={batch.linkHref} className="upcoming-batches-card-cta">
                  {batch.linkText}
                  <span aria-hidden>→</span>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default UpcomingBatchesSection
