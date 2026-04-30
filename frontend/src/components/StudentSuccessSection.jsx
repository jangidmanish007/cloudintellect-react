import { useEffect, useMemo, useRef, useState } from 'react'
import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl, successStoriesAPI } from '../services/api'

function StudentSuccessSection() {
  const { content } = usePageContentContext()
  const sectionContent = content?.studentSuccess || {}

  const [activeIndex, setActiveIndex] = useState(0)
  const [remoteLearners, setRemoteLearners] = useState([])
  const [remoteLoading, setRemoteLoading] = useState(false)
  const carouselRef = useRef(null)
  const cardRefs = useRef([])

  const learners = useMemo(() => {
    const contentLearners = Array.isArray(sectionContent.learners) ? sectionContent.learners : []
    if (contentLearners.length > 0) {
      return contentLearners
        .filter((l) => l && (l.thumbnailImage || l.mainImage || l.image || l.name || l.testimonial || l.headline))
        .map((l, idx) => ({
          _id: l._id || l.id || `content-${idx}`,
          name: l.name || 'Learner',
          lastName: l.lastName || '',
          thumbnailImage: getImageUrl(l.thumbnailImage || l.image) || (l.thumbnailImage || l.image) || '',
          mainImage: getImageUrl(l.mainImage || l.image) || (l.mainImage || l.image) || '',
          headline: l.headline || sectionContent.cardHeadline || sectionContent.headline || 'From Training to Real Implementation',
          headlineBold: Array.isArray(l.headlineBold)
            ? l.headlineBold
            : (Array.isArray(sectionContent.cardHeadlineBold) ? sectionContent.cardHeadlineBold : (Array.isArray(sectionContent.headlineBold) ? sectionContent.headlineBold : ['Training', 'Real Implementation'])),
          testimonial: l.testimonial || '',
        }))
    }
    return remoteLearners
  }, [
    sectionContent.learners,
    sectionContent.cardHeadline,
    sectionContent.cardHeadlineBold,
    sectionContent.headline,
    sectionContent.headlineBold,
    remoteLearners,
  ])

  useEffect(() => {
    const contentLearners = Array.isArray(sectionContent.learners) ? sectionContent.learners : []
    if (contentLearners.length > 0) return
    if (remoteLearners.length > 0) return

    let cancelled = false
    setRemoteLoading(true)
    successStoriesAPI
      .getAll()
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : []
        const mapped = list
          .filter((s) => s && (s.name || s.profileImage || s.text))
          .map((s, idx) => {
            const full = String(s.name || 'Learner').trim()
            const parts = full.split(/\s+/).filter(Boolean)
            const first = parts[0] || 'Learner'
            const last = parts.slice(1).join(' ')
            const img = s.profileImage ? getImageUrl(s.profileImage) : ''
            return {
              _id: s._id || `api-${idx}`,
              name: first,
              lastName: last,
              thumbnailImage: img,
              mainImage: img,
              headline:
                sectionContent.cardHeadline ||
                sectionContent.headline ||
                'From Training to Real Implementation',
              headlineBold: Array.isArray(sectionContent.cardHeadlineBold)
                ? sectionContent.cardHeadlineBold
                : Array.isArray(sectionContent.headlineBold)
                  ? sectionContent.headlineBold
                  : ['Training', 'Real Implementation'],
              testimonial: s.text || '',
            }
          })

        if (!cancelled) setRemoteLearners(mapped)
      })
      .catch((e) => {
        if (import.meta.env?.DEV) {
          console.error('Failed to load success stories for student section:', e)
        }
      })
      .finally(() => {
        if (!cancelled) setRemoteLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [
    remoteLearners.length,
    sectionContent.cardHeadline,
    sectionContent.cardHeadlineBold,
    sectionContent.headline,
    sectionContent.headlineBold,
    sectionContent.learners,
  ])

  useEffect(() => {
    if (activeIndex > learners.length - 1) setActiveIndex(0)
  }, [activeIndex, learners.length])

  useEffect(() => {
    const carousel = carouselRef.current
    const card = cardRefs.current[activeIndex]
    if (!carousel || !card) return
    const maxScroll = Math.max(0, carousel.scrollWidth - carousel.clientWidth)
    const target =
      card.offsetLeft - (carousel.clientWidth - card.offsetWidth) / 2
    carousel.scrollTo({
      left: Math.max(0, Math.min(target, maxScroll)),
      behavior: 'smooth',
    })
  }, [activeIndex, learners.length])

  const learner = learners[activeIndex] || learners[0]

  const renderHeadline = () => {
    if (!learner?.headline) return null
    const parts = learner.headlineBold || []
    let text = learner.headline
    parts.forEach((bold) => {
      text = text.replace(bold, `__B__${bold}__B__`)
    })
    return text.split('__B__').map((chunk, i) =>
      i % 2 === 1 ? <strong key={i}>{chunk}</strong> : chunk
    )
  }

  if (!learners || learners.length === 0) {
    if (remoteLoading) return null
    return null
  }

  return (
    <section className="student-success-section">
      <div className="student-success-container">
        <div className="student-success-left">
          <p className="student-success-label">{sectionContent.title || 'Student Success Stories'}</p>
          <h2 className="student-success-title">
            {sectionContent.description
              ? sectionContent.description
              : <>Discover the <strong>inspiring stories & honest experiences</strong> shared by our <strong>successful learners.</strong></>
            }
          </h2>
          <div className="student-success-carousel-wrap">
            <div className="student-success-arrows">
              <button
                type="button"
                className="student-success-arrow student-success-prev"
                onClick={() => setActiveIndex((i) => (i <= 0 ? learners.length - 1 : i - 1))}
                aria-label="Previous learner"
                disabled={learners.length <= 1}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                className="student-success-arrow student-success-next"
                onClick={() => setActiveIndex((i) => (i >= learners.length - 1 ? 0 : i + 1))}
                aria-label="Next learner"
                disabled={learners.length <= 1}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
            <div ref={carouselRef} className="student-success-carousel">
              {learners.map((item, index) => (
                <button
                  key={item._id || `${item.name}-${item.lastName}-${index}`}
                  ref={(el) => {
                    cardRefs.current[index] = el
                  }}
                  type="button"
                  className={`student-success-card ${activeIndex === index ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="student-success-card-image">
                    <img src={item.thumbnailImage || item.mainImage} alt="" decoding="async" />
                  </div>
                  <span className="student-success-card-name">{item.name} {item.lastName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="student-success-right">
          <div className="student-success-testimonial-card">
            <div className="student-success-testimonial-inner">
              <div className="student-success-testimonial-content">
                <div className="student-success-quote" aria-hidden>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                  </svg>
                </div>
                <h3 className="student-success-headline">{renderHeadline()}</h3>
                <p className="student-success-testimonial">{learner?.testimonial || ''}</p>
              </div>
              <div className="student-success-testimonial-visual">
                <img className="student-success-testimonial-photo" src={learner.mainImage || learner.thumbnailImage} alt="" decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StudentSuccessSection
