import express from 'express'
import {
  getAllCategories,
  getAllCategoriesAdmin,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories
} from '../controllers/galleryCategory.controller.js'
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public routes
router.get('/', getAllCategories)

// Protected routes
router.get('/admin', authenticate, authorize('admin', 'editor'), getAllCategoriesAdmin)
router.get('/:id', getCategory)
router.post('/', authenticate, authorize('admin', 'editor'), createCategory)
router.put('/reorder', authenticate, authorize('admin', 'editor'), reorderCategories)
router.put('/:id', authenticate, authorize('admin', 'editor'), updateCategory)
router.delete('/:id', authenticate, authorize('admin'), deleteCategory)

export default router
