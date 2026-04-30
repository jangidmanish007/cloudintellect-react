/**
 * Inserts sample blog posts if collection is empty (does not delete existing).
 * Run: node backend/scripts/seed-blog-posts.js
 */
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import BlogPost from '../models/BlogPost.model.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const samples = [
  {
    title: 'Types of Reports in Salesforce: A Complete Guide for 2025',
    slug: 'types-of-reports-in-salesforce-2025',
    excerpt:
      'Understand tabular, summary, matrix, and joined reports—and when to use each in real projects.',
    content:
      '<p>Salesforce offers powerful reporting tools. In this guide we cover the main report types and best practices for 2025.</p><h2>Tabular reports</h2><p>Best for simple lists and exports.</p><h2>Summary reports</h2><p>Group and subtotal your data.</p>',
    featuredImage: '/images/BG.webp',
    category: 'Admin & Reports',
    publishedAt: new Date('2025-08-20'),
    isPublished: true,
  },
  {
    title: 'Getting Started with Apex for Admins',
    slug: 'getting-started-with-apex-for-admins',
    excerpt: 'A gentle introduction to Apex triggers and when admins should involve developers.',
    content: '<p>Apex extends the Salesforce platform. Learn the basics and collaboration patterns.</p>',
    featuredImage: '/images/BG (2).webp',
    category: 'Development (Apex/LWC)',
    publishedAt: new Date('2025-07-15'),
    isPublished: true,
  },
  {
    title: 'From Classroom to Consultant: Training Paths That Work',
    slug: 'training-paths-that-work',
    excerpt: 'How structured programs and mentorship accelerate placement outcomes.',
    content: '<p>Career transitions need a plan. Here is what works for Salesforce learners in 2025.</p>',
    featuredImage: '/images/BG (7).webp',
    category: 'Training & Career',
    publishedAt: new Date('2025-06-01'),
    isPublished: true,
  },
]

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cloudintellect')
  const count = await BlogPost.countDocuments()
  if (count > 0) {
    console.log(`BlogPost collection already has ${count} document(s). Skipping seed.`)
    process.exit(0)
  }
  await BlogPost.insertMany(samples)
  console.log(`✅ Inserted ${samples.length} sample blog posts`)
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
