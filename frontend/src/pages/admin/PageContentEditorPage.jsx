import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { pagesAPI } from '../../services/api'
import { getSectionsForSlug } from '../../config/pageSections'
import {
  BridgingForm,
  CloudIntellectEdgeForm,
  LeadershipEdgeForm,
  CoreValuesForm,
  StudentSuccessForm,
  AchievementHighlightsForm,
  FaqForm,
  FacultyMentorsForm,
  CoreAdvantagesForm,
  SimpleSectionForm,
  HeroSlidesForm,
  PlacementsOverviewForm,
  EcosystemForm,
  CoursesForm,
  LegacyForm,
  RecognitionForm,
  PlacementNetworkForm,
  IndustryExperienceForm,
  WhyChooseForm,
  NewsAndEventsForm,
  SelectYourPathForm,
  WhoCanApplyForm,
  KeyAdvantagesForm,
  CompleteSupportEcosystemForm,
  BecomeJobReadyForm,
  PlacementAssistanceForm,
  TrustRecognitionForm,
  ImpactSnapshotForm,
  SFDCTopicsForm,
  SFDCCareerOpportunitiesForm,
  SFMCTopicsForm,
  SFMCCareerOpportunitiesForm,
  WebinarsCoverForm,
  WhoShouldAttendForm,
  MakeInformedDecisionForm,
  MoreSuccessStoriesForm,
  YourJourneyForm,
  PlacementsHeroForm,
  PlacementsStatsForm,
  GalleryHeroForm,
  TestimonialsHeroForm,
  BeNextSuccessStoryForm,
  ContactHeroForm,
  LeadershipHeroForm,
  AboutCloudIntellectHeroForm,
  CloudIntellectAdvantageForm,
  SalesforceEcosystemShowcaseForm,
  TrainingPlacementModelForm,
  WhySalesforceMentorsForm,
  CareerHeroForm,
  CareerWhyWorkForm,
  CareerCultureForm,
  CareerOpeningsForm,
  ContactInfoForm,
  LocationsForm,
  LandingHeroForm,
} from './SectionForms'
import './AdminPage.css'
import './PageContentEditor.css'

const defaultHero = {
  tag: '',
  heading: '',
  headingAccent: '',
  description: '',
  descriptionEmphasis: '',
  backgroundImage: '',
  primaryButtonText: '',
  primaryButtonHref: '',
  secondaryButtonText: '',
  secondaryButtonHref: '',
}

function CollapsibleSection({ sectionKey, label, headerClassName, isCollapsed, onToggle, children }) {
  return (
    <section className="editor-section">
      <header
        className={headerClassName}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
        aria-expanded={!isCollapsed}
        aria-controls={`editor-section-body-${sectionKey}`}
      >
        <span className="editor-section-toggle" aria-hidden>{isCollapsed ? '▶' : '▼'}</span>
        <span className="editor-section-icon">◇</span>
        {label}
      </header>
      {!isCollapsed && (
        <div id={`editor-section-body-${sectionKey}`} className="editor-section-body">
          {children}
        </div>
      )}
    </section>
  )
}

const PageContentEditorPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingSection, setSavingSection] = useState(null)
  const [error, setError] = useState(null)
  const [slugDraft, setSlugDraft] = useState('')
  const [slugSaving, setSlugSaving] = useState(false)
  const [slugError, setSlugError] = useState(null)
  const [hero, setHero] = useState({ ...defaultHero })
  const [stats, setStats] = useState([])
  const [heroSlidesArray, setHeroSlidesArray] = useState([])
  const [sectionFormData, setSectionFormData] = useState({})
  const [collapsedSectionKeys, setCollapsedSectionKeys] = useState(() => new Set())

  const sections = getSectionsForSlug(slug || '')

  const normalizedSlugDraft = useMemo(() => {
    const raw = String(slugDraft || '').trim().toLowerCase()
    const hyphenated = raw
      .replace(/[\s_]+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    return hyphenated
  }, [slugDraft])

  const slugIsValid = useMemo(() => {
    if (!normalizedSlugDraft) return false
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlugDraft)
  }, [normalizedSlugDraft])

  const toggleSection = (key) => {
    setCollapsedSectionKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }
  const expandAllSections = () => setCollapsedSectionKeys(new Set())
  const collapseAllSections = () => setCollapsedSectionKeys(() => new Set(sections.map((s) => s.key)))

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }
    let cancelled = false
    const fetchPage = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await pagesAPI.getBySlug(slug)
        if (cancelled) return
        if (!response?.success || !response.data) {
          setError('Page not found')
          return
        }
        const p = response.data
        setPage(p)
        setSlugDraft(p.slug || '')
        const content = p.content || {}

        const h = content.hero || {}
        setHero({
          tag: h.tag ?? '',
          heading: h.heading ?? '',
          headingAccent: h.headingAccent ?? '',
          description: h.description ?? '',
          descriptionEmphasis: h.descriptionEmphasis ?? '',
          backgroundImage: h.backgroundImage ?? h.bgImage ?? '',
          primaryButtonText: h.primaryButtonText ?? '',
          primaryButtonHref: h.primaryButtonHref ?? '',
          secondaryButtonText: h.secondaryButtonText ?? '',
          secondaryButtonHref: h.secondaryButtonHref ?? '',
        })
        setStats(Array.isArray(content.hero?.stats) ? content.hero.stats.map((s) => ({ value: s.value ?? '', label: s.label ?? '' })) : [])

        const slides = content.heroSlides
        setHeroSlidesArray(Array.isArray(slides) && slides.length > 0 ? slides.map((s) => ({ name: s.name ?? '', lastName: s.lastName ?? '', designation: s.designation ?? '', package: s.package ?? '', image: s.image ?? '', logo: s.logo ?? '' })) : [{ name: '', lastName: '', designation: '', package: '', image: '', logo: '' }])

        const sectionList = getSectionsForSlug(p.slug || '')
        const nextFormData = {}
        const defaultEcosystem = () => ({
          title: 'The Salesforce Ecosystem',
          description: "Join the world's most innovative community. Connect, build, and grow with the platform that powers the future.",
          trustedImage: '/images/eco-system.webp',
          card1: { tag: 'GLOBAL LEADER', bigText: "World's No.1", subText: 'CRM Platform', note: 'Recognized globally with the largest market share.' },
          card2: { stat: '20.7%', label: 'Global CRM Market Share', source: 'IDC Worldwide Semiannual Tracker, 2024' },
          card3: { stat: '150k+', label: 'Customers Worldwide', source: 'Including Fortune 500 companies' },
          card4: { tag: 'FINANCIALS', stat: '$34.86 B', label: 'Annual Revenue (FY 2024)' },
          card5: { tag: 'ECONOMIC IMPACT', stat: '1.8 Million', label: 'New Jobs in India by 2028', source: 'Source: Salesforce India Economic Impact Report' },
        })
        const defaultCourses = () => ({
          sectionTitle: 'Our',
          sectionTitleHighlight: 'Courses',
          applyText: 'Apply Today',
          applyHref: '#apply',
          brochureText: 'Download Brochure',
          brochureHref: '#brochure',
          tabs: [
            { id: 'developer', label: 'Salesforce Developer' },
            { id: 'marketing', label: 'Salesforce Marketing Cloud' },
          ],
          developer: {
            mainTitle: 'Salesforce Developer Cloud (SFDC)',
            mainDescription: 'Build apps, automate business processes & work with real CRM development tools used by global companies.',
            mainLinkText: 'Learn Salesforce Development',
            mainLinkHref: '#learn',
            cards: [
              { icon: 'trophy', stat: '#1 CRM used by 150,000+ companies' },
              { icon: 'roles', stat: 'High-demand roles : Admin, Developer, Consultant' },
              { icon: 'chart', stat: '6.6M+ job opportunities coming by 2026' },
            ],
          },
          marketing: {
            mainTitle: 'Salesforce Marketing Cloud',
            mainDescription: 'Master email, advertising, and journey orchestration. Learn the platform that powers personalized customer experiences at scale.',
            mainLinkText: 'Learn Marketing Cloud',
            mainLinkHref: '#learn',
            cards: [
              { icon: 'audience', stat: 'Unified customer data across channels' },
              { icon: 'automation', stat: 'Journey Builder & Automation Studio' },
              { icon: 'analytics', stat: 'Analytics & ROI measurement' },
            ],
          },
        })
        const defaultLegacy = () => ({
          title: 'An Illustrious',
          titleHighlight: 'Legacy we continue to Shape',
          stats: [
            { number: '5000+', label: 'LEARNERS TRAINED', description: 'Continuous skill development across India.' },
            { number: '1400+', label: 'SUCCESSFUL PLACEMENTS', description: 'Students placed in top MNCs & Salesforce partner companies.' },
            { number: '20+', label: 'EXPERT MENTORS', description: 'Certified Salesforce professionals from leading global firms.' },
            { number: '150+', label: 'CORPORATE CLIENTS', description: 'Strong industry network supporting Salesforce careers.' },
            { number: '10+', label: 'YEARS EXPERTISE', description: 'Backed by the strength of a Salesforce Ridge Partner company.' },
          ],
          cards: [
            { image: '/images/legacy.webp', title: 'Salesforce to Create 1.8 Million Jobs in India by 2028', description: 'Salesforce is powering major job growth in India, creating real opportunities for tech talent.', tags: 'Tech Growth | Salesforce', href: '#' },
            { image: '/images/legacy2.webp', title: 'Salesforce Hiring Surges Again in 2025', description: 'Salesforce roles are growing fast in 2025, especially for Admins and Developers.', tags: 'ACHIEVEMENT | CIBSUMMIT', href: '#' },
          ],
        })
        const defaultPlacementNetwork = () => {
          const base = '/images/Company Logos'
          const files = ['Logo | Png.webp', 'Logo | Png-1.webp', 'Logo | Png-2.webp', 'Logo | Png-3.webp', 'Logo | Png-4.webp', 'Logo | Png-5.webp', 'Logo | Png-6.webp', 'Logo | Png-7.webp', 'Logo | Png-8.webp', 'Logo | Png-9.webp', 'Logo | Png-10.webp', 'Logo | Png-11.webp', 'Logo | Png-12.webp', 'Logo | Png-13.webp']
          return { heading: 'Our Placement Network are', logos: files.map((f) => ({ image: `${base}/${f}` })) }
        }
        const defaultIndustryExperience = () => {
          const bg = '/images/Accordian Images/Background image.webp'
          return {
            headingPart1: 'Immerse yourself in a',
            headingStrong1: 'Real Industry Experience with',
            headingStrong2: 'Global Salesforce Ecosystem Exposure',
            tabs: [
              { label: 'Real Project-Based Training', title: 'Real Project-Based Training', description: 'Work on real-world projects and build a portfolio that demonstrates your skills to employers.', image: bg },
              { label: 'Global Salesforce Ecosystem Exposure', title: 'Global Salesforce Ecosystem Exposure', description: 'Connect with industry leaders and gain exposure to the global Salesforce ecosystem through real projects and partnerships.', image: bg },
              { label: 'Certified Mentor Guidance', title: 'Certified Mentor Guidance', description: 'Learn from certified Salesforce experts who bring years of industry experience and guide you through every step.', image: bg },
              { label: 'Job-Oriented Curriculum', title: 'Job-Oriented Curriculum', description: 'Our curriculum is designed with input from hiring partners to ensure you develop the exact skills employers are looking for.', image: bg },
              { label: 'Live Q&A Sessions', title: 'Live Q&A Sessions', description: 'Get your questions answered in real time by instructors and peers during live interactive sessions.', image: bg },
            ],
          }
        }
        const defaultWhyChoose = () => ({
          headingLine1: 'Why Should You Choose',
          headingStrong: 'Cloud Intellect?',
          arrowIcon: 'https://cloudintellect.in/wp-content/uploads/2026/01/arrow_right_alt.svg',
          faqImage: 'https://cloudintellect.in/wp-content/uploads/2026/01/IMG-5-1.webp',
          items: [
            { number: '12', title: 'High-Impact Networking Connections', content: 'Connect with an extensive network of CEOs, Nobel Laureates, entrepreneurs, technologists, and global academicians.' },
            { number: '13', title: 'Tech-Driven Collaborative Learning', content: 'Learn through modern tools, real-time collaboration, and hands-on digital platforms.' },
            { number: '14', title: '360-Degree Personal Brand Building', content: 'Build your professional brand with mentoring, positioning, and visibility strategies.' },
            { number: '15', title: 'Multi-Disciplinary University Exposure', content: 'Learn across domains with interdisciplinary programs and global faculty exposure.' },
            { number: '19', title: 'Global Vision & Research Culture', content: 'Engage with global research initiatives and international academic collaborations.' },
            { number: '16', title: 'Industry-Ready Skill Development', content: 'Gain job-ready skills through practical exposure and industry-aligned curriculum.' },
            { number: '20', title: 'Leadership & Innovation Mindset', content: 'Develop leadership skills and an innovation-first approach.' },
            { number: '17', title: 'Strong Alumni & Community Network', content: 'Become part of a lifelong alumni ecosystem supporting growth and mentorship.' },
            { number: '18', title: 'Intercontinental Research Frontiers', content: 'Explore cross-border research initiatives shaping the future of education.' },
          ],
        })
        const newsImgBase = '/images/News and Events'
        const defaultNewsAndEvents = () => ({
          headingLine1: 'News and',
          headingStrong: 'Events',
          mainFeature: {
            image: `${newsImgBase}/Event Image.webp`,
            title: 'Cloud Intellect Shines at Salesforce Hackathon Nagpur 2025',
            description: 'Cloud Intellect participated as a sponsor and delivered expert-led Salesforce mentorship at the Nagpur Hackathon, with special recognition awarded to Sumit Sir.',
            readMoreHref: '#read-more',
            readMoreLabel: 'READ MORE',
          },
          timelineItems: [
            { title: 'Knowledge Sessions', text: 'Cloud Intellect mentors delivered hands-on CRM, Apex & Marketing Cloud training during the event.', image: `${newsImgBase}/Event Image.webp` },
            { title: 'Marketing Workshop', text: 'Sumit Sir was honoured for impactful mentorship and his contribution to developing Salesforce talent.', image: `${newsImgBase}/Event Image-1.webp` },
            { title: 'Mentor Recognition', text: 'Our mentors engaged with industry professionals, sharing Salesforce trends and skills in demand.', image: `${newsImgBase}/IMG.webp` },
            { title: 'Industry Networking', text: 'Participants learned about Salesforce career paths, job roles, salaries & future growth options.', image: `${newsImgBase}/Event Image.webp` },
            { title: 'Knowledge Sessions', text: 'Cloud Intellect mentors delivered hands-on CRM, Apex & Marketing Cloud training during the event.', image: `${newsImgBase}/Event Image-1.webp` },
            { title: 'Knowledge Sessions', text: 'Cloud Intellect mentors delivered hands-on CRM, Apex & Marketing Cloud training during the event.', image: `${newsImgBase}/IMG.webp` },
            { title: 'Knowledge Sessions', text: 'Cloud Intellect mentors delivered hands-on CRM, Apex & Marketing Cloud training during the event.', image: `${newsImgBase}/Event Image.webp` },
          ],
          sideArticles: [
            { title: 'Career Guidance', text: 'Students received real-time guidance as they solved Salesforce-based problem statements.', image: `${newsImgBase}/Event Image-1.webp` },
            { title: 'Hackathon Support', text: 'Cloud Intellect supported the hackathon as an official sponsor, promoting tech education.', image: `${newsImgBase}/IMG.webp` },
          ],
        })
        const defaultRecognition = () => ({
          title: 'Proudly Recognized for',
          titleHighlight: 'Our Excellence in Salesforce Training & Industry Alignment',
          blocks: [
            { category: 'RECOGNIZED STATUS', image: '/images/Training & Industry Alignment/1734100666165 1.webp', title: 'Workforce Partner', subheading: 'Salesforce Workforce Development Partner', description: 'Cloud Intellect is officially listed as a Salesforce Workforce Development Partner, acknowledged for delivering high-quality, industry-ready Salesforce training programs.', bullets: ['Training aligned with Salesforce standards', 'Certification-focused modules', 'Real-world learning outcomes'] },
            { category: 'RECOGNIZED RANK', image: '/images/Training & Industry Alignment/1734100666165 1-1.webp', title: 'Ridge Partner', subheading: 'Salesforce Ridge Consulting Partner (via Cloud Intellect Systems)', description: 'Our consulting division, Cloud Intellect Systems, is a Salesforce Ridge Partner, enabling real-time project exposure for learners.', bullets: ['Enterprise project experience', 'Live org scenarios', 'Consulting-level learning environment'] },
            { category: 'VERIFIED OUTCOMES', image: '/images/Training & Industry Alignment/SVG.webp', title: 'Top Ranked', subheading: 'Training & Industry Reputation', description: "Ranked Among India's Trusted Salesforce Institutes based on learner success, mentorship quality, and placement outcomes.", bullets: ['Expert mentors', 'Strong placement network', 'Verified student success'] },
            { category: 'GLOBAL STANDARDS', image: '/images/Training & Industry Alignment/SVG-1.webp', title: 'Accredited', subheading: 'Ecosystem Accreditations', description: 'Follows official Salesforce learning frameworks, compliant with global certification guidelines.', bullets: ['Follows official learning frameworks', 'Recognized training pathways', 'Aligned with Salesforce roles'] },
          ],
        })
        const defaultSelectYourPath = () => ({
          headingLine1: 'Select',
          headingStrong: 'Your Path',
          paths: [
            { id: 'sfdc', icon: '/images/Icon Container.svg', bannerBg: '#1A202C', title: 'Salesforce Developer Cloud (SFDC)', bullets: ['Focuses on CRM configuration, automation, and development.', 'Used mainly for Sales and Service operations.', 'Ideal for those interested in logic, coding, and system architecture.'], batchStart: '17th January', nextBatch: '31st January', linkText: 'Learn Salesforce Development', linkHref: '/salesforce-developer' },
            { id: 'sfmc', icon: '/images/Icon Container copy.svg', bannerBg: '#007BFF', title: 'Salesforce Marketing Cloud (SFMC)', bullets: ['Focuses on marketing automation, customer journeys, and campaigns.', 'Used mainly for digital marketing and customer engagement.', 'Ideal for marketers and tech-savvy creative professionals.'], batchStart: '18th January', nextBatch: '1st February', linkText: 'Explore Marketing Cloud Career', linkHref: '/salesforce-marketing-cloud' },
          ],
        })
        const defaultFacultyMentors = () => ({
          title: 'Faculty &',
          titleBold: 'Industry Mentors',
          mentors: [
            { name: 'Mr. Roshan Vishwakarma', role: 'Salesforce LWC Expert', experience: '07+ Years Experience', image: '/images/faculty/roshan.webp' },
            { name: 'Mr. Akash Lahoti', role: 'Salesforce Developer', experience: '07+ Years Experience', image: '/images/faculty/akash.webp' },
            { name: 'Mr. Inder Kanojiya', role: 'Salesforce Specialist', experience: '09+ Years Experience', image: '/images/faculty/inder.webp' },
            { name: 'Mr. Jay Singh Gour', role: 'Salesforce Marketing Cloud Specialist', experience: '12+ Years Experience', image: '/images/faculty/jay.webp' },
            { name: 'Mr. Mandar Ingle', role: 'Salesforce Marketing Cloud Specialist', experience: '06+ Years Experience', image: '/images/faculty/mandar.webp' },
            { name: 'Mr. Swapnil Tamrakar', role: 'Senior Salesforce Developer', experience: '04+ Years Experience', image: '/images/faculty/swapnil.webp' },
          ],
        })
        const defaultCareerHero = () => ({
          tag: 'LIVE SESSIONS',
          headingLine1: 'Elevate Your Career',
          headingLine2: 'and Empower Others',
          description: 'Join Cloud Intellect for impactful education and accelerate your tech career in the Salesforce world.',
          primaryButtonText: 'View Open Positions',
          primaryButtonHref: '#open-positions',
          secondaryButtonText: 'Apply Now',
          secondaryButtonHref: '#apply',
          heroImage: '/images/career-hero.webp',
        })
        const defaultCareerWhyWork = () => ({
          headingLine1: 'Why Work With',
          headingStrong: 'Cloud Intellect?',
          cards: [
            { title: 'Career Impact', description: 'We work on real student outcomes.', icon: '' },
            { title: 'Industry Exposure', description: 'Hands-on work in the Salesforce ecosystem.', icon: '' },
            { title: 'Ownership Culture', description: 'Ideas > hierarchy. Execution > excuses.', icon: '' },
          ],
        })
        const defaultCareerCulture = () => ({
          heading: 'A Team That Grows Together',
          description: 'We believe that a strong culture is the foundation of great work. At Cloud Intellect, we nurture an environment that rewards initiative and fosters continuous learning.',
          panelTitle: 'Our Culture',
          bullets: [
            'Fast-learning, execution-focused environment',
            'Direct exposure to real industry projects',
            'Open communication with leadership',
            'Skill growth + career growth together',
            'Performance-driven recognition',
            'Transparent dialogue with management',
          ],
          image: '/images/career-culture.webp',
        })
        const defaultCareerOpenings = () => ({
          heading: 'Current Openings',
          openings: [
            { title: 'Salesforce Trainer', description: 'Deliver practical Salesforce training, guide students, and support certification + placement readiness.', linkText: 'Apply Now', linkHref: '#apply-salesforce-trainer', icon: '' },
            { title: 'Academic Counsellor', description: 'Help students choose the right career path and guide them through admissions and learning journeys.', linkText: 'Apply Now', linkHref: '#apply-academic-counsellor', icon: '' },
            { title: 'Digital Marketing Exec.', description: 'Plan and execute campaigns across Meta, Google, and content platforms to generate quality leads.', linkText: 'Apply Now', linkHref: '#apply-digital-marketing', icon: '' },
            { title: 'Content & Social Media Exec.', description: 'Create engaging reels, creatives, and educational content that drives awareness and trust.', linkText: 'Apply Now', linkHref: '#apply-content-social', icon: '' },
            { title: 'Placement Coordinator', description: 'Provide resume and interview guidance, career counselling, and connect graduates with our industry partners.', linkText: 'Apply Now', linkHref: '#apply-placement-coordinator', icon: '' },
            { title: "Don't see a fit?", description: 'Send us your resume anyway. We are always looking for great talent.', linkText: 'Drop Resume', linkHref: '#drop-resume', icon: '' },
          ],
        })
        const whoApplyIconBase = '/images/SFMC_SFDC_Apply'
        const defaultWhoCanApply = () => ({
          headingLine1: 'Who',
          headingStrong: 'Can Apply?',
          cards: [
            { title: 'Engineering & Freshers', icon: 'dashboard_2_gear.svg', bullets: ['BE / BTech / Diploma students', 'Final-year (BCA, MCA, BSC IT-CS)'] },
            { title: 'Non-Tech Graduates', icon: 'psychology.svg', bullets: ['BBA, B.Com, BA, BSc backgrounds', 'Interested in Marketing Automation & CRM'] },
            { title: 'Working Professionals', icon: 'person.svg', bullets: ['Looking to upskill/switch', '0-10+ years experience'] },
            { title: 'Career Switchers', icon: 'business_center.svg', bullets: ['Transitioning from non-IT to IT', 'Strong learning intent required'] },
          ],
          notesSfmc: { title: 'Notes For SFMC', icon: `${whoApplyIconBase}/offline_bolt.svg`, items: ['Freshers are NOT allowed in the SFMC Track.', 'Minimum 3 Years Experience required in any field.', 'Pass-out year should be 2023 or earlier.'] },
          notesSfdc: { title: 'Notes For SFDC', icon: `${whoApplyIconBase}/offline_bolt.svg`, items: [] },
        })
        const defaultKeyAdvantages = () => ({
          headingLine1: 'Key Advantages of',
          headingStrong: 'Learning at Cloud Intellect',
          items: [
            { title: 'Practical-First Training', description: 'Every concept is taught with real implementation on Salesforce org. Students learn by doing — not by memorizing.', icon: 'productivity.svg' },
            { title: 'Real Industry-Level Exposure', description: 'Training includes live business scenarios and project simulations that build strong hands-on confidence.', icon: 'home_work.svg' },
            { title: 'Structured Assignments', description: 'Each topic is followed by practical exercises, quizzes, and real use-case based tasks to track progress.', icon: 'order_approve.svg' },
            { title: 'Lifetime LMS Recording Access', description: 'All lectures, materials, and case studies remain available anytime for revision and continuous learning.', icon: 'exit_to_app.svg' },
            { title: 'Industry-Relevant Curriculum', description: 'Course modules are updated regularly to match current Salesforce market demand and platform changes.', icon: 'library_books.svg' },
            { title: 'Certified & Experienced Trainers', description: 'Sessions are handled by working Salesforce professionals with real project backgrounds.', icon: 'diversity_2.svg' },
            { title: 'Corporate & Alumni Network', description: 'Learners benefit from referrals, guidance, and opportunities shared by our partner companies and alumni.', icon: 'book.svg' },
            { title: 'Interview & Career Grooming', description: 'Focus on professional behaviour, IT work culture, confidence building, and job readiness.', icon: 'record_voice_over.svg' },
          ],
        })
        const defaultCompleteSupportEcosystem = () => ({
          headingLine1: 'Complete',
          headingStrong: 'Support Ecosystem',
          portalCard: {
            title: 'Smart Student Portal Access',
            description: 'A powerful dashboard built specially for Cloud Intellect learners to manage learning and career in one place.',
            items: ['Book mock interview slots', 'Schedule 1:1 mentor sessions', 'Access assignments & submit projects', 'Download notes & recordings anytime', 'Track course progress step-by-step', 'Receive placement & interview updates'],
          },
          placementCard: {
            title: 'Dedicated Placement Assistance',
            description: 'Complete career support to help students move from training to real Salesforce jobs.',
            items: ['Professional resume preparation', 'Mock interviews with expert feedback', 'Soft-skill & communication training', 'Daily job openings & referrals', 'Interview scheduling guidance', 'Continuous mentor support till placement'],
          },
        })
        const defaultBecomeJobReady = () => ({
          title: 'Become Job-Ready in 3 to 6 Months',
          description: 'Our training model is designed to bridge the gap between education and employability, providing practical exposure equivalent to industry experience.',
          icon: '/images/person_heart.svg',
          ctaText: 'Download Brochure',
          ctaHref: '#brochure',
        })
        const placementAssistanceImageBase = '/images/Placement Assistance'
        const defaultPlacementAssistance = () => ({
          headingLine1: 'Dedicated Placement Assistance',
          headingStrong: 'Until You Get Hired',
          description: 'Placements are an integral part of the Cloud Intellect learning journey.',
          supportHeadingLight: 'Placement support',
          supportHeadingBold: 'includes',
          items: ['Resume building workshops', 'Interview preparation & grooming', 'Alumni referral support', 'Mock interviews (HR & Technical)', 'Direct referrals to partner companies'],
          icon: `${placementAssistanceImageBase}/Icon.svg`,
          image: `${placementAssistanceImageBase}/Container (20).webp`,
        })
        const trustRecognitionIconBase = '/images/Trust and Recognition'
        const defaultTrustRecognition = () => ({
          headingLight: 'Institutional',
          headingBold: 'Trust & Recognition',
          items: [
            { text: 'Salesforce Workforce Development Partner', icon: `${trustRecognitionIconBase}/verified.svg` },
            { text: 'Training aligned with Salesforce role frameworks', icon: `${trustRecognitionIconBase}/book_ribbon.svg` },
            { text: 'Expert trainers from the Salesforce ecosystem', icon: `${trustRecognitionIconBase}/group.svg` },
            { text: 'Strong alumni & corporate network', icon: `${trustRecognitionIconBase}/account_tree.svg` },
          ],
        })
        const defaultImpactSnapshot = () => ({
          headingLight: 'CI Impact',
          headingBold: 'Snapshot',
          metrics: [
            { value: '5000+', label: 'LEARNERS TRAINED' },
            { value: '1400+', label: 'SUCCESSFUL PLACEMENTS' },
            { value: '20+', label: 'CERTIFIED INDUSTRY MENTORS' },
            { value: '11+', label: 'YEARS EXPERIENCE' },
          ],
          tagline: 'CHOOSING CLOUD INTELLECT MEANS CHOOSING PRACTICAL LEARNING',
          ctaHeading: 'industry exposure, and long-term career growth.',
          ctaDescription: 'With structured training, real project experience, and placement support until hiring, we empower learners to confidently step into the Salesforce ecosystem.',
          ctaText: 'Apply Today',
          ctaHref: '#apply',
        })
        const defaultSfdcTopics = () => ({
          headingLine1: 'Topics Covered in',
          headingStrong: 'SFDC Program',
          modules: [
            { id: '01', title: 'Cloud & Salesforce Basics', topics: ['Cloud Computing Overview', 'Introduction to Salesforce', 'Admin Setup & Navigation'] },
            { id: '02', title: 'Configuration', topics: ['Apps, Objects, Fields, Tabs', 'Security in Salesforce', 'Reports & Dashboards'] },
            { id: '04', title: 'Apex Programming', topics: ['Data Types, Loops, Classes, Interfaces', 'SOQL & SOSL', 'Triggers & Test Classes', 'Asynchronous Apex'] },
            { id: '05', title: 'Lightning & LWC', topics: ['HTML, CSS, JavaScript', 'LWC Basics & Lifecycle Hooks', 'LWC Events (Parent-Child, Pub-Sub, LMS)', 'SLDS, Promises, Apex with LWC', 'Best Practices in LWC'] },
            { id: '03', title: 'Automation Tools', topics: ['Flow (Record Trigger, Schedule, Screen Flow)', 'Process Builder'] },
            { id: '06', title: 'Integration & Deployment', topics: ['API Callouts (Remote Site, Named Credentials)', 'Connected App Setup', 'Postman Tool', 'Sandbox, Deployment Strategies', 'CI/CD & Change Set'] },
          ],
          careerCard: {
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
            batchIcon: '/images/SVG (5) copy 2.svg',
          },
        })
        const defaultSfdcCareerOpportunities = () => ({
          headingLine1: 'Career Opportunities After',
          headingStrong: 'SFDC Certification',
          icon: '/images/code.svg',
          roles: [
            { title: 'Salesforce Developer', description: 'Build custom applications and integrations on Salesforce.' },
            { title: 'Salesforce Administrator', description: 'Manage user setup, permissions, and data.' },
            { title: 'Salesforce Consultant', description: 'Analyze business requirements and implement solutions.' },
            { title: 'Salesforce Analyst', description: 'Work with clients to gather requirements and optimize processes.' },
            { title: 'Salesforce App Developer', description: 'Create and deploy custom applications.' },
            { title: 'Salesforce Architect', description: 'Design complex solutions and lead development teams.' },
          ],
        })
        const defaultSfmcTopics = () => ({
          headingLine1: 'Topics',
          headingStrong: 'Covered',
          toolsHeading: 'Tools Commonly Used',
          modules: [
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
          ],
          toolsTable: [
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
          ],
          careerCard: {
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
            batchIcon: '/images/SVG (5) copy 2.svg',
          },
        })
        const defaultSfmcCareerOpportunities = () => ({
          headingLine1: 'Career Opportunities',
          headingStrong: 'After SFMC',
          iconBase: '/images/Career_Opportunities_SFMC',
          roles: [
            { title: 'Administrator', description: 'Manages user setup, permissions, roles, business units, and ensures smooth operation.', icon: 'tune.svg' },
            { title: 'Developer', description: 'Supports marketing teams in managing data extensions, lists, and running basic campaigns.', icon: 'business_messages.svg' },
            { title: 'Consultant', description: 'Advises on Marketing Cloud strategy, implementation, and optimization.', icon: 'bar_chart_4_bars.svg' },
            { title: 'Quality Analyst', description: 'Tests emails, journeys, automations, and integrations before campaigns go live.', icon: 'star_shine.svg' },
            { title: 'Business Analyst', description: 'Translates business requirements into Salesforce Marketing Cloud campaigns and workflows.', icon: 'add_chart.svg' },
            { title: 'Architect', description: 'Designs and executes personalized email campaigns using Content Builder and Journey Builder.', icon: 'edit_square.svg' },
          ],
        })
        const defaultLeadershipHero = () => ({
          tag: 'LEADERSHIP MESSAGE',
          heading: 'Leadership at',
          headingAccent: 'Cloud Intellect',
          description: 'Vision-driven leadership backed by real industry experience.',
          primaryButtonText: 'Explore Programs',
          primaryButtonHref: '#programs',
          secondaryButtonText: 'Download Brochure',
          secondaryButtonHref: '#brochure',
          backgroundImage: '/images/BG (7).webp',
          bgImage: '/images/BG (7).webp',
        })
        const defaultAboutCloudIntellectHero = () => ({
          tag: 'SALESFORCE WORKFORCE PARTNER',
          heading: 'Building Industry-Ready Salesforce Professionals',
          headingAccent: '',
          description:
            'We combine Salesforce education with placement support to ensure you are job-ready.',
          descriptionEmphasis: '',
          backgroundImage: '',
          bgImage: '',
          primaryButtonText: 'Explore Programs',
          primaryButtonHref: '/salesforce-developer',
          secondaryButtonText: 'Download Brochure',
          secondaryButtonHref: '#brochure',
        })
        const defaultCloudIntellectAdvantage = () => ({
          headingLine1: 'The Cloud Intellect',
          headingBold: 'Advantage',
          cards: [
            {
              headerColor: '#1a365d',
              icon: '',
              title: 'Cloud Intellect Academy',
              description:
                'Focused on Salesforce training, skill development, and career preparation. Recognized as an official Salesforce Workforce Development Partner.',
              bullets: [
                'Career-oriented training programs',
                'Practical learning on real Salesforce orgs',
                'Certification-aligned preparation',
              ],
            },
            {
              headerColor: '#009fff',
              icon: '',
              title: 'Cloud Intellect Systems',
              description:
                'A Salesforce Ridge Consulting Partner, actively working on real client projects across industries, providing real-world project exposure.',
              bullets: [
                'Salesforce CRM implementation',
                'Marketing automation solutions (SFMC)',
                'Real project workflows & use cases',
              ],
            },
          ],
        })
        const defaultSalesforceEcosystemShowcase = () => ({
          badgeText: 'UNIQUE OPPORTUNITY',
          headingLine1: 'The Salesforce',
          headingLine2: 'Ecosystem',
          description:
            'This integrated approach creates a seamless bridge between training, real-world projects, and professional employment.',
          cultureTitle: 'Our Culture',
          bullets: [
            'Top candidates join Cloud Intellect Systems, our consulting arm.',
            'Direct exposure to real industry projects.',
            'Open communication with leadership.',
          ],
          image: '',
        })
        const defaultTrainingPlacementModel = () => ({
          badgeText: 'UNIQUE OPPORTUNITY',
          headingLine1: 'Training + Placement',
          headingLine2: 'Model',
          intro: 'At Cloud Intellect, training and placement are linked.',
          description:
            'Placement support is not optional or an add-on — it is an integral part of our programs. Learners receive guidance and support until they are placement-ready and successfully hired.',
          features: [
            { label: 'Resume Building', icon: '' },
            { label: 'Mock Interviews', icon: '' },
            { label: 'HR & Tech Prep', icon: '' },
            { label: 'Direct Referrals', icon: '' },
          ],
          panelTitle: 'What Services Do We Provide?',
          panelSubtitle: '',
          serviceItems: [
            { text: 'End-to-end Salesforce career enablement', icon: '' },
            { text: 'Practical learning on real Salesforce orgs', icon: '' },
            { text: 'Real-world project exposure', icon: '' },
            { text: 'Certification-aligned preparation', icon: '' },
            { text: 'Dedicated placement assistance', icon: '' },
          ],
        })
        const defaultWhySalesforceMentors = () => ({
          backgroundColor: '#fbf5ef',
          leftCard: {
            icon: '',
            title: 'Why Salesforce?',
            description:
              "Salesforce is the world's leading CRM platform with strong global demand. We focus exclusively on Salesforce because it offers:",
            bullets: [
              'Multiple career paths (Admin, Developer, Consultant, SFMC)',
              'Long-term career growth and stability',
              'Strong demand in India & international markets',
            ],
            note: 'Our training is aligned strictly with real Salesforce job roles, not generic IT learning.',
          },
          rightCard: {
            icon: '',
            title: 'Industry-Experienced Mentors',
            description: 'Our mentors are experienced, working professionals, not just trainers.',
            bullets: [
              'Actively working on real projects',
              'Strong market understanding',
              'Deep knowledge of best practices',
            ],
          },
        })
        const defaultLeadershipEdge = () => ({
          achievementsTitle: 'Key Achievements Director',
          achievements: [
            'Served as Technical Architect from client location for major enterprise accounts',
            'Successfully trained and mentored global teams (onshore & offshore)',
            'Built training frameworks used across multiple enterprise projects',
            'Delivered high-impact project solutions with measurable outcomes',
          ],
        })
        const defaultAchievementHighlights = () => ({
          headingLight: 'CI Achievement',
          headingBold: 'Highlights',
          stats: [
            { number: '1400+', title: 'SUCCESSFUL CANDIDATE PLACEMENTS', description: 'Across top Salesforce Partner Companies' },
            { number: '5000+', title: 'LEARNERS TRAINED ACROSS INDIA', description: 'Workforce Programs & Online Batches' },
            { number: '11+ Years', title: 'STRONG TRACK RECORD', description: 'in Salesforce Workforce Upskilling' },
            { number: '20 +', title: 'INDUSTRY RECOGNIZED MENTORS & CONSULTANTS', description: 'Training students with real project exposure' },
          ],
          gallery: [{ image: '' }],
        })
        const defaultFaq = () => ({
          headingLine1: 'FAQ',
          headingStrong: 'Frequently Asked Questions',
          backgroundImage: '',
          items: [
            { number: '', question: '', answer: '', image: '' },
          ],
          cta: {
            badgeText: '',
            badgeImage: '',
            title: '',
            description: '',
            buttonText: '',
            buttonHref: '',
            features: [],
          },
        })
        sectionList.forEach(({ key, type }) => {
          if (key === 'heroSlides') return
          if (key === 'hero' && type === 'hero') return
          const val = content[key]
          if (type === 'ecosystem') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultEcosystem(), ...val } : defaultEcosystem()
          } else if (type === 'courses') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultCourses(), ...val } : defaultCourses()
          } else if (type === 'legacy') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultLegacy(), ...val } : defaultLegacy()
          } else if (type === 'recognition') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultRecognition(), ...val } : defaultRecognition()
          } else if (type === 'placementNetwork') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultPlacementNetwork(), ...val } : defaultPlacementNetwork()
          } else if (type === 'industryExperience') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultIndustryExperience(), ...val } : defaultIndustryExperience()
          } else if (type === 'whyChoose') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultWhyChoose(), ...val } : defaultWhyChoose()
          } else if (type === 'newsAndEvents') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultNewsAndEvents(), ...val } : defaultNewsAndEvents()
          } else if (type === 'selectYourPath') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultSelectYourPath(), ...val } : defaultSelectYourPath()
          } else if (type === 'whoCanApply') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultWhoCanApply(), ...val } : defaultWhoCanApply()
          } else if (type === 'keyAdvantages') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultKeyAdvantages(), ...val } : defaultKeyAdvantages()
          } else if (type === 'completeSupportEcosystem') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultCompleteSupportEcosystem(), ...val } : defaultCompleteSupportEcosystem()
          } else if (type === 'becomeJobReady') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultBecomeJobReady(), ...val } : defaultBecomeJobReady()
          } else if (type === 'placementAssistance') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultPlacementAssistance(), ...val } : defaultPlacementAssistance()
          } else if (type === 'trustRecognition') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultTrustRecognition(), ...val } : defaultTrustRecognition()
          } else if (type === 'impactSnapshot') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultImpactSnapshot(), ...val } : defaultImpactSnapshot()
          } else if (type === 'sfdcTopics') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultSfdcTopics(), ...val } : defaultSfdcTopics()
          } else if (type === 'sfdcCareerOpportunities') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultSfdcCareerOpportunities(), ...val } : defaultSfdcCareerOpportunities()
          } else if (type === 'sfmcTopics') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultSfmcTopics(), ...val } : defaultSfmcTopics()
          } else if (type === 'sfmcCareerOpportunities') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultSfmcCareerOpportunities(), ...val } : defaultSfmcCareerOpportunities()
          } else if (type === 'leadershipHero') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultLeadershipHero(), ...val } : defaultLeadershipHero()
          } else if (type === 'aboutCloudIntellectHero') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultAboutCloudIntellectHero(), ...val } : defaultAboutCloudIntellectHero()
          } else if (type === 'cloudIntellectAdvantage') {
            const def = defaultCloudIntellectAdvantage()
            const merged =
              val && typeof val === 'object' && !Array.isArray(val) ? { ...def, ...val } : def
            merged.cards =
              Array.isArray(merged.cards) && merged.cards.length > 0 ? merged.cards : def.cards
            nextFormData[key] = merged
          } else if (type === 'salesforceEcosystemShowcase') {
            const def = defaultSalesforceEcosystemShowcase()
            const merged =
              val && typeof val === 'object' && !Array.isArray(val) ? { ...def, ...val } : def
            merged.bullets =
              Array.isArray(merged.bullets) && merged.bullets.length > 0 ? merged.bullets : def.bullets
            nextFormData[key] = merged
          } else if (type === 'trainingPlacementModel') {
            const def = defaultTrainingPlacementModel()
            const merged =
              val && typeof val === 'object' && !Array.isArray(val) ? { ...def, ...val } : def
            merged.features =
              Array.isArray(merged.features) && merged.features.length > 0 ? merged.features : def.features
            merged.serviceItems =
              Array.isArray(merged.serviceItems) && merged.serviceItems.length > 0 ? merged.serviceItems : def.serviceItems
            nextFormData[key] = merged
          } else if (type === 'whySalesforceMentors') {
            const def = defaultWhySalesforceMentors()
            const merged =
              val && typeof val === 'object' && !Array.isArray(val) ? { ...def, ...val } : def
            if (!merged.leftCard || typeof merged.leftCard !== 'object') merged.leftCard = def.leftCard
            if (!merged.rightCard || typeof merged.rightCard !== 'object') merged.rightCard = def.rightCard
            const lb = merged.leftCard.bullets
            const rb = merged.rightCard.bullets
            merged.leftCard.bullets = Array.isArray(lb) && lb.length > 0 ? lb : def.leftCard.bullets
            merged.rightCard.bullets = Array.isArray(rb) && rb.length > 0 ? rb : def.rightCard.bullets
            nextFormData[key] = merged
          } else if (type === 'leadershipEdge') {
            const base = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultLeadershipEdge(), ...val } : defaultLeadershipEdge()
            if (!Array.isArray(base.achievements)) base.achievements = defaultLeadershipEdge().achievements
            nextFormData[key] = base
          } else if (type === 'facultyMentors') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultFacultyMentors(), ...val } : defaultFacultyMentors()
          } else if (type === 'careerHero') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultCareerHero(), ...val } : defaultCareerHero()
          } else if (type === 'careerWhyWork') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultCareerWhyWork(), ...val } : defaultCareerWhyWork()
          } else if (type === 'careerCulture') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultCareerCulture(), ...val } : defaultCareerCulture()
          } else if (type === 'careerOpenings') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultCareerOpenings(), ...val } : defaultCareerOpenings()
          } else if (type === 'achievementHighlights') {
            const base = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultAchievementHighlights(), ...val } : defaultAchievementHighlights()
            if (!Array.isArray(base.stats)) base.stats = defaultAchievementHighlights().stats
            if (!Array.isArray(base.gallery)) base.gallery = defaultAchievementHighlights().gallery
            nextFormData[key] = base
          } else if (type === 'faq') {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...defaultFaq(), ...val } : defaultFaq()
          } else {
            nextFormData[key] = val && typeof val === 'object' && !Array.isArray(val) ? { ...val } : (type === 'simple' ? { title: '', description: '' } : {})
          }
        })
        setSectionFormData(nextFormData)
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load page')
          setPage(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchPage()
    return () => { cancelled = true }
  }, [slug])

  const saveSlug = async () => {
    if (!page?._id) return
    setSlugError(null)
    const nextSlug = normalizedSlugDraft
    if (!nextSlug) {
      setSlugError('Slug is required.')
      return
    }
    if (!slugIsValid) {
      setSlugError('Slug can only contain lowercase letters, numbers, and hyphens.')
      return
    }
    if (nextSlug === page.slug) return

    setSlugSaving(true)
    try {
      const payload = { ...page, slug: nextSlug }
      const res = await pagesAPI.update(page._id, payload)
      const updated = res?.data || { ...page, slug: nextSlug }
      setPage(updated)
      setSlugDraft(nextSlug)
      // Move editor to the new slug route so section config matches.
      navigate(`/admin/pages/edit/${nextSlug}`, { replace: true })
      alert('Slug updated successfully')
    } catch (err) {
      setSlugError(err.message || 'Failed to update slug')
    } finally {
      setSlugSaving(false)
    }
  }

  const updateHeroSection = async (e) => {
    e.preventDefault()
    if (!page?._id) return
    setSaving(true)
    try {
      const content = { ...(page.content || {}), hero: { ...hero } }
      if (slug === 'about' && stats.length > 0) {
        content.hero.stats = stats.filter((s) => s.value || s.label)
      }
      await pagesAPI.update(page._id, { ...page, content })
      setPage((prev) => (prev ? { ...prev, content } : null))
      alert('Hero section updated successfully')
    } catch (err) {
      alert(err.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const updateHeroSlides = async (e) => {
    e.preventDefault()
    if (!page?._id) return
    setSaving(true)
    try {
      const content = { ...(page.content || {}), heroSlides: heroSlidesArray }
      await pagesAPI.update(page._id, { ...page, content })
      setPage((prev) => (prev ? { ...prev, content } : null))
      alert('Hero slides updated successfully')
    } catch (err) {
      alert(err.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const updateSectionForm = async (sectionKey, e) => {
    e.preventDefault()
    if (!page?._id) return
    const payload = sectionFormData[sectionKey]
    if (!payload || typeof payload !== 'object') return
    setSavingSection(sectionKey)
    try {
      const content = { ...(page.content || {}), [sectionKey]: payload }
      await pagesAPI.update(page._id, { ...page, content })
      setPage((prev) => (prev ? { ...prev, content } : null))
      alert('Section updated successfully')
    } catch (err) {
      alert(err.message || 'Failed to update')
    } finally {
      setSavingSection(null)
    }
  }

  const setSectionFormDataForKey = (key, data) => {
    setSectionFormData((prev) => ({ ...prev, [key]: data }))
  }

  const addStat = () => setStats((s) => [...s, { value: '', label: '' }])
  const removeStat = (i) => setStats((s) => s.filter((_, j) => j !== i))
  const setStat = (i, field, value) => setStats((s) => s.map((x, j) => (j === i ? { ...x, [field]: value } : x)))

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Loading page...</div>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="admin-page">
        <div className="page-editor-error">
          <p>{error || 'Page not found'}</p>
          <Link to="/admin/pages" className="btn-primary">Back to Pages</Link>
        </div>
      </div>
    )
  }

  const isHome = slug === 'home'
  const isAbout = slug === 'about'

  return (
    <div className="admin-page page-content-editor">
      <div className="page-editor-header">
        <Link to="/admin/pages" className="page-editor-back">← Back to Pages</Link>
        <h2>Pages Manager – {page.title}</h2>
        <div className="page-editor-slug">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
            <span>Slug:</span>
            <code>{page.slug}</code>
            <span aria-hidden>→</span>
            <input
              type="text"
              value={slugDraft}
              onChange={(e) => { setSlugDraft(e.target.value); setSlugError(null) }}
              placeholder="new-slug"
              style={{ minWidth: 220 }}
            />
            <button
              type="button"
              className="page-editor-section-control-btn"
              onClick={saveSlug}
              disabled={slugSaving || !slugDraft || normalizedSlugDraft === page.slug}
              title={normalizedSlugDraft === page.slug ? 'No changes to save' : 'Update slug'}
            >
              {slugSaving ? 'Updating…' : 'Update slug'}
            </button>
          </div>
          {slugError ? (
            <div style={{ marginTop: 6, fontSize: 12, color: '#b42318' }}>{slugError}</div>
          ) : null}
          <div style={{ marginTop: 6, fontSize: 12, color: '#64748b' }}>
            Edit each section below; changes reflect on the frontend.
          </div>
        </div>
        <div className="page-editor-section-controls">
          <span className="page-editor-section-controls-label">Sections:</span>
          <button type="button" className="page-editor-section-control-btn" onClick={expandAllSections}>Expand all</button>
          <button type="button" className="page-editor-section-control-btn" onClick={collapseAllSections}>Collapse all</button>
        </div>
      </div>

      <div className="page-editor-sections">
        {sections.map(({ key, label, type, hint }) => {
          if (type === 'hero') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                <form onSubmit={updateHeroSection} className="editor-form">
                    <div className="editor-form-row">
                      <div className="editor-field">
                        <label>Badge / Tag text</label>
                        <input
                          type="text"
                          value={hero.tag}
                          onChange={(e) => setHero((h) => ({ ...h, tag: e.target.value }))}
                          placeholder="e.g. SALESFORCE WORKFORCE DEVELOPMENT PARTNER"
                        />
                      </div>
                    </div>
                    <div className="editor-form-row editor-form-row--two">
                      <div className="editor-field">
                        <label>Headline part 1</label>
                        <input
                          type="text"
                          value={hero.heading}
                          onChange={(e) => setHero((h) => ({ ...h, heading: e.target.value }))}
                          placeholder="e.g. We Are"
                        />
                      </div>
                      <div className="editor-field">
                        <label>Headline part 2 (accent)</label>
                        <input
                          type="text"
                          value={hero.headingAccent}
                          onChange={(e) => setHero((h) => ({ ...h, headingAccent: e.target.value }))}
                          placeholder="e.g. Cloud Intellect."
                        />
                      </div>
                    </div>
                    <div className="editor-form-row">
                      <div className="editor-field">
                        <label>Description</label>
                        <textarea
                          value={hero.description}
                          onChange={(e) => setHero((h) => ({ ...h, description: e.target.value }))}
                          rows={3}
                          placeholder="Short description for the hero area"
                        />
                      </div>
                    </div>
                    <div className="editor-form-row">
                      <div className="editor-field">
                        <label>Description emphasis (bold substring)</label>
                        <input
                          type="text"
                          value={hero.descriptionEmphasis}
                          onChange={(e) => setHero((h) => ({ ...h, descriptionEmphasis: e.target.value }))}
                          placeholder="Exact phrase from description to show in bold (e.g. Salesforce ecosystem)"
                        />
                      </div>
                    </div>
                    <div className="editor-form-row">
                      <div className="editor-field">
                        <label>Background image path</label>
                        <input
                          type="text"
                          value={hero.backgroundImage}
                          onChange={(e) => setHero((h) => ({ ...h, backgroundImage: e.target.value }))}
                          placeholder="e.g. /images/BG.webp or uploaded path from media"
                        />
                        <p className="admin-form-help" style={{ marginTop: 8 }}>
                          Used on Blog hero and other pages that read <code>hero.backgroundImage</code>. Leave empty to use the default background.
                        </p>
                      </div>
                    </div>
                    <div className="editor-form-row editor-form-row--two">
                      <div className="editor-field">
                        <label>Button 1 text</label>
                        <input
                          type="text"
                          value={hero.primaryButtonText}
                          onChange={(e) => setHero((h) => ({ ...h, primaryButtonText: e.target.value }))}
                          placeholder="e.g. Explore Programs"
                        />
                      </div>
                      <div className="editor-field">
                        <label>Button 1 link</label>
                        <input
                          type="text"
                          value={hero.primaryButtonHref}
                          onChange={(e) => setHero((h) => ({ ...h, primaryButtonHref: e.target.value }))}
                          placeholder="e.g. #programs"
                        />
                      </div>
                    </div>
                    <div className="editor-form-row editor-form-row--two">
                      <div className="editor-field">
                        <label>Button 2 text</label>
                        <input
                          type="text"
                          value={hero.secondaryButtonText}
                          onChange={(e) => setHero((h) => ({ ...h, secondaryButtonText: e.target.value }))}
                          placeholder="e.g. View Placements"
                        />
                      </div>
                      <div className="editor-field">
                        <label>Button 2 link</label>
                        <input
                          type="text"
                          value={hero.secondaryButtonHref}
                          onChange={(e) => setHero((h) => ({ ...h, secondaryButtonHref: e.target.value }))}
                          placeholder="e.g. #placements"
                        />
                      </div>
                    </div>
                    {isAbout && (
                      <div className="editor-form-row editor-stats-block">
                        <div className="editor-field">
                          <label>Stats (About page)</label>
                          {stats.map((s, i) => (
                            <div key={i} className="editor-stat-row">
                              <input
                                type="text"
                                value={s.value}
                                onChange={(e) => setStat(i, 'value', e.target.value)}
                                placeholder="Value (e.g. 5000+)"
                              />
                              <input
                                type="text"
                                value={s.label}
                                onChange={(e) => setStat(i, 'label', e.target.value)}
                                placeholder="Label (e.g. LEARNERS TRAINED)"
                              />
                              <button type="button" className="editor-remove-row" onClick={() => removeStat(i)} aria-label="Remove">×</button>
                            </div>
                          ))}
                          <button type="button" className="editor-add-row" onClick={addStat}>+ Add stat</button>
                        </div>
                      </div>
                    )}
                    <div className="editor-form-actions">
                      <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? 'Updating…' : `Update ${label}`}
                      </button>
                    </div>
                  </form>
              </CollapsibleSection>
            )
          }

          if (key === 'heroSlides') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                <HeroSlidesForm
                  slides={heroSlidesArray}
                  onChange={setHeroSlidesArray}
                  onSubmit={updateHeroSlides}
                  saving={saving}
                />
              </CollapsibleSection>
            )
          }

          if (type === 'bridging') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <BridgingForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'cloudIntellectEdge') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <CloudIntellectEdgeForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'leadershipEdge') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <LeadershipEdgeForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'facultyMentors') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <FacultyMentorsForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'coreValues') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <CoreValuesForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'coreAdvantages') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <CoreAdvantagesForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'placementsOverview') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <PlacementsOverviewForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'ecosystem') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <EcosystemForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'courses') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <CoursesForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'legacy') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <LegacyForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'recognition') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <RecognitionForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'placementNetwork') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <PlacementNetworkForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'industryExperience') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <IndustryExperienceForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'whyChoose') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <WhyChooseForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'newsAndEvents') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <NewsAndEventsForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'selectYourPath') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <SelectYourPathForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'whoCanApply') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <WhoCanApplyForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'keyAdvantages') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <KeyAdvantagesForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'completeSupportEcosystem') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <CompleteSupportEcosystemForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'becomeJobReady') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <BecomeJobReadyForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'placementAssistance') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <PlacementAssistanceForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'trustRecognition') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <TrustRecognitionForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'impactSnapshot') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <ImpactSnapshotForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'sfdcTopics') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <SFDCTopicsForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'sfdcCareerOpportunities') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <SFDCCareerOpportunitiesForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'sfmcTopics') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <SFMCTopicsForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'sfmcCareerOpportunities') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <SFMCCareerOpportunitiesForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'webinarsCover') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <WebinarsCoverForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'whoShouldAttend') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <WhoShouldAttendForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'makeInformedDecision') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <MakeInformedDecisionForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'moreSuccessStories') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <MoreSuccessStoriesForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'yourJourney') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <YourJourneyForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'placementsHero') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <PlacementsHeroForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'placementsStats') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <PlacementsStatsForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'galleryHero') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <GalleryHeroForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'testimonialsHero') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <TestimonialsHeroForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'beNextSuccessStory') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <BeNextSuccessStoryForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'contactHero') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <ContactHeroForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'leadershipHero') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <LeadershipHeroForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'aboutCloudIntellectHero') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                <AboutCloudIntellectHeroForm
                  data={sectionFormData[key]}
                  onChange={(data) => setSectionFormDataForKey(key, data)}
                  onSubmit={(e) => updateSectionForm(key, e)}
                  saving={savingSection === key}
                />
              </CollapsibleSection>
            )
          }
          if (type === 'cloudIntellectAdvantage') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                <CloudIntellectAdvantageForm
                  data={sectionFormData[key]}
                  onChange={(data) => setSectionFormDataForKey(key, data)}
                  onSubmit={(e) => updateSectionForm(key, e)}
                  saving={savingSection === key}
                />
              </CollapsibleSection>
            )
          }
          if (type === 'salesforceEcosystemShowcase') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                <SalesforceEcosystemShowcaseForm
                  data={sectionFormData[key]}
                  onChange={(data) => setSectionFormDataForKey(key, data)}
                  onSubmit={(e) => updateSectionForm(key, e)}
                  saving={savingSection === key}
                />
              </CollapsibleSection>
            )
          }
          if (type === 'trainingPlacementModel') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                <TrainingPlacementModelForm
                  data={sectionFormData[key]}
                  onChange={(data) => setSectionFormDataForKey(key, data)}
                  onSubmit={(e) => updateSectionForm(key, e)}
                  saving={savingSection === key}
                />
              </CollapsibleSection>
            )
          }
          if (type === 'whySalesforceMentors') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                <WhySalesforceMentorsForm
                  data={sectionFormData[key]}
                  onChange={(data) => setSectionFormDataForKey(key, data)}
                  onSubmit={(e) => updateSectionForm(key, e)}
                  saving={savingSection === key}
                />
              </CollapsibleSection>
            )
          }
          if (type === 'careerHero') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <CareerHeroForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'careerWhyWork') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <CareerWhyWorkForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'careerCulture') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <CareerCultureForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'careerOpenings') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <CareerOpeningsForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'landingHero') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <LandingHeroForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'contactInfo') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <ContactInfoForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'locations') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <LocationsForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'studentSuccess') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <StudentSuccessForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'achievementHighlights') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <AchievementHighlightsForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'faq') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <FaqForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                  />
              </CollapsibleSection>
            )
          }
          if (type === 'simple') {
            return (
              <CollapsibleSection
                key={key}
                sectionKey={key}
                label={label}
                headerClassName="editor-section-header editor-section-header--blue"
                isCollapsed={collapsedSectionKeys.has(key)}
                onToggle={() => toggleSection(key)}
              >
                  <SimpleSectionForm
                    data={sectionFormData[key]}
                    onChange={(data) => setSectionFormDataForKey(key, data)}
                    onSubmit={(e) => updateSectionForm(key, e)}
                    saving={savingSection === key}
                    titleLabel="Section title"
                    descriptionLabel="Description / main text"
                  />
              </CollapsibleSection>
            )
          }

          return (
            <CollapsibleSection
              key={key}
              sectionKey={key}
              label={label}
              headerClassName="editor-section-header editor-section-header--blue"
              isCollapsed={collapsedSectionKeys.has(key)}
              onToggle={() => toggleSection(key)}
            >
              <SimpleSectionForm
                data={sectionFormData[key]}
                onChange={(data) => setSectionFormDataForKey(key, data)}
                onSubmit={(e) => updateSectionForm(key, e)}
                saving={savingSection === key}
              />
            </CollapsibleSection>
          )
        })}
      </div>
    </div>
  )
}

export default PageContentEditorPage
