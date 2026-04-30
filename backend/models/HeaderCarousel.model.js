import mongoose from 'mongoose'

const headerCarouselSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Carousel text is required'],
    trim: true
  },
  link: {
    type: String,
    trim: true,
    default: ''
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

const HeaderCarousel = mongoose.model('HeaderCarousel', headerCarouselSchema)

export default HeaderCarousel
