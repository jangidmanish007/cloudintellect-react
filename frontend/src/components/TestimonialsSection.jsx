import { useState, useEffect, useCallback } from 'react'
import { testimonialsAPI, getImageUrl } from '../services/api'

// Helper to extract YouTube video ID from various URL formats (watch, embed, youtu.be, mobile, etc.)
const getYouTubeVideoId = (url) => {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  if (!trimmed) return null
  // youtu.be/VIDEO_ID (short link)
  const shortMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{10,12})(?:[?#&]|$)/)
  if (shortMatch) return shortMatch[1]
  // youtube.com/embed/VIDEO_ID
  const embedMatch = trimmed.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{10,12})(?:[?#&]|$)/)
  if (embedMatch) return embedMatch[1]
  // youtube.com/watch?v=VIDEO_ID (and other query forms)
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?)(?:.*&)?v=([a-zA-Z0-9_-]{10,12})(?:[&]|$)/)
  if (watchMatch) return watchMatch[1]
  try {
    const u = new URL(trimmed)
    if (u.hostname.replace(/^www\./, '') === 'youtube.com' && u.searchParams.get('v')) {
      return u.searchParams.get('v')
    }
    if (u.hostname === 'youtu.be' && u.pathname.slice(1)) {
      return u.pathname.slice(1).split(/[?#&]/)[0]
    }
  } catch (_) {}
  return null
}

// Get YouTube thumbnail URL
const getYouTubeThumbnail = (videoId) => {
  if (!videoId) return null
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

// selectedVideo: { type: 'youtube', id } | { type: 'embed', url } | null
function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await testimonialsAPI.getAll()
      setTestimonials(response.data || [])
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const closeVideoModal = useCallback(() => {
    setSelectedVideo(null)
  }, [])

  // Always play in popup – never redirect. Use YouTube embed URL only (watch URL cannot be iframe'd).
  const handleVideoClick = (testimonial) => {
    if (!testimonial.videoUrl) return
    const videoId = getYouTubeVideoId(testimonial.videoUrl)
    if (videoId) {
      setSelectedVideo({ type: 'youtube', id: videoId })
    } else {
      // Non-YouTube (e.g. Vimeo): use URL in iframe. Never use YouTube watch URL here – it would "refuse to connect".
      const isYoutube = /youtube\.com|youtu\.be/i.test(testimonial.videoUrl)
      if (isYoutube) {
        // URL looks like YouTube but we didn't parse ID – try one more time with raw string v= capture
        const fallbackId = (testimonial.videoUrl.match(/[?&]v=([a-zA-Z0-9_-]{10,12})/) || testimonial.videoUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{10,12})/))?.[1]
        if (fallbackId) setSelectedVideo({ type: 'youtube', id: fallbackId })
        else setSelectedVideo({ type: 'embed', url: testimonial.videoUrl })
      } else {
        setSelectedVideo({ type: 'embed', url: testimonial.videoUrl })
      }
    }
  }

  // Close on Escape, lock body scroll when modal is open
  useEffect(() => {
    if (!selectedVideo) return
    const origOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeVideoModal()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = origOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selectedVideo, closeVideoModal])

  if (loading) {
    return (
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="testimonials-loading">Loading testimonials...</div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return (
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="testimonials-empty">
            <p>No testimonials available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="testimonials-section">
        <div className="testimonials-container">
          <h2 className="testimonials-section-title">Alumni Spotlights</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => {
              const videoId = testimonial.videoUrl ? getYouTubeVideoId(testimonial.videoUrl) : null
              const thumbnailUrl = testimonial.coverPhoto 
                ? getImageUrl(testimonial.coverPhoto)
                : videoId 
                  ? getYouTubeThumbnail(videoId)
                  : testimonial.image 
                    ? getImageUrl(testimonial.image)
                    : null
              const hasVideo = !!testimonial.videoUrl

              // Background colors for cards (cycling through colors)
              const bgColors = ['#E5E7EB', '#BFDBFE', '#FBCFE8', '#FDE68A', '#C7D2FE', '#A7F3D0']
              const bgColor = bgColors[index % bgColors.length]

              return (
                <div key={testimonial._id} className="testimonial-card">
                  <div 
                    className={`testimonial-image-wrapper ${hasVideo ? 'testimonial-image-wrapper--video' : ''}`}
                    onClick={() => hasVideo && handleVideoClick(testimonial)}
                    style={{ 
                      cursor: hasVideo ? 'pointer' : 'default',
                      backgroundColor: bgColor
                    }}
                  >
                    {thumbnailUrl && (
                      <img
                        src={thumbnailUrl}
                        alt={testimonial.name}
                        className="testimonial-image"
                        loading="lazy"
                        style={{
                          objectFit: 'cover',
                          objectPosition: 'center bottom',
                          width: '100%',
                          height: '100%'
                        }}
                        onError={(e) => {
                          console.error('Failed to load thumbnail:', thumbnailUrl)
                          e.target.style.display = 'none'
                        }}
                      />
                    )}
                    {hasVideo && (
                      <div className="testimonial-play-button">
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="40" cy="40" r="40" fill="rgba(255, 255, 255, 0.9)"/>
                          <circle cx="40" cy="40" r="38" stroke="rgba(0, 0, 0, 0.2)" strokeWidth="2"/>
                          <path d="M32 26L32 54L54 40L32 26Z" fill="#1E1E1E"/>
                        </svg>
                      </div>
                    )}
                    {(testimonial.specialization || testimonial.program) && (
                      <div className="testimonial-badge">
                        {testimonial.specialization || testimonial.program}
                      </div>
                    )}
                    <div className="testimonial-gradient-overlay">
                      <div className="testimonial-content-overlay">
                        <h3 className="testimonial-name">{testimonial.name}</h3>
                        {testimonial.role && (
                          <p className="testimonial-role">{testimonial.role}</p>
                        )}
                        {testimonial.company && (
                          <div className="testimonial-company-badge">
                            {testimonial.company}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Video popup – always in-page, never redirect to YouTube */}
      {selectedVideo && (
        <div
          className="video-modal-overlay"
          onClick={closeVideoModal}
          role="dialog"
          aria-modal="true"
          aria-label="Testimonial video"
        >
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={closeVideoModal} aria-label="Close video">×</button>
            <div className="video-modal-embed">
              {selectedVideo.type === 'youtube' ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Testimonial Video"
                />
              ) : (
                /* Only use embed URL for non-YouTube (e.g. Vimeo). YouTube watch URLs must use /embed/ or they refuse to connect. */
                !/youtube\.com|youtu\.be/i.test(selectedVideo.url) ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={selectedVideo.url}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Testimonial Video"
                  />
                ) : (
                  <div className="video-modal-unavailable">
                    <p>This video could not be loaded. Please check the video link format (use a standard YouTube or youtu.be URL).</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TestimonialsSection
