import mongoose from 'mongoose'

const whoShouldAttendSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  icon: {
    type: String,
    required: [true, 'Icon path is required'],
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

const WhoShouldAttend = mongoose.model('WhoShouldAttend', whoShouldAttendSchema)

export default WhoShouldAttend
