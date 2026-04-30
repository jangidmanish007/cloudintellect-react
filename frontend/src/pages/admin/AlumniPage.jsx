import { useEffect, useState, useRef } from 'react'
import { alumniAPI, uploadAPI } from '../../services/api'
import './AdminPage.css'

const AlumniPage = () => {
  const [alumni, setAlumni] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    specialization: 'SF MARKETING CLOUD',
    description: '',
    image: '',
    order: 0,
  })

  useEffect(() => {
    fetchAlumni()
  }, [])

  const fetchAlumni = async () => {
    try {
      const response = await alumniAPI.getAll()
      setAlumni(response.data || [])
    } catch (error) {
      console.error('Error fetching alumni:', error)
      alert('Failed to load alumni')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await alumniAPI.update(editingId, formData)
      } else {
        await alumniAPI.create(formData)
      }
      fetchAlumni()
      resetForm()
      alert(editingId ? 'Alumnus updated successfully' : 'Alumnus created successfully')
    } catch (error) {
      alert(error.message || 'Failed to save alumnus')
    }
  }

  const handleEdit = (alumnus) => {
    setFormData({
      name: alumnus.name,
      company: alumnus.company,
      specialization: alumnus.specialization,
      description: alumnus.description,
      image: alumnus.image,
      order: alumnus.order || 0,
    })
    setEditingId(alumnus._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this alumnus?')) return
    try {
      await alumniAPI.delete(id)
      fetchAlumni()
      alert('Alumnus deleted successfully')
    } catch (error) {
      alert('Failed to delete alumnus')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      specialization: 'SF MARKETING CLOUD',
      description: '',
      image: '',
      order: 0,
    })
    setEditingId(null)
    setShowForm(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      console.log('No file selected')
      return
    }

    // Validate file type
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image file (SVG, PNG, JPG, GIF, or WEBP)')
      return
    }

    setUploadingImage(true)
    try {
      // Save to images/Alumni directory (matching existing directory name)
      const folder = 'images/Alumni'
      console.log('Uploading alumni image:', { 
        name: file.name, 
        type: file.type, 
        size: file.size, 
        folder,
        file: file
      })
      
      const response = await uploadAPI.uploadFile(file, folder)
      console.log('Upload response:', response)
      console.log('Response type:', typeof response)
      console.log('Response keys:', Object.keys(response || {}))
      
      // Handle different response structures
      let imagePath
      if (response && response.success && response.data && response.data.path) {
        imagePath = response.data.path
      } else if (response && response.data && response.data.path) {
        imagePath = response.data.path
      } else if (response && response.path) {
        imagePath = response.path
      } else {
        console.error('Unexpected response structure:', response)
        throw new Error('Upload response missing path data. Response: ' + JSON.stringify(response))
      }
      
      console.log('Extracted image path:', imagePath)
      
      if (!imagePath) {
        throw new Error('Image path is empty')
      }
      
      // Update form data with the image path
      setFormData(prev => ({ ...prev, image: imagePath }))
      console.log('Form data updated with image path:', imagePath)
      
      // Verify the file exists by trying to load it
      const img = new Image()
      img.onload = () => {
        console.log('Image preview loaded successfully:', imagePath)
        alert(`Image uploaded successfully! Path: ${imagePath}`)
      }
      img.onerror = () => {
        console.error('Image preview failed to load:', imagePath)
        alert(`Warning: Image uploaded but preview failed. Path: ${imagePath}\nPlease check if the file exists at: ${imagePath}`)
      }
      img.src = imagePath
      
    } catch (error) {
      console.error('Upload error details:', {
        error,
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      alert(`Failed to upload image: ${error.message || 'Unknown error'}`)
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  if (loading) {
    return <div className="admin-loading">Loading alumni...</div>
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Manage Alumni</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Add New Alumni
        </button>
      </div>

      {showForm && (
        <div className="admin-form-modal">
          <div className="admin-form-content">
            <h3>{editingId ? 'Edit Alumni' : 'Add New Alumni'}</h3>
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
                  <label>Company *</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Specialization *</label>
                <select
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  required
                >
                  <option value="SF MARKETING CLOUD">SF MARKETING CLOUD</option>
                  <option value="SALESFORCE DEVELOPER">SALESFORCE DEVELOPER</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  required
                />
              </div>
              <div className="form-group">
                <label>Image *</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="alumni-image-upload"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
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
                    placeholder="/images/Alumni/Icon Background.webp"
                    required
                    style={{ flex: 1 }}
                  />
                </div>
                {formData.image && (
                  <div style={{ marginTop: '8px' }}>
                    <img
                      src={`${formData.image}${formData.image.includes('?') ? '&' : '?'}t=${Date.now()}`}
                      alt="Image preview"
                      style={{ maxWidth: '120px', maxHeight: '120px', objectFit: 'contain', border: '1px solid #ddd', padding: '4px', borderRadius: '4px' }}
                      onError={(e) => {
                        console.error('Preview image failed to load:', {
                          imagePath: formData.image,
                          attemptedSrc: e.target.src,
                          fullUrl: typeof window !== 'undefined' ? window.location.origin + formData.image : formData.image
                        })
                        e.target.style.border = '2px solid red'
                        e.target.alt = 'Failed to load'
                        e.target.title = `Failed to load: ${formData.image}`
                      }}
                      onLoad={() => {
                        console.log('Preview image loaded successfully:', formData.image)
                      }}
                    />
                    <p style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                      Path: {formData.image}
                    </p>
                    <p style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>
                      Full URL: {typeof window !== 'undefined' ? window.location.origin + formData.image : formData.image}
                    </p>
                  </div>
                )}
                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Click "Upload Image" to upload a file, or enter a path manually
                </p>
              </div>
              <div className="form-group">
                <label>Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
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
              <th>Company</th>
              <th>Specialization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {alumni.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                  No alumni found. Click "Add New Alumni" to get started.
                </td>
              </tr>
            ) : (
              alumni.map((alumnus) => (
                <tr key={alumnus._id}>
                  <td>{alumnus.order || 0}</td>
                  <td>{alumnus.name}</td>
                  <td>{alumnus.company}</td>
                  <td>{alumnus.specialization}</td>
                  <td>
                    <button onClick={() => handleEdit(alumnus)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(alumnus._id)} className="btn-delete">
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

export default AlumniPage
