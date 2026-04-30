/**
 * Adds or updates only the Leadership page. Safe to run – does not touch other pages.
 * Run from project root: node backend/scripts/add-leadership-page.js
 */
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import Page from '../models/Page.model.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Load backend/.env so MONGODB_URI is found when run from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const leadershipPage = {
  slug: 'leadership',
  title: 'Leadership',
  description: 'Leadership at Cloud Intellect',
  navbarLabel: 'Leadership',
  showInNavbar: true,
  navbarOrder: 0,
  order: 13,
  isActive: true,
  content: {
    hero: {
      tag: 'LEADERSHIP MESSAGE',
      heading: 'Leadership at',
      headingAccent: 'Cloud Intellect',
      description: 'Vision-driven leadership backed by real industry experience.',
      primaryButtonText: 'Explore Programs',
      primaryButtonHref: '#programs',
      secondaryButtonText: 'Download Brochure',
      secondaryButtonHref: '#brochure',
      backgroundImage: '/images/BG (7).webp',
      bgImage: '/images/BG (7).webp'
    },
    leadershipEdge: {
      theme: 'light',
      title: '',
      label: 'LEADERSHIP MESSAGE',
      quote: 'Our aim is to create an environment where every learner builds real skills.',
      quoteHighlight: 'real skills.',
      paras: [
        'Learning at Cloud Intellect is a transformative journey designed to turn potential into expertise.',
        'Cloud Intellect has been built with a clear vision to bridge the gap between learning and industry.',
        'We believe that the right guidance and leadership can shape the next generation of Salesforce professionals.',
        'Since our inception, we have earned the trust of learners and enterprises alike.',
        'With a future-oriented approach, we remain committed to excellence and innovation.'
      ],
      profileName: 'Sumit Mahakalkar',
      profileTitle: 'Director & Senior Salesforce Architect',
      profileImage: '/images/Rectangle 2.webp',
      experienceValue: '14+ Years',
      experienceDetail: 'Salesforce Consulting & Architecture',
      credentialsValue: '8+ Global Certifications',
      credentialsDetail: 'Salesforce Ecosystem',
      linkedInUrl: '',
      linkedInLabel: 'Connect on LinkedIn'
    }
  }
}

async function addLeadershipPage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cloudintellect')
    console.log('✅ Connected to MongoDB')

    const result = await Page.findOneAndUpdate(
      { slug: 'leadership' },
      { $set: leadershipPage },
      { upsert: true, new: true }
    )
    console.log('✅ Leadership page added/updated in admin.')
    console.log('   Edit it at: Admin → Pages → Leadership (or edit slug: leadership)')
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

addLeadershipPage()
