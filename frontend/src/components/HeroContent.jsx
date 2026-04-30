function HeroContent() {
  return (
    <div className="content-wrapper">
      <div className="header-container">
        <h1 className="hero-title">
          <span className="title-highlight">India's</span>{' '}
          <span className="title-highlight">Leading</span>{' '}
          <span className="title-normal">Salesforce Training & Career Institute</span>
        </h1>
      </div>

      <div className="text-content">
        <p className="hero-subtitle">
          Empowering learners across India with industry-ready skills, certifications, and real project experience.
        </p>
        
        <p className="hero-description">
          Cloud Intellect delivers structured Salesforce learning powered by expert mentors and real consulting exposure, shaping professionals who thrive in global technology careers.
        </p>

        <button className="apply-button">
          <span className="button-text">Apply Today</span>
          <svg className="arrow-icon" width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.15 6.563H1C0.716667 6.563 0.479167 6.46717 0.2875 6.2755C0.0958333 6.08383 0 5.84633 0 5.563C0 5.27967 0.0958333 5.04217 0.2875 4.8505C0.479167 4.65883 0.716667 4.563 1 4.563H12.15L9.3 1.713C9.1 1.513 9.00417 1.27967 9.0125 1.013C9.02083 0.746333 9.11667 0.513 9.3 0.313C9.5 0.113 9.7375 0.00883333 10.0125 0.0005C10.2875 -0.00783333 10.525 0.088 10.725 0.288L15.3 4.863C15.4 4.963 15.4708 5.07133 15.5125 5.188C15.5542 5.30467 15.575 5.42967 15.575 5.563C15.575 5.69633 15.5542 5.82133 15.5125 5.938C15.4708 6.05467 15.4 6.163 15.3 6.263L10.725 10.838C10.525 11.038 10.2875 11.1338 10.0125 11.1255C9.7375 11.1172 9.5 11.013 9.3 10.813C9.11667 10.613 9.02083 10.3797 9.0125 10.113C9.00417 9.84633 9.1 9.613 9.3 9.413L12.15 6.563Z" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default HeroContent
