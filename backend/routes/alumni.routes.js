import express from 'express'
import {
  getAllAlumni,
  getAlumnus,
  createAlumnus,
  updateAlumnus,
  deleteAlumnus,
  reorderAlumni
} from '../controllers/alumni.controller.js'
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public routes
router.get('/', getAllAlumni)
router.get('/:id', getAlumnus)

// Protected routes (require authentication)
router.post('/', authenticate, authorize('admin', 'editor'), createAlumnus)
router.put('/:id', authenticate, authorize('admin', 'editor'), updateAlumnus)
router.delete('/:id', authenticate, authorize('admin'), deleteAlumnus)
router.put('/reorder', authenticate, authorize('admin', 'editor'), reorderAlumni)

export default router
