import express from 'express'
import {
  submitCareerLead,
  getCareerLeads,
  updateCareerLead,
  deleteCareerLead,
  uploadResumeMiddleware,
} from '../controllers/careerLead.controller.js'
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public submission route with resume upload
router.post('/submit', uploadResumeMiddleware, submitCareerLead)

// Admin routes
router.get('/', authenticate, authorize('admin'), getCareerLeads)
router.put('/:id', authenticate, authorize('admin'), updateCareerLead)
router.delete('/:id', authenticate, authorize('admin'), deleteCareerLead)

export default router

