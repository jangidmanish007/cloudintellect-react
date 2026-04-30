import { useEffect, useRef, useState } from 'react'
import { usePageContentContext } from '../contexts/PageContentContext'

const ICON_BASE = '/images/Salesforce Marketing Cloud'
const DEFAULT_BATCH_ICON = '/images/SVG (5) copy 2.svg'

function url(path) {
  return path ? encodeURI(path) : ''
}

const DEFAULT_MODULES = [
  { id: '01', title: 'Setup & Administration', topics: ['User Management', 'Platform Tools', 'Content Builder', 'Email Studio Configuration', 'Security & SAP'], icon: 'manage_accounts.svg' },
  { id: '02', title: 'Subscribers & Data Management', topics: ['Data Extensions', 'Lists', 'Measures & Data Filters', 'Share Items & Subscriber Management Review'], icon: 'format_indent_increase.svg' },
  { id: '03', title: 'Content Creation (Email Studio)', topics: ['Creating Email Messages & Templates', 'Content Blocks', 'Uploading & Managing Content', 'Building & Testing Emails'], icon: 'article.svg' },
  { id: '04', title: 'Interactions, A/B Testing & Tracking', topics: ['Interaction Setup', 'A/B Testing', 'Tracking', 'Admin'], icon: 'autopause.svg' },
  { id: '05', title: 'HTML, CSS & Design Functions', topics: ['HTML Basics (Structure, Tables, Divs)', 'Styling (Inline, Embedded & Linked CSS)', 'AMPscript Embeds (Variables, Conditionals)', 'Function Basics & Styling Integration'], icon: 'developer_mode_tv.svg' },
  { id: '06', title: 'AMPscript Programming', topics: ['Variables & Output', 'Data Extension Functions', 'Conditional Logic & Loops', 'String & Math Functions', 'URL, Redirect, HTTP & API Integration'], icon: 'terminal.svg' },
  { id: '07', title: 'SQL Queries & Automation Studio', topics: ['SQL: SELECT, Joins, Aggregations, CASE Conditions', 'Automation Studio: Schedule, File Drop, Trigger', 'Activities: Import, Extract, Transfer, Filter, Query, Script', 'Data Management (FTP, Key Management)'], icon: 'integration_instructions.svg' },
  { id: '08', title: 'MC Connect & Journey Builder', topics: ['MC Connect: Managed Package, CRM Settings, Testing', 'Journey Builder: Multi-Step, Single-Step, Transactional', 'Entry Sources: Data Extension, Salesforce Data, API Event', 'Journey Settings & Goals'], icon: 'playlist_add_check_circle.svg' },
  { id: '09', title: 'Contact Builder, Analytics & Web Studio', topics: ['Contact Builder (Data Designer, Attribute Groups)', 'Analytics Builder (Catalogue, Activity Reports)', 'Web Studio (Cloud Pages, Microsites, Preference Centers)'], icon: 'chat.svg' },
  { id: '10', title: 'SSJS & API Integration', topics: ['SSJS (Core Functions, HTTP Functions)', 'API & Postman (Authentication, Journey Management)', 'Managing Unsubscribers via API'], icon: 'highlight_mouse_cursor.svg' },
]

const DEFAULT_TOOLS_TABLE = [
  { tool: 'Journey Builder', purpose: 'Designs personalized, automated customer journeys.' },
  { tool: 'Automation Studio', purpose: 'Automates data imports, segmentation, and campaign sends.' },
  { tool: 'Email Studio', purpose: 'Designs and sends professional marketing emails.' },
  { tool: 'Content Builder', purpose: 'Creates and manages reusable email and landing page content.' },
  { tool: 'Contact Builder', purpose: 'Manages subscriber data and relationships.' },
  { tool: 'Analytics Builder', purpose: 'Generates performance reports and insights.' },
  { tool: 'Mobile Studio', purpose: 'Sends targeted SMS and push notifications.' },
  { tool: 'Web Studio', purpose: 'Creates landing pages and forms using Cloud Pages.' },
  { tool: 'Developer Console', purpose: 'Used by developers to test code, run queries, and debug.' },
  { tool: 'Postman', purpose: 'Tool for testing Salesforce and SFMC APIs.' },
]

const DEFAULT_CAREER = {
  brand: 'CLOUD INTELLECT',
  title: 'Career Outcomes',
  metrics: [
    { value: '1400+', label: 'SUCCESSFUL PLACEMENTS' },
    { value: '5000+', label: 'LEARNERS TRAINED' },
    { value: '32.5 LPA', label: 'HIGHEST PACKAGE' },
  ],
  applyText: 'APPLY NOW',
  applyHref: '#apply',
  batchDate: 'Next Batch Starts Jan 15th',
  batchType: 'Weekend Batch',
  batchIcon: DEFAULT_BATCH_ICON,
}

function SFMCTopicsSection() {
  const { content } = usePageContentContext()
  const sectionRef = useRef(null)
  const rightColumnRef = useRef(null)
  const layoutRef = useRef(null)
  const [isSticky, setIsSticky] = useState(false)
  const [stickyStyle, setStickyStyle] = useState({})

  const section = content?.sfmcTopics && typeof content.sfmcTopics === 'object' ? content.sfmcTopics : {}
  const headingLine1 = section.headingLine1 ?? 'Topics'
  const headingStrong = section.headingStrong ?? 'Covered'
  const modules = Array.isArray(section.modules) && section.modules.length > 0 ? section.modules : DEFAULT_MODULES
  const toolsHeading = section.toolsHeading ?? 'Tools Commonly Used'
  const toolsTable = Array.isArray(section.toolsTable) && section.toolsTable.length > 0 ? section.toolsTable : DEFAULT_TOOLS_TABLE
  const career = section.careerCard && typeof section.careerCard === 'object' ? { ...DEFAULT_CAREER, ...section.careerCard } : DEFAULT_CAREER
  const metrics = Array.isArray(career.metrics) ? career.metrics : DEFAULT_CAREER.metrics
  const batchIcon = career.batchIcon || DEFAULT_BATCH_ICON

  useEffect(() => {
    const handleScroll = () => {
      // Disable sticky behavior on small screens (mobile)
      if (window.innerWidth <= 768) {
        setIsSticky(false)
        setStickyStyle({})
        return
      }

      if (!sectionRef.current || !rightColumnRef.current || !layoutRef.current) return

      const section = sectionRef.current
      const rightColumn = rightColumnRef.current
      const inner = section.querySelector('.sfmc-topics-inner')
      if (!inner) return

      const sectionRect = section.getBoundingClientRect()
      const innerRect = inner.getBoundingClientRect()
      const headerHeight = 140
      const stickyTop = 100

      // Check if we should make it sticky (when section top reaches sticky point)
      if (sectionRect.top <= stickyTop && sectionRect.bottom >= stickyTop + rightColumn.offsetHeight) {
        setIsSticky(true)
        // Calculate left position: right edge of inner container minus width and gap
        const maxWidth = 1280 // max-width of inner container
        const viewportWidth = window.innerWidth
        const innerMaxWidth = Math.min(maxWidth, viewportWidth - 48) // 24px padding on each side
        const leftPosition = (viewportWidth - innerMaxWidth) / 2 + innerMaxWidth - rightColumn.offsetWidth - 40 // gap is 40px
        
        setStickyStyle({
          position: 'fixed',
          top: `${stickyTop}px`,
          left: `${leftPosition}px`,
          width: `${rightColumn.offsetWidth}px`,
          zIndex: 100
        })
      } else {
        setIsSticky(false)
        setStickyStyle({})
      }
    }

    const handleResize = () => {
      handleScroll()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    handleScroll() // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <section ref={sectionRef} className="sfmc-topics-section">
      <div className="sfmc-topics-inner">
        <h2 className="sfmc-topics-heading">{headingLine1} <span>{headingStrong}</span></h2>

        <div ref={layoutRef} className="sfmc-topics-layout">
          <div className="sfmc-topics-left">
            <div className="sfmc-topics-grid">
              {modules.map((mod, idx) => (
                <div key={mod.id || idx} className="sfmc-module-card">
                  <div className="sfmc-module-header">
                    <span className="sfmc-module-label">MODULE {mod.id || ''}</span>
                    <div className="sfmc-module-icon-wrap">
                      <img
                        src={url(mod.icon ? `${ICON_BASE}/${mod.icon}` : '')}
                        alt=""
                        width={24}
                        height={24}
                        className="sfmc-module-icon"
                        aria-hidden
                      />
                    </div>
                  </div>
                  <h3 className="sfmc-module-title">{mod.title || ''}</h3>
                  <ul className="sfmc-module-topics">
                    {(Array.isArray(mod.topics) ? mod.topics : []).map((topic, i) => (
                      <li key={i} className="sfmc-module-topic">{topic}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="sfmc-tools-wrap">
              <h3 className="sfmc-tools-heading">{toolsHeading}</h3>
              <div className="sfmc-tools-table-wrap">
                <table className="sfmc-tools-table">
                  <thead>
                    <tr>
                      <th scope="col">STUDIOS & BUILDERS</th>
                      <th scope="col">PURPOSE / FUNCTIONALITY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {toolsTable.map((row, i) => (
                      <tr key={i}>
                        <td data-label="STUDIOS & BUILDERS">{row.tool}</td>
                        <td data-label="PURPOSE / FUNCTIONALITY">{row.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="sfmc-tools-cards">
                {toolsTable.map((row, i) => (
                  <div key={i} className="sfmc-tools-card">
                    <div className="sfmc-tools-card-label">STUDIOS & BUILDERS</div>
                    <div className="sfmc-tools-card-tool">{row.tool}</div>
                    <div className="sfmc-tools-card-label">PURPOSE / FUNCTIONALITY</div>
                    <div className="sfmc-tools-card-purpose">{row.purpose}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div 
            ref={rightColumnRef}
            className={`sfmc-topics-right ${isSticky ? 'sfmc-topics-right-sticky' : ''}`}
            style={isSticky ? stickyStyle : {}}
          >
            <div className="sfmc-career-card">
              <div className="sfmc-career-brand">{career.brand}</div>
              <h3 className="sfmc-career-title">{career.title}</h3>
              <div className="sfmc-career-metrics">
                {metrics.map((m, i) => (
                  <div key={i} className="sfmc-career-metric">
                    <span className="sfmc-career-value">{m.value}</span>
                    <span className="sfmc-career-label">{m.label}</span>
                  </div>
                ))}
              </div>
              <a href={career.applyHref || '#apply'} className="sfmc-career-apply-btn">
                {career.applyText || 'APPLY NOW'}
              </a>
              <div className="sfmc-career-batch">
                <div className="sfmc-career-batch-icon">
                  <img
                    src={url(batchIcon)}
                    alt=""
                    width={28}
                    height={28}
                    className="sfmc-career-batch-icon-img"
                    aria-hidden
                  />
                </div>
                <div className="sfmc-career-batch-text">
                  <span className="sfmc-career-batch-date">{career.batchDate}</span>
                  <span className="sfmc-career-batch-type">{career.batchType}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SFMCTopicsSection
