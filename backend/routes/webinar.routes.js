import express from 'express'
import {
  getAllWebinarTopics,
  createWebinarTopic,
  updateWebinarTopic,
  deleteWebinarTopic,
  getAllWhoShouldAttend,
  createWhoShouldAttend,
  updateWhoShouldAttend,
  deleteWhoShouldAttend
} from '../controllers/webinar.controller.js'
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = express.Router()

// Webinar Topics routes
router.get('/topics', getAllWebinarTopics)
router.post('/topics', authenticate, authorize('admin', 'editor'), createWebinarTopic)
router.put('/topics/:id', authenticate, authorize('admin', 'editor'), updateWebinarTopic)
router.delete('/topics/:id', authenticate, authorize('admin'), deleteWebinarTopic)

// Who Should Attend routes
router.get('/who-should-attend', getAllWhoShouldAttend)
router.post('/who-should-attend', authenticate, authorize('admin', 'editor'), createWhoShouldAttend)
router.put('/who-should-attend/:id', authenticate, authorize('admin', 'editor'), updateWhoShouldAttend)
router.delete('/who-should-attend/:id', authenticate, authorize('admin'), deleteWhoShouldAttend)

export default router
