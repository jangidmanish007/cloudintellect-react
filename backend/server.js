import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'

// Import routes
import authRoutes from './routes/auth.routes.js'
import alumniRoutes from './routes/alumni.routes.js'
import batchesRoutes from './routes/batches.routes.js'
import successStoriesRoutes from './routes/successStories.routes.js'
import webinarRoutes from './routes/webinar.routes.js'
import uploadRoutes from './routes/upload.routes.js'
import pagesRoutes from './routes/pages.routes.js'
import headerCarouselRoutes from './routes/headerCarousel.routes.js'
import headerSettingsRoutes from './routes/headerSettings.routes.js'
import footerSettingsRoutes from './routes/footerSettings.routes.js'
import placementRoutes from './routes/placement.routes.js'
import galleryCategoryRoutes from './routes/galleryCategory.routes.js'
import galleryImageRoutes from './routes/galleryImage.routes.js'
import testimonialRoutes from './routes/testimonial.routes.js'
import contactSubmissionRoutes from './routes/contactSubmission.routes.js'
import careerLeadRoutes from './routes/careerLead.routes.js'
import blogPostRoutes from './routes/blogPost.routes.js'
import heroApplicationRoutes from './routes/heroApplication.routes.js'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middleware
const envAllowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(Boolean)
const devLocalhostOrigin = /^http:\/\/localhost:\d+$/

app.use(cors({
  origin: (origin, cb) => {
    // Allow non-browser requests (curl, server-to-server) with no Origin header
    if (!origin) return cb(null, true)

    // In development, allow any localhost:* (Vite may pick 5174, 5175, etc.)
    if ((process.env.NODE_ENV || 'development') === 'development' && devLocalhostOrigin.test(origin)) {
      return cb(null, true)
    }

    // Otherwise, only allow explicitly configured origins
    if (envAllowedOrigins.includes(origin)) return cb(null, true)

    return cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
// Serve public images (for webinars icons and other static assets)
// Note: frontend assets live in ./frontend/public after repo restructuring
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')))

// MongoDB Connection (server still starts so /api/health works; API will fail until DB connects)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cloudintellect')
  .then(() => {
    console.log('✅ MongoDB connected successfully')
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message)
    console.error('   Server will keep running. Fix MONGODB_URI in .env and restart. API routes will fail until DB connects.')
  })

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/alumni', alumniRoutes)
app.use('/api/batches', batchesRoutes)
app.use('/api/success-stories', successStoriesRoutes)
app.use('/api/webinars', webinarRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/pages', pagesRoutes)
app.use('/api/header-carousel', headerCarouselRoutes)
app.use('/api/header-settings', headerSettingsRoutes)
app.use('/api/footer-settings', footerSettingsRoutes)
app.use('/api/placements', placementRoutes)
app.use('/api/gallery/categories', galleryCategoryRoutes)
app.use('/api/gallery/images', galleryImageRoutes)
app.use('/api/testimonials', testimonialRoutes)
app.use('/api/contact', contactSubmissionRoutes)
app.use('/api/career-leads', careerLeadRoutes)
app.use('/api/blog-posts', blogPostRoutes)
app.use('/api/hero-application', heroApplicationRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Cloud Intellect API is running',
    timestamp: new Date().toISOString()
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
})
