import Alumni from '../models/Alumni.model.js'

// @desc    Get all alumni
// @route   GET /api/alumni
// @access  Public
export const getAllAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })

    res.json({
      success: true,
      count: alumni.length,
      data: alumni
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching alumni'
    })
  }
}

// @desc    Get single alumnus
// @route   GET /api/alumni/:id
// @access  Public
export const getAlumnus = async (req, res) => {
  try {
    const alumnus = await Alumni.findById(req.params.id)

    if (!alumnus) {
      return res.status(404).json({
        success: false,
        message: 'Alumnus not found'
      })
    }

    res.json({
      success: true,
      data: alumnus
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching alumnus'
    })
  }
}

// @desc    Create new alumnus
// @route   POST /api/alumni
// @access  Private
export const createAlumnus = async (req, res) => {
  try {
    const alumnus = await Alumni.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Alumnus created successfully',
      data: alumnus
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating alumnus'
    })
  }
}

// @desc    Update alumnus
// @route   PUT /api/alumni/:id
// @access  Private
export const updateAlumnus = async (req, res) => {
  try {
    const alumnus = await Alumni.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!alumnus) {
      return res.status(404).json({
        success: false,
        message: 'Alumnus not found'
      })
    }

    res.json({
      success: true,
      message: 'Alumnus updated successfully',
      data: alumnus
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating alumnus'
    })
  }
}

// @desc    Delete alumnus
// @route   DELETE /api/alumni/:id
// @access  Private
export const deleteAlumnus = async (req, res) => {
  try {
    const alumnus = await Alumni.findByIdAndDelete(req.params.id)

    if (!alumnus) {
      return res.status(404).json({
        success: false,
        message: 'Alumnus not found'
      })
    }

    res.json({
      success: true,
      message: 'Alumnus deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting alumnus'
    })
  }
}

// @desc    Reorder alumni
// @route   PUT /api/alumni/reorder
// @access  Private
export const reorderAlumni = async (req, res) => {
  try {
    const { alumni } = req.body // Array of { id, order }

    if (!Array.isArray(alumni)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid alumni order data'
      })
    }

    const updatePromises = alumni.map(({ id, order }) =>
      Alumni.findByIdAndUpdate(id, { order }, { new: true })
    )

    await Promise.all(updatePromises)

    res.json({
      success: true,
      message: 'Alumni reordered successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error reordering alumni'
    })
  }
}
