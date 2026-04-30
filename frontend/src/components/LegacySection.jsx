import { usePageContentContext } from '../contexts/PageContentContext';
import { getImageUrl } from '../services/api';
import AppLink from './AppLink';

const DEFAULT_STATS = [
  { number: '5000+', label: 'LEARNERS TRAINED', description: 'Continuous skill development across India.' },
  {
    number: '1400+',
    label: 'SUCCESSFUL PLACEMENTS',
    description: 'Students placed in top MNCs & Salesforce partner companies.',
  },
  {
    number: '20+',
    label: 'EXPERT MENTORS',
    description: 'Certified Salesforce professionals from leading global firms.',
  },
  { number: '150+', label: 'CORPORATE CLIENTS', description: 'Strong industry network supporting Salesforce careers.' },
  {
    number: '10+',
    label: 'YEARS EXPERTISE',
    description: 'Backed by the strength of a Salesforce Ridge Partner company.',
  },
];

const DEFAULT_CARDS = [
  {
    image: '/images/legacy.webp',
    title: 'Salesforce to Create 1.8 Million Jobs in India by 2028',
    description: 'Salesforce is powering major job growth in India, creating real opportunities for tech talent.',
    tags: 'Tech Growth | Salesforce',
    href: '#',
  },
  {
    image: '/images/legacy2.webp',
    title: 'Salesforce Hiring Surges Again in 2025',
    description: 'Salesforce roles are growing fast in 2025, especially for Admins and Developers.',
    tags: 'ACHIEVEMENT | CIBSUMMIT',
    href: '#',
  },
];

function LegacySection() {
  const { content } = usePageContentContext();
  const legacy = content?.legacy || {};

  const title = legacy.title ?? 'An Illustrious';
  const titleHighlight = legacy.titleHighlight ?? 'Legacy we continue to Shape';
  const stats = Array.isArray(legacy.stats) && legacy.stats.length >= 5 ? legacy.stats : DEFAULT_STATS;
  const cards = Array.isArray(legacy.cards) && legacy.cards.length >= 2 ? legacy.cards : DEFAULT_CARDS;

  return (
    <section className="legacy-section">
      <div className="legacy-container">
        <h2 className="legacy-title">
          {title} <span className="legacy-title-highlight">{titleHighlight}</span>
        </h2>

        <div className="legacy-stats" role="list">
          {stats.map((stat, i) => (
            <div key={i} className="legacy-stat" role="listitem">
              <p className="legacy-stat-number">{stat.number}</p>
              <p className="legacy-stat-label">{stat.label}</p>
              <p className="legacy-stat-desc">{stat.description}</p>
            </div>
          ))}
        </div>

        <div className="legacy-cards">
          {cards.map((card, i) => {
            const imagePath = (card.image || '').trim();
            const imageUrl = imagePath
              ? imagePath.startsWith('http')
                ? imagePath
                : getImageUrl(imagePath.startsWith('/') ? imagePath : `/${imagePath}`)
              : getImageUrl('/images/legacy.webp');
            return (
              <article key={i} className="legacy-card">
                <div className="legacy-card-bg" style={{ backgroundImage: `url(${imageUrl})` }} aria-hidden />
                <div className="legacy-card-overlay" />
                <div className="legacy-card-content">
                  <div className="legacy-card-body">
                    <h3 className="legacy-card-title">{card.title}</h3>
                    <p className="legacy-card-desc">{card.description}</p>
                    <AppLink href={card.href || '#'} className="legacy-card-btn">
                      READ MORE
                    </AppLink>
                  </div>
                  <p className="legacy-card-tags">{card.tags}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LegacySection;
