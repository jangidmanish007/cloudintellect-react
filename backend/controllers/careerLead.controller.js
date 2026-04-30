import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import CareerLead from '../models/CareerLead.model.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure resumes directory exists
const resumesDir = path.join(__dirname, '../uploads/career-resumes')
if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir, { recursive: true })
}

// Multer storage for resumes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumesDir)
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now()
    const random = Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    const safeBase = (file.originalname || 'resume')
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9.-]/g, '')
      .slice(0, 40)
    cb(null, `${safeBase}-${timestamp}-${random}${ext}`)
  },
})

// Allow common resume file types
const fileFilter = (req, file, cb) => {
  const allowedExt = /pdf|doc|docx|rtf|txt/
  const extname = allowedExt.test(path.extname(file.originalname).toLowerCase())

  if (extname) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Allowed: pdf, doc, docx, rtf, txt'))
  }
}

export const uploadResumeMiddleware = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_RESUME_FILE_SIZE, 10) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter,
}).single('resume')

// @desc    Submit a new career lead (public)
// @route   POST /api/career-leads/submit
// @access  Public
export const submitCareerLead = async (req, res) => {
  try {
    const { name, email, phone, experience, openingTitle, openingIdentifier, source } = req.body

    if (!name || !email || !phone || !experience) {
      return res.status(400).json({
        success: false,
        message: 'Name, Email, Phone, and Experience are required',
      })
    }

    const experienceYears = Number(experience)
    if (Number.isNaN(experienceYears) || experienceYears < 0) {
      return res.status(400).json({
        success: false,
        message: 'Experience must be a non-negative number',
      })
    }

    let resumePath = ''
    if (req.file) {
      resumePath = `/uploads/career-resumes/${req.file.filename}`.replace(/\/+/g, '/')
    }

    const lead = await CareerLead.create({
      name,
      email,
      phone,
      experienceYears,
      resumePath,
      openingTitle: openingTitle || '',
      openingIdentifier: openingIdentifier || '',
      source: source || 'career-page',
    })

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        id: lead._id,
      },
    })
  } catch (error) {
    console.error('Career lead submission error:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Error submitting application',
    })
  }
}

// @desc    Get all career leads (admin)
// @route   GET /api/career-leads
// @access  Private
export const getCareerLeads = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const query = status ? { status } : {}

    const leads = await CareerLead.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .select('-__v')

    const total = await CareerLead.countDocuments(query)

    return res.json({
      success: true,
      data: leads,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get career leads error:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching career leads',
    })
  }
}

// @desc    Update a career lead (status/notes)
// @route   PUT /api/career-leads/:id
// @access  Private
export const updateCareerLead = async (req, res) => {
  try {
    const { status, notes } = req.body

    const lead = await CareerLead.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(notes !== undefined && { notes }) },
      { new: true, runValidators: true },
    )

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Career lead not found',
      })
    }

    return res.json({
      success: true,
      message: 'Career lead updated successfully',
      data: lead,
    })
  } catch (error) {
    console.error('Update career lead error:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating career lead',
    })
  }
}

// @desc    Delete a career lead
// @route   DELETE /api/career-leads/:id
// @access  Private
export const deleteCareerLead = async (req, res) => {
  try {
    const lead = await CareerLead.findByIdAndDelete(req.params.id)

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Career lead not found',
      })
    }

    return res.json({
      success: true,
      message: 'Career lead deleted successfully',
    })
  } catch (error) {
    console.error('Delete career lead error:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting career lead',
    })
  }
}

