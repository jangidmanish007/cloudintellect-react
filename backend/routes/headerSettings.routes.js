import express from 'express'
import {
  getHeaderSettings,
  updateHeaderSettings
} from '../controllers/headerSettings.controller.js'
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public route
router.get('/', getHeaderSettings)

// Protected route (require authentication)
router.put('/', authenticate, authorize('admin', 'editor'), updateHeaderSettings)

export default router
