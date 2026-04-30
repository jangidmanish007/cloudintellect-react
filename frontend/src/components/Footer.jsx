import { useEffect, useMemo, useState } from 'react'
import { footerSettingsAPI } from '../services/api'
import AppLink from './AppLink'

const DEFAULT_FOOTER = {
  brand: {
    name: 'Cloud Intellect',
    tagline: 'IT Training | Placement | Consulting',
    description: "India's #1 Salesforce training institute, empowering careers since 2012.",
    logoImage: '/images/Logo (1).webp',
  },
  contact: {
    locationText: 'Nagpur & Pune Centers',
    email: 'info@cloudintellect.in',
    phone: '+91 98765 43210',
  },
  socialLinks: [
    { platform: 'linkedin', href: '#', isActive: true },
    { platform: 'instagram', href: '#', isActive: true },
    { platform: 'facebook', href: '#', isActive: true },
    { platform: 'youtube', href: '#', isActive: true },
  ],
  columns: [
    { title: 'Institute', order: 0, isActive: true, links: [
      { label: 'Home Page', href: '/', order: 0, isActive: true },
      { label: 'About Us', href: '/about', order: 1, isActive: true },
      { label: 'Why Choose Cloud Intellect', href: '/why-choose-us', order: 2, isActive: true },
      { label: 'Leadership', href: '/leadership', order: 3, isActive: true },
      { label: 'Contact Us', href: '/contact', order: 4, isActive: true },
      { label: 'FAQ', href: '/faq', order: 5, isActive: true },
    ]},
    { title: 'Programs', order: 1, isActive: true, links: [
      { label: 'Salesforce Developer', href: '/salesforce-developer', order: 0, isActive: true },
      { label: 'Salesforce Marketing Cloud', href: '/salesforce-marketing-cloud', order: 1, isActive: true },
      { label: 'SFDC & SFMC', href: '/sfmc-sfdc', order: 2, isActive: true },
    ]},
    { title: 'Resources', order: 2, isActive: true, links: [
      { label: 'Placement', href: '/placements', order: 0, isActive: true },
      { label: 'Alumni Success', href: '/alumni-success', order: 1, isActive: true },
      { label: 'Testimonials', href: '/testimonials', order: 2, isActive: true },
      { label: 'Webinar', href: '/webinars', order: 3, isActive: true },
      { label: 'Blog', href: '#', order: 4, isActive: true },
      { label: 'Gallery', href: '/gallery', order: 5, isActive: true },
    ]},
  ],
  bottomBar: {
    copyrightText: '© 2026 Cloud Intellect. All rights reserved.',
    creditText: 'Design & Developed by Medisign',
  },
}

function SocialIcon({ platform }) {
  const p = (platform || '').toLowerCase()
  if (p === 'linkedin') {
    return (
      <svg aria-hidden viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A2.06 2.06 0 0 0 3 5.07c0 1.13.9 2.04 2.2 2.04h.02c1.32 0 2.2-.9 2.2-2.04A2.06 2.06 0 0 0 5.25 3Zm7 5.5H8.88V20h3.38v-6.42c0-1.7.92-2.83 2.36-2.83 1.36 0 2.02.98 2.02 2.83V20H20v-6.98c0-3.6-1.9-4.84-4.16-4.84-1.7 0-2.74.75-3.6 1.96h-.01V8.5Z"/>
      </svg>
    )
  }
  if (p === 'instagram') {
    return (
      <svg aria-hidden viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5"/>
        <circle cx="12" cy="12" r="4.1"/>
        <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none"/>
      </svg>
    )
  }
  if (p === 'facebook') {
    return (
      <svg aria-hidden viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M13.4 21v-7.7h2.6l.39-3.01H13.4V8.4c0-.87.25-1.46 1.53-1.46h1.64V4.25A22 22 0 0 0 14.2 4c-2.4 0-4.05 1.47-4.05 4.18v2.14H7.43v3h2.72V21h3.25Z"/>
      </svg>
    )
  }
  if (p === 'youtube') {
    return (
      <svg aria-hidden viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M22 12s0-3.1-.4-4.6a2.4 2.4 0 0 0-1.7-1.7C18.4 5.3 12 5.3 12 5.3s-6.4 0-7.9.4a2.4 2.4 0 0 0-1.7 1.7C2 8.9 2 12 2 12s0 3.1.4 4.6a2.4 2.4 0 0 0 1.7 1.7c1.5.4 7.9.4 7.9.4s6.4 0 7.9-.4a2.4 2.4 0 0 0 1.7-1.7c.4-1.5.4-4.6.4-4.6ZM10 15.5v-7l6 3.5-6 3.5Z"/>
      </svg>
    )
  }
  if (p === 'twitter') return <span aria-hidden>X</span>
  return <span aria-hidden>•</span>
}

function ContactIcon({ type }) {
  if (type === 'location') {
    return (
      <svg aria-hidden viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M12 2a7 7 0 0 0-7 7c0 5.26 7 13 7 13s7-7.74 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"/>
      </svg>
    )
  }
  if (type === 'email') {
    return (
      <svg aria-hidden viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7 8-5H4l8 5Zm0 2L4 9v8h16V9l-8 5Z"/>
      </svg>
    )
  }
  if (type === 'phone') {
    return (
      <svg aria-hidden viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M6.62 10.79a15.46 15.46 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24 11.2 11.2 0 0 0 3.52.56 1 1 0 0 1 1 1V21a1 1 0 0 1-1 1C10.85 22 2 13.15 2 2a1 1 0 0 1 1-1h4.5a1 1 0 0 1 1 1c0 1.22.2 2.4.56 3.52a1 1 0 0 1-.24 1.01l-2.2 2.26Z"/>
      </svg>
    )
  }
  return <span aria-hidden>•</span>
}

function Footer() {
  const [data, setData] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await footerSettingsAPI.get()
        if (!cancelled && res?.success) setData(res.data)
      } catch (e) {
        console.error('Failed to load footer settings:', e)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const footer = useMemo(() => {
    const merged = {
      ...DEFAULT_FOOTER,
      ...(data || {}),
      brand: { ...DEFAULT_FOOTER.brand, ...(data?.brand || {}) },
      contact: { ...DEFAULT_FOOTER.contact, ...(data?.contact || {}) },
      bottomBar: { ...DEFAULT_FOOTER.bottomBar, ...(data?.bottomBar || {}) },
    }
    return merged
  }, [data])

  const columnsSource = Array.isArray(footer.columns) && footer.columns.length > 0
    ? footer.columns
    : DEFAULT_FOOTER.columns

  const columns = columnsSource
    .filter((c) => c && c.isActive !== false)
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const socialSource = Array.isArray(footer.socialLinks) && footer.socialLinks.length > 0
    ? footer.socialLinks
    : DEFAULT_FOOTER.socialLinks
  const socials = socialSource.filter((s) => s && s.isActive !== false && s.href)

  return (
    <footer className="site-footer">
      <div className="site-footer-container">
        <div className="site-footer-main">
          <div className="site-footer-brand">
            <div className="site-footer-logo-row">
              {footer.brand.logoImage ? (
                <img className="site-footer-logo" src={footer.brand.logoImage} alt="" decoding="async" />
              ) : (
                <div className="site-footer-logo-fallback" aria-hidden>CI</div>
              )}
              <div className="site-footer-brand-text">
                <div className="site-footer-brand-name">{footer.brand.name}</div>
                <div className="site-footer-brand-tagline">{footer.brand.tagline}</div>
              </div>
            </div>
            <p className="site-footer-desc">{footer.brand.description}</p>
            <ul className="site-footer-contact">
              {footer.contact.locationText && <li><span className="site-footer-contact-icon"><ContactIcon type="location" /></span><span>{footer.contact.locationText}</span></li>}
              {footer.contact.email && <li><span className="site-footer-contact-icon"><ContactIcon type="email" /></span><a href={`mailto:${footer.contact.email}`}>{footer.contact.email}</a></li>}
              {footer.contact.phone && <li><span className="site-footer-contact-icon"><ContactIcon type="phone" /></span><a href={`tel:${footer.contact.phone.replace(/\s+/g, '')}`}>{footer.contact.phone}</a></li>}
            </ul>
            {socials.length > 0 && (
              <div className="site-footer-socials" aria-label="Social links">
                {socials.map((s, i) => (
                  <a key={`${s.platform}-${i}`} className="site-footer-social" href={s.href} target="_blank" rel="noreferrer">
                    <SocialIcon platform={s.platform} />
                    <span className="sr-only">{s.platform}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="site-footer-columns">
            {columns.map((col, i) => {
              const links = (col.links || [])
                .filter((l) => l && l.isActive !== false && l.href && l.label)
                .slice()
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              if (links.length === 0) return null
              return (
                <nav key={`${col.title}-${i}`} className="site-footer-col" aria-label={col.title}>
                  <div className="site-footer-col-title">{col.title}</div>
                  <ul className="site-footer-links">
                    {links.map((l, li) => (
                      <li key={`${l.href}-${li}`}>
                        <AppLink href={l.href} className="site-footer-link">{l.label}</AppLink>
                      </li>
                    ))}
                  </ul>
                </nav>
              )
            })}
          </div>
        </div>

        <div className="site-footer-bottom">
          <div className="site-footer-bottom-left">{footer.bottomBar.copyrightText}</div>
          <div className="site-footer-bottom-right">{footer.bottomBar.creditText}</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

