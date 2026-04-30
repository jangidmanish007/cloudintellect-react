import mongoose from 'mongoose'

const batchSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Batch ID is required'],
    unique: true,
    enum: ['sfdc', 'sfmc'],
    trim: true
  },
  icon: {
    type: String,
    required: [true, 'Icon path is required'],
    trim: true
  },
  bannerBg: {
    type: String,
    required: [true, 'Banner background color is required'],
    trim: true
  },
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
  batchStart: {
    type: String,
    required: [true, 'Batch start date is required'],
    trim: true
  },
  nextBatch: {
    type: String,
    required: [true, 'Next batch date is required'],
    trim: true
  },
  linkText: {
    type: String,
    required: [true, 'Link text is required'],
    trim: true
  },
  linkHref: {
    type: String,
    required: [true, 'Link href is required'],
    trim: true
  },
  isOpen: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const Batch = mongoose.model('Batch', batchSchema)

export default Batch
