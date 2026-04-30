import { Link } from 'react-router-dom'
import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

const isInternalLink = (href) => {
  if (!href || href === '#') return false
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return false
  if (href.startsWith('#')) return false
  return true
}

const NavLink = ({ href, children, className, ...props }) => {
  if (isInternalLink(href)) {
    const path = href.startsWith('/') ? href : `/${href}`
    return <Link to={path} className={className} {...props}>{children}</Link>
  }
  return <a href={href || '#'} className={className} {...props}>{children}</a>
}

function LandingHeroSection() {
  const { content } = usePageContentContext()
  const hero = content?.hero || {}
  const topBar = hero.topBar || {}
  const eventBar = hero.eventBar || {}
  const video = hero.video || {}
  const cta = hero.cta || {}
  const stats = Array.isArray(hero.stats) ? hero.stats : []

  const backgroundPath = hero.backgroundImage || ''
  const backgroundUrl = backgroundPath ? (backgroundPath.startsWith('/') ? getImageUrl(backgroundPath) : backgroundPath) : ''

  const logoPath = topBar.logoUrl || '/images/Logo (1).webp'
  const logoUrl = logoPath.startsWith('/') ? getImageUrl(logoPath) : logoPath
  const tagline = topBar.tagline || 'IT Training | Placements | Consulting'
  const phone = topBar.phone || '8766996944'
  const contactBtnText = topBar.contactButtonText || 'Contact Us'
  const contactBtnHref = topBar.contactButtonHref || '/contact'

  const eventDate = eventBar.date || '8th November'
  const eventTime = eventBar.time || '08:30 AM'

  const headline = hero.headline || 'Become a Salesforce Developer in 90 Days & Land a ₹5-22 LPA IT Job.'
  const accent1 = hero.headlineAccent1 || '90 Days'
  const accent2 = hero.headlineAccent2 || '₹5-22 LPA IT Job'
  const subHeadline = hero.subHeadline || "Even if You're from Non-IT."
  const supportingText = hero.supportingText || 'Join 1200+ students who transformed their career with Salesforce. Live Masterclass + Guaranteed Placement Assistance.'

  const videoThumbUrl = video.thumbnailUrl ? (video.thumbnailUrl.startsWith('/') ? getImageUrl(video.thumbnailUrl) : video.thumbnailUrl) : ''
  const videoUrl = video.videoUrl || '#'

  const ctaText = cta.buttonText || 'Register for a free 3-day Masterclass'
  const ctaAccent = cta.buttonTextAccent || '3-day Masterclass'
  const ctaHref = cta.buttonHref || '#register'

  // Build headline with optional accent highlights (replace first occurrence of accent1, then accent2)
  const renderHeadline = () => {
    let rest = headline
    const parts = []
    if (accent1 && rest.includes(accent1)) {
      const i = rest.indexOf(accent1)
      if (i > 0) parts.push(rest.slice(0, i))
      parts.push({ type: 'accent', text: accent1 })
      rest = rest.slice(i + accent1.length)
    }
    if (accent2 && rest.includes(accent2)) {
      const i = rest.indexOf(accent2)
      if (i > 0) parts.push(rest.slice(0, i))
      parts.push({ type: 'accent', text: accent2 })
      rest = rest.slice(i + accent2.length)
    }
    if (rest) parts.push(rest)
    return parts.map((p, i) =>
      typeof p === 'object' && p.type === 'accent'
        ? <span key={i} className="landing-hero-headline-accent">{p.text}</span>
        : <span key={i}>{p}</span>
    )
  }

  return (
    <section
      className="landing-hero-section"
      style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : undefined}
    >
      <div className="landing-hero-bg-pattern" aria-hidden="true" />
      <div className="landing-hero-container">
        {/* Top bar: logo, tagline, phone, contact button */}
        <header className="landing-hero-topbar">
          <div className="landing-hero-brand">
            {logoUrl && <img src={logoUrl} alt="Cloud Intellect" className="landing-hero-logo" />}
            {/* <span className="landing-hero-logo-text">CLOUD INTELLECT</span>
            <span className="landing-hero-tagline">{tagline}</span> */}
          </div>
          <div className="landing-hero-topbar-right">
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="landing-hero-phone">
              <span className="landing-hero-phone-icon" aria-hidden>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M13.9996 10.4817V12.5893C14.0004 12.7849 13.9602 12.9786 13.8817 13.1578C13.8031 13.3371 13.6879 13.498 13.5435 13.6303C13.399 13.7626 13.2285 13.8633 13.0428 13.9259C12.8571 13.9886 12.6603 14.0119 12.465 13.9943C10.299 13.7594 8.2183 13.0207 6.39023 11.8376C4.68945 10.7589 3.24748 9.31984 2.16674 7.62243C0.977102 5.78969 0.236769 3.70306 0.00571348 1.53156C-0.011877 1.33729 0.0112568 1.1415 0.0736417 0.956639C0.136027 0.77178 0.236296 0.601911 0.368066 0.457846C0.499835 0.313781 0.660218 0.198678 0.839003 0.119863C1.01779 0.0410494 1.21106 0.000251806 1.40651 6.81111e-05H3.51826C3.85987 -0.00328744 4.19105 0.117444 4.45007 0.33976C4.70909 0.562076 4.87828 0.870806 4.92609 1.20841C5.01522 1.88287 5.18052 2.54511 5.41883 3.18249C5.51354 3.43394 5.53403 3.70721 5.47789 3.96993C5.42175 4.23265 5.29132 4.4738 5.10207 4.66481L4.20809 5.55701C5.21016 7.31581 6.6693 8.77206 8.43159 9.77214L9.32556 8.87994C9.51695 8.69106 9.75858 8.56089 10.0218 8.50486C10.2851 8.44883 10.5589 8.46929 10.8108 8.56381C11.4495 8.80164 12.113 8.96662 12.7888 9.05557C13.1308 9.10371 13.4431 9.2756 13.6663 9.53855C13.8895 9.8015 14.0081 10.1372 13.9996 10.4817Z" fill="#00FFE6" />
                </svg>
              </span>
              {phone}
            </a>
            <NavLink href={contactBtnHref} className="landing-hero-contact-btn">
              {contactBtnText}
            </NavLink>
          </div>
        </header>

        {/* Event bar */}
        <div className="landing-hero-eventbar">
          <span className="landing-hero-eventbar-icon" aria-hidden>🕐</span>
          <span>Date: {eventDate} | Time: {eventTime}</span>
        </div>

        {/* Main content: left = copy + stats, right = video */}
        <div className="landing-hero-main">
          <div className="landing-hero-content">
            <h1 className="landing-hero-headline">
              {renderHeadline()}
            </h1>
            <p className="landing-hero-subheadline">{subHeadline}</p>
            <p className="landing-hero-supporting">{supportingText}</p>
            <div className="landing-hero-stats">
              {stats.map((stat, i) => (
                <div key={i} className="landing-hero-stat">
                  <span className="landing-hero-stat-value">{stat.value}</span>
                  <span className="landing-hero-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
            <NavLink href={ctaHref} className="landing-hero-cta-btn">
              {ctaAccent && ctaText.includes(ctaAccent) ? (
                <>
                  {ctaText.slice(0, ctaText.indexOf(ctaAccent))}
                  <span className="landing-hero-cta-accent">{ctaAccent}</span>
                  {ctaText.slice(ctaText.indexOf(ctaAccent) + ctaAccent.length)}
                </>
              ) : (
                ctaText
              )}
            </NavLink>
          </div>
          <div className="landing-hero-video-wrap">
            <NavLink href={videoUrl} className="landing-hero-video-thumb" aria-label="Play video">
              {videoThumbUrl ? (
                <img src={videoThumbUrl} alt="" />
              ) : (
                <div className="landing-hero-video-placeholder">Video</div>
              )}
              <span className="landing-hero-play-icon" aria-hidden>▶</span>
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingHeroSection
