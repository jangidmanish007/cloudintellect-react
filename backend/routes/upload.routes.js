import express from 'express'
import { uploadFile, uploadMultipleFiles, upload } from '../controllers/upload.controller.js'
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = express.Router()

// Single file upload
router.post('/', authenticate, authorize('admin', 'editor'), upload.single('file'), uploadFile)

// Multiple files upload
router.post('/multiple', authenticate, authorize('admin', 'editor'), upload.array('files', 10), uploadMultipleFiles)

export default router
