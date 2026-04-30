import { useState } from 'react'
import { usePageContentContext } from '../contexts/PageContentContext'

const DEFAULT_ARROW_ICON = 'https://cloudintellect.in/wp-content/uploads/2026/01/arrow_right_alt.svg'
const DEFAULT_FAQ_IMAGE = 'https://cloudintellect.in/wp-content/uploads/2026/01/IMG-5-1.webp'
const NUMBER_SVG_BASE = 'https://cloudintellect.in/wp-content/uploads/2026/01'

const FALLBACK_ITEMS = [
  { number: '12', title: 'High-Impact Networking Connections', content: 'Connect with an extensive network of CEOs, Nobel Laureates, entrepreneurs, technologists, and global academicians.' },
  { number: '13', title: 'Tech-Driven Collaborative Learning', content: 'Learn through modern tools, real-time collaboration, and hands-on digital platforms.' },
  { number: '14', title: '360-Degree Personal Brand Building', content: 'Build your professional brand with mentoring, positioning, and visibility strategies.' },
  { number: '15', title: 'Multi-Disciplinary University Exposure', content: 'Learn across domains with interdisciplinary programs and global faculty exposure.' },
  { number: '19', title: 'Global Vision & Research Culture', content: 'Engage with global research initiatives and international academic collaborations.' },
  { number: '16', title: 'Industry-Ready Skill Development', content: 'Gain job-ready skills through practical exposure and industry-aligned curriculum.' },
  { number: '20', title: 'Leadership & Innovation Mindset', content: 'Develop leadership skills and an innovation-first approach.' },
  { number: '17', title: 'Strong Alumni & Community Network', content: 'Become part of a lifelong alumni ecosystem supporting growth and mentorship.' },
  { number: '18', title: 'Intercontinental Research Frontiers', content: 'Explore cross-border research initiatives shaping the future of education.' },
]

function getNumberSvg(number) {
  return number ? `${NUMBER_SVG_BASE}/Number-${number}.svg` : ''
}

function WhyChooseSection() {
  const { content } = usePageContentContext()
  const [activeIndex, setActiveIndex] = useState(0)

  const whyChoose = content?.whyChoose || {}
  const headingLine1 = whyChoose.headingLine1 ?? 'Why Should You Choose'
  const headingStrong = whyChoose.headingStrong ?? 'Cloud Intellect?'
  const arrowIcon = whyChoose.arrowIcon || DEFAULT_ARROW_ICON
  const faqImage = whyChoose.faqImage || DEFAULT_FAQ_IMAGE
  const items = Array.isArray(whyChoose.items) && whyChoose.items.length > 0 ? whyChoose.items : FALLBACK_ITEMS

  return (
    <section className="why-choose-section">
      <h2 className="why-choose-heading">
        {headingLine1} <strong>{headingStrong}</strong>
      </h2>
      <div className="faq-list">
        {items.map((item, index) => (
          <div
            key={item.number ?? index}
            className={`faq-row ${activeIndex === index ? 'active' : ''}`}
          >
            <div
              className="faq-header"
              onClick={() => setActiveIndex(index)}
              onKeyDown={(e) => e.key === 'Enter' && setActiveIndex(index)}
              role="button"
              tabIndex={0}
              aria-expanded={activeIndex === index}
            >
              <img
                decoding="async"
                className="faq-number"
                src={getNumberSvg(item.number)}
                alt=""
                aria-hidden
              />
              <div className="faq-title">
                <h3>{item.title}</h3>
                <div className="faq-content">
                  {item.content}
                </div>
              </div>
              <div className="faq-images">
                <img decoding="async" src={item.image || faqImage} alt="" />
                <img decoding="async" src={item.image || faqImage} alt="" />
              </div>
              <img
                decoding="async"
                className="faq-arrow"
                src={arrowIcon}
                alt=""
                aria-hidden
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default WhyChooseSection
