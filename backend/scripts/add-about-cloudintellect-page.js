/**
 * Adds or updates the About Cloud Intellect page (hero + advantage + ecosystem showcase).
 * Preserves existing hero / advantage / ecosystem content in DB when already present.
 * Run from project root: node backend/scripts/add-about-cloudintellect-page.js
 */
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import Page from '../models/Page.model.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const aboutCloudIntellectPage = {
  slug: 'about-cloudintellect',
  title: 'About Cloud Intellect', 
  description: 'Salesforce workforce training and placement support',
  navbarLabel: 'About Cloud Intellect',
  showInNavbar: false,
  navbarOrder: 14,
  order: 14,
  isActive: true,
  content: {
    hero: {
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
    },
    cloudIntellectAdvantage: {
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
    },
    salesforceEcosystemShowcase: {
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
    },
    trainingPlacementModel: {
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
    },
    whySalesforceMentors: {
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
    },
  },
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cloudintellect')
    console.log('✅ Connected to MongoDB')

    const existing = await Page.findOne({ slug: 'about-cloudintellect' })
    const prev = existing?.content && typeof existing.content === 'object' ? existing.content : {}
    const hasHero = prev.hero && typeof prev.hero === 'object' && Object.keys(prev.hero).length > 0
    const hasAdvantage =
      prev.cloudIntellectAdvantage &&
      typeof prev.cloudIntellectAdvantage === 'object' &&
      Array.isArray(prev.cloudIntellectAdvantage.cards) &&
      prev.cloudIntellectAdvantage.cards.length > 0
    const hasEcosystemShowcase =
      prev.salesforceEcosystemShowcase &&
      typeof prev.salesforceEcosystemShowcase === 'object' &&
      (Array.isArray(prev.salesforceEcosystemShowcase.bullets) ||
        typeof prev.salesforceEcosystemShowcase.description === 'string' ||
        typeof prev.salesforceEcosystemShowcase.headingLine1 === 'string')
    const hasTrainingPlacementModel =
      prev.trainingPlacementModel &&
      typeof prev.trainingPlacementModel === 'object' &&
      (Array.isArray(prev.trainingPlacementModel.serviceItems) ||
        Array.isArray(prev.trainingPlacementModel.features) ||
        typeof prev.trainingPlacementModel.headingLine1 === 'string')
    const hasWhySalesforceMentors =
      prev.whySalesforceMentors &&
      typeof prev.whySalesforceMentors === 'object' &&
      (typeof prev.whySalesforceMentors.backgroundColor === 'string' ||
        typeof prev.whySalesforceMentors.leftCard === 'object' ||
        typeof prev.whySalesforceMentors.rightCard === 'object')

    const content = {
      ...prev,
      hero: hasHero ? prev.hero : aboutCloudIntellectPage.content.hero,
      cloudIntellectAdvantage: hasAdvantage
        ? prev.cloudIntellectAdvantage
        : aboutCloudIntellectPage.content.cloudIntellectAdvantage,
      salesforceEcosystemShowcase: hasEcosystemShowcase
        ? prev.salesforceEcosystemShowcase
        : aboutCloudIntellectPage.content.salesforceEcosystemShowcase,
      trainingPlacementModel: hasTrainingPlacementModel
        ? prev.trainingPlacementModel
        : aboutCloudIntellectPage.content.trainingPlacementModel,
      whySalesforceMentors: hasWhySalesforceMentors
        ? prev.whySalesforceMentors
        : aboutCloudIntellectPage.content.whySalesforceMentors,
    }

    const result = await Page.findOneAndUpdate(
      { slug: 'about-cloudintellect' },
      { $set: { ...aboutCloudIntellectPage, content } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    console.log('✅ Page upserted:', result.slug, '→ /about-cloudintellect')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

run()
