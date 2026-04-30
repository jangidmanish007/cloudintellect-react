import mongoose from 'mongoose'

const pageSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: [true, 'Page slug is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  title: {
    type: String,
    required: [true, 'Page title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  showInNavbar: {
    type: Boolean,
    default: true
  },
  navbarLabel: {
    type: String,
    trim: true
  },
  navbarOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

const Page = mongoose.model('Page', pageSchema)

export default Page
