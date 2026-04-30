import { useState, useEffect, useRef } from 'react'
import { webinarsAPI, pagesAPI, uploadAPI } from '../../services/api'
import './AdminPage.css'

const WebinarsPage = () => {
  const [activeTab, setActiveTab] = useState('topics')
  const [topics, setTopics] = useState([])
  const [attendees, setAttendees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    order: 0,
  })
  const [sectionContent, setSectionContent] = useState({
    heading: '',
    intro: '',
    whyAttendTitle: '',
    whyAttendText: '',
    projectTitle: '',
    projectSubtitle: '',
  })
  const [savingSection, setSavingSection] = useState(false)
  const [uploadingIcon, setUploadingIcon] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchData()
    fetchSectionContent()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'topics') {
        const response = await webinarsAPI.getTopics()
        setTopics(response.data || [])
      } else {
        const response = await webinarsAPI.getWhoShouldAttend()
        setAttendees(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const fetchSectionContent = async () => {
    try {
      const response = await pagesAPI.getBySlug('webinars')
      const content = response.data?.content?.webinarsCover || {}
      setSectionContent({
        heading: content.heading || content.title || '',
        intro: content.intro || content.description || '',
        whyAttendTitle: content.whyAttendTitle || '',
        whyAttendText: content.whyAttendText || '',
        projectTitle: content.projectTitle || '',
        projectSubtitle: content.projectSubtitle || '',
      })
    } catch (error) {
      console.error('Error fetching section content:', error)
    }
  }

  const handleSectionContentSave = async (e) => {
    e.preventDefault()
    setSavingSection(true)
    try {
      const response = await pagesAPI.getBySlug('webinars')
      const page = response.data
      const updatedContent = {
        ...page.content,
        webinarsCover: {
          heading: sectionContent.heading,
          title: sectionContent.heading,
          intro: sectionContent.intro,
          description: sectionContent.intro,
          whyAttendTitle: sectionContent.whyAttendTitle,
          whyAttendText: sectionContent.whyAttendText,
          projectTitle: sectionContent.projectTitle,
          projectSubtitle: sectionContent.projectSubtitle,
        }
      }
      await pagesAPI.update(page._id, { content: updatedContent })
      alert('Section content updated successfully')
    } catch (error) {
      alert('Failed to update section content')
      console.error(error)
    } finally {
      setSavingSection(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (activeTab === 'topics') {
        if (editingId) {
          await webinarsAPI.updateTopic(editingId, formData)
        } else {
          await webinarsAPI.createTopic(formData)
        }
      } else {
        if (editingId) {
          await webinarsAPI.updateWhoShouldAttend(editingId, formData)
        } else {
          await webinarsAPI.createWhoShouldAttend(formData)
        }
      }
      fetchData()
      resetForm()
      alert(editingId ? 'Item updated successfully' : 'Item created successfully')
    } catch (error) {
      alert(error.message || 'Failed to save item')
    }
  }

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      description: item.description,
      icon: item.icon,
      order: item.order || 0,
    })
    setEditingId(item._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      if (activeTab === 'topics') {
        await webinarsAPI.deleteTopic(id)
      } else {
        await webinarsAPI.deleteWhoShouldAttend(id)
      }
      fetchData()
      alert('Item deleted successfully')
    } catch (error) {
      alert('Failed to delete item')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: '',
      order: 0,
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
      // Use 'images/' prefix to save to public/images directory
      const folder = activeTab === 'topics' ? 'images/Weninar_Cover' : 'images/Webinar_Attend'
      console.log('Uploading file:', { name: file.name, type: file.type, size: file.size, folder })
      const response = await uploadAPI.uploadFile(file, folder)
      console.log('Upload response:', response)
      
      if (!response.success || !response.data || !response.data.path) {
        throw new Error('Upload response missing path data')
      }
      
      const iconPath = response.data.path
      console.log('Setting icon path:', iconPath)
      
      // Add cache busting query param to force refresh
      const iconPathWithCache = `${iconPath}?t=${Date.now()}`
      
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

  const currentData = activeTab === 'topics' ? topics : attendees
  const itemType = activeTab === 'topics' ? 'Topic' : 'Attendee Type'

  if (loading) {
    return <div className="admin-loading">Loading...</div>
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Manage Webinars</h2>
        {activeTab !== 'section' && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            + Add New {itemType}
          </button>
        )}
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === 'section' ? 'tab-active' : ''}
          onClick={() => setActiveTab('section')}
        >
          Section Content
        </button>
        <button
          className={activeTab === 'topics' ? 'tab-active' : ''}
          onClick={() => setActiveTab('topics')}
        >
          Webinar Topics
        </button>
        <button
          className={activeTab === 'attendees' ? 'tab-active' : ''}
          onClick={() => setActiveTab('attendees')}
        >
          Who Should Attend
        </button>
      </div>

      {activeTab === 'section' && (
        <div className="admin-section-content">
          <form onSubmit={handleSectionContentSave} className="admin-form">
            <h3>Webinars Cover Section Content</h3>
            <div className="form-group">
              <label>Section Heading *</label>
              <input
                type="text"
                value={sectionContent.heading}
                onChange={(e) => setSectionContent({ ...sectionContent, heading: e.target.value })}
                placeholder="What These Webinars Cover"
                required
              />
            </div>
            <div className="form-group">
              <label>Intro Text *</label>
              <textarea
                value={sectionContent.intro}
                onChange={(e) => setSectionContent({ ...sectionContent, intro: e.target.value })}
                rows="3"
                placeholder="We focus on clarity, not theory overload..."
                required
              />
            </div>
            <div className="form-group">
              <label>Why Attend Title</label>
              <input
                type="text"
                value={sectionContent.whyAttendTitle}
                onChange={(e) => setSectionContent({ ...sectionContent, whyAttendTitle: e.target.value })}
                placeholder="Why Attend?"
              />
            </div>
            <div className="form-group">
              <label>Why Attend Text</label>
              <textarea
                value={sectionContent.whyAttendText}
                onChange={(e) => setSectionContent({ ...sectionContent, whyAttendText: e.target.value })}
                rows="2"
                placeholder="Choosing the right track is crucial..."
              />
            </div>
            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label>Project Title</label>
                <input
                  type="text"
                  value={sectionContent.projectTitle}
                  onChange={(e) => setSectionContent({ ...sectionContent, projectTitle: e.target.value })}
                  placeholder="Real Project Experience"
                />
              </div>
              <div>
                <label>Project Subtitle</label>
                <input
                  type="text"
                  value={sectionContent.projectSubtitle}
                  onChange={(e) => setSectionContent({ ...sectionContent, projectSubtitle: e.target.value })}
                  placeholder="Guaranteed exposure"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={savingSection}>
                {savingSection ? 'Saving...' : 'Save Section Content'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab !== 'section' && showForm && (
        <div className="admin-form-modal">
          <div className="admin-form-content">
            <h3>{editingId ? `Edit ${itemType}` : `Add New ${itemType}`}</h3>
            <form onSubmit={handleSubmit}>
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
              <div className="form-group">
                <label>Icon *</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp"
                    onChange={handleIconUpload}
                    style={{ display: 'none' }}
                    id="icon-upload"
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
                    placeholder="/images/Weninar_Cover/assignment_globe.svg"
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

      {activeTab !== 'section' && (
        <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                  No items found. Click "Add New {itemType}" to get started.
                </td>
              </tr>
            ) : (
              currentData.map((item) => (
                <tr key={item._id}>
                  <td>{item.order || 0}</td>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>
                    <button onClick={() => handleEdit(item)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="btn-delete">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  )
}

export default WebinarsPage
