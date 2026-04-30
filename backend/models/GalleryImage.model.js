import mongoose from 'mongoose'

const galleryImageSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Image path is required'],
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GalleryCategory',
    required: [true, 'Category is required']
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

const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema)

export default GalleryImage
