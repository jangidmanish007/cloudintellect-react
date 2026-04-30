import express from 'express'
import {
  getAllPages,
  getNavbarPages,
  getPageBySlug,
  getPageById,
  createPage,
  updatePage,
  deletePage
} from '../controllers/pages.controller.js'
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public routes
router.get('/', getAllPages)
router.get('/navbar', getNavbarPages)
router.get('/slug/:slug', getPageBySlug)
router.get('/id/:id', getPageById)

// Protected routes
router.post('/', authenticate, authorize('admin', 'editor'), createPage)
router.put('/:id', authenticate, authorize('admin', 'editor'), updatePage)
router.delete('/:id', authenticate, authorize('admin'), deletePage)

export default router
