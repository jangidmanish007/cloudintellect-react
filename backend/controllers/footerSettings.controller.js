import FooterSettings from '../models/FooterSettings.model.js'

// @desc    Get footer settings
// @route   GET /api/footer-settings
// @access  Public
export const getFooterSettings = async (req, res) => {
  try {
    const settings = await FooterSettings.getSettings()
    res.json({ success: true, data: settings })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching footer settings'
    })
  }
}

// @desc    Update footer settings
// @route   PUT /api/footer-settings
// @access  Private
export const updateFooterSettings = async (req, res) => {
  try {
    let settings = await FooterSettings.findOne()

    if (!settings) {
      settings = await FooterSettings.create(req.body)
    } else {
      settings = await FooterSettings.findOneAndUpdate(
        {},
        req.body,
        { new: true, runValidators: true, upsert: true }
      )
    }

    res.json({
      success: true,
      message: 'Footer settings updated successfully',
      data: settings
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating footer settings'
    })
  }
}

