import GalleryCategory from '../models/GalleryCategory.model.js'

// @desc    Get all categories
// @route   GET /api/gallery/categories
// @access  Public
export const getAllCategories = async (req, res) => {
  try {
    const categories = await GalleryCategory.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })

    res.json({
      success: true,
      count: categories.length,
      data: categories
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching categories'
    })
  }
}

// @desc    Get all categories (admin - includes inactive)
// @route   GET /api/gallery/categories/admin
// @access  Private
export const getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await GalleryCategory.find()
      .sort({ order: 1, createdAt: -1 })

    res.json({
      success: true,
      count: categories.length,
      data: categories
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching categories'
    })
  }
}

// @desc    Get single category
// @route   GET /api/gallery/categories/:id
// @access  Public
export const getCategory = async (req, res) => {
  try {
    const category = await GalleryCategory.findById(req.params.id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }

    res.json({
      success: true,
      data: category
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching category'
    })
  }
}

// @desc    Create new category
// @route   POST /api/gallery/categories
// @access  Private
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      })
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // Auto-assign next order
    const maxOrderDoc = await GalleryCategory.findOne().sort({ order: -1 }).select('order')
    const nextOrder = (maxOrderDoc?.order ?? -1) + 1

    const category = await GalleryCategory.create({
      name,
      slug,
      order: nextOrder
    })

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating category'
    })
  }
}

// @desc    Update category
// @route   PUT /api/gallery/categories/:id
// @access  Private
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body
    const updateData = { ...req.body }

    // If name changed, update slug
    if (name) {
      updateData.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }

    const category = await GalleryCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating category'
    })
  }
}

// @desc    Delete category
// @route   DELETE /api/gallery/categories/:id
// @access  Private
export const deleteCategory = async (req, res) => {
  try {
    const category = await GalleryCategory.findByIdAndDelete(req.params.id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting category'
    })
  }
}

// @desc    Reorder categories
// @route   PUT /api/gallery/categories/reorder
// @access  Private
export const reorderCategories = async (req, res) => {
  try {
    const { categories } = req.body

    if (!Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid categories order data'
      })
    }

    const updatePromises = categories.map(({ id, order }) =>
      GalleryCategory.findByIdAndUpdate(id, { order }, { new: true })
    )

    await Promise.all(updatePromises)

    res.json({
      success: true,
      message: 'Categories reordered successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error reordering categories'
    })
  }
}
