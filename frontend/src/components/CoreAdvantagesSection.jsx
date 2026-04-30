import { usePageContentContext } from '../contexts/PageContentContext'

const ICON_BASE = '/images/Core Advantages'

function url(path) {
  return path ? encodeURI(path) : ''
}

const DEFAULT_ADVANTAGES = [
  { title: '100% Practical & Hands-On Training', description: 'Learning at Cloud Intellect is focused on real-time Salesforce implementation, not theory.', bullets: ['Hands-on assignments on Salesforce org', 'Real business scenarios & use cases', 'Project-based learning approach'], icon: `${ICON_BASE}/code.svg` },
  { title: 'Real-Time Experience Equivalent to Industry Exposure', description: 'Every learner works on live business use cases and project simulations, gaining experience aligned with real industry expectations.', bullets: ['Industry-based tasks', 'Project simulations designed by consultants', 'Practical exposure equivalent to real project environments'], icon: `${ICON_BASE}/work.svg` },
  { title: 'Structured Assignments & Continuous Assessments', description: 'Learner progress is tracked through topic-wise assignments, quizzes, and real-world exercises.', bullets: ['Skill validation at every stage', 'Practical assessments', 'Performance-driven learning journey'], icon: `${ICON_BASE}/task.svg` },
  { title: 'Smart Learning Infrastructure (LMS + Student Portal)', description: 'Cloud Intellect provides a technology-enabled learning ecosystem through LMS and a dedicated student portal. Students can', bullets: ['Access recorded lectures & resources', 'Book interview slots', 'Connect with mentors for 1:1 doubt sessions', 'Track learning & placement progress', 'Collaborate with peers'], icon: `${ICON_BASE}/live_tv.svg` },
  { title: 'Mentorship from Experienced Certified Trainers', description: 'All trainers at Cloud Intellect are active Salesforce professionals with strong project delivery experience.', bullets: ['Industry-certified mentors', 'Real consulting exposure', 'Practical problem-solving guidance'], icon: `${ICON_BASE}/person.svg` },
  { title: 'Job-Oriented Curriculum & Career Focus', description: 'Our curriculum is continuously updated based on:', bullets: ['Salesforce product releases', 'Market skill demand', 'Hiring partner expectations'], additionalText: 'Training is designed to deliver job readiness within a structured timeline, not just course completion.', icon: `${ICON_BASE}/SVG (5).svg` },
]

function CoreAdvantagesSection() {
  const { content } = usePageContentContext()
  const d = content?.coreAdvantages || {}
  const title = d.title ?? 'Core Advantages of Learning at Cloud Intellect'
  const advantages = Array.isArray(d.advantages) && d.advantages.length > 0 ? d.advantages : DEFAULT_ADVANTAGES

  return (
    <section className="core-advantages-section">
      <div className="core-advantages-inner">
        <h2 className="core-advantages-title">{title}</h2>

        <div className="core-advantages-grid">
          {advantages.map((advantage, i) => (
            <div key={i} className="core-advantage-card">
              <div className="core-advantage-icon-wrap">
                <img
                  src={url(advantage.icon)}
                  alt=""
                  width={28}
                  height={28}
                  className="core-advantage-icon"
                  aria-hidden
                />
              </div>
              <h3 className="core-advantage-title">{advantage.title}</h3>
              <p className="core-advantage-description">{advantage.description}</p>
              {advantage.bullets && advantage.bullets.length > 0 && (
                <ul className="core-advantage-bullets">
                  {advantage.bullets.map((bullet, j) => (
                    <li key={j} className="core-advantage-bullet">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              {advantage.additionalText && (
                <p className="core-advantage-additional">{advantage.additionalText}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CoreAdvantagesSection
