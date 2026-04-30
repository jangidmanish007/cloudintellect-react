import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

const IMG_BASE = '/images/News and Events'
const FALLBACK_IMAGES = [
  `${IMG_BASE}/Event Image.webp`,
  `${IMG_BASE}/Event Image-1.webp`,
  `${IMG_BASE}/IMG.webp`,
]

function toImgSrc(path) {
  if (!path) return ''
  return path.startsWith('/') ? getImageUrl(path) : path
}

const FALLBACK_TIMELINE = [
  { title: 'Knowledge Sessions', text: 'Cloud Intellect mentors delivered hands-on CRM, Apex & Marketing Cloud training during the event.', image: FALLBACK_IMAGES[0] },
  { title: 'Marketing Workshop', text: 'Sumit Sir was honoured for impactful mentorship and his contribution to developing Salesforce talent.', image: FALLBACK_IMAGES[1] },
  { title: 'Mentor Recognition', text: 'Our mentors engaged with industry professionals, sharing Salesforce trends and skills in demand.', image: FALLBACK_IMAGES[2] },
  { title: 'Industry Networking', text: 'Participants learned about Salesforce career paths, job roles, salaries & future growth options.', image: FALLBACK_IMAGES[0] },
  { title: 'Knowledge Sessions', text: 'Cloud Intellect mentors delivered hands-on CRM, Apex & Marketing Cloud training during the event.', image: FALLBACK_IMAGES[1] },
  { title: 'Knowledge Sessions', text: 'Cloud Intellect mentors delivered hands-on CRM, Apex & Marketing Cloud training during the event.', image: FALLBACK_IMAGES[2] },
  { title: 'Knowledge Sessions', text: 'Cloud Intellect mentors delivered hands-on CRM, Apex & Marketing Cloud training during the event.', image: FALLBACK_IMAGES[0] },
]
const FALLBACK_SIDE_ARTICLES = [
  { title: 'Career Guidance', text: 'Students received real-time guidance as they solved Salesforce-based problem statements.', image: FALLBACK_IMAGES[1] },
  { title: 'Hackathon Support', text: 'Cloud Intellect supported the hackathon as an official sponsor, promoting tech education.', image: FALLBACK_IMAGES[2] },
]
const FALLBACK_MAIN_FEATURE = {
  image: FALLBACK_IMAGES[0],
  title: 'Cloud Intellect Shines at Salesforce Hackathon Nagpur 2025',
  description: 'Cloud Intellect participated as a sponsor and delivered expert-led Salesforce mentorship at the Nagpur Hackathon, with special recognition awarded to Sumit Sir.',
  readMoreHref: '#read-more',
  readMoreLabel: 'READ MORE',
}

function NewsAndEventsSection() {
  const { content } = usePageContentContext()
  const data = content?.newsAndEvents || {}
  const headingLine1 = data.headingLine1 ?? 'News and'
  const headingStrong = data.headingStrong ?? 'Events'
  const mainFeature = data.mainFeature && typeof data.mainFeature === 'object' ? { ...FALLBACK_MAIN_FEATURE, ...data.mainFeature } : FALLBACK_MAIN_FEATURE
  const timelineItems = Array.isArray(data.timelineItems) && data.timelineItems.length > 0 ? data.timelineItems : FALLBACK_TIMELINE
  const sideArticles = Array.isArray(data.sideArticles) && data.sideArticles.length > 0 ? data.sideArticles : FALLBACK_SIDE_ARTICLES

  return (
    <section className="news-events-outer">
      <div className="news-events-section">
        <h2 className="news-events-section-title">{headingLine1} <strong>{headingStrong}</strong></h2>
      <div className="news-events-content-wrapper">
        <div className="news-events-timeline-column">
          {timelineItems.map((item, i) => (
            <div key={i} className="news-events-timeline-item">
              <img
                decoding="async"
                src={toImgSrc(item.image || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length])}
                alt={item.title || ''}
                className="news-events-timeline-item-image"
              />
              <div className="news-events-timeline-item-content">
                <h3 className="news-events-timeline-item-title">{item.title}</h3>
                <p className="news-events-timeline-item-text">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="news-events-main-feature">
          <img
            decoding="async"
            src={toImgSrc(mainFeature.image)}
            alt={mainFeature.title || ''}
            className="news-events-main-feature-image"
          />
          <div className="news-events-main-feature-content">
            <h2 className="news-events-main-feature-title">{mainFeature.title}</h2>
            <p className="news-events-main-feature-description">{mainFeature.description}</p>
            <a href={mainFeature.readMoreHref || '#read-more'} className="news-events-read-more-btn">{mainFeature.readMoreLabel || 'READ MORE'}</a>
          </div>
        </div>
        <div className="news-events-right-column">
          {sideArticles.map((article, i) => (
            <article key={i} className="news-events-side-article">
              <img
                decoding="async"
                src={toImgSrc(article.image || FALLBACK_IMAGES[(i + 1) % FALLBACK_IMAGES.length])}
                alt={article.title || ''}
                className="news-events-side-article-image"
              />
              <div className="news-events-side-article-content">
                <h3 className="news-events-side-article-title">{article.title}</h3>
                <p className="news-events-side-article-text">{article.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      </div>
    </section>
  )
}

export default NewsAndEventsSection
