import { useEffect, useState } from 'react'
import { headerCarouselAPI } from '../../services/api'
import './AdminPage.css'

const HeaderCarouselPage = () => {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    text: '',
    link: '',
    order: 0,
    isActive: true,
  })

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      const response = await headerCarouselAPI.getAllAdmin()
      setSlides(response.data || [])
    } catch (error) {
      console.error('Error fetching carousel slides:', error)
      alert('Failed to load carousel slides')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await headerCarouselAPI.update(editingId, formData)
      } else {
        await headerCarouselAPI.create(formData)
      }
      fetchSlides()
      resetForm()
      alert(editingId ? 'Carousel slide updated successfully' : 'Carousel slide created successfully')
    } catch (error) {
      alert(error.message || 'Failed to save carousel slide')
    }
  }

  const handleEdit = (slide) => {
    setFormData({
      text: slide.text || '',
      link: slide.link || '',
      order: slide.order || 0,
      isActive: slide.isActive !== undefined ? slide.isActive : true,
    })
    setEditingId(slide._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this carousel slide?')) return
    try {
      await headerCarouselAPI.delete(id)
      fetchSlides()
      alert('Carousel slide deleted successfully')
    } catch (error) {
      alert('Failed to delete carousel slide')
    }
  }

  const handleToggleActive = async (slide) => {
    try {
      await headerCarouselAPI.update(slide._id, { isActive: !slide.isActive })
      fetchSlides()
    } catch (error) {
      alert('Failed to update carousel slide')
    }
  }

  const resetForm = () => {
    setFormData({
      text: '',
      link: '',
      order: 0,
      isActive: true,
    })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) {
    return <div className="admin-loading">Loading carousel slides...</div>
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Manage Header Carousel</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Add New Slide
        </button>
      </div>

      {showForm && (
        <div className="admin-form-overlay">
          <div className="admin-form">
            <h3>{editingId ? 'Edit' : 'Add New'} Carousel Slide</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Text *</label>
                <input
                  type="text"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  required
                  placeholder="e.g., Salesforce Institute Your Pathway to a Thriving Career"
                />
              </div>

              <div className="form-group">
                <label>Link (Optional)</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label>Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  Active
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update' : 'Create'} Slide
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-container">
        {slides.length === 0 ? (
          <p className="admin-empty">No carousel slides found. Add your first slide!</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Text</th>
                <th>Link</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slides
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((slide) => (
                  <tr key={slide._id}>
                    <td>{slide.order || 0}</td>
                    <td>
                      <div style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {slide.text}
                      </div>
                    </td>
                    <td>
                      {slide.link ? (
                        <a href={slide.link} target="_blank" rel="noopener noreferrer" style={{ color: '#009FFF' }}>
                          {slide.link.length > 30 ? slide.link.substring(0, 30) + '...' : slide.link}
                        </a>
                      ) : (
                        <span style={{ color: '#999' }}>No link</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleActive(slide)}
                        className={`btn-toggle ${slide.isActive ? 'active' : 'inactive'}`}
                      >
                        {slide.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button onClick={() => handleEdit(slide)} className="btn-edit">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(slide._id)} className="btn-delete">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default HeaderCarouselPage
