import { useEffect, useState } from 'react'
import { webinarsAPI } from '../services/api'
import { usePageContentContext } from '../contexts/PageContentContext'

const WEBINAR_COVER_BASE = '/images/Weninar_Cover'

// Helper to get icon URL - handles both static and uploaded files
function getIconUrl(iconPath) {
  if (!iconPath) return ''
  
  // Clean the path
  let cleanPath = iconPath.trim()
  if (!cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`
  }
  cleanPath = cleanPath.replace(/\/+/g, '/')
  
  // For Vite, files in public/ are served at root
  // Don't encode unless necessary (spaces or special chars)
  if (cleanPath.includes(' ') || /[^a-zA-Z0-9\/._-]/.test(cleanPath)) {
    // Only encode the parts that need it, not the whole path
    return cleanPath.split('/').map(part => {
      if (part && (part.includes(' ') || /[^a-zA-Z0-9._-]/.test(part))) {
        return encodeURIComponent(part)
      }
      return part
    }).join('/')
  }
  
  return cleanPath
}

function WebinarsCoverSection() {
  const { content } = usePageContentContext()
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)

  // Get content from page content, with fallbacks
  const sectionContent = content?.webinarsCover || {}
  const heading = sectionContent.heading || sectionContent.title || 'What These Webinars Cover'
  // Split heading at "Webinars" if present, otherwise use default split
  const headingMatch = heading.match(/^(.+?)\s*(Webinars\s+.+)$/i)
  const headingLine1 = headingMatch ? headingMatch[1].trim() : heading.split(' ').slice(0, 2).join(' ') || 'What These'
  const headingLine2 = headingMatch ? headingMatch[2].trim() : heading.split(' ').slice(2).join(' ') || 'Webinars Cover'
  const intro = sectionContent.description || sectionContent.intro || 'We focus on clarity, not theory overload. Our goal is to give you a realistic view of the ecosystem before you commit.'
  const whyAttendTitle = sectionContent.whyAttendTitle || 'Why Attend?'
  const whyAttendText = sectionContent.whyAttendText || "Choosing the right track is crucial. Don't invest time in the wrong direction without understanding the practical reality first."
  const projectTitle = sectionContent.projectTitle || 'Real Project Experience'
  const projectSubtitle = sectionContent.projectSubtitle || 'Guaranteed exposure'

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await webinarsAPI.getTopics()
        setTopics(response.data || [])
      } catch (error) {
        console.error('Error fetching webinar topics:', error)
        // Fallback to empty array if API fails
        setTopics([])
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [])

  if (loading) {
    return (
      <section className="webinars-cover-section">
        <div className="webinars-cover-container">
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading webinar topics...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="webinars-cover-section">
      <div className="webinars-cover-container">
        <div className="webinars-cover-layout">
          <div className="webinars-cover-left">
            <h2 className="webinars-cover-heading">
              {headingLine1} <span>{headingLine2}</span>
            </h2>
            <p className="webinars-cover-intro">
              {intro}
            </p>

            <div className="webinars-cover-why-attend">
              <div className="webinars-cover-why-attend-header">
                <div className="webinars-cover-why-attend-icon-wrap">
                  <img
                    src={getIconUrl(`${WEBINAR_COVER_BASE}/offline_bolt.svg`)}
                    alt=""
                    width={24}
                    height={24}
                    className="webinars-cover-why-attend-icon"
                    aria-hidden
                  />
                </div>
                <h3 className="webinars-cover-why-attend-title">{whyAttendTitle}</h3>
              </div>
              <p className="webinars-cover-why-attend-text">
                {whyAttendText}
              </p>
              <div className="webinars-cover-project-experience">
                <div className="webinars-cover-project-icon-wrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.6654 10.8333C16.6654 15 13.7487 17.0833 10.282 18.2916C10.1005 18.3531 9.90331 18.3502 9.7237 18.2833C6.2487 17.0833 3.33203 15 3.33203 10.8333V4.99997C3.33203 4.77895 3.41983 4.56699 3.57611 4.41071C3.73239 4.25443 3.94435 4.16663 4.16536 4.16663C5.83203 4.16663 7.91536 3.16663 9.36536 1.89997C9.54191 1.74913 9.76649 1.66626 9.9987 1.66626C10.2309 1.66626 10.4555 1.74913 10.632 1.89997C12.0904 3.17497 14.1654 4.16663 15.832 4.16663C16.053 4.16663 16.265 4.25443 16.4213 4.41071C16.5776 4.56699 16.6654 4.77895 16.6654 4.99997V10.8333Z" stroke="#4ADE80" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.5 10L9.16667 11.6667L12.5 8.33337" stroke="#4ADE80" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="webinars-cover-project-content">
                  <span className="webinars-cover-project-title">{projectTitle}</span>
                  <span className="webinars-cover-project-subtitle">{projectSubtitle}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="webinars-cover-right">
            {topics.length > 0 && (
              <div className="webinars-cover-grid">
                {topics.map((topic) => {
                  const iconUrl = getIconUrl(topic.icon)
                  
                  return (
                    <div key={topic._id} className="webinars-cover-card">
                      <div className="webinars-cover-card-icon-wrap">
                        {iconUrl ? (
                          <img
                            src={iconUrl}
                            alt=""
                            width={28}
                            height={28}
                            className="webinars-cover-card-icon"
                            aria-hidden
                            loading="lazy"
                            onError={(e) => {
                              console.error('Failed to load topic icon:', {
                                originalPath: topic.icon,
                                processedUrl: iconUrl,
                                attemptedSrc: e.target.src,
                                title: topic.title,
                                fullUrl: typeof window !== 'undefined' ? window.location.origin + iconUrl : iconUrl
                              })
                              // Try original path
                              const originalPath = topic.icon?.trim()
                              if (originalPath && e.target.src !== originalPath) {
                                const cleanOriginal = originalPath.startsWith('/') 
                                  ? originalPath 
                                  : `/${originalPath}`
                                console.log('Retrying with original path:', cleanOriginal)
                                e.target.src = cleanOriginal
                              } else {
                                e.target.style.opacity = '0.3'
                                e.target.alt = 'Icon not found'
                              }
                            }}
                            onLoad={() => {
                              console.log('Topic icon loaded successfully:', iconUrl)
                            }}
                          />
                        ) : (
                          <div style={{ 
                            width: 28, 
                            height: 28, 
                            backgroundColor: '#f0f0f0', 
                            borderRadius: '4px' 
                          }} />
                        )}
                      </div>
                      <h3 className="webinars-cover-card-title">{topic.title}</h3>
                      <p className="webinars-cover-card-description">{topic.description}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WebinarsCoverSection
