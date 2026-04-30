import Page from '../models/Page.model.js'

// @desc    Get all pages
// @route   GET /api/pages
// @access  Public
export const getAllPages = async (req, res) => {
  try {
    const pages = await Page.find().sort({ order: 1, createdAt: -1 })

    res.json({
      success: true,
      count: pages.length,
      data: pages
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching pages'
    })
  }
}

// @desc    Get pages for navbar
// @route   GET /api/pages/navbar
// @access  Public
export const getNavbarPages = async (req, res) => {
  try {
    const pages = await Page.find({ 
      isActive: true, 
      showInNavbar: true 
    })
      .sort({ navbarOrder: 1, order: 1 })
      .select('slug title navbarLabel')

    res.json({
      success: true,
      count: pages.length,
      data: pages
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching navbar pages'
    })
  }
}

// @desc    Get single page by slug
// @route   GET /api/pages/:slug
// @access  Public
export const getPageBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug })

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      })
    }

    res.json({
      success: true,
      data: page
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching page'
    })
  }
}

// @desc    Get single page by ID
// @route   GET /api/pages/id/:id
// @access  Public
export const getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id)

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      })
    }

    res.json({
      success: true,
      data: page
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching page'
    })
  }
}

// @desc    Create page
// @route   POST /api/pages
// @access  Private
export const createPage = async (req, res) => {
  try {
    const page = await Page.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Page created successfully',
      data: page
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating page'
    })
  }
}

// @desc    Update page
// @route   PUT /api/pages/:id
// @access  Private
export const updatePage = async (req, res) => {
  try {
    const page = await Page.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      })
    }

    res.json({
      success: true,
      message: 'Page updated successfully',
      data: page
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating page'
    })
  }
}

// @desc    Delete page
// @route   DELETE /api/pages/:id
// @access  Private
export const deletePage = async (req, res) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id)

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      })
    }

    res.json({
      success: true,
      message: 'Page deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting page'
    })
  }
}
