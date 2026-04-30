import { Link } from 'react-router-dom'
import { usePageContentContext } from '../contexts/PageContentContext'

// Helper to determine if link should use Link component or anchor tag
const isInternalLink = (href) => {
  if (!href || href === '#') return false
  if (href.startsWith('http://') || href.startsWith('https://') || 
      href.startsWith('mailto:') || href.startsWith('tel:')) {
    return false
  }
  if (href.startsWith('#')) {
    return false
  }
  return true
}

const normalizeInternalPath = (href) => {
  if (!href) return '/'
  if (href.startsWith('/')) return href
  return `/${href}`
}

const NavLink = ({ href, children, className, onClick, ...props }) => {
  if (isInternalLink(href)) {
    const normalizedPath = normalizeInternalPath(href)
    return (
      <Link to={normalizedPath} className={className} onClick={onClick} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} className={className} onClick={onClick} {...props}>
      {children}
    </a>
  )
}

function BeNextSuccessStorySection() {
  const { content } = usePageContentContext()
  const section = content?.beNextSuccessStory || {}
  
  const heading = section.heading || section.title || 'Be Our Next Success Story'
  const description = section.description || section.text || 'Join 5000+ learners who have successfully transitioned into the Salesforce ecosystem. Your journey starts here.'
  const buttonText = section.buttonText || section.buttonLabel || 'Apply Today'
  const buttonHref = section.buttonHref || section.buttonLink || '#apply'

  return (
    <section className="be-next-success-story-section">
      <div className="be-next-success-story-container">
        <div className="be-next-success-story-card">
          <h2 className="be-next-success-story-heading">{heading}</h2>
          <p className="be-next-success-story-description">{description}</p>
          <NavLink href={buttonHref} className="be-next-success-story-button">
            {buttonText}
            <span aria-hidden>→</span>
          </NavLink>
        </div>
      </div>
    </section>
  )
}

export default BeNextSuccessStorySection
