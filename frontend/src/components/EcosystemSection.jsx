import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

const DEFAULT_TITLE = 'The Salesforce Ecosystem'
const DEFAULT_DESC = "Join the world's most innovative community. Connect, build, and grow with the platform that powers the future."
const DEFAULT_TRUSTED_IMAGE = '/images/eco-system.webp'

function EcosystemSection() {
  const { content } = usePageContentContext()
  const eco = content?.ecosystem || {}

  const title = eco.title ?? DEFAULT_TITLE
  const description = eco.description ?? DEFAULT_DESC
  const trustedImagePath = eco.trustedImage ?? DEFAULT_TRUSTED_IMAGE
  const trustedImageUrl = trustedImagePath ? (trustedImagePath.startsWith('/') ? getImageUrl(trustedImagePath) : trustedImagePath) : getImageUrl(DEFAULT_TRUSTED_IMAGE)

  const c1 = eco.card1 || {}
  const c2 = eco.card2 || {}
  const c3 = eco.card3 || {}
  const c4 = eco.card4 || {}
  const c5 = eco.card5 || {}

  return (
    <section className="ecosystem-section">
      <div className="ecosystem-bg-image" aria-hidden />
      <div className="ecosystem-container">
        {/* Header */}
        <div className="ecosystem-header">
          <div className="ecosystem-header-text">
            <h2 className="ecosystem-title">{title}</h2>
            <p className="ecosystem-desc">{description}</p>
          </div>
          <div className="ecosystem-trusted">
            <img
              src={trustedImageUrl}
              alt="Trusted by thousands"
              className="ecosystem-trusted-image"
            />
          </div>
        </div>

        {/* Cards - flexbox layout */}
        <div className="ecosystem-cards">
          <div className="ecosystem-cards-row">
          {/* Card 1: World's No.1 CRM */}
          <div className="ecosystem-card ecosystem-card-yellow">
            <span className="ecosystem-card-tag">{c1.tag ?? 'GLOBAL LEADER'}</span>
            <div className="ecosystem-card-trophy" aria-hidden>
              <svg xmlns="http://www.w3.org/2000/svg" width="152" height="152" viewBox="0 0 152 152" fill="none">
                <g opacity="0.2">
                  <path d="M47.9303 53.5995L40.1058 51.9364C36.6472 51.2012 33.6223 49.1223 31.6965 46.1568C29.7707 43.1914 29.1018 39.5824 29.837 36.1238C30.5721 32.6651 32.6511 29.6402 35.6166 27.7144C38.582 25.7886 42.191 25.1198 45.6496 25.8549L53.4741 27.518" stroke="#EAB308" strokeWidth="10.6658" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M110.527 66.905L118.351 68.5681C121.81 69.3033 125.419 68.6344 128.384 66.7086C131.349 64.7828 133.428 61.7579 134.164 58.2993C134.899 54.8406 134.23 51.2316 132.304 48.2662C130.378 45.3008 127.353 43.2218 123.895 42.4866L116.07 40.8235" stroke="#EAB308" strokeWidth="10.6658" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23.0835 119.196L106.546 136.936" stroke="#EAB308" strokeWidth="10.6658" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M62.5195 87.5598L59.925 99.7659C59.3152 102.635 56.3868 104.357 53.5236 105.002C46.7696 106.511 40.6837 113.34 38.7323 122.521" stroke="#EAB308" strokeWidth="10.6658" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M83.3853 91.995L80.7908 104.201C80.1809 107.07 82.1558 109.834 84.509 111.588C90.0655 115.713 92.8473 124.428 90.8959 133.609" stroke="#EAB308" strokeWidth="10.6658" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M118.288 30.3908L55.6919 17.0854L47.9305 53.6001C46.1661 61.9009 47.7714 70.5627 52.3934 77.6798C57.0153 84.797 64.2753 89.7866 72.5761 91.551C80.8769 93.3154 89.5386 91.7101 96.6558 87.0881C103.773 82.4662 108.763 75.2062 110.527 66.9054L118.288 30.3908Z" stroke="#EAB308" strokeWidth="10.6658" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
              </svg>
            </div>
            <p className="ecosystem-card-big">{c1.bigText ?? "World's No.1"}</p>
            <p className="ecosystem-card-sub">{c1.subText ?? 'CRM Platform'}</p>
            <p className="ecosystem-card-note">{c1.note ?? 'Recognized globally with the largest market share.'}</p>
          </div>

          {/* Card 2: Market Share */}
          <div className="ecosystem-card ecosystem-card-white">
            <div className="ecosystem-card-icons">
              <span className="ecosystem-icon ecosystem-icon-green" aria-hidden>
                {/* <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 17l6-6 4 4 8-8"/></svg> */}
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M18.6602 8.1637H25.6572V15.1608" stroke="#16A34A" stroke-width="2.3325" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M25.657 8.16382L15.7439 18.0769L9.91266 12.2457L2.33203 19.8263" stroke="#16A34A" stroke-width="2.3325" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span className="ecosystem-icon-expand" aria-hidden>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6.99414 6.99414H16.9858V16.9858" stroke="#D1D5DB" stroke-width="1.99833" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.99414 16.9858L16.9858 6.99414" stroke="#D1D5DB" stroke-width="1.99833" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              </span>
            </div>
            <p className="ecosystem-card-stat">{c2.stat ?? '20.7%'}</p>
            <p className="ecosystem-card-label">{c2.label ?? 'Global CRM Market Share'}</p>
            <p className="ecosystem-card-source">{c2.source ?? 'IDC Worldwide Semiannual Tracker, 2024'}</p>
          </div>

          {/* Card 3: Customers */}
          <div className="ecosystem-card ecosystem-card-white">
            <div className="ecosystem-card-icons">
              <span className="ecosystem-icon ecosystem-icon-purple" aria-hidden>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M18.6585 24.4907V22.1584C18.6585 20.9212 18.1671 19.7347 17.2923 18.8599C16.4175 17.9851 15.231 17.4937 13.9938 17.4937H6.99675C5.75959 17.4937 4.5731 17.9851 3.6983 18.8599C2.82349 19.7347 2.33203 20.9212 2.33203 22.1584V24.4907" stroke="#4F46E5" stroke-width="2.3325" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.6602 3.64807C19.6605 3.90739 20.5463 4.49153 21.1787 5.30878C21.8111 6.12604 22.1543 7.13015 22.1543 8.16352C22.1543 9.19688 21.8111 10.201 21.1787 11.0183C20.5463 11.8355 19.6605 12.4196 18.6602 12.679" stroke="#4F46E5" stroke-width="2.3325" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M25.6577 24.4907V22.1584C25.6569 21.1248 25.3129 20.1208 24.6797 19.3039C24.0465 18.4871 23.1599 17.9037 22.1592 17.6453" stroke="#4F46E5" stroke-width="2.3325" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.4958 12.8282C13.072 12.8282 15.1605 10.7397 15.1605 8.1635C15.1605 5.58724 13.072 3.49878 10.4958 3.49878C7.91952 3.49878 5.83105 5.58724 5.83105 8.1635C5.83105 10.7397 7.91952 12.8282 10.4958 12.8282Z" stroke="#4F46E5" stroke-width="2.3325" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              </span>
              <span className="ecosystem-icon-expand" aria-hidden>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6.99414 6.99414H16.9858V16.9858" stroke="#D1D5DB" stroke-width="1.99833" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.99414 16.9858L16.9858 6.99414" stroke="#D1D5DB" stroke-width="1.99833" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              </span>
            </div>
            <p className="ecosystem-card-stat">{c3.stat ?? '150k+'}</p>
            <p className="ecosystem-card-label">{c3.label ?? 'Customers Worldwide'}</p>
            <p className="ecosystem-card-source">{c3.source ?? 'Including Fortune 500 companies'}</p>
          </div>
          </div>

          <div className="ecosystem-cards-row">
          {/* Card 4: Financials - same structure as top white cards */}
          <div className="ecosystem-card ecosystem-card-white ecosystem-card-small">
            <div className="ecosystem-card-icons">
              <span aria-hidden />
              <span className="ecosystem-icon-expand" aria-hidden>
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6.99414 6.99414H16.9858V16.9858" stroke="currentColor" strokeWidth="1.99833" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.99414 16.9858L16.9858 6.99414" stroke="currentColor" strokeWidth="1.99833" strokeLinecap="round" strokeLinejoin="round"/>
                </svg> */}
              </span>
            </div>
            <div className="ecosystem-card-small-content">
              <div className="ecosystem-card-tag-row">
                <span className="ecosystem-icon-dollar-circle" aria-hidden>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M11.9902 1.99829V21.9816" stroke="#9333EA" stroke-width="1.99833" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.986 4.99585H9.4922C8.56472 4.99585 7.67522 5.36429 7.01939 6.02012C6.36356 6.67595 5.99512 7.56545 5.99512 8.49293C5.99512 9.42042 6.36356 10.3099 7.01939 10.9657C7.67522 11.6216 8.56472 11.99 9.4922 11.99H14.488C15.4155 11.99 16.305 12.3585 16.9608 13.0143C17.6167 13.6701 17.9851 14.5596 17.9851 15.4871C17.9851 16.4146 17.6167 17.3041 16.9608 17.9599C16.305 18.6157 15.4155 18.9842 14.488 18.9842H5.99512" stroke="#9333EA" stroke-width="1.99833" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                </span>
                <span className="ecosystem-card-tag ecosystem-card-tag-purple">{c4.tag ?? 'FINANCIALS'}</span>
              </div>
              <p className="ecosystem-card-stat">{c4.stat ?? '$34.86 B'}</p>
              <p className="ecosystem-card-label">{c4.label ?? 'Annual Revenue (FY 2024)'}</p>
            </div>
          </div>

          {/* Card 5: Economic Impact - same structure with expand icon */}
          <div className="ecosystem-card ecosystem-card-dark">
            <div className="ecosystem-card-icons ecosystem-card-icons-dark">
              <span aria-hidden />
              {/* <span className="ecosystem-icon-expand ecosystem-icon-expand-light" aria-hidden>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6.99414 6.99414H16.9858V16.9858" stroke="currentColor" strokeWidth="1.99833" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.99414 16.9858L16.9858 6.99414" stroke="currentColor" strokeWidth="1.99833" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span> */}
            </div>
            <div className="ecosystem-card-tag-row ecosystem-card-tag-row-light">
              <span className="ecosystem-dot" />
              <span className="ecosystem-card-tag ecosystem-card-tag-light">{c5.tag ?? 'ECONOMIC IMPACT'}</span>
            </div>
            <div className="ecosystem-card-dark-main">
              <p className="ecosystem-card-stats ecosystem-card-stat-light">{c5.stat ?? '1.8 Million'}</p>
              <p className="ecosystem-card-label ecosystem-card-label-light">{c5.label ?? 'New Jobs in India by 2028'}</p>
              <p className="ecosystem-card-source ecosystem-card-source-light">{c5.source ?? 'Source: Salesforce India Economic Impact Report'}</p>
            </div>
            <div className="ecosystem-card-briefcase" aria-hidden>
              <div className="ecosystem-card-briefcase-circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="52" viewBox="0 0 56 52" fill="none">
                <path d="M37.0837 46.9072V9.57389C37.0837 8.33622 36.592 7.14923 35.7168 6.27406C34.8417 5.39889 33.6547 4.90723 32.417 4.90723H23.0837C21.846 4.90723 20.659 5.39889 19.7838 6.27406C18.9087 7.14923 18.417 8.33622 18.417 9.57389V46.9072" stroke="white" stroke-width="4.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M46.417 14.2402H9.08366C6.50633 14.2402 4.41699 16.3296 4.41699 18.9069V42.2402C4.41699 44.8176 6.50633 46.9069 9.08366 46.9069H46.417C48.9943 46.9069 51.0837 44.8176 51.0837 42.2402V18.9069C51.0837 16.3296 48.9943 14.2402 46.417 14.2402Z" stroke="white" stroke-width="4.66667" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EcosystemSection
