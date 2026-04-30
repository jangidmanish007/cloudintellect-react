import mongoose from 'mongoose'

const successStorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
    trim: true,
    default: '1 year ago'
  },
  profileImage: {
    type: String,
    required: [true, 'Profile image path is required'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
    default: 5
  },
  text: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true
  },
  readMoreUrl: {
    type: String,
    default: '#',
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

const SuccessStory = mongoose.model('SuccessStory', successStorySchema)

export default SuccessStory
