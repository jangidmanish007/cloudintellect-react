import { postToMediaGhar } from '../services/mediaGharClient.js'

const ALLOWED_PRODUCTS = new Set(['SFDC', 'SFMC'])

/** @param {string} ymd - YYYY-MM-DD from HTML date input */
function ymdToDmy(ymd) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(ymd).trim())
  if (!m) return null
  const [, y, mo, d] = m
  return `${d}/${mo}/${y}`
}

// @desc    Submit home hero application to Salesforce CRM (MediaGhar Apex REST)
// @route   POST /api/hero-application/submit
// @access  Public
export const submitHeroApplication = async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, city, product } = req.body

    if (!name || !email || !phone || !dateOfBirth || !city || !product) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      })
    }

    if (!ALLOWED_PRODUCTS.has(String(product).trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid course (SFDC or SFMC)',
      })
    }

    const dob = ymdToDmy(dateOfBirth)
    if (!dob) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date of birth',
      })
    }

    const payload = {
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      dob,
      city: String(city).trim(),
      product: String(product).trim(),
    }

    try {
      const { parsed } = await postToMediaGhar(payload)
      res.status(201).json({
        success: true,
        message: 'Thank you! Your application has been submitted.',
        data: parsed,
      })
    } catch (err) {
      if (err.code === 'MEDIAGHAR_NETWORK') {
        console.error('Hero application Salesforce request failed:', err.message)
        return res.status(503).json({
          success: false,
          message:
            'We could not reach our enrollment system. Please try again in a few minutes or contact us by phone.',
        })
      }
      if (err.code === 'MEDIAGHAR_SF_ERROR') {
        console.error(
          'Salesforce MediaGhar error',
          err.status,
          err.rawBody?.slice(0, 500)
        )
        return res.status(503).json({
          success: false,
          message:
            'We could not complete your application. Please try again or contact us directly.',
          ...(process.env.NODE_ENV === 'development' && {
            details: { status: err.status, body: err.parsed },
          }),
        })
      }
      throw err
    }
  } catch (error) {
    console.error('Hero application error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting application',
    })
  }
}
