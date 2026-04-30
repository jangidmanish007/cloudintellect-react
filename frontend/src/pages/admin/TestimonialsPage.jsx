import { useEffect, useState, useRef } from 'react'
import { testimonialsAPI, uploadAPI, getImageUrl } from '../../services/api'
import './AdminPage.css'

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [imageDropZoneActive, setImageDropZoneActive] = useState(false)
  const fileInputRef = useRef(null)
  const coverPhotoInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    program: '',
    image: '',
    videoUrl: '',
    coverPhoto: '',
    story: '',
    company: '',
    role: '',
    order: 0,
    isActive: true,
  })
  const [uploadingCoverPhoto, setUploadingCoverPhoto] = useState(false)
  const [coverPhotoDropZoneActive, setCoverPhotoDropZoneActive] = useState(false)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await testimonialsAPI.getAllAdmin()
      setTestimonials(response.data || [])
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      alert('Failed to load testimonials')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name) {
      alert('Please fill in the required field: Name')
      return
    }
    if (!formData.videoUrl && !formData.coverPhoto && !formData.image) {
      alert('Please provide either a Video URL, Cover Photo, or Image')
      return
    }
    try {
      if (editingId) {
        await testimonialsAPI.update(editingId, formData)
      } else {
        await testimonialsAPI.create(formData)
      }
      fetchTestimonials()
      resetForm()
      alert(editingId ? 'Testimonial updated successfully' : 'Testimonial created successfully')
    } catch (error) {
      alert(error.message || 'Failed to save testimonial')
    }
  }

  const handleEdit = (testimonial) => {
    setFormData({
      name: testimonial.name,
      specialization: testimonial.specialization || '',
      program: testimonial.program || '',
      image: testimonial.image || '',
      videoUrl: testimonial.videoUrl || '',
      coverPhoto: testimonial.coverPhoto || '',
      story: testimonial.story || '',
      company: testimonial.company || '',
      role: testimonial.role || '',
      order: testimonial.order || 0,
      isActive: testimonial.isActive !== false,
    })
    setEditingId(testimonial._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return
    try {
      await testimonialsAPI.delete(id)
      fetchTestimonials()
      alert('Testimonial deleted successfully')
    } catch (error) {
      alert('Failed to delete testimonial')
    }
  }

  const sortedTestimonials = [...testimonials].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

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

    const reordered = [...sortedTestimonials]
    const [removed] = reordered.splice(dragIndex, 1)
    reordered.splice(dropIndex, 0, removed)

    const payload = reordered.map((t, i) => ({ id: t._id, order: i }))
    setReordering(true)
    try {
      await testimonialsAPI.reorder(payload)
      await fetchTestimonials()
    } catch (err) {
      alert(err.message || 'Failed to reorder testimonials')
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
      specialization: '',
      program: '',
      image: '',
      videoUrl: '',
      coverPhoto: '',
      story: '',
      company: '',
      role: '',
      order: 0,
      isActive: true,
    })
    setEditingId(null)
    setShowForm(false)
    setUploadingCoverPhoto(false)
    setCoverPhotoDropZoneActive(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (coverPhotoInputRef.current) {
      coverPhotoInputRef.current.value = ''
    }
  }

  const uploadCoverPhotoFile = async (file) => {
    if (!file) return
    if (!allowedImageTypes.includes(file.type)) {
      alert('Please upload an image file (SVG, PNG, JPG, GIF, or WEBP)')
      return
    }
    setUploadingCoverPhoto(true)
    try {
      const folder = 'images/Testimonials'
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
      setFormData(prev => ({ ...prev, coverPhoto: imagePath }))
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload cover photo: ${error.message || 'Unknown error'}`)
    } finally {
      setUploadingCoverPhoto(false)
      if (coverPhotoInputRef.current) coverPhotoInputRef.current.value = ''
    }
  }

  const handleCoverPhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) uploadCoverPhotoFile(file)
  }

  const handleCoverPhotoDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCoverPhotoDropZoneActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadCoverPhotoFile(file)
  }

  const handleCoverPhotoDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
    setCoverPhotoDropZoneActive(true)
  }

  const handleCoverPhotoDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCoverPhotoDropZoneActive(false)
  }

  const openAddForm = () => {
    resetForm()
    setShowForm(true)
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
      const folder = 'images/Testimonials'
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
    return <div className="admin-loading">Loading testimonials...</div>
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Manage Testimonials</h2>
        <button onClick={openAddForm} className="btn-primary">
          + Add New Testimonial
        </button>
      </div>

      {showForm && (
        <div className="admin-form-modal" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="admin-form-content admin-form-content--large" onClick={(e) => e.stopPropagation()}>
            <div className="admin-form-header">
              <h3>{editingId ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
              <button type="button" className="admin-form-close" onClick={resetForm} aria-label="Close">×</button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form-body">
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
                  <label>Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Salesforce Developer"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Accenture"
                  />
                </div>
                <div className="form-group">
                  <label>Specialization</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="e.g. SF MARKETING CLOUD"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Program</label>
                <input
                  type="text"
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  placeholder="e.g. Salesforce Developer Program"
                />
              </div>
              <div className="form-group">
                <label>Story</label>
                <textarea
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  rows="4"
                  placeholder="Their success story..."
                />
              </div>
              <div className="form-group">
                <label>YouTube Video URL</label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                />
                <small style={{ fontSize: '12px', color: '#666', marginTop: '4px', display: 'block' }}>
                  Paste YouTube video URL. Cover photo will be used if provided, otherwise YouTube thumbnail will be used.
                </small>
              </div>
              <div className="form-group">
                <label>Cover Photo (Optional)</label>
                <input
                  type="file"
                  ref={coverPhotoInputRef}
                  accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  onChange={handleCoverPhotoUpload}
                  style={{ display: 'none' }}
                  id="testimonial-cover-photo-upload"
                />
                <div
                  className={`placement-image-dropzone ${coverPhotoDropZoneActive ? 'placement-image-dropzone--active' : ''} ${uploadingCoverPhoto ? 'placement-image-dropzone--uploading' : ''}`}
                  onDragOver={handleCoverPhotoDragOver}
                  onDragLeave={handleCoverPhotoDragLeave}
                  onDrop={handleCoverPhotoDrop}
                  onClick={() => !uploadingCoverPhoto && coverPhotoInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !uploadingCoverPhoto) {
                      e.preventDefault()
                      coverPhotoInputRef.current?.click()
                    }
                  }}
                  aria-label="Drag and drop cover photo or click to browse"
                >
                  <span className="placement-image-dropzone-text">
                    {uploadingCoverPhoto ? 'Uploading...' : 'Drag and drop cover photo here, or click to browse'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); coverPhotoInputRef.current?.click() }}
                    className="btn-secondary"
                    disabled={uploadingCoverPhoto}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {uploadingCoverPhoto ? 'Uploading...' : 'Upload Cover Photo'}
                  </button>
                  <input
                    type="text"
                    value={formData.coverPhoto}
                    onChange={(e) => setFormData({ ...formData, coverPhoto: e.target.value })}
                    placeholder="/images/Testimonials/cover.webp"
                    style={{ flex: 1 }}
                  />
                </div>
                {formData.coverPhoto && (
                  <div style={{ marginTop: '10px' }}>
                    <img
                      src={`${getImageUrl(formData.coverPhoto)}${formData.coverPhoto.includes('?') ? '&' : '?'}t=${Date.now()}`}
                      alt="Cover photo preview"
                      style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px' }}
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Profile Image (Optional - fallback if no video/cover photo)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="testimonial-image-upload"
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
                    placeholder="/images/Testimonials/profile.webp"
                    style={{ flex: 1 }}
                  />
                </div>
                {formData.image && (
                  <div style={{ marginTop: '10px' }}>
                    <img
                      src={`${getImageUrl(formData.image)}${formData.image.includes('?') ? '&' : '?'}t=${Date.now()}`}
                      alt="Preview"
                      style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px' }}
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  </div>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Order</label>
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
              <div className="form-actions form-actions--sticky">
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update Testimonial' : 'Create Testimonial'}
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
              <th style={{ width: '40px' }}></th>
              <th>Image</th>
              <th>Name</th>
              <th>Role/Company</th>
              <th>Program</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTestimonials.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                  No testimonials found. Click "Add New Testimonial" to get started.
                </td>
              </tr>
            ) : (
              sortedTestimonials.map((testimonial, index) => (
                <tr
                  key={testimonial._id}
                  draggable={!reordering}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`${draggedIndex === index ? 'admin-table-row--dragging' : ''} ${dragOverIndex === index ? 'admin-table-row--drag-over' : ''}`}
                >
                  <td>
                    <span className="admin-drag-handle" title="Drag to reorder">⋮⋮</span>
                  </td>
                  <td>
                    {(() => {
                      const thumbnail = testimonial.coverPhoto || testimonial.image
                      if (thumbnail) {
                        return (
                          <img
                            src={getImageUrl(thumbnail)}
                            alt={testimonial.name}
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                            onError={(e) => { e.target.src = '/placeholder-image.png' }}
                          />
                        )
                      }
                      if (testimonial.videoUrl) {
                        const videoId = testimonial.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)?.[1]
                        if (videoId) {
                          return (
                            <img
                              src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                              alt={testimonial.name}
                              style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                              onError={(e) => { e.target.src = '/placeholder-image.png' }}
                            />
                          )
                        }
                      }
                      return <span style={{ fontSize: '12px', color: '#999' }}>No image</span>
                    })()}
                    {testimonial.videoUrl && (
                      <span style={{ display: 'block', fontSize: '10px', color: '#009FFF', marginTop: '4px' }}>🎥 Video</span>
                    )}
                  </td>
                  <td><strong>{testimonial.name}</strong></td>
                  <td>
                    {testimonial.role && testimonial.company
                      ? `${testimonial.role} at ${testimonial.company}`
                      : testimonial.role || testimonial.company || '-'}
                  </td>
                  <td>{testimonial.program || testimonial.specialization || '-'}</td>
                  <td>{testimonial.order || 0}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: testimonial.isActive ? '#c6f6d5' : '#fed7d7',
                      color: testimonial.isActive ? '#22543d' : '#742a2a'
                    }}>
                      {testimonial.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button onClick={() => handleEdit(testimonial)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDelete(testimonial._id)} className="btn-delete">Delete</button>
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

export default TestimonialsPage
