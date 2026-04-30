import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

const ICON_BASE = '/images/Key_Advantages'

function toIconSrc(path) {
  if (!path) return ''
  const full = path.startsWith('/') ? path : `${ICON_BASE}/${path}`
  return getImageUrl(full)
}

const FALLBACK_ITEMS = [
  { title: 'Practical-First Training', description: 'Every concept is taught with real implementation on Salesforce org. Students learn by doing — not by memorizing.', icon: 'productivity.svg' },
  { title: 'Real Industry-Level Exposure', description: 'Training includes live business scenarios and project simulations that build strong hands-on confidence.', icon: 'home_work.svg' },
  { title: 'Structured Assignments', description: 'Each topic is followed by practical exercises, quizzes, and real use-case based tasks to track progress.', icon: 'order_approve.svg' },
  { title: 'Lifetime LMS Recording Access', description: 'All lectures, materials, and case studies remain available anytime for revision and continuous learning.', icon: 'exit_to_app.svg' },
  { title: 'Industry-Relevant Curriculum', description: 'Course modules are updated regularly to match current Salesforce market demand and platform changes.', icon: 'library_books.svg' },
  { title: 'Certified & Experienced Trainers', description: 'Sessions are handled by working Salesforce professionals with real project backgrounds.', icon: 'diversity_2.svg' },
  { title: 'Corporate & Alumni Network', description: 'Learners benefit from referrals, guidance, and opportunities shared by our partner companies and alumni.', icon: 'book.svg' },
  { title: 'Interview & Career Grooming', description: 'Focus on professional behaviour, IT work culture, confidence building, and job readiness.', icon: 'record_voice_over.svg' },
]

function KeyAdvantagesSection() {
  const { content } = usePageContentContext()
  const data = content?.keyAdvantages || {}
  const headingLine1 = data.headingLine1 ?? 'Key Advantages of'
  const headingStrong = data.headingStrong ?? 'Learning at Cloud Intellect'
  const items = Array.isArray(data.items) && data.items.length > 0 ? data.items : FALLBACK_ITEMS

  return (
    <section className="key-advantages-section">
      <div className="key-advantages-inner">
        <h2 className="key-advantages-heading">{headingLine1} <span>{headingStrong}</span></h2>
        <div className="key-advantages-grid">
          {items.map((item, i) => (
            <div key={i} className="key-advantages-card">
              <div className="key-advantages-card-icon-wrap">
                <img
                  src={toIconSrc(item.icon)}
                  alt=""
                  width={40}
                  height={40}
                  className="key-advantages-card-icon"
                  aria-hidden
                />
              </div>
              <h3 className="key-advantages-card-title">{item.title}</h3>
              <p className="key-advantages-card-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default KeyAdvantagesSection
