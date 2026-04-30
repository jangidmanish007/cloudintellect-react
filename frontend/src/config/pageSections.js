/**
 * Maps each page slug to its editable content sections.
 * Each section key corresponds to content[sectionKey] in the API.
 * Frontend components read from usePageContentContext().content[sectionKey].
 */
export const PAGE_SECTIONS = {
  home: [
    { key: 'heroSlides', label: 'Hero Carousel Slides', type: 'heroSlides' },
    { key: 'placementsOverview', label: 'Placements Overview Section', type: 'placementsOverview' },
    { key: 'ecosystem', label: 'Ecosystem Section', type: 'ecosystem' },
    { key: 'courses', label: 'Courses Section', type: 'courses' },
    { key: 'legacy', label: 'Legacy Section', type: 'legacy' },
    { key: 'recognition', label: 'Recognition Section', type: 'recognition' },
    { key: 'placements', label: 'Placements Section', type: 'simple' },
    { key: 'placementNetwork', label: 'Placement Network Section', type: 'placementNetwork' },
    { key: 'industryExperience', label: 'Industry Experience Section', type: 'industryExperience' },
    { key: 'communityImage', label: 'Community Image Section', type: 'simple' },
    { key: 'whyChoose', label: 'Why Choose Section', type: 'whyChoose' },
    { key: 'studentSuccess', label: 'Student Success Section', type: 'studentSuccess' },
    { key: 'studentReviews', label: 'Student Reviews Section', type: 'simple' },
    { key: 'achievementHighlights', label: 'CI Achievement Highlights Section', type: 'achievementHighlights' },
    { key: 'newsAndEvents', label: 'News and Events Section', type: 'newsAndEvents' },
  ],
  about: [
    { key: 'hero', label: 'Hero Section', type: 'hero' },
    { key: 'bridging', label: 'Bridging Section', type: 'bridging' },
    { key: 'cloudIntellectEdge', label: 'Cloud Intellect Edge', type: 'cloudIntellectEdge' },
    { key: 'leadershipEdge', label: 'Leadership Edge Section', type: 'leadershipEdge' },
    { key: 'coreValues', label: 'Core Values Section', type: 'coreValues' },
  ],
  'about-cloudintellect': [
    { key: 'hero', label: 'Hero Section', type: 'aboutCloudIntellectHero' },
    { key: 'cloudIntellectAdvantage', label: 'Cloud Intellect Advantage', type: 'cloudIntellectAdvantage' },
    { key: 'salesforceEcosystemShowcase', label: 'Salesforce Ecosystem Showcase', type: 'salesforceEcosystemShowcase' },
    { key: 'trainingPlacementModel', label: 'Training + Placement Model', type: 'trainingPlacementModel' },
    { key: 'whySalesforceMentors', label: 'Why Salesforce + Mentors', type: 'whySalesforceMentors' },
  ],
  'why-choose-us': [
    { key: 'hero', label: 'Hero Section', type: 'hero' },
    { key: 'coreAdvantages', label: 'Core Advantages Section', type: 'coreAdvantages' },
    { key: 'placementAssistance', label: 'Placement Assistance Section', type: 'placementAssistance' },
    { key: 'trustRecognition', label: 'Trust & Recognition Section', type: 'trustRecognition' },
    { key: 'impactSnapshot', label: 'Impact Snapshot Section', type: 'impactSnapshot' },
  ],
  webinars: [
    { key: 'hero', label: 'Hero Section', type: 'hero' },
    { key: 'upcomingBatches', label: 'Upcoming Batches Section', type: 'simple' },
    { key: 'webinarsCover', label: 'Webinars Cover Section', type: 'webinarsCover' },
    { key: 'whoShouldAttend', label: 'Who Should Attend Section', type: 'whoShouldAttend' },
    { key: 'moreSuccessStories', label: 'More Success Stories Section', type: 'moreSuccessStories' },
    { key: 'makeInformedDecision', label: 'Make Informed Decision Section', type: 'makeInformedDecision' },
  ],
  'salesforce-developer': [
    { key: 'hero', label: 'Hero Section', type: 'hero' },
    { key: 'sfdcTopics', label: 'SFDC Topics Section', type: 'sfdcTopics' },
    { key: 'sfdcCareerOpportunities', label: 'SFDC Career Opportunities Section', type: 'sfdcCareerOpportunities' },
  ],
  'salesforce-marketing-cloud': [
    { key: 'hero', label: 'Hero Section', type: 'hero' },
    { key: 'sfmcTopics', label: 'SFMC Topics Section', type: 'sfmcTopics' },
    { key: 'sfmcCareerOpportunities', label: 'SFMC Career Opportunities Section', type: 'sfmcCareerOpportunities' },
  ],
  'sfmc-sfdc': [
    { key: 'hero', label: 'Hero Section', type: 'hero' },
    { key: 'selectYourPath', label: 'Select Your Path Section', type: 'selectYourPath' },
    { key: 'whoCanApply', label: 'Who Can Apply Section', type: 'whoCanApply' },
    { key: 'keyAdvantages', label: 'Key Advantages Section', type: 'keyAdvantages' },
    { key: 'completeSupportEcosystem', label: 'Complete Support Ecosystem Section', type: 'completeSupportEcosystem' },
    { key: 'becomeJobReady', label: 'Become Job Ready Section', type: 'becomeJobReady' },
  ],
  'alumni-success': [
    { key: 'hero', label: 'Hero Section', type: 'hero' },
    { key: 'successStories', label: 'Success Stories Section', type: 'simple' },
    { key: 'alumniProfiles', label: 'Alumni Profiles Section', type: 'simple' },
    { key: 'moreSuccessStories', label: 'More Success Stories Section', type: 'simple' },
    { key: 'yourJourney', label: 'Your Journey Section', type: 'yourJourney' },
  ],
  career: [
    { key: 'hero', label: 'Hero Section', type: 'careerHero' },
    { key: 'whyWork', label: 'Why Work With Cloud Intellect Section', type: 'careerWhyWork' },
    { key: 'culture', label: 'Culture Section', type: 'careerCulture' },
    { key: 'openings', label: 'Current Openings Section', type: 'careerOpenings' },
  ],
  placements: [
    { key: 'hero', label: 'Hero Section', type: 'placementsHero' },
    { key: 'stats', label: 'Statistics Section', type: 'placementsStats' },
  ],
  gallery: [
    { key: 'hero', label: 'Hero Section', type: 'galleryHero' },
  ],
  testimonials: [
    { key: 'hero', label: 'Hero Section', type: 'testimonialsHero' },
    { key: 'moreSuccessStories', label: 'More Success Stories Section', type: 'moreSuccessStories' },
    { key: 'beNextSuccessStory', label: 'Be Our Next Success Story Section', type: 'beNextSuccessStory' },
  ],
  contact: [
    { key: 'hero', label: 'Hero Section', type: 'contactHero' },
    { key: 'contactInfo', label: 'Contact Information Section', type: 'contactInfo' },
    { key: 'locations', label: 'Locations Section', type: 'locations' },
  ],
  leadership: [
    { key: 'hero', label: 'Hero Section', type: 'leadershipHero' },
    { key: 'leadershipEdge', label: 'Leadership Message Section', type: 'leadershipEdge' },
    { key: 'facultyMentors', label: 'Faculty & Mentors Section', type: 'facultyMentors' },
  ],
  landing: [
    { key: 'hero', label: 'Landing Hero Section', type: 'landingHero' },
  ],
  faq: [
    { key: 'faq', label: 'FAQ Section', type: 'faq' },
  ],
  blog: [
    { key: 'hero', label: 'Blog Hero Section', type: 'hero' },
  ],
}

export function getSectionsForSlug(slug) {
  return PAGE_SECTIONS[slug] || []
}
