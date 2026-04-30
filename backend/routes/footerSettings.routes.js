import express from 'express'
import { getFooterSettings, updateFooterSettings } from '../controllers/footerSettings.controller.js'
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public route
router.get('/', getFooterSettings)

// Protected route
router.put('/', authenticate, authorize('admin', 'editor'), updateFooterSettings)

export default router

