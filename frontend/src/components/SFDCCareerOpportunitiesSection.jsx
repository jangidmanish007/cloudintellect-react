import { usePageContentContext } from '../contexts/PageContentContext'

const DEFAULT_ICON = '/images/code.svg'

function url(path) {
  return path ? encodeURI(path) : ''
}

const DEFAULT_ROLES = [
  { title: 'Salesforce Developer', description: 'Build custom applications and integrations on Salesforce.' },
  { title: 'Salesforce Administrator', description: 'Manage user setup, permissions, and data.' },
  { title: 'Salesforce Consultant', description: 'Analyze business requirements and implement solutions.' },
  { title: 'Salesforce Analyst', description: 'Work with clients to gather requirements and optimize processes.' },
  { title: 'Salesforce App Developer', description: 'Create and deploy custom applications.' },
  { title: 'Salesforce Architect', description: 'Design complex solutions and lead development teams.' },
]

function SFDCCareerOpportunitiesSection() {
  const { content } = usePageContentContext()
  const section = content?.sfdcCareerOpportunities && typeof content.sfdcCareerOpportunities === 'object' ? content.sfdcCareerOpportunities : {}
  const headingLine1 = section.headingLine1 ?? 'Career Opportunities After'
  const headingStrong = section.headingStrong ?? 'SFDC Certification'
  const iconUrl = section.icon || DEFAULT_ICON
  const roles = Array.isArray(section.roles) && section.roles.length > 0 ? section.roles : DEFAULT_ROLES

  return (
    <section className="sfdc-career-opportunities-section">
      <div className="sfdc-career-opportunities-inner">
        <h2 className="sfdc-career-opportunities-heading">
          {headingLine1} <span>{headingStrong}</span>
        </h2>

        <div className="sfdc-career-opportunities-grid">
          {roles.map((role, i) => (
            <div key={i} className="sfdc-career-opportunity-card">
              <div className="sfdc-career-opportunity-icon-wrap">
                <img
                  src={url(iconUrl)}
                  alt=""
                  width={24}
                  height={24}
                  className="sfdc-career-opportunity-icon"
                  aria-hidden
                />
              </div>
              <h3 className="sfdc-career-opportunity-title">{role.title || ''}</h3>
              <p className="sfdc-career-opportunity-description">{role.description || ''}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SFDCCareerOpportunitiesSection
