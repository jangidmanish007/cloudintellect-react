import { usePageContentContext } from '../contexts/PageContentContext'

function SuccessStoriesSection() {
  const { content } = usePageContentContext()
  const hero = content?.hero || {}
  return (
    <section className="success-stories-outer">
      <div className="success-stories-bg" aria-hidden />
      <div className="success-stories-container">
        <div className="success-stories-content">
          <div className="success-stories-tag">
            <span className="success-stories-tag-dot" aria-hidden />
            <span>{hero.tag ?? 'SUCCESS STORIES'}</span>
          </div>
          <h2 className="success-stories-heading">
            {hero.heading ?? 'Our Alumni Are Building Real Careers in Salesforce'}
          </h2>
          <p className="success-stories-description">
            {hero.description ?? 'Different starts, one choice to learn Salesforce right. Now working on real projects.'}
          </p>
          <div className="success-stories-buttons">
            <a href={hero.primaryButtonHref ?? '#programs'} className="success-stories-btn success-stories-btn-primary">
              {hero.primaryButtonText ?? 'Explore Programs'}
              <span aria-hidden>→</span>
            </a>
            <a href={hero.secondaryButtonHref ?? '#placements'} className="success-stories-btn success-stories-btn-secondary">
              {hero.secondaryButtonText ?? 'View Placements'}
            </a>
          </div>
        </div>
        <div className="success-stories-visual" />
      </div>
    </section>
  )
}

export default SuccessStoriesSection
