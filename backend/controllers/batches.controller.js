import Batch from '../models/Batch.model.js'

// @desc    Get all batches
// @route   GET /api/batches
// @access  Public
export const getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: 1 })

    res.json({
      success: true,
      count: batches.length,
      data: batches
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching batches'
    })
  }
}

// @desc    Get single batch
// @route   GET /api/batches/:id
// @access  Public
export const getBatch = async (req, res) => {
  try {
    const batch = await Batch.findOne({ id: req.params.id })

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      })
    }

    res.json({
      success: true,
      data: batch
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching batch'
    })
  }
}

// @desc    Create or update batch
// @route   POST /api/batches
// @access  Private
export const createOrUpdateBatch = async (req, res) => {
  try {
    const { id } = req.body

    const batch = await Batch.findOneAndUpdate(
      { id },
      req.body,
      { new: true, upsert: true, runValidators: true }
    )

    res.json({
      success: true,
      message: 'Batch saved successfully',
      data: batch
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error saving batch'
    })
  }
}

// @desc    Update batch
// @route   PUT /api/batches/:id
// @access  Private
export const updateBatch = async (req, res) => {
  try {
    const batch = await Batch.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    )

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      })
    }

    res.json({
      success: true,
      message: 'Batch updated successfully',
      data: batch
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating batch'
    })
  }
}

// @desc    Delete batch
// @route   DELETE /api/batches/:id
// @access  Private
export const deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findOneAndDelete({ id: req.params.id })

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      })
    }

    res.json({
      success: true,
      message: 'Batch deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting batch'
    })
  }
}
