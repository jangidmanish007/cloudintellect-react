import { usePageContentContext } from '../contexts/PageContentContext'

function url(path) {
  return path ? encodeURI(path) : ''
}

const DEFAULT_MENTORS = [
  {
    name: 'Mr. Roshan Vishwakarma',
    role: 'Salesforce LWC Expert',
    experience: '07+ Years Experience',
    image: '/images/faculty/roshan.webp',
  },
  {
    name: 'Mr. Akash Lahoti',
    role: 'Salesforce Developer',
    experience: '07+ Years Experience',
    image: '/images/faculty/akash.webp',
  },
  {
    name: 'Mr. Inder Kanojiya',
    role: 'Salesforce Specialist',
    experience: '09+ Years Experience',
    image: '/images/faculty/inder.webp',
  },
  {
    name: 'Mr. Jay Singh Gour',
    role: 'Salesforce Marketing Cloud Specialist',
    experience: '12+ Years Experience',
    image: '/images/faculty/jay.webp',
  },
  {
    name: 'Mr. Mandar Ingle',
    role: 'Salesforce Marketing Cloud Specialist',
    experience: '06+ Years Experience',
    image: '/images/faculty/mandar.webp',
  },
  {
    name: 'Mr. Swapnil Tamrakar',
    role: 'Senior Salesforce Developer',
    experience: '04+ Years Experience',
    image: '/images/faculty/swapnil.webp',
  },
]

function FacultyMentorsSection() {
  const { content } = usePageContentContext()
  const d = content?.facultyMentors || {}
  const title = d.title ?? 'Faculty &'
  const titleBold = d.titleBold ?? 'Industry Mentors'
  const mentors = Array.isArray(d.mentors) && d.mentors.length > 0 ? d.mentors : DEFAULT_MENTORS

  return (
    <section className="faculty-mentors-section">
      <div className="faculty-mentors-inner">
        <h2 className="faculty-mentors-heading">
          {title} <strong className="faculty-mentors-heading-bold">{titleBold}</strong>
        </h2>
        <div className="faculty-mentors-grid">
          {mentors.map((m, i) => (
            <article key={i} className="faculty-mentor-card">
              <div
                className="faculty-mentor-photo"
                style={m.image ? { backgroundImage: `url(${url(m.image)})` } : {}}
                aria-hidden
              />
              <div className="faculty-mentor-body">
                <h3 className="faculty-mentor-name">{m.name}</h3>
                <p className="faculty-mentor-role">{m.role}</p>
                {m.experience && <p className="faculty-mentor-experience">{m.experience}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FacultyMentorsSection

