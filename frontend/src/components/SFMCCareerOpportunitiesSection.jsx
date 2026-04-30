import { usePageContentContext } from '../contexts/PageContentContext'

const DEFAULT_ICON_BASE = '/images/Career_Opportunities_SFMC'

function url(path) {
  return path ? encodeURI(path) : ''
}

const DEFAULT_ROLES = [
  { title: 'Administrator', description: 'Manages user setup, permissions, roles, business units, and ensures smooth operation.', icon: 'tune.svg' },
  { title: 'Developer', description: 'Supports marketing teams in managing data extensions, lists, and running basic campaigns.', icon: 'business_messages.svg' },
  { title: 'Consultant', description: 'Advises on Marketing Cloud strategy, implementation, and optimization.', icon: 'bar_chart_4_bars.svg' },
  { title: 'Quality Analyst', description: 'Tests emails, journeys, automations, and integrations before campaigns go live.', icon: 'star_shine.svg' },
  { title: 'Business Analyst', description: 'Translates business requirements into Salesforce Marketing Cloud campaigns and workflows.', icon: 'add_chart.svg' },
  { title: 'Architect', description: 'Designs and executes personalized email campaigns using Content Builder and Journey Builder.', icon: 'edit_square.svg' },
]

function SFMCCareerOpportunitiesSection() {
  const { content } = usePageContentContext()
  const section = content?.sfmcCareerOpportunities && typeof content.sfmcCareerOpportunities === 'object' ? content.sfmcCareerOpportunities : {}
  const headingLine1 = section.headingLine1 ?? 'Career Opportunities'
  const headingStrong = section.headingStrong ?? 'After SFMC'
  const iconBase = section.iconBase || DEFAULT_ICON_BASE
  const roles = Array.isArray(section.roles) && section.roles.length > 0 ? section.roles : DEFAULT_ROLES

  return (
    <section className="sfmc-career-opportunities-section">
      <div className="sfmc-career-opportunities-inner">
        <h2 className="sfmc-career-opportunities-heading">
          {headingLine1} <span>{headingStrong}</span>
        </h2>

        <div className="sfmc-career-opportunities-grid">
          {roles.map((role, i) => (
            <div key={i} className="sfmc-career-opportunity-card">
              <div className="sfmc-career-opportunity-icon-wrap">
                <img
                  src={url(role.icon?.startsWith('/') ? role.icon : (role.icon ? `${iconBase}/${role.icon}` : ''))}
                  alt=""
                  width={24}
                  height={24}
                  className="sfmc-career-opportunity-icon"
                  aria-hidden
                />
              </div>
              <h3 className="sfmc-career-opportunity-title">{role.title || ''}</h3>
              <p className="sfmc-career-opportunity-description">{role.description || ''}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SFMCCareerOpportunitiesSection
