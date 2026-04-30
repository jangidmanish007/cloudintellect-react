import { useEffect, useState, useRef } from 'react'
import { placementsAPI, uploadAPI, getImageUrl } from '../../services/api'
import './AdminPage.css'

const PlacementsPage = () => {
  const [placements, setPlacements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [imageDropZoneActive, setImageDropZoneActive] = useState(false)
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    package: '',
    image: '',
    order: 0,
  })

  useEffect(() => {
    fetchPlacements()
  }, [])

  const fetchPlacements = async () => {
    try {
      const response = await placementsAPI.getAll()
      setPlacements(response.data || [])
    } catch (error) {
      console.error('Error fetching placements:', error)
      alert('Failed to load placements')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await placementsAPI.update(editingId, formData)
      } else {
        await placementsAPI.create(formData)
      }
      fetchPlacements()
      resetForm()
      alert(editingId ? 'Placement updated successfully' : 'Placement created successfully')
    } catch (error) {
      alert(error.message || 'Failed to save placement')
    }
  }

  const handleEdit = (placement) => {
    setFormData({
      name: placement.name,
      role: placement.role,
      company: placement.company,
      package: placement.package,
      image: placement.image,
      order: placement.order || 0,
    })
    setEditingId(placement._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this placement?')) return
    try {
      await placementsAPI.delete(id)
      fetchPlacements()
      alert('Placement deleted successfully')
    } catch (error) {
      alert('Failed to delete placement')
    }
  }

  // Sorted by order for display
  const sortedPlacements = [...placements].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault()
    setDragOverIndex(null)
    setDraggedIndex(null)
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10)
    if (dragIndex === dropIndex || isNaN(dragIndex)) return

    const reordered = [...sortedPlacements]
    const [removed] = reordered.splice(dragIndex, 1)
    reordered.splice(dropIndex, 0, removed)

    const payload = reordered.map((p, i) => ({ id: p._id, order: i }))
    setReordering(true)
    try {
      await placementsAPI.reorder(payload)
      await fetchPlacements()
    } catch (err) {
      alert(err.message || 'Failed to reorder placements')
    } finally {
      setReordering(false)
    }
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      company: '',
      package: '',
      image: '',
      order: 0,
    })
    setEditingId(null)
    setShowForm(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // When opening "Add New", set order to next sequence (user doesn't need to enter it)
  const openAddForm = () => {
    const nextOrder = placements.length > 0
      ? Math.max(...placements.map((p) => p.order ?? 0)) + 1
      : 0
    setFormData({
      name: '',
      role: '',
      company: '',
      package: '',
      image: '',
      order: nextOrder,
    })
    setEditingId(null)
    setShowForm(true)
  }

  const allowedImageTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']

  const uploadImageFile = async (file) => {
    if (!file) {
      console.log('No file selected')
      return
    }
    if (!allowedImageTypes.includes(file.type)) {
      alert('Please upload an image file (SVG, PNG, JPG, GIF, or WEBP)')
      return
    }

    setUploadingImage(true)
    try {
      const folder = 'images/Placements'
      const response = await uploadAPI.uploadFile(file, folder)
      let imagePath
      if (response && response.success && response.data && response.data.path) {
        imagePath = response.data.path
      } else if (response && response.data && response.data.path) {
        imagePath = response.data.path
      } else if (response && response.path) {
        imagePath = response.path
      } else {
        throw new Error('Upload response missing path data.')
      }
      if (!imagePath) throw new Error('Image path is empty')
      setFormData(prev => ({ ...prev, image: imagePath }))
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload image: ${error.message || 'Unknown error'}`)
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) uploadImageFile(file)
  }

  const handleImageDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setImageDropZoneActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadImageFile(file)
  }

  const handleImageDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
    setImageDropZoneActive(true)
  }

  const handleImageDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setImageDropZoneActive(false)
  }

  if (loading) {
    return <div className="admin-loading">Loading placements...</div>
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Manage Placements</h2>
        <button onClick={openAddForm} className="btn-primary">
          + Add New Placement
        </button>
      </div>

      {showForm && (
        <div className="admin-form-modal" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="admin-form-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-form-header">
              <h3>{editingId ? 'Edit Placement' : 'Add New Placement'}</h3>
              <button type="button" className="admin-form-close" onClick={resetForm} aria-label="Close">×</button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form-body">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role/Specialization *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g., Salesforce Developer, Salesforce Marketing Cloud"
                  required
                />
              </div>
              <div className="form-group">
                <label>Company *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Package (LPA) *</label>
                <input
                  type="text"
                  value={formData.package}
                  onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                  placeholder="e.g., 13 LPA, 10 LPA"
                  required
                />
              </div>
              <div className="form-group">
                <label>Profile Image *</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="placement-image-upload"
                />
                <div
                  className={`placement-image-dropzone ${imageDropZoneActive ? 'placement-image-dropzone--active' : ''} ${uploadingImage ? 'placement-image-dropzone--uploading' : ''}`}
                  onDragOver={handleImageDragOver}
                  onDragLeave={handleImageDragLeave}
                  onDrop={handleImageDrop}
                  onClick={() => !uploadingImage && fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !uploadingImage) {
                      e.preventDefault()
                      fileInputRef.current?.click()
                    }
                  }}
                  aria-label="Drag and drop image or click to browse"
                >
                  <span className="placement-image-dropzone-text">
                    {uploadingImage ? 'Uploading...' : 'Drag and drop image here, or click to browse'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                    className="btn-secondary"
                    disabled={uploadingImage}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  </button>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/Placements/profile.webp"
                    required
                    style={{ flex: 1 }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                {formData.image && (
                  <div style={{ marginTop: '8px' }}>
                    <img
                      src={`${getImageUrl(formData.image)}${formData.image.includes('?') ? '&' : '?'}t=${Date.now()}`}
                      alt="Image preview"
                      style={{ maxWidth: '120px', maxHeight: '120px', objectFit: 'contain', border: '1px solid #ddd', padding: '4px', borderRadius: '4px' }}
                      onError={(e) => {
                        console.error('Preview image failed to load:', formData.image)
                        e.target.style.border = '2px solid red'
                        e.target.alt = 'Failed to load'
                      }}
                      onLoad={() => {
                        console.log('Preview image loaded successfully:', formData.image)
                      }}
                    />
                    <p style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                      Path: {formData.image}
                    </p>
                  </div>
                )}
                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Drag and drop an image above, click to browse, or enter a path manually. Supported: PNG, JPG, GIF, WEBP, SVG.
                </p>
              </div>
              {editingId && (
                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  />
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    Lower numbers appear first. When adding new placements, order is set automatically.
                  </p>
                </div>
              )}
              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update Placement' : 'Create Placement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-container">
        {reordering && (
          <p style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>Updating order…</p>
        )}
        <table className="admin-table admin-table--placements">
          <thead>
            <tr>
              <th style={{ width: '40px' }} aria-label="Drag to reorder" />
              <th>Image</th>
              <th>Name</th>
              <th>Role</th>
              <th>Company</th>
              <th>Package</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlacements.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                  No placements found. Click "Add New Placement" to get started.
                </td>
              </tr>
            ) : (
              sortedPlacements.map((placement, index) => (
                <tr
                  key={placement._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={
                    (draggedIndex === index ? 'placement-row-dragging' : '') +
                    (dragOverIndex === index ? ' placement-row-drag-over' : '')
                  }
                >
                  <td className="placement-drag-handle" title="Drag to reorder">
                    <span className="placement-drag-handle-icon" aria-hidden>⋮⋮</span>
                  </td>
                  <td>
                    {placement.image && (
                      <img
                        src={getImageUrl(placement.image)}
                        alt={placement.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #009FFF' }}
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    )}
                  </td>
                  <td>{placement.name}</td>
                  <td>{placement.role}</td>
                  <td>{placement.company}</td>
                  <td>{placement.package}</td>
                  <td>{placement.order ?? index}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button type="button" onClick={() => handleEdit(placement)} className="btn-edit">
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(placement._id)} className="btn-delete">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {sortedPlacements.length > 0 && (
          <p style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>
            Drag rows by the ⋮⋮ handle to reorder. Order is saved automatically.
          </p>
        )}
      </div>
    </div>
  )
}

export default PlacementsPage
