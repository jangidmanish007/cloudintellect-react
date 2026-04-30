import mongoose from 'mongoose'

const careerLeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true,
  },
  experienceYears: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative'],
  },
  resumePath: {
    type: String,
    trim: true,
  },
  openingTitle: {
    type: String,
    trim: true,
  },
  openingIdentifier: {
    type: String,
    trim: true,
  },
  source: {
    type: String,
    trim: true,
    default: 'career-page',
  },
  status: {
    type: String,
    enum: ['new', 'in_review', 'contacted', 'rejected', 'hired', 'archived'],
    default: 'new',
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
})

careerLeadSchema.index({ createdAt: -1 })
careerLeadSchema.index({ status: 1 })
careerLeadSchema.index({ email: 1 })

const CareerLead = mongoose.model('CareerLead', careerLeadSchema)

export default CareerLead

