import Placement from '../models/Placement.model.js'

// @desc    Get all placements
// @route   GET /api/placements
// @access  Public
export const getAllPlacements = async (req, res) => {
  try {
    const placements = await Placement.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })

    res.json({
      success: true,
      count: placements.length,
      data: placements
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching placements'
    })
  }
}

// @desc    Get single placement
// @route   GET /api/placements/:id
// @access  Public
export const getPlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id)

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: 'Placement not found'
      })
    }

    res.json({
      success: true,
      data: placement
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching placement'
    })
  }
}

// @desc    Create new placement
// @route   POST /api/placements
// @access  Private
export const createPlacement = async (req, res) => {
  try {
    // Auto-assign next order so new placements appear in sequence
    const maxOrderDoc = await Placement.findOne().sort({ order: -1 }).select('order')
    const nextOrder = (maxOrderDoc?.order ?? -1) + 1
    const body = { ...req.body, order: nextOrder }

    const placement = await Placement.create(body)

    res.status(201).json({
      success: true,
      message: 'Placement created successfully',
      data: placement
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating placement'
    })
  }
}

// @desc    Update placement
// @route   PUT /api/placements/:id
// @access  Private
export const updatePlacement = async (req, res) => {
  try {
    const placement = await Placement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: 'Placement not found'
      })
    }

    res.json({
      success: true,
      message: 'Placement updated successfully',
      data: placement
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating placement'
    })
  }
}

// @desc    Delete placement
// @route   DELETE /api/placements/:id
// @access  Private
export const deletePlacement = async (req, res) => {
  try {
    const placement = await Placement.findByIdAndDelete(req.params.id)

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: 'Placement not found'
      })
    }

    res.json({
      success: true,
      message: 'Placement deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting placement'
    })
  }
}

// @desc    Reorder placements
// @route   PUT /api/placements/reorder
// @access  Private
export const reorderPlacements = async (req, res) => {
  try {
    const { placements } = req.body // Array of { id, order }

    if (!Array.isArray(placements)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid placements order data'
      })
    }

    const updatePromises = placements.map(({ id, order }) =>
      Placement.findByIdAndUpdate(id, { order }, { new: true })
    )

    await Promise.all(updatePromises)

    res.json({
      success: true,
      message: 'Placements reordered successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error reordering placements'
    })
  }
}
