import mongoose from 'mongoose'

const contactSubmissionSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  program: {
    type: String,
    required: [true, 'Program selection is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  consent: {
    type: Boolean,
    required: true,
    default: false
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'resolved', 'archived'],
    default: 'new'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

// Index for efficient queries
contactSubmissionSchema.index({ createdAt: -1 })
contactSubmissionSchema.index({ status: 1 })
contactSubmissionSchema.index({ email: 1 })

const ContactSubmission = mongoose.model('ContactSubmission', contactSubmissionSchema)

export default ContactSubmission
