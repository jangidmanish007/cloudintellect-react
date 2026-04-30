import express from 'express'
import {
  getAllBatches,
  getBatch,
  createOrUpdateBatch,
  updateBatch,
  deleteBatch
} from '../controllers/batches.controller.js'
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public routes
router.get('/', getAllBatches)
router.get('/:id', getBatch)

// Protected routes
router.post('/', authenticate, authorize('admin', 'editor'), createOrUpdateBatch)
router.put('/:id', authenticate, authorize('admin', 'editor'), updateBatch)
router.delete('/:id', authenticate, authorize('admin'), deleteBatch)

export default router
