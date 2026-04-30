import { useState } from 'react'
import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

function FaqSection() {
  const { content } = usePageContentContext()
  const faq = content?.faq || {}

  const DEFAULT_FAQ_IMAGE = 'https://cloudintellect.in/wp-content/uploads/2026/01/IMG-5-1.webp'

  // const headingStrong = (faq.headingStrong || faq.titleBold || 'Questions').trim()
  const headingLight = (faq.headingLine1 || faq.titleLight || faq.title || 'Frequently Asked Questions').trim()
  // const headingStrong = (faq.headingStrong || faq.titleBold || 'Questions').trim()

  const items = Array.isArray(faq.items) ? faq.items : []

  const normalizedItems = items
    .filter((x) => x && (x.question || x.title) && (x.answer || x.content))
    .map((x) => ({
      number: typeof x.number === 'string' || typeof x.number === 'number' ? String(x.number).trim() : '',
      question: (x.question || x.title || '').trim(),
      answer: (x.answer || x.content || '').trim(),
      image: typeof x.image === 'string' ? x.image.trim() : '',
    }))

  const [activeIndex, setActiveIndex] = useState(0)
  const hasItems = normalizedItems.length > 0

  const bgPath = typeof faq.backgroundImage === 'string' ? faq.backgroundImage.trim() : ''
  const bgUrl = bgPath
    ? (bgPath.startsWith('http') ? bgPath : getImageUrl(bgPath.startsWith('/') ? bgPath : `/${bgPath}`))
    : ''

  const cta = faq.cta && typeof faq.cta === 'object' ? faq.cta : {}
  const ctaTitle = (cta.title || '').trim()
  const ctaDescription = (cta.description || '').trim()
  const ctaButtonText = (cta.buttonText || '').trim()
  const ctaButtonHref = (cta.buttonHref || '').trim()

  const badgeText = (cta.badgeText || '').trim()
  const badgeImagePath = typeof cta.badgeImage === 'string' ? cta.badgeImage.trim() : ''
  const badgeImageUrl = badgeImagePath
    ? (badgeImagePath.startsWith('http') ? badgeImagePath : getImageUrl(badgeImagePath.startsWith('/') ? badgeImagePath : `/${badgeImagePath}`))
    : ''

  const featureTexts = Array.isArray(cta.features)
    ? cta.features
      .map((f) => {
        if (!f) return ''
        if (typeof f === 'string') return f.trim()
        if (typeof f === 'object') return (f.text || f.label || '').toString().trim()
        return ''
      })
      .filter(Boolean)
    : []

  const shouldRenderCta = !!(ctaTitle || ctaDescription || ctaButtonText || badgeText || badgeImageUrl || featureTexts.length > 0)

  return (
    <>
      <section
        className="faq-page-hero"
        aria-label="FAQ hero"
        style={bgUrl ? { backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : undefined}
      >
        <div className="faq-page-hero-overlay" />
      </section>

      <section className="faq-page-section" aria-labelledby="faq-page-heading">
        <div className="faq-page-container">
          <h2 id="faq-page-heading" className="faq-page-title faq-page-accordion-heading">
            <span className="faq-page-title-light">{headingLight} </span>

          </h2>

          <div className="faq-page-accordion-wrapper" aria-label="FAQ accordion">
            <div className="faq-page-modern-list" role="list">
              {hasItems ? (
                normalizedItems.map((item, index) => {
                  const isActive = activeIndex === index
                  const rawNumber = item.number || String(index + 1)
                  const numberValue = rawNumber.padStart(2, '0')
                  const rowImagePath = item.image
                  const rowImageUrl = rowImagePath
                    ? (rowImagePath.startsWith('http') ? rowImagePath : getImageUrl(rowImagePath.startsWith('/') ? rowImagePath : `/${rowImagePath}`))
                    : DEFAULT_FAQ_IMAGE
                  return (
                    <div key={`${item.number || index}-${item.question}`} className={`faq-page-modern-row ${isActive ? 'active' : ''}`} role="listitem">
                      <div
                        className="faq-page-modern-header"
                        onClick={() => setActiveIndex(index)}
                        onKeyDown={(e) => e.key === 'Enter' && setActiveIndex(index)}
                        role="button"
                        tabIndex={0}
                        aria-expanded={isActive}
                      >
                        <div className="faq-page-modern-number" aria-hidden>{numberValue}</div>
                        <div className="faq-page-modern-content">
                          <h3 className="faq-page-modern-question">{item.question}</h3>
                          <div className="faq-page-modern-answer">{item.answer}</div>
                        </div>
                        {isActive ? (
                          <div className="faq-page-modern-images">
                            <img decoding="async" src={rowImageUrl} alt="" />
                            <img decoding="async" src={rowImageUrl} alt="" />
                          </div>
                        ) : null}
                        <span className="faq-page-modern-arrow" aria-hidden>→</span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="faq-page-empty" role="status" aria-live="polite">
                  {/* Add FAQ questions & answers from <span style={{ fontWeight: 700 }}>Admin → Pages → faq → FAQ Section</span>. */}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {shouldRenderCta && (
        <div className="faq-page-final-cta" role="region" aria-label="FAQ call to action">
          <div className="faq-page-container">
            {(badgeText || badgeImageUrl) && (
              <div className="faq-page-final-badge">
                {badgeImageUrl ? <img src={badgeImageUrl} alt="" /> : null}
                {badgeText ? <span>{badgeText}</span> : null}
              </div>
            )}

            {ctaTitle ? <h2 className="faq-page-final-title">{ctaTitle}</h2> : null}
            {ctaDescription ? <p className="faq-page-final-description">{ctaDescription}</p> : null}

            {ctaButtonText && ctaButtonHref ? (
              <a className="faq-page-final-btn" href={ctaButtonHref}>
                {ctaButtonText}
              </a>
            ) : null}

            {featureTexts.length > 0 ? (
              <div className="faq-page-final-features" aria-label="Benefits">
                {featureTexts.map((t, i) => (
                  <div key={`${t}-${i}`} className="faq-page-final-feature">
                    <div className="faq-page-final-dot" aria-hidden />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  )
}

export default FaqSection

