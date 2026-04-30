import { usePageContentContext } from '../contexts/PageContentContext'

const CHECK_ICON = '/images/check_circle copy.svg'

function url(path) {
  return encodeURI(path)
}

const DEFAULT_BENEFITS = [
  'Learn before committing time or money',
  'Ask real questions to experts',
  'Understand actual career scope',
  'Choose your path with 100% confidence'
]

function MakeInformedDecisionSection() {
  const { content } = usePageContentContext()
  const sectionContent = content?.makeInformedDecision || {}
  
  const heading = sectionContent.heading || sectionContent.title || 'Make an Informed Decision'
  const subheading = sectionContent.subheading || sectionContent.description || 'Attend the webinar, understand both tracks clearly, and choose your path with confidence.'
  const benefits = Array.isArray(sectionContent.benefits) && sectionContent.benefits.length > 0 
    ? sectionContent.benefits 
    : DEFAULT_BENEFITS
  const primaryButtonText = sectionContent.primaryButtonText || 'Explore Programs'
  const primaryButtonHref = sectionContent.primaryButtonHref || '#programs'
  const secondaryButtonText = sectionContent.secondaryButtonText || 'View Placements'
  const secondaryButtonHref = sectionContent.secondaryButtonHref || '#placements'

  return (
    <section className="make-informed-decision-section">
      <div className="make-informed-decision-container">
        <div className="make-informed-decision-card">
          <h2 className="make-informed-decision-heading">{heading}</h2>
          <p className="make-informed-decision-subheading">
            {subheading}
          </p>

          <div className="make-informed-decision-benefits">
            {benefits.map((benefit, index) => (
              <div key={index} className="make-informed-decision-benefit">
                <div className="make-informed-decision-check-wrap">
                  <img
                    src={url(CHECK_ICON)}
                    alt=""
                    width={20}
                    height={20}
                    className="make-informed-decision-check-icon"
                    aria-hidden
                  />
                </div>
                <span className="make-informed-decision-benefit-text">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="make-informed-decision-buttons">
            <a href={primaryButtonHref} className="make-informed-decision-btn make-informed-decision-btn-primary">
              {primaryButtonText}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href={secondaryButtonHref} className="make-informed-decision-btn make-informed-decision-btn-secondary">
              {secondaryButtonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MakeInformedDecisionSection
