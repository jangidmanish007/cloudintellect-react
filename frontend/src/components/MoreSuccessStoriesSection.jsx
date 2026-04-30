import { useEffect, useState } from 'react'
import { successStoriesAPI, getImageUrl } from '../services/api'
import { usePageContentContext } from '../contexts/PageContentContext'

const MORE_STUDENTS_BASE = '/images/More_Students'
const GOOGLE_ICON = `${MORE_STUDENTS_BASE}/SVG (5).svg`

function StarRating({ count = 5 }) {
  return (
    <span className="more-success-stories-stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="more-success-stories-star" aria-hidden>★</span>
      ))}
    </span>
  )
}

function MoreSuccessStoriesSection() {
  const { content } = usePageContentContext()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  // Get heading from page content, with fallback
  const sectionContent = content?.moreSuccessStories || {}
  const heading = sectionContent.heading || sectionContent.title || 'More Success Stories'
  // Split heading for bold part
  const headingMatch = heading.match(/^(.+?)\s*(Success\s+Stories)$/i)
  const headingLine1 = headingMatch ? headingMatch[1].trim() : heading.split(' ').slice(0, 1).join(' ') || 'More'
  const headingLine2 = headingMatch ? headingMatch[2].trim() : heading.split(' ').slice(1).join(' ') || 'Success Stories'

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await successStoriesAPI.getAll()
        setStories(response.data || [])
      } catch (error) {
        console.error('Error fetching success stories:', error)
        // Fallback to empty array if API fails
        setStories([])
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  if (loading) {
    return (
      <section className="more-success-stories-section">
        <div className="more-success-stories-container">
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading success stories...</div>
        </div>
      </section>
    )
  }

  if (stories.length === 0) {
    return null
  }

  return (
    <section className="more-success-stories-section">
      <div className="more-success-stories-container">
        <h2 className="more-success-stories-title">{headingLine1} <span>{headingLine2}</span></h2>
        <div className="more-success-stories-cards">
          {stories.map((review) => (
            <article key={review._id} className="more-success-stories-card">
              <div className="more-success-stories-card-header">
                <div className="more-success-stories-card-user">
                  <img
                    src={getImageUrl(review.profileImage)}
                    alt=""
                    className="more-success-stories-card-avatar"
                    width={48}
                    height={48}
                    decoding="async"
                    onError={(e) => {
                      console.error('Failed to load profile image:', review.profileImage)
                      e.target.style.display = 'none'
                    }}
                  />
                  <div>
                    <h3 className="more-success-stories-card-name">{review.name}</h3>
                    <span className="more-success-stories-card-time">{review.time}</span>
                  </div>
                </div>
                <img
                  src={encodeURI(GOOGLE_ICON)}
                  alt=""
                  className="more-success-stories-card-google"
                  width={20}
                  height={20}
                  aria-hidden
                />
              </div>
              <StarRating count={review.rating} />
              <p className="more-success-stories-card-text">{review.text}</p>
              <a href={review.readMoreUrl || '#'} className="more-success-stories-card-readmore">
                Read more &gt;
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MoreSuccessStoriesSection
