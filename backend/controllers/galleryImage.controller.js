import GalleryImage from '../models/GalleryImage.model.js'
import GalleryCategory from '../models/GalleryCategory.model.js'

// @desc    Get all images (filtered by category if provided)
// @route   GET /api/gallery/images?category=categoryId
// @access  Public
export const getAllImages = async (req, res) => {
  try {
    const { category } = req.query
    const query = { isActive: true }
    
    if (category && category !== 'all') {
      query.category = category
    }

    const images = await GalleryImage.find(query)
      .populate('category', 'name slug')
      .sort({ order: 1, createdAt: -1 })

    res.json({
      success: true,
      count: images.length,
      data: images
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching images'
    })
  }
}

// @desc    Get all images (admin - includes inactive)
// @route   GET /api/gallery/images/admin
// @access  Private
export const getAllImagesAdmin = async (req, res) => {
  try {
    const images = await GalleryImage.find()
      .populate('category', 'name slug')
      .sort({ order: 1, createdAt: -1 })

    res.json({
      success: true,
      count: images.length,
      data: images
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching images'
    })
  }
}

// @desc    Get single image
// @route   GET /api/gallery/images/:id
// @access  Public
export const getImage = async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id)
      .populate('category', 'name slug')

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      })
    }

    res.json({
      success: true,
      data: image
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching image'
    })
  }
}

// @desc    Create new image
// @route   POST /api/gallery/images
// @access  Private
export const createImage = async (req, res) => {
  try {
    const { category } = req.body
    
    // Verify category exists
    const categoryExists = await GalleryCategory.findById(category)
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      })
    }

    // Auto-assign next order for this category
    const maxOrderDoc = await GalleryImage.findOne({ category })
      .sort({ order: -1 })
      .select('order')
    const nextOrder = (maxOrderDoc?.order ?? -1) + 1

    const image = await GalleryImage.create({
      ...req.body,
      order: nextOrder
    })

    const populatedImage = await GalleryImage.findById(image._id)
      .populate('category', 'name slug')

    res.status(201).json({
      success: true,
      message: 'Image created successfully',
      data: populatedImage
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating image'
    })
  }
}

// @desc    Update image
// @route   PUT /api/gallery/images/:id
// @access  Private
export const updateImage = async (req, res) => {
  try {
    const { category } = req.body
    
    // If category is being updated, verify it exists
    if (category) {
      const categoryExists = await GalleryCategory.findById(category)
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        })
      }
    }

    const image = await GalleryImage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name slug')

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      })
    }

    res.json({
      success: true,
      message: 'Image updated successfully',
      data: image
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating image'
    })
  }
}

// @desc    Delete image
// @route   DELETE /api/gallery/images/:id
// @access  Private
export const deleteImage = async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndDelete(req.params.id)

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      })
    }

    res.json({
      success: true,
      message: 'Image deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting image'
    })
  }
}

// @desc    Reorder images
// @route   PUT /api/gallery/images/reorder
// @access  Private
export const reorderImages = async (req, res) => {
  try {
    const { images } = req.body

    if (!Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid images order data'
      })
    }

    const updatePromises = images.map(({ id, order }) =>
      GalleryImage.findByIdAndUpdate(id, { order }, { new: true })
    )

    await Promise.all(updatePromises)

    res.json({
      success: true,
      message: 'Images reordered successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error reordering images'
    })
  }
}
