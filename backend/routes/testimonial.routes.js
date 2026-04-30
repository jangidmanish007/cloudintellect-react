import express from 'express'
import {
  getAllTestimonials,
  getAllTestimonialsAdmin,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials
} from '../controllers/testimonial.controller.js'
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public routes
router.get('/', getAllTestimonials)
router.get('/:id', getTestimonial)

// Protected routes
router.get('/admin/all', authenticate, authorize('admin', 'editor'), getAllTestimonialsAdmin)
router.post('/', authenticate, authorize('admin', 'editor'), createTestimonial)
router.put('/reorder', authenticate, authorize('admin', 'editor'), reorderTestimonials)
router.put('/:id', authenticate, authorize('admin', 'editor'), updateTestimonial)
router.delete('/:id', authenticate, authorize('admin'), deleteTestimonial)

export default router
