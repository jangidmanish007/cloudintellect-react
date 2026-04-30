import { useEffect, useState } from 'react'
import { webinarsAPI } from '../services/api'
import { usePageContentContext } from '../contexts/PageContentContext'

const WEBINAR_ATTEND_BASE = '/images/Webinar_Attend'

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
  // So /images/Webinar_Attend/file.svg should work directly
  // Don't encode unless necessary (spaces or special chars)
  if (cleanPath.includes(' ') || /[^a-zA-Z0-9\/._-]/.test(cleanPath)) {
    // Only encode the parts that need it, not the whole path
    cleanPath = cleanPath.split('/').map(part => {
      if (part && (part.includes(' ') || /[^a-zA-Z0-9._-]/.test(part))) {
        return encodeURIComponent(part)
      }
      return part
    }).join('/')
  }
  
  // Add cache busting for uploaded files (files with timestamp in name)
  // This helps Vite pick up newly uploaded files
  if (cleanPath.includes('file-') && cleanPath.match(/file-\d+/)) {
    // Already has timestamp, but add a small query param to force refresh if needed
    // Actually, don't add query param - Vite should handle it
    // But we can add ?v=timestamp if file was just uploaded
  }
  
  return cleanPath
}

function WhoShouldAttendSection() {
  const { content } = usePageContentContext()
  const [attendees, setAttendees] = useState([])
  const [loading, setLoading] = useState(true)

  // Get heading from page content, with fallback
  const sectionContent = content?.whoShouldAttend || {}
  const heading = sectionContent.heading || sectionContent.title || 'Who Should Attend?'
  // Split heading for bold part
  const headingMatch = heading.match(/^(.+?)\s*(Attend\??)$/i)
  const headingLine1 = headingMatch ? headingMatch[1].trim() : heading.split(' ').slice(0, -1).join(' ') || 'Who Should'
  const headingLine2 = headingMatch ? headingMatch[2].trim() : heading.split(' ').slice(-1)[0] || 'Attend?'

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await webinarsAPI.getWhoShouldAttend()
        setAttendees(response.data || [])
      } catch (error) {
        console.error('Error fetching who should attend:', error)
        // Fallback to empty array if API fails
        setAttendees([])
      } finally {
        setLoading(false)
      }
    }

    fetchAttendees()
  }, [])

  if (loading) {
    return (
      <section className="who-should-attend-section">
        <div className="who-should-attend-container">
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        </div>
      </section>
    )
  }

  if (attendees.length === 0) {
    return null
  }

  return (
    <section className="who-should-attend-section">
      <div className="who-should-attend-container">
        <h2 className="who-should-attend-heading">
          {headingLine1} <span>{headingLine2}</span>
        </h2>
        <div className="who-should-attend-grid">
          {attendees.map((attendee) => {
            // Get properly formatted icon URL
            const iconUrl = getIconUrl(attendee.icon)
            
            console.log('Rendering attendee icon:', { 
              original: attendee.icon, 
              processed: iconUrl,
              title: attendee.title,
              fullUrl: typeof window !== 'undefined' ? window.location.origin + iconUrl : iconUrl
            })
            
            return (
              <div key={attendee._id} className="who-should-attend-card">
                <div className="who-should-attend-card-icon-wrap">
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt=""
                      width={28}
                      height={28}
                      className="who-should-attend-card-icon"
                      aria-hidden
                      loading="lazy"
                      onError={(e) => {
                        const errorInfo = {
                          originalPath: attendee.icon,
                          processedUrl: iconUrl,
                          attemptedSrc: e.target.src,
                          title: attendee.title,
                          currentOrigin: window.location.origin,
                          fullAttemptedUrl: window.location.origin + iconUrl
                        }
                        console.error('Failed to load icon:', errorInfo)
                        
                        // Try multiple fallback strategies
                        const originalPath = attendee.icon?.trim()
                        if (originalPath) {
                          const cleanOriginal = originalPath.startsWith('/') 
                            ? originalPath 
                            : `/${originalPath}`
                          
                          // Try original path
                          if (e.target.src !== cleanOriginal && e.target.src !== originalPath) {
                            console.log('Retrying with original path:', cleanOriginal)
                            e.target.src = cleanOriginal
                            return
                          }
                          
                          // Try without encoding
                          if (iconUrl !== cleanOriginal) {
                            console.log('Retrying without encoding:', cleanOriginal)
                            e.target.src = cleanOriginal
                            return
                          }
                        }
                        
                        // If all retries fail, show placeholder
                        e.target.style.opacity = '0.3'
                        e.target.alt = 'Icon not found'
                        e.target.title = `Failed to load: ${attendee.icon}`
                      }}
                      onLoad={() => {
                        console.log('Icon loaded successfully:', iconUrl)
                      }}
                    />
                  ) : (
                    <div style={{ 
                      width: 28, 
                      height: 28, 
                      backgroundColor: '#f0f0f0', 
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#999'
                    }}>
                      ?
                    </div>
                  )}
                </div>
                <h3 className="who-should-attend-card-title">{attendee.title}</h3>
                <p className="who-should-attend-card-description">{attendee.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WhoShouldAttendSection
