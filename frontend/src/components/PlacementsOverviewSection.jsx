import { useState, useEffect } from 'react'
import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'
import AppLink from './AppLink'

const SLIDER_BREAKPOINT = 768 // below this: 1 card visible; at or above: 2 cards

const DEFAULT_STATS_TOP = [
  { value: '1400+', label: 'Successful Placements' },
  { value: '300+', label: 'Hiring Partners' },
  { value: '32.5 LPA', label: 'Highest National Package' },
]

const DEFAULT_STATS_BOTTOM = [
  { value: '15', label: 'Packages Offered by Top Companies' },
  { value: '10', label: 'Packages Offered by Leading IT Firms' },
  { value: '7', label: 'Packages Offered by Mid & Large Enterprises' },
  { value: '5', label: 'Packages Offered by Consulting & Startup Companies' },
]

function PlacementsOverviewSection() {
  const { content } = usePageContentContext()
  const overview = content?.placementsOverview || {}

  const [slideIndex, setSlideIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(2)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${SLIDER_BREAKPOINT - 1}px)`)
    const update = () => setVisibleCount(mq.matches ? 1 : 2)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Left side: image slider – 1 card on small screens, 2 on larger (uploaded from admin)
  const sliderImages = Array.isArray(overview.sliderImages) && overview.sliderImages.length > 0
    ? overview.sliderImages.filter((s) => s && (s.image || s.url))
    : []
  const slideCount = sliderImages.length
  const maxIndex = Math.max(0, slideCount - visibleCount)
  const canPrev = slideCount > visibleCount && slideIndex > 0
  const canNext = slideCount > visibleCount && slideIndex < maxIndex
  const goPrev = () => setSlideIndex((i) => (i <= 0 ? maxIndex : i - 1))
  const goNext = () => setSlideIndex((i) => (i >= maxIndex ? 0 : i + 1))
  const trackWidthPercent = slideCount > 0 ? slideCount * (100 / visibleCount) : 100
  const translatePercent = slideCount > 0 ? slideIndex * (100 / slideCount) : 0

  const label = overview.label ?? 'Placements Overview'
  const headlinePart1 = overview.headlinePart1 ?? "The World's"
  const headlineBold = overview.headlineBold ?? 'Leading Companies Hire'
  const headlinePart2 = overview.headlinePart2 ?? 'Our Talent'
  const applyText = overview.applyButtonText ?? 'Apply Today'
  const applyHref = overview.applyButtonHref ?? '#apply'
  const viewText = overview.viewPlacementsText ?? 'View Placements'
  const viewHref = overview.viewPlacementsHref ?? '#placements'
  const statsTop = Array.isArray(overview.statsTop) && overview.statsTop.length > 0 ? overview.statsTop : DEFAULT_STATS_TOP
  const statsBottom = Array.isArray(overview.statsBottom) && overview.statsBottom.length > 0 ? overview.statsBottom : DEFAULT_STATS_BOTTOM

  return (
    <section className="placements-section placements-overview-section placements-overview-section--image-slider">
      <div className="placements-container">
        {/* Left: Image slider – 2 image cards visible, images uploaded from admin */}
        <div className="placements-carousel-wrap placements-overview-slider-wrap">
          {slideCount > 0 ? (
            <>
              <div
                className="placements-overview-slider-track"
                style={{
                  '--overview-slide-count': slideCount,
                  '--overview-gap-count': Math.max(0, slideCount - 1),
                  width: `${trackWidthPercent}%`,
                  transform: `translateX(-${translatePercent}%)`,
                }}
              >
                {sliderImages.map((slide, i) => {
                  const imagePath = slide.image || slide.url || ''
                  const imageUrl = imagePath ? getImageUrl(imagePath) : ''
                  return (
                    <div key={i} className="placements-overview-slider-card">
                      <div
                        className="placements-overview-slider-bg"
                        style={{
                          backgroundImage: imageUrl ? `url(${imageUrl})` : 'linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
                        }}
                      >
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt=""
                            className="placements-overview-slider-img"
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              {slideCount > visibleCount && (
                <div className="placements-carousel-nav">
                  <button
                    type="button"
                    className="placements-nav-btn placements-nav-prev"
                    aria-label="Previous"
                    disabled={!canPrev}
                    onClick={goPrev}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <button
                    type="button"
                    className="placements-nav-btn placements-nav-next"
                    aria-label="Next"
                    disabled={!canNext}
                    onClick={goNext}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
              )}
              {/* {slideCount > visibleCount && (
                <div className="placements-overview-slider-dots" aria-hidden="true">
                  {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`placements-overview-slider-dot ${i === slideIndex ? 'active' : ''}`}
                      aria-label={`Go to set ${i + 1}`}
                      onClick={() => setSlideIndex(i)}
                    />
                  ))}
                </div>
              )} */}
            </>
          ) : (
            <div className="placements-overview-slider-placeholder-wrap">
              <div className="placements-overview-slider-placeholder">
                <span>Add slider images in Admin → Pages → Home → Placements Overview Section</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Placements Overview + CTA + Stats (from page content) */}
        <div className="placements-content">
          <p className="placements-label">{label}</p>
          <h2 className="placements-headline">
            {headlinePart1} <strong>{headlineBold}</strong><br />{headlinePart2}
          </h2>
          <div className="placements-buttons">
            <AppLink href={applyHref} className="placements-btn placements-btn-primary">
              {applyText}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </AppLink>
            <AppLink href={viewHref} className="placements-btn placements-btn-secondary">
              {viewText}
            </AppLink>
          </div>
          <div className="placements-stats">
            <div className="placements-stats-row placements-stats-top">
              {statsTop.map((stat, i) => (
                <div key={i} className="placements-stat">
                  <div className="placements-stat-card placements-stat-card-light">
                    <span className="placements-stat-value placements-stat-value-blue">{stat.value}</span>
                    <span className="placements-overview-stat-caption">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="placements-stats-row placements-stats-bottom">
              {statsBottom.map((stat, i) => (
                <div key={i} className="placements-stat placements-stat-block">
                  <span className="placements-stat-value placements-stat-value-lpa">
                    {stat.value}<sub>LPA</sub>
                  </span>
                  <span className="placements-overview-stat-caption">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PlacementsOverviewSection
