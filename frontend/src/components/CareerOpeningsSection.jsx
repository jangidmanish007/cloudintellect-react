import { useEffect, useState } from 'react'
import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

const ICON_BASE = '/images/career-icons'

function url(path) {
  if (!path) return ''
  if (path.startsWith('/')) return getImageUrl(path)
  if (path.includes('images/')) return getImageUrl(path)
  return `${ICON_BASE}/${path}`
}

const DEFAULT_OPENINGS = [
  {
    title: 'Salesforce Trainer',
    description: 'Deliver practical Salesforce training, guide students, and support certification + placement readiness.',
    linkText: 'Apply Now',
    linkHref: '#apply-salesforce-trainer',
    icon: `${ICON_BASE}/briefcase.svg`,
  },
  {
    title: 'Academic Counsellor',
    description: 'Help students choose the right career path and guide them through admissions and learning journeys.',
    linkText: 'Apply Now',
    linkHref: '#apply-academic-counsellor',
    icon: `${ICON_BASE}/briefcase.svg`,
  },
  {
    title: 'Digital Marketing Exec.',
    description: 'Plan and execute campaigns across Meta, Google, and content platforms to generate quality leads.',
    linkText: 'Apply Now',
    linkHref: '#apply-digital-marketing',
    icon: `${ICON_BASE}/briefcase.svg`,
  },
  {
    title: 'Content & Social Media Exec.',
    description: 'Create engaging reels, creatives, and educational content that drives awareness and trust.',
    linkText: 'Apply Now',
    linkHref: '#apply-content-social',
    icon: `${ICON_BASE}/briefcase.svg`,
  },
  {
    title: 'Placement Coordinator',
    description: 'Provide resume and interview guidance, career counselling, and connect graduates with our industry partners.',
    linkText: 'Apply Now',
    linkHref: '#apply-placement-coordinator',
    icon: `${ICON_BASE}/briefcase.svg`,
  },
  {
    title: "Don't see a fit?",
    description: 'Send us your resume anyway. We are always looking for great talent.',
    linkText: 'Drop Resume',
    linkHref: '#drop-resume',
    icon: `${ICON_BASE}/upload.svg`,
  },
]

function CareerOpeningsSection() {
  const { content } = usePageContentContext()
  const d = content?.openings || {}
  const heading = d.heading ?? 'Current Openings'
  const openings = Array.isArray(d.openings) && d.openings.length > 0 ? d.openings : DEFAULT_OPENINGS

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
  })
  const [resumeFile, setResumeFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState(null)
  const [submitError, setSubmitError] = useState(null)

  const handleApplyClick = (job) => {
    setSelectedJob(job)
    setSubmitMessage(null)
    setSubmitError(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    if (submitting) return
    setIsModalOpen(false)
  }

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0]
    setResumeFile(file || null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitMessage(null)
    setSubmitError(null)

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5002/api'
      const form = new FormData()
      form.append('name', formData.name)
      form.append('email', formData.email)
      form.append('phone', formData.phone)
      form.append('experience', formData.experience)
      if (selectedJob?.title) form.append('openingTitle', selectedJob.title)
      if (selectedJob?.linkHref) form.append('openingIdentifier', selectedJob.linkHref)
      form.append('source', 'career-page')
      if (resumeFile) {
        form.append('resume', resumeFile)
      }

      const response = await fetch(`${apiBase}/career-leads/submit`, {
        method: 'POST',
        body: form,
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Failed to submit application. Please try again.')
      }

      setSubmitMessage('Thank you! Your application has been submitted.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        experience: '',
      })
      setResumeFile(null)
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    const handleExternalApply = (event) => {
      const detail = event?.detail || {}
      const job = {
        title: detail.title || 'General Application',
        linkHref: detail.identifier || '#career-hero-apply',
        linkText: 'Apply Now',
      }
      handleApplyClick(job)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('career-openings-apply', handleExternalApply)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('career-openings-apply', handleExternalApply)
      }
    }
  }, [])

  return (
    <section className="career-openings-section" id="open-positions">
      <div className="career-openings-inner">
        <h2 className="career-openings-heading">{heading}</h2>
        <div className="career-openings-grid">
          {openings.map((job, i) => {
            const iconPath = job.icon || ''
            const iconUrl = iconPath ? url(iconPath) : ''
            const isAlt = job.variant === 'alt' || i === openings.length - 1
            return (
              <article
                key={i}
                className={`career-opening-card ${isAlt ? 'career-opening-card--alt' : ''}`}
              >
                <div className="career-opening-icon-wrap">
                  {iconUrl && (
                    <img
                      src={iconUrl}
                      alt=""
                      width={24}
                      height={24}
                      className="career-opening-icon"
                      aria-hidden
                    />
                  )}
                </div>
                <h3 className="career-opening-title">{job.title}</h3>
                <p className="career-opening-description">{job.description}</p>
                {job.linkText && (
                  <button
                    type="button"
                    className="career-opening-link"
                    onClick={() => handleApplyClick(job)}
                  >
                    {job.linkText} <span aria-hidden>→</span>
                  </button>
                )}
              </article>
            )
          })}
        </div>
      </div>

      {isModalOpen && (
        <div className="career-apply-modal-backdrop" role="dialog" aria-modal="true">
          <div className="career-apply-modal">
            <button
              type="button"
              className="career-apply-modal-close"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="career-apply-modal-heading">Apply Now</h3>
            {selectedJob?.title && (
              <p className="career-apply-modal-subheading">
                Applying for <strong>{selectedJob.title}</strong>
              </p>
            )}
            <form className="career-apply-form" onSubmit={handleSubmit}>
              <div className="career-apply-form-row">
                <label className="career-apply-label">
                  Name
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFieldChange}
                    required
                    className="career-apply-input"
                  />
                </label>
              </div>
              <div className="career-apply-form-row">
                <label className="career-apply-label">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFieldChange}
                    required
                    className="career-apply-input"
                  />
                </label>
              </div>
              <div className="career-apply-form-row">
                <label className="career-apply-label">
                  Phone
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFieldChange}
                    required
                    className="career-apply-input"
                  />
                </label>
              </div>
              <div className="career-apply-form-row">
                <label className="career-apply-label">
                  Experience (in years)
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleFieldChange}
                    required
                    min="0"
                    step="0.5"
                    className="career-apply-input"
                  />
                </label>
              </div>
              <div className="career-apply-form-row">
                <label className="career-apply-label">
                  Resume Upload
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx,.rtf,.txt"
                    onChange={handleResumeChange}
                    className="career-apply-input"
                  />
                </label>
              </div>

              {submitError && (
                <div className="career-apply-status career-apply-status--error">
                  {submitError}
                </div>
              )}
              {submitMessage && (
                <div className="career-apply-status career-apply-status--success">
                  {submitMessage}
                </div>
              )}

              <div className="career-apply-actions">
                <button
                  type="button"
                  className="career-apply-secondary"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="career-apply-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting…' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default CareerOpeningsSection

