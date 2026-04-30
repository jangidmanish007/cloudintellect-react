import HeaderSettings from '../models/HeaderSettings.model.js'

// @desc    Get header settings
// @route   GET /api/header-settings
// @access  Public
export const getHeaderSettings = async (req, res) => {
  try {
    const settings = await HeaderSettings.getSettings()
    
    res.json({
      success: true,
      data: settings
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching header settings'
    })
  }
}

// @desc    Update header settings
// @route   PUT /api/header-settings
// @access  Private
export const updateHeaderSettings = async (req, res) => {
  try {
    let settings = await HeaderSettings.findOne()
    
    if (!settings) {
      settings = await HeaderSettings.create(req.body)
    } else {
      settings = await HeaderSettings.findOneAndUpdate(
        {},
        req.body,
        { new: true, runValidators: true, upsert: true }
      )
    }

    res.json({
      success: true,
      message: 'Header settings updated successfully',
      data: settings
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating header settings'
    })
  }
}
