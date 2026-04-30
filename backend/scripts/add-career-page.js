/**
 * Adds or updates only the Career page. Safe to run – does not touch other pages.
 * Run from project root: node backend/scripts/add-career-page.js
 */
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import Page from '../models/Page.model.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Load backend/.env so MONGODB_URI is found when run from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const careerPage = {
  slug: 'career',
  title: 'Career',
  description: 'Build your Salesforce career with Cloud Intellect',
  navbarLabel: 'Career',
  showInNavbar: true,
  navbarOrder: 7,
  order: 20,
  isActive: true,
  content: {
    hero: {
      tag: 'LIVE SESSIONS',
      headingLine1: 'Elevate Your Career',
      headingLine2: 'and Empower Others',
      description: 'Join Cloud Intellect for impactful education and accelerate your tech career in the Salesforce world.',
      primaryButtonText: 'View Open Positions',
      primaryButtonHref: '#open-positions',
      secondaryButtonText: 'Apply Now',
      secondaryButtonHref: '#apply',
      heroImage: '/images/career-hero.webp',
    },
    whyWork: {
      headingLine1: 'Why Work With',
      headingStrong: 'Cloud Intellect?',
      cards: [
        { title: 'Career Impact', description: 'We work on real student outcomes.', icon: '' },
        { title: 'Industry Exposure', description: 'Hands-on work in the Salesforce ecosystem.', icon: '' },
        { title: 'Ownership Culture', description: 'Ideas > hierarchy. Execution > excuses.', icon: '' },
      ],
    },
    culture: {
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
    },
    openings: {
      heading: 'Current Openings',
      openings: [
        { title: 'Salesforce Trainer', description: 'Deliver practical Salesforce training, guide students, and support certification + placement readiness.', linkText: 'Apply Now', linkHref: '#apply-salesforce-trainer', icon: '' },
        { title: 'Academic Counsellor', description: 'Help students choose the right career path and guide them through admissions and learning journeys.', linkText: 'Apply Now', linkHref: '#apply-academic-counsellor', icon: '' },
        { title: 'Digital Marketing Exec.', description: 'Plan and execute campaigns across Meta, Google, and content platforms to generate quality leads.', linkText: 'Apply Now', linkHref: '#apply-digital-marketing', icon: '' },
        { title: 'Content & Social Media Exec.', description: 'Create engaging reels, creatives, and educational content that drives awareness and trust.', linkText: 'Apply Now', linkHref: '#apply-content-social', icon: '' },
        { title: 'Placement Coordinator', description: 'Provide resume and interview guidance, career counselling, and connect graduates with our industry partners.', linkText: 'Apply Now', linkHref: '#apply-placement-coordinator', icon: '' },
        { title: "Don't see a fit?", description: 'Send us your resume anyway. We are always looking for great talent.', linkText: 'Drop Resume', linkHref: '#drop-resume', icon: '' },
      ],
    },
  },
}

async function addCareerPage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cloudintellect')
    console.log('✅ Connected to MongoDB')

    const result = await Page.findOneAndUpdate(
      { slug: 'career' },
      { $set: careerPage },
      { upsert: true, new: true }
    )
    console.log('✅ Career page added/updated in admin.')
    console.log('   Edit it at: Admin → Pages → Career (slug: career)')
    process.exit(0)
  } catch (error) {
    if (error.message && (error.message.includes('ECONNREFUSED') || error.message.includes('connect'))) {
      console.error('❌ Could not connect to MongoDB.')
      console.error('   • If using local MongoDB: start it (e.g. brew services start mongodb-community)')
      console.error('   • If using Atlas: set MONGODB_URI in backend/.env to your Atlas connection string')
      console.error('   • Run this script from project root so backend/.env is loaded')
    } else {
      console.error('❌ Error:', error.message)
    }
    process.exit(1)
  }
}

addCareerPage()

