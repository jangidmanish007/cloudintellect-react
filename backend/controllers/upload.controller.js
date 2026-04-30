import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Public images directory (for webinars icons)
// Note: frontend assets live in ../frontend/public after repo restructuring
const publicImagesDir = path.join(__dirname, '../../frontend/public/images')
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true })
}

// Configure multer storage with dynamic destination
// Note: req.body might not be available in destination callback when using FormData
// So we'll use a temporary location and move files in the controller
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use a temporary directory - we'll move files to correct location in the controller
    // This is because req.body.folder might not be parsed yet
    const tempDir = path.join(uploadsDir, 'temp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    cb(null, tempDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const fieldname = file.fieldname || 'file'
    const filename = fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    console.log('Multer filename:', { fieldname, uniqueSuffix, originalname: file.originalname, filename })
    cb(null, filename)
  }
})

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Only image files are allowed!'))
  }
}

export const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 // 5MB default
  },
  fileFilter
})

// @desc    Upload single file
// @route   POST /api/upload
// @access  Private
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      })
    }

    const folder = req.body.folder || req.file.fieldname || 'general'
    
    console.log('Upload request:', {
      folder,
      tempPath: req.file.path,
      filename: req.file.filename,
      body: req.body
    })

    // Determine final destination based on folder
    let finalDir
    let filePath
    
    if (folder.startsWith('images/')) {
      const subFolder = folder.replace('images/', '')
      finalDir = path.join(publicImagesDir, subFolder)
      filePath = `/images/${subFolder}/${req.file.filename}`.replace(/\/+/g, '/')
    } else {
      finalDir = path.join(uploadsDir, folder)
      filePath = `/uploads/${folder}/${req.file.filename}`.replace(/\/+/g, '/')
    }

    // Ensure destination directory exists
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true })
      console.log('Created destination directory:', finalDir)
    }

    // Move file from temp location to final destination
    const finalPath = path.join(finalDir, req.file.filename)
    fs.renameSync(req.file.path, finalPath)
    console.log('File moved from', req.file.path, 'to', finalPath)

    // Verify file actually exists at final location
    const fileExists = fs.existsSync(finalPath)
    const fileStats = fileExists ? fs.statSync(finalPath) : null

    // Log for debugging
    console.log('File uploaded:', {
      folder,
      filename: req.file.filename,
      tempPath: req.file.path,
      finalPath,
      publicPath: filePath,
      fileExists,
      fileSize: fileStats?.size || 0,
      isFile: fileStats?.isFile() || false
    })

    if (!fileExists) {
      console.error('ERROR: File was not moved to final location!', finalPath)
      return res.status(500).json({
        success: false,
        message: 'File upload failed - file was not saved to final location'
      })
    }

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: filePath,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    // Try to clean up temp file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path)
      } catch (cleanupError) {
        console.error('Failed to cleanup temp file:', cleanupError)
      }
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading file'
    })
  }
}

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private
export const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      })
    }

    const folder = req.body.folder || 'general'
    const files = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: `/uploads/${folder}/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype
    }))

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      count: files.length,
      data: files
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading files'
    })
  }
}
