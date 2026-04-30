import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { pagesAPI } from '../../services/api'
import './AdminPage.css'

const PagesPage = () => {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [contentJsonRaw, setContentJsonRaw] = useState('{}')
  const [contentJsonError, setContentJsonError] = useState(null)
  const [contentSectionOpen, setContentSectionOpen] = useState(false)
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    content: {},
    isActive: true,
    showInNavbar: true,
    navbarLabel: '',
    navbarOrder: 0,
    order: 0,
  })

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await pagesAPI.getAll()
      setPages(response.data || [])
    } catch (error) {
      console.error('Error fetching pages:', error)
      alert('Failed to load pages')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this page?')) return
    try {
      await pagesAPI.delete(id)
      fetchPages()
      alert('Page deleted successfully')
    } catch (error) {
      alert('Failed to delete page')
    }
  }

  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      description: '',
      metaTitle: '',
      metaDescription: '',
      content: {},
      isActive: true,
      showInNavbar: true,
      navbarLabel: '',
      navbarOrder: 0,
      order: 0,
    })
    setContentJsonRaw('{}')
    setContentJsonError(null)
    setContentSectionOpen(false)
    setEditingId(null)
    setShowForm(false)
  }

  const openAddForm = () => {
    setContentJsonRaw('{}')
    setContentJsonError(null)
    setContentSectionOpen(false)
    setShowForm(true)
  }

  const handleContentJsonChange = (value) => {
    setContentJsonRaw(value)
    try {
      const parsed = JSON.parse(value)
      setFormData((prev) => ({ ...prev, content: parsed }))
      setContentJsonError(null)
    } catch {
      setContentJsonError('Invalid JSON')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      JSON.parse(contentJsonRaw)
    } catch {
      setContentJsonError('Fix JSON before saving')
      return
    }
    try {
      if (editingId) {
        await pagesAPI.update(editingId, formData)
      } else {
        await pagesAPI.create(formData)
      }
      fetchPages()
      resetForm()
      alert(editingId ? 'Page updated successfully' : 'Page created successfully')
    } catch (error) {
      alert(error.message || 'Failed to save page')
    }
  }

  if (loading) {
    return <div className="admin-loading">Loading pages...</div>
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Manage Pages</h2>
        <button onClick={openAddForm} className="btn-primary">
          + Add New Page
        </button>
      </div>

      {showForm && (
        <div className="admin-form-modal" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="admin-form-content admin-form-content--pages" onClick={(e) => e.stopPropagation()}>
            <div className="admin-form-header">
              <h3>{editingId ? 'Edit Page' : 'Add New Page'}</h3>
              <button type="button" className="admin-form-close" onClick={resetForm} aria-label="Close">×</button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form-body">
              <section className="admin-form-section">
                <h4 className="admin-form-section-title">Basics</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Slug *</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder="about-us"
                      required
                      disabled={!!editingId}
                    />
                    <small>URL-friendly identifier (e.g., about-us, home)</small>
                  </div>
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="2"
                  />
                </div>
              </section>

              <section className="admin-form-section">
                <h4 className="admin-form-section-title">SEO & Navbar</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Meta Title</label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Meta Description</label>
                    <input
                      type="text"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Navbar</label>
                  <div className="form-inline">
                    <label className="form-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.showInNavbar}
                        onChange={(e) => setFormData({ ...formData, showInNavbar: e.target.checked })}
                      />
                      Show in Navbar
                    </label>
                    {formData.showInNavbar && (
                      <>
                        <input
                          type="text"
                          value={formData.navbarLabel}
                          onChange={(e) => setFormData({ ...formData, navbarLabel: e.target.value })}
                          placeholder="Navbar label"
                          className="form-inline-input"
                        />
                        <input
                          type="number"
                          value={formData.navbarOrder}
                          onChange={(e) => setFormData({ ...formData, navbarOrder: parseInt(e.target.value) || 0 })}
                          placeholder="Order"
                          className="form-inline-input form-inline-input--narrow"
                        />
                      </>
                    )}
                  </div>
                </div>
              </section>

              <section className="admin-form-section">
                <h4 className="admin-form-section-title">Display</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Page Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.isActive ? 'active' : 'inactive'}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="admin-form-section admin-form-section--collapse">
                <button
                  type="button"
                  className="admin-form-collapse-trigger"
                  onClick={() => setContentSectionOpen((o) => !o)}
                  aria-expanded={contentSectionOpen}
                >
                  <span className="admin-form-collapse-icon">{contentSectionOpen ? '▼' : '▶'}</span>
                  Page Content (JSON)
                  {contentJsonError && <span className="admin-form-json-error">{contentJsonError}</span>}
                </button>
                {contentSectionOpen && (
                  <div className="admin-form-collapse-body">
                    <textarea
                      value={contentJsonRaw}
                      onChange={(e) => handleContentJsonChange(e.target.value)}
                      rows={14}
                      className={`form-input-json${contentJsonError ? ' error' : ''}`}
                      placeholder='{ "hero": { ... } }'
                    />
                    <p className="admin-form-help">
                      Dynamic content for the frontend. Use <strong>hero</strong> for hero section (tag, heading, headingAccent, description, primaryButtonText, primaryButtonHref, secondaryButtonText, secondaryButtonHref). About page can include <strong>stats</strong>: <code>[{`{ "value": "5000+", "label": "LEARNERS TRAINED" }`}, ...]</code>
                    </p>
                  </div>
                )}
              </section>

              <div className="form-actions form-actions--sticky">
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update Page' : 'Create Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Slug</th>
              <th>Title</th>
              <th>Navbar</th>
              <th>Status</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                  No pages found. Click "Add New Page" to get started.
                </td>
              </tr>
            ) : (
              pages.map((page) => (
                <tr key={page._id}>
                  <td><code>{page.slug}</code></td>
                  <td>{page.title}</td>
                  <td>{page.showInNavbar ? '✓' : '✗'}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: page.isActive ? '#c6f6d5' : '#fed7d7',
                      color: page.isActive ? '#22543d' : '#742a2a'
                    }}>
                      {page.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{page.order || 0}</td>
                  <td>
                    <div className="admin-table-actions">
                      <Link to={`/admin/pages/edit/${page.slug}`} className="btn-edit">
                        Edit
                      </Link>
                      <button type="button" onClick={() => handleDelete(page._id)} className="btn-delete">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PagesPage
