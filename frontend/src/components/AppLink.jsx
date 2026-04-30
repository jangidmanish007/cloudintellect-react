import { Link } from 'react-router-dom'

/**
 * Use for in-app links so navigation does not cause a full page refresh.
 * Internal paths (e.g. /placements, /contact) use React Router Link.
 * External (http, https, tel, mailto) and hash-only (#section) stay as <a>.
 */
export function isInternalLink(href) {
  if (!href || href === '#') return false
  if (href.startsWith('http://') || href.startsWith('https://') ||
      href.startsWith('mailto:') || href.startsWith('tel:')) return false
  if (href.startsWith('#')) return false
  return true
}

export function normalizeInternalPath(href) {
  if (!href) return '/'
  if (href.startsWith('/')) return href
  return `/${href}`
}

export default function AppLink({ href, children, className, onClick, ...props }) {
  if (isInternalLink(href)) {
    const to = normalizeInternalPath(href)
    return (
      <Link to={to} className={className} onClick={onClick} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href || '#'} className={className} onClick={onClick} {...props}>
      {children}
    </a>
  )
}
