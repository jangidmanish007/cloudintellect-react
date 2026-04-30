import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

const IMG_BASE = '/images/Training & Industry Alignment'

const DEFAULT_BLOCKS = [
  { category: 'RECOGNIZED STATUS', image: `${IMG_BASE}/1734100666165 1.webp`, title: 'Workforce Partner', subheading: 'Salesforce Workforce Development Partner', description: 'Cloud Intellect is officially listed as a Salesforce Workforce Development Partner, acknowledged for delivering high-quality, industry-ready Salesforce training programs.', bullets: ['Training aligned with Salesforce standards', 'Certification-focused modules', 'Real-world learning outcomes'] },
  { category: 'RECOGNIZED RANK', image: `${IMG_BASE}/1734100666165 1-1.webp`, title: 'Ridge Partner', subheading: 'Salesforce Ridge Consulting Partner (via Cloud Intellect Systems)', description: 'Our consulting division, Cloud Intellect Systems, is a Salesforce Ridge Partner, enabling real-time project exposure for learners.', bullets: ['Enterprise project experience', 'Live org scenarios', 'Consulting-level learning environment'] },
  { category: 'VERIFIED OUTCOMES', image: `${IMG_BASE}/SVG.webp`, title: 'Top Ranked', subheading: 'Training & Industry Reputation', description: "Ranked Among India's Trusted Salesforce Institutes based on learner success, mentorship quality, and placement outcomes.", bullets: ['Expert mentors', 'Strong placement network', 'Verified student success'] },
  { category: 'GLOBAL STANDARDS', image: `${IMG_BASE}/SVG-1.webp`, title: 'Accredited', subheading: 'Ecosystem Accreditations', description: 'Follows official Salesforce learning frameworks, compliant with global certification guidelines.', bullets: ['Follows official learning frameworks', 'Recognized training pathways', 'Aligned with Salesforce roles'] },
]

function RecognitionSection() {
  const { content } = usePageContentContext()
  const recognition = content?.recognition || {}

  const title = recognition.title ?? 'Proudly Recognized for'
  const titleHighlight = recognition.titleHighlight ?? 'Our Excellence in Salesforce Training & Industry Alignment'
  const blocks = Array.isArray(recognition.blocks) && recognition.blocks.length >= 4 ? recognition.blocks : DEFAULT_BLOCKS

  return (
    <section className="recognition-section">
      <div className="recognition-container">
        <h2 className="recognition-title">
          {title} <span className="recognition-title-highlight">{titleHighlight}</span></h2>

        <div className="recognition-blocks">
          {blocks.map((block, i) => {
            const imagePath = (block.image || '').trim()
            const imageUrl = imagePath
              ? (imagePath.startsWith('http') ? imagePath : getImageUrl(imagePath.startsWith('/') ? imagePath : `/${imagePath}`))
              : getImageUrl(`${IMG_BASE}/1734100666165 1.webp`)
            const bullets = Array.isArray(block.bullets) ? block.bullets : DEFAULT_BLOCKS[i]?.bullets || []
            return (
              <div key={i} className="recognition-block">
                <div className="recognition-left">
                  <div className="recognition-badge">
                    <img
                      src={imageUrl}
                      alt=""
                      className="recognition-logo"
                      loading="lazy"
                    />
                  </div>
                  <div className="recognition-heading-group">
                    <span className="recognition-category">{block.category}</span>
                    <h3 className="recognition-block-title">{block.title}</h3>
                  </div>
                </div>
                <div className="recognition-right">
                  <h4 className="recognition-subheading">{block.subheading}</h4>
                  <p className="recognition-desc">{block.description}</p>
                  <ul className="recognition-bullets">
                    {bullets.filter(Boolean).map((bullet, j) => (
                      <li key={j}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default RecognitionSection
