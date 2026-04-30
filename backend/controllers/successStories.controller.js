import SuccessStory from '../models/SuccessStory.model.js'

// @desc    Get all success stories
// @route   GET /api/success-stories
// @access  Public
export const getAllSuccessStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })

    res.json({
      success: true,
      count: stories.length,
      data: stories
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching success stories'
    })
  }
}

// @desc    Get single success story
// @route   GET /api/success-stories/:id
// @access  Public
export const getSuccessStory = async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id)

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Success story not found'
      })
    }

    res.json({
      success: true,
      data: story
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching success story'
    })
  }
}

// @desc    Create success story
// @route   POST /api/success-stories
// @access  Private
export const createSuccessStory = async (req, res) => {
  try {
    const story = await SuccessStory.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Success story created successfully',
      data: story
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating success story'
    })
  }
}

// @desc    Update success story
// @route   PUT /api/success-stories/:id
// @access  Private
export const updateSuccessStory = async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Success story not found'
      })
    }

    res.json({
      success: true,
      message: 'Success story updated successfully',
      data: story
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating success story'
    })
  }
}

// @desc    Delete success story
// @route   DELETE /api/success-stories/:id
// @access  Private
export const deleteSuccessStory = async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndDelete(req.params.id)

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Success story not found'
      })
    }

    res.json({
      success: true,
      message: 'Success story deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting success story'
    })
  }
}

// @desc    Reorder success stories
// @route   PUT /api/success-stories/reorder
// @access  Private
export const reorderSuccessStories = async (req, res) => {
  try {
    const { stories } = req.body

    if (!Array.isArray(stories)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stories order data'
      })
    }

    const updatePromises = stories.map(({ id, order }) =>
      SuccessStory.findByIdAndUpdate(id, { order }, { new: true })
    )

    await Promise.all(updatePromises)

    res.json({
      success: true,
      message: 'Success stories reordered successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error reordering success stories'
    })
  }
}
