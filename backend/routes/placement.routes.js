import express from 'express'
import {
  getAllPlacements,
  getPlacement,
  createPlacement,
  updatePlacement,
  deletePlacement,
  reorderPlacements
} from '../controllers/placement.controller.js'
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public routes
router.get('/', getAllPlacements)
router.get('/:id', getPlacement)

// Protected routes (require authentication)
router.post('/', authenticate, authorize('admin', 'editor'), createPlacement)
// Must be before /:id so "reorder" is not matched as an id
router.put('/reorder', authenticate, authorize('admin', 'editor'), reorderPlacements)
router.put('/:id', authenticate, authorize('admin', 'editor'), updatePlacement)
router.delete('/:id', authenticate, authorize('admin'), deletePlacement)

export default router
