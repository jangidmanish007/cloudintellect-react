import mongoose from 'mongoose'

const placementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company is required'],
    trim: true
  },
  package: {
    type: String,
    required: [true, 'Package is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Image path is required'],
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

const Placement = mongoose.model('Placement', placementSchema)

export default Placement
