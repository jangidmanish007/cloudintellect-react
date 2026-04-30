import WebinarTopic from '../models/WebinarTopic.model.js'
import WhoShouldAttend from '../models/WhoShouldAttend.model.js'

// ========== Webinar Topics ==========

export const getAllWebinarTopics = async (req, res) => {
  try {
    const topics = await WebinarTopic.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })

    res.json({
      success: true,
      count: topics.length,
      data: topics
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching webinar topics'
    })
  }
}

export const createWebinarTopic = async (req, res) => {
  try {
    const topic = await WebinarTopic.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Webinar topic created successfully',
      data: topic
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating webinar topic'
    })
  }
}

export const updateWebinarTopic = async (req, res) => {
  try {
    const topic = await WebinarTopic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Webinar topic not found'
      })
    }

    res.json({
      success: true,
      message: 'Webinar topic updated successfully',
      data: topic
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating webinar topic'
    })
  }
}

export const deleteWebinarTopic = async (req, res) => {
  try {
    const topic = await WebinarTopic.findByIdAndDelete(req.params.id)

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Webinar topic not found'
      })
    }

    res.json({
      success: true,
      message: 'Webinar topic deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting webinar topic'
    })
  }
}

// ========== Who Should Attend ==========

export const getAllWhoShouldAttend = async (req, res) => {
  try {
    const attendees = await WhoShouldAttend.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })

    res.json({
      success: true,
      count: attendees.length,
      data: attendees
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching who should attend'
    })
  }
}

export const createWhoShouldAttend = async (req, res) => {
  try {
    const attendee = await WhoShouldAttend.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Who should attend item created successfully',
      data: attendee
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating who should attend item'
    })
  }
}

export const updateWhoShouldAttend = async (req, res) => {
  try {
    const attendee = await WhoShouldAttend.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!attendee) {
      return res.status(404).json({
        success: false,
        message: 'Who should attend item not found'
      })
    }

    res.json({
      success: true,
      message: 'Who should attend item updated successfully',
      data: attendee
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating who should attend item'
    })
  }
}

export const deleteWhoShouldAttend = async (req, res) => {
  try {
    const attendee = await WhoShouldAttend.findByIdAndDelete(req.params.id)

    if (!attendee) {
      return res.status(404).json({
        success: false,
        message: 'Who should attend item not found'
      })
    }

    res.json({
      success: true,
      message: 'Who should attend item deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting who should attend item'
    })
  }
}
