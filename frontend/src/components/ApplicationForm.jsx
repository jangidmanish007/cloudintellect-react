import { useState } from 'react'
import { heroApplicationAPI } from '../services/api'

function todayLocalYmd() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const initialForm = {
  name: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  city: '',
  product: '',
}

function ApplicationForm() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({ type: null, message: '' })
  const [submitting, setSubmitting] = useState(false)

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (status.type) setStatus({ type: null, message: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: null, message: '' })
    setSubmitting(true)
    try {
      await heroApplicationAPI.submit({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        dateOfBirth: form.dateOfBirth,
        city: form.city.trim(),
        product: form.product,
      })
      setForm(initialForm)
      setStatus({
        type: 'success',
        message: 'Thank you! Your application has been submitted.',
      })
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Something went wrong. Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="application-form">
      <div className="form-content">
        <div className="form-header">
          <div className="form-subtitle">APPLY TODAY FOR</div>
          <h2 className="form-title">Salesforce Training Institute</h2>
          <div className="form-cta">
            Start your learning with a free orientation session
          </div>
        </div>

        <form className="form-fields" onSubmit={handleSubmit} noValidate>
          <div className="input-row">
            <div className="form-field">
              <input
                type="text"
                name="name"
                placeholder="Student Name"
                className="input"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                autoComplete="name"
                required
              />
            </div>
            <div className="form-field">
              <input
                type="email"
                name="email"
                placeholder="E Mail"
                className="input"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-field full-width">
            <input
              type="tel"
              name="phone"
              placeholder="+91 - Student Mobile Number"
              className="input"
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              autoComplete="tel"
              required
            />
          </div>

          <div className="input-row">
            <div className="form-field form-field--date">
              <input
                type="date"
                name="dateOfBirth"
                className="input input--date"
                aria-label="Date of birth"
                max={todayLocalYmd()}
                min="1920-01-01"
                value={form.dateOfBirth}
                onChange={(e) => setField('dateOfBirth', e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <input
                type="text"
                name="city"
                placeholder="Student City"
                className="input"
                value={form.city}
                onChange={(e) => setField('city', e.target.value)}
                autoComplete="address-level2"
                required
              />
            </div>
          </div>

          <div className="form-field full-width select-field">
            <select
              className="input"
              name="product"
              value={form.product}
              onChange={(e) => setField('product', e.target.value)}
              required
            >
              <option value="">Select Course</option>
              <option value="SFDC">SFDC</option>
              <option value="SFMC">SFMC</option>
            </select>
            <svg className="select-icon" width="4" height="2" viewBox="0 0 4 2" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0L2 2L4 0" stroke="black" strokeOpacity="0.75" strokeLinecap="round"/>
            </svg>
          </div>

          {status.message ? (
            <p
              className={`form-submit-status form-submit-status--${status.type}`}
              role={status.type === 'error' ? 'alert' : 'status'}
            >
              {status.message}
            </p>
          ) : null}

          <div className="form-footer">
            <p className="disclaimer">
              By submitting this form, I agree to receive notifications from the
              Cloud Intellect in the form of SMS/E-mail/Call.
            </p>
            <button
              type="submit"
              className="submit-button"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? 'SUBMITTING…' : 'APPLY NOW'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ApplicationForm
