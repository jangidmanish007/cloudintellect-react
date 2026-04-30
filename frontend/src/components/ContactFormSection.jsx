import { useState } from 'react'
import { usePageContentContext } from '../contexts/PageContentContext'
import { contactAPI, getImageUrl } from '../services/api'

/** Contact form program dropdown — fixed for Salesforce CRM `product` field (not CMS-editable). */
const CONTACT_FORM_PROGRAMS = ['SFDC', 'SFMC']

function ContactFormSection() {
  const { content } = usePageContentContext()
  const contactInfo = content?.contactInfo || {}
  const locationsData = content?.locations || {}
  // Handle both { locations: [...] } and direct array formats
  const locations = Array.isArray(locationsData.locations) 
    ? locationsData.locations 
    : (Array.isArray(locationsData) ? locationsData : [])
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    program: '',
    message: ''
  })
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!consent) {
      setSubmitStatus({
        type: 'error',
        message: 'Please agree to receive notifications to submit the form.',
      })
      return
    }

    setSubmitting(true)
    setSubmitStatus(null)

    try {
      await contactAPI.submit({
        ...formData,
        consent,
      })
      setSubmitStatus({
        type: 'success',
        message: 'Thank you! We will get back to you within 24 hours.',
      })
      setFormData({
        fullName: '',
        phoneNumber: '',
        email: '',
        program: '',
        message: '',
      })
      setConsent(false)
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus({
        type: 'error',
        message:
          error.message ||
          'Network error. Please check your connection and try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const phoneNumbers = contactInfo.phoneNumbers || [
    { number: '+91 876-699-6944', label: 'Call Us' },
    { number: '+91 876-699-6945', label: 'Call Us' }
  ]
  const email = contactInfo.email || 'info@cloudintellect.in'
  const mapEmbedUrl = contactInfo.mapEmbedUrl || ''

  return (
    <section className="contact-form-section">
      <div className="contact-form-container">
        <div className="contact-form-layout">
          {/* Left Column - Contact Form */}
          <div className="contact-form-column">
            <div className="contact-form-card">
              <h2 className="contact-form-heading">Send us a message</h2>
              <p className="contact-form-description">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-row">
                  <div className="contact-form-field">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Full Name"
                      required
                      className="contact-form-input"
                    />
                  </div>
                  <div className="contact-form-field">
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      required
                      className="contact-form-input"
                    />
                  </div>
                </div>
                
                <div className="contact-form-field">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    className="contact-form-input"
                  />
                </div>
                
                <div className="contact-form-field">
                  <select
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    required
                    className="contact-form-select"
                  >
                    <option value="">Select a program</option>
                    {CONTACT_FORM_PROGRAMS.map((program, index) => (
                      <option key={index} value={program}>{program}</option>
                    ))}
                  </select>
                </div>
                
                <div className="contact-form-field">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    rows={6}
                    required
                    className="contact-form-textarea"
                  />
                </div>
                
                <p className="contact-form-consent">
                  By submitting this form, I agree to receive notifications from the Cloud Intellect in the form of SMS/E-mail/Call.
                </p>
                
                <div className="contact-form-checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                    className="contact-form-checkbox"
                  />
                  <label htmlFor="consent" className="contact-form-checkbox-label">
                    I agree to the terms above
                  </label>
                </div>
                
                {submitStatus && (
                  <div className={`contact-form-status contact-form-status--${submitStatus.type}`}>
                    {submitStatus.message}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="contact-form-submit"
                >
                  {submitting ? 'Submitting...' : 'APPLY NOW'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Contact Information & Locations */}
          <div className="contact-info-column">
            {/* Contact Information Block */}
            <div className="contact-info-card">
              <h3 className="contact-info-heading">Contact Information</h3>
              
              <div className="contact-info-items">
                {phoneNumbers.map((phone, index) => {
                  const phoneIcon = contactInfo.phoneIcon || ''
                  const phoneIconUrl = phoneIcon ? getImageUrl(phoneIcon) : null
                  
                  return (
                    <a
                      key={index}
                      href={`tel:${phone.number.replace(/\s+/g, '')}`}
                      className="contact-info-item"
                    >
                      <div className="contact-info-icon contact-info-icon--phone">
                        {phoneIconUrl ? (
                          <img 
                            src={phoneIconUrl} 
                            alt="Phone" 
                            style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                            onError={(e) => {
                              // Fallback to SVG if image fails to load
                              e.target.style.display = 'none'
                              const svg = e.target.nextSibling
                              if (svg) svg.style.display = 'block'
                            }}
                          />
                        ) : null}
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ display: phoneIconUrl ? 'none' : 'block' }}
                        >
                          <path d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C9.4 21 0 11.6 0 0.08C0 -0.52 0.48 -1 1.08 -1H4.08C4.68 -1 5.16 -0.52 5.16 0.08V3.08C5.16 3.68 4.68 4.16 4.08 4.16H1.08C1.08 13.6 8.4 20.92 17.84 20.92V17.92C17.84 17.32 18.32 16.84 18.92 16.84H21.92C22.52 16.84 23 17.32 23 17.92V20.92C23 21.52 22.52 22 21.92 22H18.92C8.4 22 0 13.6 0 3.08V0.08C0 -0.52 0.48 -1 1.08 -1H4.08C4.68 -1 5.16 -0.52 5.16 0.08V3.08C5.16 3.68 4.68 4.16 4.08 4.16H1.08C1.08 13.6 8.4 20.92 17.84 20.92V17.92C17.84 17.32 18.32 16.84 18.92 16.84H21.92C22.52 16.84 23 17.32 23 17.92Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="contact-info-content">
                        <div className="contact-info-value">{phone.number}</div>
                        <div className="contact-info-label">{phone.label}</div>
                      </div>
                    </a>
                  )
                })}
                
                {(() => {
                  const emailIcon = contactInfo.emailIcon || ''
                  const emailIconUrl = emailIcon ? getImageUrl(emailIcon) : null
                  
                  return (
                    <a
                      href={`mailto:${email}`}
                      className="contact-info-item"
                    >
                      <div className="contact-info-icon contact-info-icon--email">
                        {emailIconUrl ? (
                          <img 
                            src={emailIconUrl} 
                            alt="Email" 
                            style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                            onError={(e) => {
                              // Fallback to SVG if image fails to load
                              e.target.style.display = 'none'
                              const svg = e.target.nextSibling
                              if (svg) svg.style.display = 'block'
                            }}
                          />
                        ) : null}
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ display: emailIconUrl ? 'none' : 'block' }}
                        >
                          <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="contact-info-content">
                        <div className="contact-info-value">{email}</div>
                        <div className="contact-info-label">Email Us</div>
                      </div>
                    </a>
                  )
                })()}
              </div>

              {mapEmbedUrl && (
                <div className="contact-info-map">
                  <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="300"
                    style={{ border: 0, borderRadius: '12px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location Map"
                  />
                </div>
              )}
            </div>

            {/* Location Cards */}
            {locations.map((location, index) => {
              const defaultLocationIcon = '/images/Icon Container (3).svg'
              const locationIcon = location.icon || defaultLocationIcon
              const isDefaultIcon = locationIcon === defaultLocationIcon
              const locationIconUrl = locationIcon
                ? (isDefaultIcon && typeof window !== 'undefined'
                    ? `${window.location.origin}${encodeURI(locationIcon)}`
                    : getImageUrl(locationIcon))
                : null
              
              return (
                <div key={index} className="contact-location-card">
                  <div className="contact-location-icon">
                    {locationIconUrl ? (
                      <img 
                        src={locationIconUrl} 
                        alt="Location" 
                        style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                        onError={(e) => {
                          // Fallback to SVG if image fails to load
                          e.target.style.display = 'none'
                          const svg = e.target.nextSibling
                          if (svg) svg.style.display = 'block'
                        }}
                      />
                    ) : null}
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ display: locationIconUrl ? 'none' : 'block' }}
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </div>
                  <div className="contact-location-content">
                    <h4 className="contact-location-city">{location.city}</h4>
                    <p className="contact-location-address">{location.address}</p>
                    {location.mapUrl && (
                      <a
                        href={location.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-location-link"
                      >
                        View on Map
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactFormSection
