import mongoose from 'mongoose'

const footerLinkSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true
  },
  href: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: false })

const footerColumnSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  links: [footerLinkSchema],
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: false })

const footerSocialSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ['linkedin', 'instagram', 'facebook', 'youtube', 'twitter']
  },
  href: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: false })

const footerSettingsSchema = new mongoose.Schema({
  brand: {
    name: { type: String, default: 'Cloud Intellect', trim: true },
    tagline: { type: String, default: 'IT Training | Placement | Consulting', trim: true },
    description: { type: String, default: "India's #1 Salesforce training institute, empowering careers since 2012.", trim: true },
    logoImage: { type: String, default: '', trim: true }
  },
  contact: {
    locationText: { type: String, default: 'Nagpur & Pune Centers', trim: true },
    email: { type: String, default: 'info@cloudintellect.in', trim: true },
    phone: { type: String, default: '+91 98765 43210', trim: true }
  },
  socialLinks: [footerSocialSchema],
  columns: [footerColumnSchema],
  bottomBar: {
    copyrightText: { type: String, default: '© 2026 Cloud Intellect. All rights reserved.', trim: true },
    creditText: { type: String, default: 'Design & Developed by Medisign', trim: true }
  }
}, { timestamps: true })

// Ensure only one document exists
footerSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne()
  if (!settings) settings = await this.create({})
  return settings
}

const FooterSettings = mongoose.model('FooterSettings', footerSettingsSchema)

export default FooterSettings

