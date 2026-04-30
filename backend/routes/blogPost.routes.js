import express from 'express'
import {
  getPublishedPosts,
  getPublishedCategories,
  getPublishedBySlug,
  getAllPostsAdmin,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '../controllers/blogPost.controller.js'
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/meta/categories', getPublishedCategories)
router.get('/slug/:slug', getPublishedBySlug)
router.get('/admin/all', authenticate, authorize('admin', 'editor'), getAllPostsAdmin)
router.get('/', getPublishedPosts)
router.post('/', authenticate, authorize('admin', 'editor'), createBlogPost)
router.put('/:id', authenticate, authorize('admin', 'editor'), updateBlogPost)
router.delete('/:id', authenticate, authorize('admin'), deleteBlogPost)

export default router
