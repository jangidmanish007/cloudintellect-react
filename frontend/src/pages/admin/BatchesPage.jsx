import { useEffect, useState, useRef } from 'react'
import { batchesAPI, uploadAPI } from '../../services/api'
import './AdminPage.css'

const BatchesPage = () => {
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [uploadingIcon, setUploadingIcon] = useState(false)
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    id: 'sfdc',
    icon: '/images/Icon Container.svg',
    bannerBg: '#1A202C',
    title: '',
    description: '',
    batchStart: '',
    nextBatch: '',
    linkText: '',
    linkHref: '',
    isOpen: true,
  })

  useEffect(() => {
    fetchBatches()
  }, [])

  const fetchBatches = async () => {
    try {
      const response = await batchesAPI.getAll()
      setBatches(response.data || [])
    } catch (error) {
      console.error('Error fetching batches:', error)
      alert('Failed to load batches')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await batchesAPI.createOrUpdate(formData)
      fetchBatches()
      resetForm()
      alert('Batch saved successfully')
    } catch (error) {
      alert(error.message || 'Failed to save batch')
    }
  }

  const handleEdit = (batch) => {
    setFormData({
      id: batch.id,
      icon: batch.icon,
      bannerBg: batch.bannerBg,
      title: batch.title,
      description: batch.description,
      batchStart: batch.batchStart,
      nextBatch: batch.nextBatch,
      linkText: batch.linkText,
      linkHref: batch.linkHref,
      isOpen: batch.isOpen !== false,
    })
    setEditingId(batch.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this batch?')) return
    try {
      await batchesAPI.delete(id)
      fetchBatches()
      alert('Batch deleted successfully')
    } catch (error) {
      alert('Failed to delete batch')
    }
  }

  const resetForm = () => {
    setFormData({
      id: 'sfdc',
      icon: '/images/Icon Container.svg',
      bannerBg: '#1A202C',
      title: '',
      description: '',
      batchStart: '',
      nextBatch: '',
      linkText: '',
      linkHref: '',
      isOpen: true,
    })
    setEditingId(null)
    setShowForm(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleIconUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image file (SVG, PNG, JPG, GIF, or WEBP)')
      return
    }

    setUploadingIcon(true)
    try {
      // Save to images/batches directory
      const folder = 'images/batches'
      console.log('Uploading batch icon:', { name: file.name, type: file.type, size: file.size, folder })
      const response = await uploadAPI.uploadFile(file, folder)
      console.log('Upload response:', response)
      
      if (!response.success || !response.data || !response.data.path) {
        throw new Error('Upload response missing path data')
      }
      
      const iconPath = response.data.path
      console.log('Setting icon path:', iconPath)
      
      setFormData({ ...formData, icon: iconPath })
      
      // Verify the file exists by trying to load it
      const img = new Image()
      img.onload = () => {
        console.log('Icon preview loaded successfully:', iconPath)
        alert(`Icon uploaded successfully! Path: ${iconPath}`)
      }
      img.onerror = () => {
        console.error('Icon preview failed to load:', iconPath)
        alert(`Warning: Icon uploaded but preview failed. Path: ${iconPath}\nPlease check if the file exists at: ${iconPath}`)
      }
      img.src = iconPath
      
    } catch (error) {
      console.error('Upload error:', error)
      alert(error.message || 'Failed to upload icon')
    } finally {
      setUploadingIcon(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  if (loading) {
    return <div className="admin-loading">Loading batches...</div>
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Manage Batches</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Add New Batch
        </button>
      </div>

      {showForm && (
        <div className="admin-form-modal">
          <div className="admin-form-content">
            <h3>{editingId ? 'Edit Batch' : 'Add New Batch'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Batch ID *</label>
                <select
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  required
                >
                  <option value="sfdc">SFDC</option>
                  <option value="sfmc">SFMC</option>
                </select>
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
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Icon *</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp"
                      onChange={handleIconUpload}
                      style={{ display: 'none' }}
                      id="batch-icon-upload"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-secondary"
                      disabled={uploadingIcon}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {uploadingIcon ? 'Uploading...' : 'Upload Icon'}
                    </button>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="/images/batches/sfdc-icon.svg"
                      required
                      style={{ flex: 1 }}
                    />
                  </div>
                  {formData.icon && (
                    <div style={{ marginTop: '8px' }}>
                      <img
                        src={`${formData.icon}${formData.icon.includes('?') ? '&' : '?'}t=${Date.now()}`}
                        alt="Icon preview"
                        style={{ maxWidth: '48px', maxHeight: '48px', objectFit: 'contain', border: '1px solid #ddd', padding: '4px', borderRadius: '4px' }}
                        onError={(e) => {
                          console.error('Preview icon failed to load:', {
                            iconPath: formData.icon,
                            attemptedSrc: e.target.src,
                            fullUrl: typeof window !== 'undefined' ? window.location.origin + formData.icon : formData.icon
                          })
                          e.target.style.border = '2px solid red'
                          e.target.alt = 'Failed to load'
                          e.target.title = `Failed to load: ${formData.icon}`
                        }}
                        onLoad={() => {
                          console.log('Preview icon loaded successfully:', formData.icon)
                        }}
                      />
                      <p style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                        Path: {formData.icon}
                      </p>
                      <p style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>
                        Full URL: {typeof window !== 'undefined' ? window.location.origin + formData.icon : formData.icon}
                      </p>
                    </div>
                  )}
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    Click "Upload Icon" to upload a file, or enter a path manually
                  </p>
                </div>
                <div className="form-group">
                  <label>Banner Background Color *</label>
                  <input
                    type="color"
                    value={formData.bannerBg}
                    onChange={(e) => setFormData({ ...formData, bannerBg: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Batch Start *</label>
                  <input
                    type="text"
                    value={formData.batchStart}
                    onChange={(e) => setFormData({ ...formData, batchStart: e.target.value })}
                    placeholder="17th January"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Next Batch *</label>
                  <input
                    type="text"
                    value={formData.nextBatch}
                    onChange={(e) => setFormData({ ...formData, nextBatch: e.target.value })}
                    placeholder="31st January"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Link Text *</label>
                  <input
                    type="text"
                    value={formData.linkText}
                    onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Link Href *</label>
                  <input
                    type="text"
                    value={formData.linkHref}
                    onChange={(e) => setFormData({ ...formData, linkHref: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update' : 'Create'}
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
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Batch Start</th>
              <th>Next Batch</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                  No batches found. Click "Add New Batch" to get started.
                </td>
              </tr>
            ) : (
              batches.map((batch) => (
                <tr key={batch._id}>
                  <td>{batch.id}</td>
                  <td>{batch.title}</td>
                  <td>{batch.batchStart}</td>
                  <td>{batch.nextBatch}</td>
                  <td>{batch.isOpen ? 'Open' : 'Closed'}</td>
                  <td>
                    <button onClick={() => handleEdit(batch)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(batch.id)} className="btn-delete">
                      Delete
                    </button>
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

export default BatchesPage
