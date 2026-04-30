import express from 'express'
import {
  getAllCarouselSlides,
  getAllCarouselSlidesAdmin,
  getCarouselSlide,
  createCarouselSlide,
  updateCarouselSlide,
  deleteCarouselSlide,
  reorderCarouselSlides
} from '../controllers/headerCarousel.controller.js'
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public routes
router.get('/', getAllCarouselSlides)

// Protected routes (require authentication)
router.get('/all', authenticate, authorize('admin', 'editor'), getAllCarouselSlidesAdmin)
router.get('/:id', authenticate, authorize('admin', 'editor'), getCarouselSlide)
router.post('/', authenticate, authorize('admin', 'editor'), createCarouselSlide)
router.put('/:id', authenticate, authorize('admin', 'editor'), updateCarouselSlide)
router.delete('/:id', authenticate, authorize('admin', 'editor'), deleteCarouselSlide)
router.put('/reorder', authenticate, authorize('admin', 'editor'), reorderCarouselSlides)

export default router
