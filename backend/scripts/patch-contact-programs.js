/**
 * Sets contact page content.contactInfo.programs to SFDC / SFMC only (matches public form).
 * Run from repo root: node backend/scripts/patch-contact-programs.js
 */
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import Page from '../models/Page.model.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const PROGRAMS = ['SFDC', 'SFMC']

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cloudintellect'
  await mongoose.connect(uri)
  const page = await Page.findOne({ slug: 'contact' })
  if (!page) {
    console.error('No page with slug "contact" found.')
    process.exit(1)
  }
  const content = page.content && typeof page.content === 'object' ? { ...page.content } : {}
  const contactInfo = { ...(content.contactInfo || {}), programs: PROGRAMS }
  content.contactInfo = contactInfo
  page.content = content
  page.markModified('content')
  await page.save()
  console.log('Updated contact page contactInfo.programs to:', PROGRAMS)
  await mongoose.disconnect()
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
