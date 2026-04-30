import express from 'express'
import {
  getAllSuccessStories,
  getSuccessStory,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
  reorderSuccessStories
} from '../controllers/successStories.controller.js'
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public routes
router.get('/', getAllSuccessStories)
router.get('/:id', getSuccessStory)

// Protected routes
router.post('/', authenticate, authorize('admin', 'editor'), createSuccessStory)
router.put('/:id', authenticate, authorize('admin', 'editor'), updateSuccessStory)
router.delete('/:id', authenticate, authorize('admin'), deleteSuccessStory)
router.put('/reorder', authenticate, authorize('admin', 'editor'), reorderSuccessStories)

export default router
