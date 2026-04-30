import express from 'express'
import {
  getAllImages,
  getAllImagesAdmin,
  getImage,
  createImage,
  updateImage,
  deleteImage,
  reorderImages
} from '../controllers/galleryImage.controller.js'
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public routes
router.get('/', getAllImages)

// Protected routes
router.get('/admin', authenticate, authorize('admin', 'editor'), getAllImagesAdmin)
router.get('/:id', getImage)
router.post('/', authenticate, authorize('admin', 'editor'), createImage)
router.put('/reorder', authenticate, authorize('admin', 'editor'), reorderImages)
router.put('/:id', authenticate, authorize('admin', 'editor'), updateImage)
router.delete('/:id', authenticate, authorize('admin'), deleteImage)

export default router
