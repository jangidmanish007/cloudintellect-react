import BlogPost from '../models/BlogPost.model.js'

const listSelect =
  'title slug excerpt featuredImage category publishedAt createdAt order isPublished'

// @desc    Published posts for public blog listing
// @route   GET /api/blog-posts
// @access  Public
export const getPublishedPosts = async (req, res) => {
  try {
    const { category } = req.query
    const filter = { isPublished: true }
    if (category && String(category).trim()) {
      filter.category = String(category).trim()
    }

    const posts = await BlogPost.find(filter)
      .select(listSelect)
      .sort({ order: 1, publishedAt: -1, createdAt: -1 })
      .lean()

    res.json({
      success: true,
      count: posts.length,
      data: posts,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching blog posts',
    })
  }
}

// @desc    Distinct categories from published posts
// @route   GET /api/blog-posts/meta/categories
// @access  Public
export const getPublishedCategories = async (req, res) => {
  try {
    const cats = await BlogPost.distinct('category', {
      isPublished: true,
      category: { $nin: ['', null], $exists: true },
    })
    const sorted = cats.filter(Boolean).sort((a, b) => a.localeCompare(b))
    res.json({ success: true, data: sorted })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching categories',
    })
  }
}

// @desc    Single published post by slug (full content)
// @route   GET /api/blog-posts/slug/:slug
// @access  Public
export const getPublishedBySlug = async (req, res) => {
  try {
    const slug = String(req.params.slug || '').trim().toLowerCase()
    if (!slug) {
      return res.status(400).json({ success: false, message: 'Slug required' })
    }

    const post = await BlogPost.findOne({ slug, isPublished: true }).lean()

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }

    res.json({ success: true, data: post })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching post',
    })
  }
}

// @desc    All posts (admin)
// @route   GET /api/blog-posts/admin/all
// @access  Private
export const getAllPostsAdmin = async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .sort({ order: 1, publishedAt: -1, createdAt: -1 })
      .lean()

    res.json({ success: true, count: posts.length, data: posts })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching blog posts',
    })
  }
}

// @desc    Create post
// @route   POST /api/blog-posts
// @access  Private
export const createBlogPost = async (req, res) => {
  try {
    const maxOrder = await BlogPost.findOne().sort({ order: -1 }).select('order').lean()
    const nextOrder = (maxOrder?.order ?? -1) + 1

    const body = { ...req.body, order: req.body.order ?? nextOrder }
    const post = await BlogPost.create(body)

    res.status(201).json({ success: true, data: post })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A post with this slug already exists. Change the slug.',
      })
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating post',
    })
  }
}

// @desc    Update post
// @route   PUT /api/blog-posts/:id
// @access  Private
export const updateBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }

    res.json({ success: true, data: post })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A post with this slug already exists.',
      })
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating post',
    })
  }
}

// @desc    Delete post
// @route   DELETE /api/blog-posts/:id
// @access  Private
export const deleteBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id)
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }
    res.json({ success: true, message: 'Post deleted' })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting post',
    })
  }
}
