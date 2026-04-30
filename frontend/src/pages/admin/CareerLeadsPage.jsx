import { useEffect, useState } from 'react'
import { careerLeadsAPI } from '../../services/api'
import { getImageBaseUrl } from '../../services/api'

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleString()
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'in_review', label: 'In Review' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'archived', label: 'Archived' },
]

function CareerLeadsPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState(null)

  const fetchLeads = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await careerLeadsAPI.getAll({
        status: statusFilter === 'all' ? undefined : statusFilter,
        page: 1,
        limit: 100,
      })
      setLeads(res.data || [])
    } catch (err) {
      setError(err.message || 'Failed to load career leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id)
      await careerLeadsAPI.update(id, { status: newStatus })
      setLeads((prev) =>
        prev.map((lead) => (lead._id === id ? { ...lead, status: newStatus } : lead)),
      )
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err.message || 'Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id) => {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm('Are you sure you want to delete this lead? This cannot be undone.')
    if (!confirm) return
    try {
      await careerLeadsAPI.delete(id)
      setLeads((prev) => prev.filter((lead) => lead._id !== id))
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err.message || 'Failed to delete lead')
    }
  }

  const baseUrl = getImageBaseUrl()

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Career Leads</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={{ fontSize: 14 }}>
            Status:
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ marginLeft: 8 }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="admin-button"
            onClick={fetchLeads}
            disabled={loading}
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Applied On</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Experience</th>
              <th>Opening</th>
              <th>Resume</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && !loading && (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: 24 }}>
                  No leads found.
                </td>
              </tr>
            )}
            {leads.map((lead) => {
              const resumeHref = lead.resumePath ? `${baseUrl}${lead.resumePath}` : ''
              return (
                <tr key={lead._id}>
                  <td>{formatDate(lead.createdAt)}</td>
                  <td>{lead.name}</td>
                  <td>
                    <div>{lead.email}</div>
                    <div>{lead.phone}</div>
                  </td>
                  <td>{lead.experienceYears ?? ''}</td>
                  <td>
                    <div>{lead.openingTitle || '-'}</div>
                    {lead.openingIdentifier && (
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{lead.openingIdentifier}</div>
                    )}
                  </td>
                  <td>
                    {resumeHref ? (
                      <a href={resumeHref} target="_blank" rel="noopener noreferrer">
                        Download
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <select
                      value={lead.status || 'new'}
                      onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                      disabled={updatingId === lead._id}
                    >
                      {STATUS_OPTIONS.filter((s) => s.value !== 'all').map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ maxWidth: 220 }}>
                    {lead.notes || ''}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin-button admin-button-danger"
                      onClick={() => handleDelete(lead._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CareerLeadsPage

