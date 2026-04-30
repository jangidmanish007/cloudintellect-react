import mongoose from 'mongoose'

function slugify(text) {
  if (!text || typeof text !== 'string') return ''
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, default: '', trim: true },
    content: { type: String, default: '' },
    featuredImage: { type: String, default: '' },
    category: { type: String, default: '', trim: true },
    publishedAt: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

blogPostSchema.pre('validate', function (next) {
  if (this.title && (!this.slug || !String(this.slug).trim())) {
    this.slug = slugify(this.title)
  }
  if (this.slug) {
    this.slug = slugify(this.slug) || slugify(this.title)
  }
  if (!this.slug || !String(this.slug).trim()) {
    this.slug = `post-${Date.now()}`
  }
  next()
})

const BlogPost = mongoose.model('BlogPost', blogPostSchema)
export default BlogPost
