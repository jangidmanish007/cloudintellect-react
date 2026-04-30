import Testimonial from '../models/Testimonial.model.js'

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching testimonials'
    })
  }
}

// @desc    Get all testimonials (admin - includes inactive)
// @route   GET /api/testimonials/admin
// @access  Private
export const getAllTestimonialsAdmin = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ order: 1, createdAt: -1 })

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching testimonials'
    })
  }
}

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
export const getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id)

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      })
    }

    res.json({
      success: true,
      data: testimonial
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching testimonial'
    })
  }
}

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private
export const createTestimonial = async (req, res) => {
  try {
    // Auto-assign next order
    const maxOrderDoc = await Testimonial.findOne().sort({ order: -1 }).select('order')
    const nextOrder = (maxOrderDoc?.order ?? -1) + 1
    const body = { ...req.body, order: nextOrder }

    const testimonial = await Testimonial.create(body)

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating testimonial'
    })
  }
}

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private
export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      })
    }

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating testimonial'
    })
  }
}

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id)

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      })
    }

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting testimonial'
    })
  }
}

// @desc    Reorder testimonials
// @route   PUT /api/testimonials/reorder
// @access  Private
export const reorderTestimonials = async (req, res) => {
  try {
    const { testimonials } = req.body

    if (!Array.isArray(testimonials)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid testimonials order data'
      })
    }

    const updatePromises = testimonials.map(({ id, order }) =>
      Testimonial.findByIdAndUpdate(id, { order }, { new: true })
    )

    await Promise.all(updatePromises)

    res.json({
      success: true,
      message: 'Testimonials reordered successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error reordering testimonials'
    })
  }
}
