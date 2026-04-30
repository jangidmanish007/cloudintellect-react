import express from 'express'
import {
  submitContactForm,
  getAllSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission
} from '../controllers/contactSubmission.controller.js'
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public route - form submission
router.post('/submit', submitContactForm)

// Protected routes - admin only
router.get('/submissions', authenticate, authorize('admin'), getAllSubmissions)
router.get('/submissions/:id', authenticate, authorize('admin'), getSubmission)
router.put('/submissions/:id', authenticate, authorize('admin'), updateSubmission)
router.delete('/submissions/:id', authenticate, authorize('admin'), deleteSubmission)

export default router
