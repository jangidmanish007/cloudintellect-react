/**
 * Adds or updates only the Blog page. Safe to run – does not touch other pages.
 * Run from project root: node backend/scripts/add-blog-page.js
 */
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import Page from '../models/Page.model.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const blogPage = {
  slug: 'blog',
  title: 'Blog',
  description: 'Insights & updates from Cloud Intellect',
  navbarLabel: 'Blog',
  showInNavbar: false,
  navbarOrder: 0,
  order: 21,
  isActive: true,
  content: {
    hero: {
      tag: 'KNOWLEDGE HUB',
      heading: 'Insights &',
      headingAccent: 'Updates',
      description:
        'Stay ahead in the Salesforce ecosystem with our expert guides, industry trends, and career advice updated for 2025.',
      descriptionEmphasis: 'Salesforce ecosystem',
      backgroundImage: '/images/BG.webp',
      primaryButtonText: 'Explore Programs',
      primaryButtonHref: '/salesforce-developer',
      secondaryButtonText: 'View Placements',
      secondaryButtonHref: '/placements',
    },
  },
}

async function addBlogPage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cloudintellect')
    console.log('✅ Connected to MongoDB')

    const result = await Page.findOneAndUpdate(
      { slug: 'blog' },
      { $set: blogPage },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    console.log('✅ Blog page upserted:', result.slug)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

addBlogPage()
