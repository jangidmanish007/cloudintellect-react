import mongoose from 'mongoose'

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  specialization: {
    type: String,
    trim: true
  },
  program: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    trim: true
  },
  coverPhoto: {
    type: String,
    trim: true
  },
  story: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  role: {
    type: String,
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
}, {
  timestamps: true
})

const Testimonial = mongoose.model('Testimonial', testimonialSchema)

export default Testimonial
