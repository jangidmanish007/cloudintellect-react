import HeaderCarousel from '../models/HeaderCarousel.model.js'

// @desc    Get all header carousel slides
// @route   GET /api/header-carousel
// @access  Public
export const getAllCarouselSlides = async (req, res) => {
  try {
    const slides = await HeaderCarousel.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })

    res.json({
      success: true,
      count: slides.length,
      data: slides
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching carousel slides'
    })
  }
}

// @desc    Get all carousel slides (including inactive) - Admin only
// @route   GET /api/header-carousel/all
// @access  Private
export const getAllCarouselSlidesAdmin = async (req, res) => {
  try {
    const slides = await HeaderCarousel.find()
      .sort({ order: 1, createdAt: 1 })

    res.json({
      success: true,
      count: slides.length,
      data: slides
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching carousel slides'
    })
  }
}

// @desc    Get single carousel slide
// @route   GET /api/header-carousel/:id
// @access  Private
export const getCarouselSlide = async (req, res) => {
  try {
    const slide = await HeaderCarousel.findById(req.params.id)

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Carousel slide not found'
      })
    }

    res.json({
      success: true,
      data: slide
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching carousel slide'
    })
  }
}

// @desc    Create carousel slide
// @route   POST /api/header-carousel
// @access  Private
export const createCarouselSlide = async (req, res) => {
  try {
    const slide = await HeaderCarousel.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Carousel slide created successfully',
      data: slide
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating carousel slide'
    })
  }
}

// @desc    Update carousel slide
// @route   PUT /api/header-carousel/:id
// @access  Private
export const updateCarouselSlide = async (req, res) => {
  try {
    const slide = await HeaderCarousel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Carousel slide not found'
      })
    }

    res.json({
      success: true,
      message: 'Carousel slide updated successfully',
      data: slide
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating carousel slide'
    })
  }
}

// @desc    Delete carousel slide
// @route   DELETE /api/header-carousel/:id
// @access  Private
export const deleteCarouselSlide = async (req, res) => {
  try {
    const slide = await HeaderCarousel.findByIdAndDelete(req.params.id)

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Carousel slide not found'
      })
    }

    res.json({
      success: true,
      message: 'Carousel slide deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting carousel slide'
    })
  }
}

// @desc    Reorder carousel slides
// @route   PUT /api/header-carousel/reorder
// @access  Private
export const reorderCarouselSlides = async (req, res) => {
  try {
    const { slides } = req.body

    if (!Array.isArray(slides)) {
      return res.status(400).json({
        success: false,
        message: 'Slides must be an array'
      })
    }

    const updatePromises = slides.map((slide, index) =>
      HeaderCarousel.findByIdAndUpdate(
        slide._id || slide.id,
        { order: index },
        { new: true }
      )
    )

    await Promise.all(updatePromises)

    res.json({
      success: true,
      message: 'Carousel slides reordered successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error reordering carousel slides'
    })
  }
}
