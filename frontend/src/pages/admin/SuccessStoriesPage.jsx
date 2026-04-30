import { useEffect, useState, useRef } from 'react'
import { successStoriesAPI, uploadAPI, getImageUrl } from '../../services/api'
import './AdminPage.css'

const SuccessStoriesPage = () => {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageDropZoneActive, setImageDropZoneActive] = useState(false)
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    time: '1 year ago',
    profileImage: '',
    rating: 5,
    text: '',
    readMoreUrl: '#',
    order: 0,
  })

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const response = await successStoriesAPI.getAll()
      setStories(response.data || [])
    } catch (error) {
      console.error('Error fetching success stories:', error)
      alert('Failed to load success stories')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await successStoriesAPI.update(editingId, formData)
      } else {
        await successStoriesAPI.create(formData)
      }
      fetchStories()
      resetForm()
      alert(editingId ? 'Success story updated successfully' : 'Success story created successfully')
    } catch (error) {
      alert(error.message || 'Failed to save success story')
    }
  }

  const handleEdit = (story) => {
    setFormData({
      name: story.name,
      time: story.time,
      profileImage: story.profileImage,
      rating: story.rating,
      text: story.text,
      readMoreUrl: story.readMoreUrl || '#',
      order: story.order || 0,
    })
    setEditingId(story._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this success story?')) return
    try {
      await successStoriesAPI.delete(id)
      fetchStories()
      alert('Success story deleted successfully')
    } catch (error) {
      alert('Failed to delete success story')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      time: '1 year ago',
      profileImage: '',
      rating: 5,
      text: '',
      readMoreUrl: '#',
      order: 0,
    })
    setEditingId(null)
    setShowForm(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const allowedImageTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']

  const uploadImageFile = async (file) => {
    if (!file) return
    if (!allowedImageTypes.includes(file.type)) {
      alert('Please upload an image file (SVG, PNG, JPG, GIF, or WEBP)')
      return
    }
    setUploadingImage(true)
    try {
      const folder = 'images/More_Students'
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
      setFormData(prev => ({ ...prev, profileImage: imagePath }))
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
    return <div className="admin-loading">Loading success stories...</div>
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Manage Success Stories</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Add New Story
        </button>
      </div>

      {showForm && (
        <div className="admin-form-modal">
          <div className="admin-form-content">
            <h3>{editingId ? 'Edit Success Story' : 'Add New Success Story'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
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
                  <label>Time</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="1 year ago"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Profile Image *</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="success-story-image-upload"
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
                    value={formData.profileImage}
                    onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                    placeholder="/images/More_Students/Profile Image.webp"
                    required
                    style={{ flex: 1 }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                {formData.profileImage && (
                  <div style={{ marginTop: '8px' }}>
                    <img
                      src={`${getImageUrl(formData.profileImage)}${formData.profileImage.includes('?') ? '&' : '?'}t=${Date.now()}`}
                      alt="Preview"
                      style={{ maxWidth: '120px', maxHeight: '120px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px' }}
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                    <p style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>Path: {formData.profileImage}</p>
                  </div>
                )}
                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Drag and drop an image above, click to browse, or enter a path manually. Saved to /images/More_Students/
                </p>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Rating *</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    required
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Review Text *</label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  rows="4"
                  required
                />
              </div>
              <div className="form-group">
                <label>Read More URL</label>
                <input
                  type="text"
                  value={formData.readMoreUrl}
                  onChange={(e) => setFormData({ ...formData, readMoreUrl: e.target.value })}
                  placeholder="#"
                />
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
              <th>Order</th>
              <th>Name</th>
              <th>Rating</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stories.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                  No success stories found. Click "Add New Story" to get started.
                </td>
              </tr>
            ) : (
              stories.map((story) => (
                <tr key={story._id}>
                  <td>{story.order || 0}</td>
                  <td>{story.name}</td>
                  <td>{'★'.repeat(story.rating)}</td>
                  <td>{story.time}</td>
                  <td>
                    <button onClick={() => handleEdit(story)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(story._id)} className="btn-delete">
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

export default SuccessStoriesPage
