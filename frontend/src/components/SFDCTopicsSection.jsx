import { useEffect, useRef, useState } from 'react'
import { usePageContentContext } from '../contexts/PageContentContext'

const ICON_CODE = '/images/code.svg'
const DEFAULT_BATCH_ICON = '/images/SVG (5) copy 2.svg'

function url(path) {
  return path ? encodeURI(path) : ''
}

const DEFAULT_MODULES = [
  { id: '01', title: 'Cloud & Salesforce Basics', topics: ['Cloud Computing Overview', 'Introduction to Salesforce', 'Admin Setup & Navigation'] },
  { id: '02', title: 'Configuration', topics: ['Apps, Objects, Fields, Tabs', 'Security in Salesforce', 'Reports & Dashboards'] },
  { id: '04', title: 'Apex Programming', topics: ['Data Types, Loops, Classes, Interfaces', 'SOQL & SOSL', 'Triggers & Test Classes', 'Asynchronous Apex'] },
  { id: '05', title: 'Lightning & LWC', topics: ['HTML, CSS, JavaScript', 'LWC Basics & Lifecycle Hooks', 'LWC Events (Parent-Child, Pub-Sub, LMS)', 'SLDS, Promises, Apex with LWC', 'Best Practices in LWC'] },
  { id: '03', title: 'Automation Tools', topics: ['Flow (Record Trigger, Schedule, Screen Flow)', 'Process Builder'] },
  { id: '06', title: 'Integration & Deployment', topics: ['API Callouts (Remote Site, Named Credentials)', 'Connected App Setup', 'Postman Tool', 'Sandbox, Deployment Strategies', 'CI/CD & Change Set'] },
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
  batchDate: 'Next Batch Starts Feb 15th',
  batchType: 'Weekend Batch',
  batchIcon: DEFAULT_BATCH_ICON,
}

function SFDCTopicsSection() {
  const { content } = usePageContentContext()
  const sectionRef = useRef(null)
  const rightColumnRef = useRef(null)
  const layoutRef = useRef(null)
  const [isSticky, setIsSticky] = useState(false)
  const [stickyStyle, setStickyStyle] = useState({})

  const section = content?.sfdcTopics && typeof content.sfdcTopics === 'object' ? content.sfdcTopics : {}
  const headingLine1 = section.headingLine1 ?? 'Topics Covered in'
  const headingStrong = section.headingStrong ?? 'SFDC Program'
  const modules = Array.isArray(section.modules) && section.modules.length > 0 ? section.modules : DEFAULT_MODULES
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
      const inner = section.querySelector('.sfdc-topics-inner')
      if (!inner) return

      const sectionRect = section.getBoundingClientRect()
      const innerRect = inner.getBoundingClientRect()
      const headerHeight = 140
      const stickyTop = 160

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
    <section ref={sectionRef} className="sfdc-topics-section">
      <div className="sfdc-topics-inner">
        <h2 className="sfdc-topics-heading">{headingLine1} <span>{headingStrong}</span></h2>

        <div ref={layoutRef} className="sfdc-topics-layout">
          <div className="sfdc-topics-left">
            <div className="sfdc-topics-grid">
              {modules.map((mod, idx) => (
                <div key={mod.id || idx} className="sfdc-module-card">
                  <div className="sfdc-module-header">
                    <span className="sfdc-module-label">MODULE {mod.id || ''}</span>
                    <div className="sfdc-module-icon-wrap">
                      <img
                        src={url(ICON_CODE)}
                        alt=""
                        width={24}
                        height={24}
                        className="sfdc-module-icon"
                        aria-hidden
                      />
                    </div>
                  </div>
                  <h3 className="sfdc-module-title">{mod.title || ''}</h3>
                  <ul className="sfdc-module-topics">
                    {(Array.isArray(mod.topics) ? mod.topics : []).map((topic, i) => (
                      <li key={i} className="sfdc-module-topic">{topic}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div 
            ref={rightColumnRef}
            className={`sfdc-topics-right ${isSticky ? 'sfdc-topics-right-sticky' : ''}`}
            style={isSticky ? stickyStyle : {}}
          >
            <div className="sfdc-career-card">
              <div className="sfdc-career-brand">{career.brand}</div>
              <h3 className="sfdc-career-title">{career.title}</h3>
              <div className="sfdc-career-metrics">
                {metrics.map((m, i) => (
                  <div key={i} className="sfdc-career-metric">
                    <span className="sfdc-career-value">{m.value}</span>
                    <span className="sfdc-career-label">{m.label}</span>
                  </div>
                ))}
              </div>
              <a href={career.applyHref || '#apply'} className="sfdc-career-apply-btn">
                {career.applyText || 'APPLY NOW'}
              </a>
              <div className="sfdc-career-batch">
                <div className="sfdc-career-batch-icon">
                  <img
                    src={url(batchIcon)}
                    alt=""
                    width={28}
                    height={28}
                    className="sfdc-career-batch-icon-img"
                    aria-hidden
                  />
                </div>
                <div className="sfdc-career-batch-text">
                  <span className="sfdc-career-batch-date">{career.batchDate}</span>
                  <span className="sfdc-career-batch-type">{career.batchType}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SFDCTopicsSection
