import { useState } from 'react'
import { usePageContentContext } from '../contexts/PageContentContext'
import AppLink from './AppLink'

const DEFAULT_TABS = [
  { id: 'developer', label: 'Salesforce Developer' },
  { id: 'marketing', label: 'Salesforce Marketing Cloud' },
]

const DEFAULT_DEVELOPER = {
  main: {
    icon: 'code',
    title: 'Salesforce Developer Cloud (SFDC)',
    description: 'Build apps, automate business processes & work with real CRM development tools used by global companies.',
    linkText: 'Learn Salesforce Development',
    linkHref: '#learn',
  },
  cards: [
    { icon: 'trophy', stat: '#1 CRM used by 150,000+ companies' },
    { icon: 'roles', stat: 'High-demand roles : Admin, Developer, Consultant' },
    { icon: 'chart', stat: '6.6M+ job opportunities coming by 2026' },
  ],
}

const DEFAULT_MARKETING = {
  main: {
    icon: 'marketing',
    title: 'Salesforce Marketing Cloud',
    description: 'Master email, advertising, and journey orchestration. Learn the platform that powers personalized customer experiences at scale.',
    linkText: 'Learn Marketing Cloud',
    linkHref: '#learn',
  },
  cards: [
    { icon: 'audience', stat: 'Unified customer data across channels' },
    { icon: 'automation', stat: 'Journey Builder & Automation Studio' },
    { icon: 'analytics', stat: 'Analytics & ROI measurement' },
  ],
}

function IconCode() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="8" fill="#009FFF" fillOpacity="0.1" />
      <mask id="courses-code-mask" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="12" y="12" width="40" height="40">
        <rect x="12" y="12" width="40" height="40" fill="#D9D9D9" />
      </mask>
      <g mask="url(#courses-code-mask)">
        <path d="M19.2916 31.9583L26.3332 39C26.6019 39.2686 26.7314 39.5926 26.722 39.9721C26.7128 40.3518 26.5739 40.676 26.3053 40.9446C26.037 41.2129 25.7084 41.3471 25.3195 41.3471C24.9306 41.3471 24.6019 41.2129 24.3332 40.9446L16.3053 32.9167C16.1573 32.7686 16.0531 32.6158 15.9928 32.4583C15.9328 32.3008 15.9028 32.1296 15.9028 31.9446C15.9028 31.7593 15.9328 31.5879 15.9928 31.4304C16.0531 31.2732 16.1573 31.1204 16.3053 30.9721L24.4166 22.8612C24.6944 22.5835 25.0253 22.4446 25.4095 22.4446C25.7939 22.4446 26.1251 22.5835 26.4028 22.8612C26.6806 23.139 26.8195 23.47 26.8195 23.8542C26.8195 24.2383 26.6806 24.5693 26.4028 24.8471L19.2916 31.9583ZM44.7083 31.9304L37.6666 24.8887C37.398 24.6204 37.2684 24.2964 37.2778 23.9167C37.287 23.5369 37.4259 23.2129 37.6945 22.9446C37.9628 22.676 38.2914 22.5417 38.6803 22.5417C39.0692 22.5417 39.398 22.676 39.6666 22.9446L47.6945 30.9721C47.8426 31.1204 47.9467 31.2732 48.007 31.4304C48.067 31.5879 48.097 31.7593 48.097 31.9446C48.097 32.1296 48.067 32.3008 48.007 32.4583C47.9467 32.6158 47.8426 32.7686 47.6945 32.9167L39.5833 41.0279C39.3055 41.3057 38.9814 41.4376 38.6112 41.4237C38.2406 41.4099 37.9164 41.264 37.6387 40.9862C37.3609 40.7085 37.222 40.3774 37.222 39.9929C37.222 39.6087 37.3609 39.2778 37.6387 39L44.7083 31.9304Z" fill="#009FFF" />
      </g>
    </svg>
  )
}

function IconTrophy() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="8" fill="#009FFF" fillOpacity="0.1" />
      <mask id="courses-trophy-mask" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="12" y="12" width="40" height="40">
        <rect x="12" y="12" width="40" height="40" fill="#D9D9D9" />
      </mask>
      <g mask="url(#courses-trophy-mask)">
        <path d="M30.6113 44.2221V38.3887C29.1574 38.0832 27.8633 37.4606 26.7292 36.5208C25.595 35.5811 24.7964 34.4075 24.3333 33C22.2686 32.7686 20.5301 31.9099 19.1179 30.4237C17.706 28.9376 17 27.1668 17 25.1112V23.3333C17 22.5694 17.2719 21.9156 17.8158 21.3717C18.36 20.8275 19.014 20.5554 19.7779 20.5554H23.7779V19.7779C23.7779 19.014 24.0499 18.36 24.5938 17.8158C25.1376 17.2719 25.7915 17 26.5554 17H37.4446C38.2085 17 38.8624 17.2719 39.4062 17.8158C39.9501 18.36 40.2221 19.014 40.2221 19.7779V20.5554H44.2221C44.986 20.5554 45.64 20.8275 46.1842 21.3717C46.7281 21.9156 47 22.5694 47 23.3333V25.1112C47 27.1668 46.294 28.9376 44.8821 30.4237C43.4699 31.9099 41.7314 32.7686 39.6667 33C39.2036 34.4075 38.405 35.5811 37.2708 36.5208C36.1367 37.4606 34.8426 38.0832 33.3888 38.3887V44.2221H38.4446C38.8379 44.2221 39.1678 44.3557 39.4342 44.6229C39.7003 44.8901 39.8333 45.2211 39.8333 45.6158C39.8333 46.0108 39.7003 46.3403 39.4342 46.6042C39.1678 46.8681 38.8379 47 38.4446 47H25.5554C25.1621 47 24.8322 46.8664 24.5658 46.5992C24.2997 46.3322 24.1667 46.0013 24.1667 45.6063C24.1667 45.2113 24.2997 44.8818 24.5658 44.6179C24.8322 44.354 25.1621 44.2221 25.5554 44.2221H30.6113ZM23.7779 30.0554V23.3333H19.7779V25.1112C19.7779 26.2963 20.1529 27.3401 20.9029 28.2429C21.6529 29.1457 22.6113 29.7499 23.7779 30.0554ZM32.0067 35.75C33.5208 35.75 34.8057 35.2179 35.8612 34.1538C36.9168 33.0899 37.4446 31.7979 37.4446 30.2779V19.7779H26.5554V30.2779C26.5554 31.7979 27.0854 33.0899 28.1454 34.1538C29.2054 35.2179 30.4925 35.75 32.0067 35.75ZM40.2221 30.0554C41.3888 29.7499 42.3471 29.1457 43.0971 28.2429C43.8471 27.3401 44.2221 26.2963 44.2221 25.1112V23.3333H40.2221V30.0554Z" fill="#009FFF" />
      </g>
    </svg>
  )
}

function IconRoles() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconChart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

function IconMarketing() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function IconAudience() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconAutomation() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function IconAnalytics() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

const ICON_MAP = {
  code: IconCode,
  trophy: IconTrophy,
  roles: IconRoles,
  chart: IconChart,
  marketing: IconMarketing,
  audience: IconAudience,
  automation: IconAutomation,
  analytics: IconAnalytics,
}

function CoursesSection() {
  const { content } = usePageContentContext()
  const courses = content?.courses || {}

  const [activeTab, setActiveTab] = useState('developer')

  const tabs = Array.isArray(courses.tabs) && courses.tabs.length >= 2
    ? courses.tabs
    : DEFAULT_TABS

  const dev = courses.developer || {}
  const mkt = courses.marketing || {}
  const devCards = Array.isArray(dev.cards) && dev.cards.length >= 3 ? dev.cards : DEFAULT_DEVELOPER.cards
  const mktCards = Array.isArray(mkt.cards) && mkt.cards.length >= 3 ? mkt.cards : DEFAULT_MARKETING.cards

  const developerContent = {
    main: {
      icon: 'code',
      title: dev.mainTitle ?? DEFAULT_DEVELOPER.main.title,
      description: dev.mainDescription ?? DEFAULT_DEVELOPER.main.description,
      linkText: dev.mainLinkText ?? DEFAULT_DEVELOPER.main.linkText,
      linkHref: dev.mainLinkHref ?? DEFAULT_DEVELOPER.main.linkHref,
    },
    cards: devCards,
  }
  const marketingContent = {
    main: {
      icon: 'marketing',
      title: mkt.mainTitle ?? DEFAULT_MARKETING.main.title,
      description: mkt.mainDescription ?? DEFAULT_MARKETING.main.description,
      linkText: mkt.mainLinkText ?? DEFAULT_MARKETING.main.linkText,
      linkHref: mkt.mainLinkHref ?? DEFAULT_MARKETING.main.linkHref,
    },
    cards: mktCards,
  }

  const contentByTab = activeTab === 'developer' ? developerContent : marketingContent
  const sectionTitle = courses.sectionTitle ?? 'Our'
  const sectionTitleHighlight = courses.sectionTitleHighlight ?? 'Courses'
  const applyText = courses.applyText ?? 'Apply Today'
  const applyHref = courses.applyHref ?? '#apply'
  const brochureText = courses.brochureText ?? 'Download Brochure'
  const brochureHref = courses.brochureHref ?? '#brochure'

  return (
    <section className="courses-section">
      <div className="courses-container">
        <h2 className="courses-title">{sectionTitle} <span className="courses-title-highlight">{sectionTitleHighlight}</span></h2>

        <div className="courses-tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`courses-tab ${activeTab === tab.id ? 'courses-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="courses-content" role="tabpanel">
          <div className="courses-cards">
            <div className="courses-card courses-card-main">
              <div className={`courses-card-icon-wrap ${contentByTab.main.icon === 'code' ? 'courses-card-icon-wrap-code' : ''}`}>
                {(() => {
                  const Icon = ICON_MAP[contentByTab.main.icon]
                  return Icon ? <Icon /> : null
                })()}
              </div>
              <h3 className="courses-card-title">{contentByTab.main.title}</h3>
              <p className="courses-card-desc">{contentByTab.main.description}</p>
              <AppLink href={contentByTab.main.linkHref || '#learn'} className="courses-card-link">
                {contentByTab.main.linkText} →
              </AppLink>
            </div>
            {contentByTab.cards.map((card, i) => {
              const Icon = ICON_MAP[card.icon]
              return (
                <div key={i} className="courses-card courses-card-small">
                  <div className={`courses-card-icon-wrap ${card.icon === 'trophy' ? 'courses-card-icon-wrap-trophy' : ''}`}>
                    {Icon ? <Icon /> : null}
                  </div>
                  <p className="courses-card-stat">{card.stat}</p>
                </div>
              )
            })}
          </div>

          <div className="courses-cta">
            <AppLink href={applyHref} className="courses-btn courses-btn-primary">
              {applyText}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </AppLink>
            <AppLink href={brochureHref} className="courses-btn courses-btn-secondary">
              {brochureText}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="courses-btn-icon">
                <mask id="courses-download-mask" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                  <rect width="20" height="20" fill="#009FFF" />
                </mask>
                <g mask="url(#courses-download-mask)">
                  <path d="M9.99821 12.9791C9.8871 12.9791 9.78293 12.9617 9.68571 12.927C9.58849 12.8923 9.49821 12.8333 9.41488 12.7499L6.41488 9.74992C6.24821 9.58325 6.16835 9.38881 6.17529 9.16658C6.18224 8.94436 6.2621 8.74992 6.41488 8.58325C6.58154 8.41658 6.77946 8.32978 7.00863 8.32283C7.23779 8.31589 7.43571 8.39575 7.60238 8.56242L9.16488 10.1249V4.16659C9.16488 3.93047 9.24474 3.73256 9.40446 3.57284C9.56418 3.41311 9.7621 3.33325 9.99821 3.33325C10.2343 3.33325 10.4322 3.41311 10.592 3.57284C10.7517 3.73256 10.8315 3.93047 10.8315 4.16659V10.1249L12.394 8.56242C12.5607 8.39575 12.7586 8.31589 12.9878 8.32283C13.217 8.32978 13.4149 8.41658 13.5815 8.58325C13.7343 8.74992 13.8142 8.94436 13.8211 9.16658C13.8281 9.38881 13.7482 9.58325 13.5815 9.74992L10.5815 12.7499C10.4982 12.8333 10.4079 12.8923 10.3107 12.927C10.2135 12.9617 10.1093 12.9791 9.99821 12.9791ZM4.99821 16.6666C4.53988 16.6666 4.14752 16.5034 3.82113 16.177C3.49474 15.8506 3.33154 15.4583 3.33154 14.9999V13.3333C3.33154 13.0971 3.4114 12.8992 3.57113 12.7395C3.73085 12.5798 3.92877 12.4999 4.16488 12.4999C4.40099 12.4999 4.5989 12.5798 4.75863 12.7395C4.91835 12.8992 4.99821 13.0971 4.99821 13.3333V14.9999H14.9982V13.3333C14.9982 13.0971 15.0781 12.8992 15.2378 12.7395C15.3975 12.5798 15.5954 12.4999 15.8315 12.4999C16.0677 12.4999 16.2656 12.5798 16.4253 12.7395C16.585 12.8992 16.6649 13.0971 16.6649 13.3333V14.9999C16.6649 15.4583 16.5017 15.8506 16.1753 16.177C15.8489 16.5034 15.4565 16.6666 14.9982 16.6666H4.99821Z" fill="#009FFF" />
                </g>
              </svg>
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CoursesSection
