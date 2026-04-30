import React from 'react'
import { Link } from 'react-router-dom'
import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'
import '../styles/landing-export.css'

const PHONE_ICON_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M13.9996 10.4817V12.5893C14.0004 12.7849 13.9602 12.9786 13.8817 13.1578C13.8031 13.3371 13.6879 13.498 13.5435 13.6303C13.399 13.7626 13.2285 13.8633 13.0428 13.9259C12.8571 13.9886 12.6603 14.0119 12.465 13.9943C10.299 13.7594 8.2183 13.0207 6.39023 11.8376C4.68945 10.7589 3.24748 9.31984 2.16674 7.62243C0.977102 5.78969 0.236769 3.70306 0.00571348 1.53156C-0.011877 1.33729 0.0112568 1.1415 0.0736417 0.956639C0.136027 0.77178 0.236296 0.601911 0.368066 0.457846C0.499835 0.313781 0.660218 0.198678 0.839003 0.119863C1.01779 0.0410494 1.21106 0.000251806 1.40651 6.81111e-05H3.51826C3.85987 -0.00328744 4.19105 0.117444 4.45007 0.33976C4.70909 0.562076 4.87828 0.870806 4.92609 1.20841C5.01522 1.88287 5.18052 2.54511 5.41883 3.18249C5.51354 3.43394 5.53403 3.70721 5.47789 3.96993C5.42175 4.23265 5.29132 4.4738 5.10207 4.66481L4.20809 5.55701C5.21016 7.31581 6.6693 8.77206 8.43159 9.77214L9.32556 8.87994C9.51695 8.69106 9.75858 8.56089 10.0218 8.50486C10.2851 8.44883 10.5589 8.46929 10.8108 8.56381C11.4495 8.80164 12.113 8.96662 12.7888 9.05557C13.1308 9.10371 13.4431 9.2756 13.6663 9.53855C13.8895 9.8015 14.0081 10.1372 13.9996 10.4817Z" fill="#00FFE6" />
  </svg>
)

function CtaLink({ href, className, children }) {
  if (!href || href === '#') return <span className={className}>{children}</span>
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:'))
    return <a href={href} className={className}>{children}</a>
  const to = href.startsWith('/') ? href : `/${href}`
  return <Link to={to} className={className}>{children}</Link>
}

export default function LandingPageExport() {
  const { content } = usePageContentContext()
  const hero = content?.hero || {}
  const topBar = hero.topBar || {}
  const eventBar = hero.eventBar || {}
  const video = hero.video || {}
  const cta = hero.cta || {}
  const stats = Array.isArray(hero.stats) ? hero.stats : [
    { value: '1200+', label: 'Students Placed' },
    { value: '200+', label: 'Hiring Partners' },
    { value: '₹8 LPA', label: 'Avg Salary' },
  ]

  const logoPath = topBar.logoUrl || '/images/Logo (1).webp'
  const logoUrl = logoPath.startsWith('/') ? getImageUrl(logoPath) : logoPath
  const phone = topBar.phone || '8766996944'
  const contactBtnText = topBar.contactButtonText || 'Contact Us'
  const contactBtnHref = topBar.contactButtonHref || '/contact'
  const eventDate = eventBar.date || '29th November 2025'
  const eventTime = eventBar.time || '08:30 AM'
  const headline = hero.headline || 'Become a Salesforce\nDeveloper in 90 Days\n& Land a ₹5–22 LPA IT Job'
  const subHeadline = hero.subHeadline || "Even if You're from Non-IT"
  const supportingText = hero.supportingText || 'Join 1200+ students who transformed their career with Salesforce. Live\nMasterclass + Guaranteed Placement Assistance.'
  const videoThumb = video.thumbnailUrl ? (video.thumbnailUrl.startsWith('/') ? getImageUrl(video.thumbnailUrl) : video.thumbnailUrl) : 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/5ngbi7vw_expires_30_days.png'
  const videoHref = video.videoUrl || '#'
  const ctaText = cta.buttonText || 'Register for a free 3-day Masterclass'
  const ctaHref = cta.buttonHref || '#register'

  const defaultStatImgs = [
    'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/ca57mdc1_expires_30_days.png',
    'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/awsnf0b4_expires_30_days.png',
    'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/60zy2qy2_expires_30_days.png',
  ]

  return (
    <div className="landing-export">
      <div className="page">
        <div className="section hero-wrap">
          <div className="hero-bg">
            <div className="container header">
              <CtaLink href="/" className="logo-btn">
                {logoUrl && <img src={logoUrl} alt="Cloud Intellect" />}
              </CtaLink>
              <div className="header-right">
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="phone-row">
                  {PHONE_ICON_SVG}
                  <span>{phone}</span>
                </a>
                <CtaLink href={contactBtnHref} className="btn-contact">{contactBtnText}</CtaLink>
              </div>
            </div>
            <div className="container hero-inner">
              <div className="hero-left">
                <div className="hero-badge">
                  <span>Date: {eventDate} | Time: {eventTime}</span>
                </div>
                <h1 className="hero-title">{headline}</h1>
                <p className="hero-sub">{subHeadline}</p>
                <p className="hero-desc">{supportingText}</p>
                <div className="stats-row">
                  {stats.map((stat, i) => (
                    <div key={i} className="stat-item">
                      <img src={defaultStatImgs[i] || defaultStatImgs[0]} alt="" />
                      <div>
                        <span className="stat-num">{stat.value}</span><br />
                        <span className="stat-label">{stat.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <CtaLink href={ctaHref} className="btn-register">{ctaText}</CtaLink>
              </div>
              <CtaLink href={videoHref}>
                <img src={videoThumb} alt="Hero" className="hero-img" />
              </CtaLink>
            </div>
            {/* <div className="webinar-bar">
              <div>
                <h2>Register for the Free 3-Day Salesforce Webinar</h2>
                <p>Live from 8:30 PM – 10:00 PM · Limited Seats — Don't Miss Out!</p>
              </div>
              <CtaLink href={ctaHref} className="btn-register-now">Register Now</CtaLink>
            </div> */}
          </div>

          <div className="section-dark section-center">
            <h2 className="section-title">Why You're Still Not in an IT Job</h2>
            <div className="problem-grid">
              <div className="problem-card"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/kpvwuqdl_expires_30_days.png" alt="" /><span>No clarity on where to start in IT</span></div>
              <div className="problem-card"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/9tg3hvi2_expires_30_days.png" alt="" /><span>You've done certifications… but nothing changed</span></div>
              <div className="problem-card"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/tknhr935_expires_30_days.png" alt="" /><span>No coding knowledge or technical background</span></div>
              <div className="problem-card"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/k3weufpp_expires_30_days.png" alt="" /><span>Fear of switching — What if I fail?</span></div>
            </div>
            <CtaLink href={ctaHref} className="btn-register">{ctaText}</CtaLink>
          </div>

          <div className="container-narrow mb-20" >
            <h2 className="section-title text-center">Your Career After 120 Days</h2>
            <p className="section-sub text-center">From Zero to Salesforce Professional</p>
            <div className="career-grid">
              <div className="career-card">
                <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/h8qgby8a_expires_30_days.png" alt="" />
                <h3>Become Job-Ready in<br />Salesforce</h3>
                <p>Master in-demand skills in just 120<br />days</p>
              </div>
              <div className="career-card">
                <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/jp87p2ph_expires_30_days.png" alt="" />
                <h3>Build Real Industry<br />Projects</h3>
                <p>Hands-on experience with actual<br />business scenarios</p>
              </div>
              <div className="career-card">
                <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/8rfw44pi_expires_30_days.png" alt="" />
                <h3>Crack 3–5 Interviews</h3>
                <p>Interview prep & placement<br />assistance included</p>
              </div>
              <div className="career-card">
                <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/jitz4fhm_expires_30_days.png" alt="" />
                <h3>Earn ₹5–22 LPA Salary</h3>
                <p>Start your IT career with<br />competitive packages</p>
              </div>
            </div>
          </div>

          <div className="section-dark section-center">
            <h2 className="section-title">Success Stories from Our Students</h2>
            <p className="section-sub">Real people, real transformations</p>
            <div className="stories-row">
              <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/voqrnrtx_expires_30_days.png" alt="" style={{ width: 32, height: 32 }} />
              <div className="story-card">
                <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/tf7dvbk9_expires_30_days.png" alt="Azharuddin" className="photo" />
                <div className="story-name">Azharuddin Maniyar</div>
                <div className="story-meta">Linkedin</div>
                <div className="divider-line" />
                <span className="story-role">Salesforce Developer</span> <span className="story-salary">₹8.25 LPA</span>
                <div className="story-tag"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/hgwte0ql_expires_30_days.png" alt="" /><span>Marketing Cloud Developer</span></div>
              </div>
              <div className="story-card">
                <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/no87uy8x_expires_30_days.png" alt="Shivani" className="photo" />
                <div className="story-name">Shivani Korwan</div>
                <div className="story-meta">Linkedin</div>
                <div className="divider-line" />
                <span className="story-role">Salesforce Developer</span> <span className="story-salary">₹3 LPA</span>
                <div className="story-tag"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/6npbyxga_expires_30_days.png" alt="" /><span>Marketing Cloud Developer</span></div>
              </div>
              <div className="story-card">
                <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/dras8cuv_expires_30_days.png" alt="Gaurav" className="photo" />
                <div className="story-name">Gaurav Ghayar</div>
                <div className="story-meta">Linkedin</div>
                <div className="divider-line" />
                <span className="story-role">Salesforce Developer</span> <span className="story-salary">₹9 LPA</span>
                <div className="story-tag"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/4tmpmzai_expires_30_days.png" alt="" /><span>Commerce Student to IT Developer</span></div>
              </div>
              <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/zwqwaq0g_expires_30_days.png" alt="" style={{ width: 32, height: 32 }} />
            </div>
          </div>

          <div className="gradient-section">
            <div className="section-center">
              <h2 className="section-title">Why Salesforce? The Market Says It All</h2>
              <p className="section-sub">Join the fastest-growing tech ecosystem</p>
              <div className="market-grid">
                <div className="market-card">
                  <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/w8tlbqr4_expires_30_days.png" alt="" />
                  <span className="big">150,000+</span>
                  <h3>Jobs in India</h3>
                  <p>Growing Salesforce ecosystem</p>
                </div>
                <div className="market-card">
                  <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/vs1sshwm_expires_30_days.png" alt="" />
                  <span className="big">₹3–5 LPA</span>
                  <h3>Fresher Salary Range</h3>
                  <p>Start earning from day one</p>
                </div>
                <div className="market-card">
                  <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/o60uivrk_expires_30_days.png" alt="" />
                  <span className="big">Fortune 500</span>
                  <h3>Global Demand</h3>
                  <p>Work with top companies worldwide</p>
                </div>
              </div>
            </div>
          </div>

          <div className="section-dark section-center">
            <h2 className="section-title">What You'll Learn in the Masterclass</h2>
            <p className="section-sub">Everything you need to kickstart your Salesforce career</p>
            <div className="learn-grid">
              <div className="learn-row">
                <div className="learn-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/mi0ruvw2_expires_30_days.png" alt="" /><span>Understand Cloud & Cloud{'\n'}Computing Fundamentals</span></div>
                <div className="learn-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/5gnb1v15_expires_30_days.png" alt="" /><span>Learn What Salesforce Is and Why It{'\n'}Powers Fortune 500 Companies</span></div>
                <div className="learn-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/d058thdr_expires_30_days.png" alt="" /><span>See How Top Businesses Automate{'\n'}Using Salesforce</span></div>
              </div>
              <div className="learn-row">
                <div className="learn-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/zvgdwsh0_expires_30_days.png" alt="" /><span>Build Your First Salesforce App{'\n'}(Objects, Fields & Tabs – Step by Step)</span></div>
                <div className="learn-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/crl946kr_expires_30_days.png" alt="" /><span>Follow the Complete Salesforce Career{'\n'}Roadmap (Admin → Developer → LWC)</span></div>
                <div className="learn-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/7kyec687_expires_30_days.png" alt="" /><span>100% Practical. No Theory. Build live{'\n'}apps along with the trainer.</span></div>
              </div>
              <div className="learn-row">
                <div className="learn-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/f04jsz54_expires_30_days.png" alt="" /><span>Discover How to Grow Your Career to{'\n'}₹25–30 LPA as a Salesforce Developer</span></div>
                <div className="learn-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/59zgpwss_expires_30_days.png" alt="" /><span>Gain Insights into the Latest Salesforce{'\n'}Features and Innovations for 2025</span></div>
                <div className="learn-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/dmo408e4_expires_30_days.png" alt="" /><span>Explore Real-World Case Studies of{'\n'}Successful Salesforce Implementations</span></div>
              </div>
            </div>
            <CtaLink href={ctaHref} className="btn-register">{ctaText}</CtaLink>
          </div>

          <div className="section-center mb-20" style={{ padding: '0 24px' }}>
            <h2 className="section-title">Is This Masterclass Right for You? Let's Find Out</h2>
            <p className="section-sub">No matter your background, this masterclass gets you Salesforce-ready.</p>
            <div className="audience-grid">
              {[
                { img: 'offv6g4r', h: 'Freshers', p: 'Start your IT career right out of college' },
                { img: 's4vvzkyr', h: 'Non-IT Workers', p: 'Switch from any background to tech' },
                { img: 'mzg1w38t', h: 'IT Support → Developer', p: 'Upgrade your current IT role' },
                { img: 'j43dcwg9', h: 'Women Returning', p: 'Restart your career after a break' },
                { img: '79nidvi8', h: 'Final Year Students', p: 'Get placed before graduation' },
                { img: 'tqzuljxs', h: 'Graduating Seniors', p: 'Launch your career before graduating' },
              ].map((item, i) => (
                <div key={i} className="audience-card">
                  <img src={`https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/${item.img}_expires_30_days.png`} alt="" />
                  <h3>{item.h}</h3>
                  <p>{item.p}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-dark section-center">
            <h2 className="section-title">Why Salesforce Is the Smartest Career Choice in 2026</h2>
            <p className="section-sub">Discover the opportunities that make Salesforce a game-changing career path</p>
            <div className="reasons-grid">
              <div className="reasons-row">
                <div className="reason-card">
                  <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/o6ewghs6_expires_30_days.png" alt="" />
                  <div><h3>Low-Code, Easy to Learn</h3><p>No programming background? No problem. Start your career today.</p></div>
                </div>
                <div className="reason-card">
                  <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/zg2tiky2_expires_30_days.png" alt="" />
                  <div><h3>Job-Ready in 4 Months</h3><p>From basics → projects → placement calls in just 4 months.</p></div>
                </div>
              </div>
              <div className="reasons-row">
                <div className="reason-card">
                  <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/tlkq21qa_expires_30_days.png" alt="" />
                  <div><h3>High-Paying Career</h3><p>₹5–8 LPA (fresher) | ₹20–40 LPA (experienced professionals).</p></div>
                </div>
                <div className="reason-card">
                  <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/7nyqn9ij_expires_30_days.png" alt="" />
                  <div><h3>Global Demand</h3><p>93 lakh jobs by 2026; 90% Fortune 500 companies use Salesforce.</p></div>
                </div>
              </div>
              <div className="reasons-row">
                <div className="reason-card">
                  <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/b2f5wmon_expires_30_days.png" alt="" />
                  <div><h3>AI-Powered Future</h3><p>Learn Einstein, Data Cloud & Agentforce technologies.</p></div>
                </div>
                <div className="reason-card">
                  <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/28rnzsmq_expires_30_days.png" alt="" />
                  <div><h3>Work from Anywhere</h3><p>Remote & global roles in 120+ countries.</p></div>
                </div>
              </div>
            </div>
            <CtaLink href={ctaHref} className="btn-register">{ctaText}</CtaLink>
          </div>

          <div className="who-section">
            <div className="who-left">
              <h2>Who We Are</h2>
              <p>We are Cloud Intellect (CI) — Central India's No. 1 Salesforce Institute, combining real project experience with 100% placement support.</p>
              <div className="who-item">
                <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/w6s03pph_expires_30_days.png" alt="" />
                <div><h3>Official Salesforce Ridge Consulting Partner</h3><p>Recognized for excellence in training and consulting.</p></div>
              </div>
              <div className="who-item">
                <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/0at74y6k_expires_30_days.png" alt="" />
                <div><h3>Official Salesforce Workforce Development Partner</h3><p>Committed to developing skilled professionals for the global ecosystem.</p></div>
              </div>
              <div className="who-item">
                <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/pkg3to5r_expires_30_days.png" alt="" />
                <div><h3>Offices in Nagpur (HQ) and Pune (Baner)</h3><p>Strategically located to serve learners and enterprises across Central India.</p></div>
              </div>
            </div>
            <div className="who-badges">
              <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/4cxz2al2_expires_30_days.png" alt="Badge 1" />
              <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/fosnebhq_expires_30_days.png" alt="Badge 2" />
            </div>
          </div>

          <div className="section-dark section-center">
            <h2 className="section-title">From Training to Placement</h2>
            <p className="section-sub" style={{ maxWidth: 976 }}>We don't just teach — we make you job-ready and confident to crack your first Salesforce interview. Our comprehensive approach combines cutting-edge curriculum with real-world project experience and personalized career guidance.</p>
            <div className="placement-grid">
              <div className="placement-row">
                <div className="placement-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/wsqpeqsv_expires_30_days.png" alt="" /><span>100% Placement Support (Resume{'\n'}+ Mocks + Job Calls)</span></div>
                <div className="placement-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/692x4equ_expires_30_days.png" alt="" /><span>Trainers with 12+ Years of Industry Experience</span></div>
                <div className="placement-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/4bqt0zht_expires_30_days.png" alt="" /><span>1200+ Students Placed in Top MNCs</span></div>
              </div>
              <div className="placement-row">
                <div className="placement-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/k6o19fyo_expires_30_days.png" alt="" /><span>50+ Live Projects & Hands-On Practice</span></div>
                <div className="placement-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/43u6y5ve_expires_30_days.png" alt="" /><span>LMS Access + Recordings + Assignment</span></div>
                <div className="placement-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/q7mx3cgr_expires_30_days.png" alt="" /><span>Offline (Nagpur, Pune) + Online Batches</span></div>
              </div>
              <div className="placement-row">
                <div className="placement-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/gzb4nqnc_expires_30_days.png" alt="" /><span>Global Alumni in 8+ Countries</span></div>
                <div className="placement-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/ypl7tajz_expires_30_days.png" alt="" /><span>Industry Recognized Certification Upon Completion</span></div>
                <div className="placement-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/4jtduyn4_expires_30_days.png" alt="" /><span>Networking Opportunities with Industry Leaders</span></div>
              </div>
            </div>
            <CtaLink href={ctaHref} className="btn-register">{ctaText}</CtaLink>
          </div>

          <div className="section-dark section-center mb-20">
            <h2 className="section-title">Learn From an Industry Expert</h2>
            <p className="section-sub">Get guidance from someone who's been there</p>
            <div className="expert-section">
              <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/ohdl8sq4_expires_30_days.png" alt="Sumit Mahakalkar" className="expert-img" />
              <div className="expert-info">
                <h2>Sumit Mahakalkar</h2>
                <p className="role">Salesforce Technical Architect</p>
                <p>With over 13 years of experience in Salesforce development and implementation, Sumit has trained thousands of successful developers. He's worked with Fortune 500 companies and brings real-world expertise to every session.</p>
                <div className="expert-stats">
                  <div className="expert-stat"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/jqns32l8_expires_30_days.png" alt="" /><span className="num">10,000+</span><span className="lbl">Students Trained</span></div>
                  <div className="expert-stat"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/pzr57imr_expires_30_days.png" alt="" /><span className="num">13+</span><span className="lbl">Years Experience</span></div>
                  <div className="expert-stat"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/mnvuwsyv_expires_30_days.png" alt="" /><span className="num">85%</span><span className="lbl">Placement Rate</span></div>
                </div>
                <div className="expert-certs">
                  <h4>Certifications & Expertise:</h4>
                  <div className="cert-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/doswjlcf_expires_30_days.png" alt="" /><span>Salesforce Certified Technical Architect</span></div>
                  <div className="cert-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/fk5m1108_expires_30_days.png" alt="" /><span>Salesforce Certified Platform Developer II</span></div>
                  <div className="cert-item"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/k2q4vjrt_expires_30_days.png" alt="" /><span>12x Salesforce Certified Professional</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="container-wide offers-section" style={{ padding: '0 24px' }}>
            <h2 className="section-title text-center">Real Students. Real Offers. Real Success.</h2>
            <p className="section-sub text-center" style={{ maxWidth: 638, marginLeft: 'auto', marginRight: 'auto' }}>Our students started here and now work at top firms like Accenture, Deloitte, and Solunus. Real results. Real careers.</p>
            <div className="offers-grid">
              <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/0wmdwtmo_expires_30_days.png" alt="Offers 1" />
              <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/nenxwr5t_expires_30_days.png" alt="Offers 2" />
              <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/03umwa50_expires_30_days.png" alt="Offers 3" />
            </div>
          </div>

          <div className="gradient-section section-center">
            <div className="bonus-badge"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/2rh7jwft_expires_30_days.png" alt="" /><span>Exclusive Free Bonuses</span></div>
            <h2 className="section-title">Get ₹25,000 Worth of Bonuses</h2>
            <p className="section-sub">Free for all masterclass attendees today</p>
            <div className="bonus-list">
              <div className="bonus-row">
                <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/tw0aesv3_expires_30_days.png" alt="" />
                <div style={{ flex: 1 }}><h3>Salesforce Career Starter Kit</h3><p>Complete roadmap, resources, and checklists</p></div>
                <div><span className="bonus-price">₹9,999</span><br /><span className="bonus-free">FREE</span></div>
              </div>
              <div className="bonus-row">
                <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/x0vx5elc_expires_30_days.png" alt="" />
                <div style={{ flex: 1 }}><h3>LinkedIn Profile Optimization</h3><p>Stand out to recruiters and hiring managers</p></div>
                <div><span className="bonus-price">₹7,499</span><br /><span className="bonus-free">FREE</span></div>
              </div>
              <div className="bonus-row">
                <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/75zq6n95_expires_30_days.png" alt="" />
                <div style={{ flex: 1 }}><h3>Interview Success Blueprint</h3><p>50+ common interview questions with answers</p></div>
                <div><span className="bonus-price">₹7,499</span><br /><span className="bonus-free">FREE</span></div>
              </div>
            </div>
            <div className="bonus-cta">
              <div className="old">₹24,997</div>
              <div className="new">FREE TODAY</div>
              <CtaLink href={ctaHref} className="limited">Limited Time Offer</CtaLink>
            </div>
          </div>

          <div className="section-dark section-center">
            <div className="urgent-badge"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/43l45zy5_expires_30_days.png" alt="" /><span>URGENT - Limited Spots</span></div>
            <h2 className="section-title">Only 35 Spots Left for This Saturday</h2>
            <p className="section-sub">Registrations close when timer hits zero</p>
            <div className="timer-row">
              <div className="timer-box"><span className="n">03</span><span className="l">Days</span></div>
              <div className="timer-box"><span className="n">12</span><span className="l">Hours</span></div>
              <div className="timer-box"><span className="n">04</span><span className="l">Minutes</span></div>
              <div className="timer-box"><span className="n">20</span><span className="l">Seconds</span></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 600, marginBottom: 8 }}><span style={{ color: '#fff', fontSize: 14 }}>Seats Filling Fast</span><span style={{ color: '#ef4444', fontSize: 14 }}>Only 35 left</span></div>
            <div className="seats-bar-wrap"><div className="seats-bar" /></div>
            <CtaLink href={ctaHref} className="btn-register">{ctaText}</CtaLink>
            <p style={{ color: '#B3B3B3', fontSize: 14, marginTop: 20 }}>1,247 people have registered in the last 48 hours</p>
          </div>

          <div className="faq-section section-center">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-sub">Everything you need to know</p>
            <div className="faq-list">
              <button type="button" className="faq-item"><span>Do I need coding knowledge to start?</span><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/n29cibg0_expires_30_days.png" alt="" /></button>
              <button type="button" className="faq-item"><span>Will I get the recording if I can't attend live?</span><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/gtppekoi_expires_30_days.png" alt="" /></button>
              <button type="button" className="faq-item"><span>Is placement support really included?</span><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/oyo9vy1w_expires_30_days.png" alt="" /></button>
              <button type="button" className="faq-item"><span>How is this different from Salesforce certifications?</span><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/phxcpii5_expires_30_days.png" alt="" /></button>
              <button type="button" className="faq-item"><span>Can I switch to Salesforce from a non-IT background?</span><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/3goerxcn_expires_30_days.png" alt="" /></button>
              <button type="button" className="faq-item"><span>What's the time commitment for the 90-day program?</span><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/4yrtczrp_expires_30_days.png" alt="" /></button>
            </div>
          </div>

          <div className="section-dark final-cta section-center">
            <div className="final-badge"><img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/k5wkowr0_expires_30_days.png" alt="" /><span>Limited Seats Available</span></div>
            <h2>Start Your Salesforce<br />Career Today</h2>
            <p>Join 10,000+ students who transformed their careers. Reserve your free seat in the next masterclass.</p>
            <CtaLink href={ctaHref} className="btn-register">{ctaText}</CtaLink>
            <div className="final-features">
              <div className="final-dot" /><span>No hidden costs</span>
              <div className="final-dot" /><span>Lifetime access</span>
              <div className="final-dot" /><span>Job placement support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
