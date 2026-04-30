import mongoose from 'mongoose'
import dotenv from 'dotenv'
import GalleryCategory from '../models/GalleryCategory.model.js'

dotenv.config()

const seedGallery = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cloudintellect')
    console.log('✅ Connected to MongoDB')

    const categories = [
      {
        name: 'Offline classroom sessions',
        slug: 'offline-classroom-sessions',
        order: 1,
        isActive: true
      },
      {
        name: 'Corporate training programs',
        slug: 'corporate-training-programs',
        order: 2,
        isActive: true
      },
      {
        name: 'Events & Workshops',
        slug: 'events-workshops',
        order: 3,
        isActive: true
      },
      {
        name: 'Infrastructure Building',
        slug: 'infrastructure-building',
        order: 4,
        isActive: true
      }
    ]

    // Clear existing categories
    await GalleryCategory.deleteMany({})
    console.log('🗑️  Cleared existing gallery categories')

    // Insert categories
    await GalleryCategory.insertMany(categories)
    console.log(`✅ Seeded ${categories.length} gallery categories`)

    console.log('🎉 Gallery seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding gallery:', error)
    process.exit(1)
  }
}

seedGallery()
