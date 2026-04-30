import { useEffect, useState, useRef } from 'react'
import { galleryAPI, uploadAPI, getImageUrl } from '../../services/api'
import './AdminPage.css'

const GalleryPage = () => {
  const [activeTab, setActiveTab] = useState('categories') // 'categories' or 'images'
  const [categories, setCategories] = useState([])
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showImageForm, setShowImageForm] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [editingImageId, setEditingImageId] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [bulkUploading, setBulkUploading] = useState(false)
  const [bulkUploadProgress, setBulkUploadProgress] = useState({ current: 0, total: 0 })
  const [imageDropZoneActive, setImageDropZoneActive] = useState(false)
  const [bulkDropZoneActive, setBulkDropZoneActive] = useState(false)
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false)
  const [bulkUploadCategory, setBulkUploadCategory] = useState('')
  const fileInputRef = useRef(null)
  const bulkFileInputRef = useRef(null)
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    order: 0,
    isActive: true,
  })
  const [imageFormData, setImageFormData] = useState({
    title: '',
    image: '',
    category: '',
    order: 0,
    isActive: true,
  })
  const [reorderingCategories, setReorderingCategories] = useState(false)
  const [reorderingImages, setReorderingImages] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [categoriesRes, imagesRes] = await Promise.all([
        galleryAPI.getCategoriesAdmin(),
        galleryAPI.getImagesAdmin()
      ])
      setCategories(categoriesRes.data || [])
      setImages(imagesRes.data || [])
    } catch (error) {
      console.error('Error fetching gallery data:', error)
      alert('Failed to load gallery data')
    } finally {
      setLoading(false)
    }
  }

  // Category handlers
  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCategoryId) {
        await galleryAPI.updateCategory(editingCategoryId, categoryFormData)
      } else {
        await galleryAPI.createCategory(categoryFormData)
      }
      fetchData()
      resetCategoryForm()
      alert(editingCategoryId ? 'Category updated successfully' : 'Category created successfully')
    } catch (error) {
      alert(error.message || 'Failed to save category')
    }
  }

  const handleCategoryEdit = (category) => {
    setCategoryFormData({
      name: category.name,
      order: category.order || 0,
      isActive: category.isActive !== false,
    })
    setEditingCategoryId(category._id)
    setShowCategoryForm(true)
  }

  const handleCategoryDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category? All images in this category will also be deleted.')) return
    try {
      await galleryAPI.deleteCategory(id)
      fetchData()
      alert('Category deleted successfully')
    } catch (error) {
      alert(error.message || 'Failed to delete category')
    }
  }

  const resetCategoryForm = () => {
    setCategoryFormData({ name: '', order: 0, isActive: true })
    setEditingCategoryId(null)
    setShowCategoryForm(false)
  }

  const openAddCategoryForm = () => {
    resetCategoryForm()
    setShowCategoryForm(true)
  }

  // Image handlers
  const uploadImageFile = async (file) => {
    if (!file) return
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image file (SVG, PNG, JPG, GIF, or WEBP)')
      return
    }
    setUploadingImage(true)
    try {
      const folder = 'images/Gallery'
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
      setImageFormData(prev => ({ ...prev, image: imagePath }))
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload image: ${error.message || 'Unknown error'}`)
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const uploadBulkImages = async (files, categoryId = null) => {
    const targetCategory = categoryId || imageFormData.category || bulkUploadCategory
    
    if (!targetCategory) {
      alert('Please select a category first')
      return
    }

    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
    const validFiles = Array.from(files).filter(file => allowedTypes.includes(file.type))
    
    if (validFiles.length === 0) {
      alert('Please select at least one valid image file (SVG, PNG, JPG, GIF, or WEBP)')
      return
    }

    if (validFiles.length !== files.length) {
      alert(`${files.length - validFiles.length} file(s) were skipped (invalid format)`)
    }

    setBulkUploading(true)
    setBulkUploadProgress({ current: 0, total: validFiles.length })

    let successCount = 0
    let failCount = 0

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        setBulkUploadProgress({ current: i + 1, total: validFiles.length })

        try {
          // Upload file
          const folder = 'images/Gallery'
          const uploadResponse = await uploadAPI.uploadFile(file, folder)
          
          let imagePath
          if (uploadResponse && uploadResponse.success && uploadResponse.data && uploadResponse.data.path) {
            imagePath = uploadResponse.data.path
          } else if (uploadResponse && uploadResponse.data && uploadResponse.data.path) {
            imagePath = uploadResponse.data.path
          } else if (uploadResponse && uploadResponse.path) {
            imagePath = uploadResponse.path
          } else {
            throw new Error('Upload response missing path data.')
          }

          if (!imagePath) throw new Error('Image path is empty')

          // Create gallery image entry
          await galleryAPI.createImage({
            title: file.name.replace(/\.[^/.]+$/, ''), // Use filename without extension as title
            image: imagePath,
            category: targetCategory,
            order: images.length + successCount,
            isActive: true
          })

          successCount++
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error)
          failCount++
        }
      }

      // Refresh data
      await fetchData()

      // Show results
      if (successCount > 0 && failCount === 0) {
        alert(`Successfully uploaded ${successCount} image(s)!`)
      } else if (successCount > 0) {
        alert(`Uploaded ${successCount} image(s) successfully. ${failCount} failed.`)
      } else {
        alert(`Failed to upload images. Please try again.`)
      }

      // Close bulk upload modal if open
      if (showBulkUploadModal) {
        setShowBulkUploadModal(false)
        setBulkUploadCategory('')
        if (bulkFileInputRef.current) bulkFileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Bulk upload error:', error)
      alert(`Bulk upload failed: ${error.message || 'Unknown error'}`)
    } finally {
      setBulkUploading(false)
      setBulkUploadProgress({ current: 0, total: 0 })
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleImageUpload = (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    if (files.length === 1) {
      // Single file upload (existing behavior)
      uploadImageFile(files[0])
    } else {
      // Bulk upload
      uploadBulkImages(files)
    }
  }

  const handleImageDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setImageDropZoneActive(false)
    const files = e.dataTransfer.files
    if (!files || files.length === 0) return
    
    if (files.length === 1) {
      // Single file drop (existing behavior)
      uploadImageFile(files[0])
    } else {
      // Bulk drop
      uploadBulkImages(files)
    }
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

  const handleImageSubmit = async (e) => {
    e.preventDefault()
    if (!imageFormData.category) {
      alert('Please select a category')
      return
    }
    if (!imageFormData.image) {
      alert('Please upload an image')
      return
    }
    try {
      if (editingImageId) {
        await galleryAPI.updateImage(editingImageId, imageFormData)
      } else {
        await galleryAPI.createImage(imageFormData)
      }
      fetchData()
      resetImageForm()
      alert(editingImageId ? 'Image updated successfully' : 'Image created successfully')
    } catch (error) {
      alert(error.message || 'Failed to save image')
    }
  }

  const handleImageEdit = (image) => {
    setImageFormData({
      title: image.title || '',
      image: image.image,
      category: image.category._id || image.category,
      order: image.order || 0,
      isActive: image.isActive !== false,
    })
    setEditingImageId(image._id)
    setShowImageForm(true)
  }

  const handleImageDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    try {
      await galleryAPI.deleteImage(id)
      fetchData()
      alert('Image deleted successfully')
    } catch (error) {
      alert(error.message || 'Failed to delete image')
    }
  }

  const resetImageForm = () => {
    setImageFormData({ title: '', image: '', category: '', order: 0, isActive: true })
    setEditingImageId(null)
    setShowImageForm(false)
    setBulkUploading(false)
    setBulkUploadProgress({ current: 0, total: 0 })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const openAddImageForm = () => {
    resetImageForm()
    if (categories.length > 0) {
      setImageFormData(prev => ({ ...prev, category: categories[0]._id }))
    }
    setShowImageForm(true)
  }

  // Drag and drop reordering
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

  const handleDrop = async (e, dropIndex, type) => {
    e.preventDefault()
    setDragOverIndex(null)
    setDraggedIndex(null)
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10)
    if (dragIndex === dropIndex || isNaN(dragIndex)) return

    if (type === 'categories') {
      const sorted = [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      const reordered = [...sorted]
      const [removed] = reordered.splice(dragIndex, 1)
      reordered.splice(dropIndex, 0, removed)
      const payload = reordered.map((c, i) => ({ id: c._id, order: i }))
      setReorderingCategories(true)
      try {
        await galleryAPI.reorderCategories(payload)
        await fetchData()
      } catch (err) {
        alert(err.message || 'Failed to reorder categories')
      } finally {
        setReorderingCategories(false)
      }
    } else {
      const categoryId = activeTab === 'images' ? null : activeTab
      const filtered = categoryId
        ? images.filter(img => (img.category._id || img.category) === categoryId)
        : images
      const sorted = [...filtered].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      const reordered = [...sorted]
      const [removed] = reordered.splice(dragIndex, 1)
      reordered.splice(dropIndex, 0, removed)
      const payload = reordered.map((img, i) => ({ id: img._id, order: i }))
      setReorderingImages(true)
      try {
        await galleryAPI.reorderImages(payload)
        await fetchData()
      } catch (err) {
        alert(err.message || 'Failed to reorder images')
      } finally {
        setReorderingImages(false)
      }
    }
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const sortedCategories = [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const sortedImages = [...images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  if (loading) {
    return <div className="admin-loading">Loading gallery...</div>
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Manage Gallery</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          {activeTab === 'categories' && (
            <button onClick={openAddCategoryForm} className="btn-primary">
              + Add Category
            </button>
          )}
          {activeTab === 'images' && (
            <>
              <button 
                onClick={() => {
                  if (categories.length > 0) {
                    setBulkUploadCategory(categories[0]._id)
                  }
                  setShowBulkUploadModal(true)
                }} 
                className="btn-secondary"
                disabled={categories.length === 0}
              >
                📤 Bulk Upload Images
              </button>
              <button onClick={openAddImageForm} className="btn-primary">
                + Add Image
              </button>
            </>
          )}
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'categories' ? 'admin-tab--active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
        <button
          className={`admin-tab ${activeTab === 'images' ? 'admin-tab--active' : ''}`}
          onClick={() => setActiveTab('images')}
        >
          Images
        </button>
      </div>

      {/* Category Form */}
      {showCategoryForm && (
        <div className="admin-form-modal" onClick={(e) => e.target === e.currentTarget && resetCategoryForm()}>
          <div className="admin-form-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-form-header">
              <h3>{editingCategoryId ? 'Edit Category' : 'Add Category'}</h3>
              <button type="button" className="admin-form-close" onClick={resetCategoryForm}>×</button>
            </div>
            <form onSubmit={handleCategorySubmit}>
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  placeholder="e.g. Offline classroom sessions"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    value={categoryFormData.order}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={categoryFormData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, isActive: e.target.value === 'active' })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={resetCategoryForm} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editingCategoryId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="admin-form-modal" onClick={(e) => e.target === e.currentTarget && setShowBulkUploadModal(false)}>
          <div className="admin-form-content admin-form-content--large" onClick={(e) => e.stopPropagation()}>
            <div className="admin-form-header">
              <h3>Bulk Upload Images</h3>
              <button type="button" className="admin-form-close" onClick={() => setShowBulkUploadModal(false)}>×</button>
            </div>
            <div style={{ padding: '20px' }}>
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={bulkUploadCategory}
                  onChange={(e) => setBulkUploadCategory(e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Select Images *</label>
                <input
                  type="file"
                  ref={bulkFileInputRef}
                  accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files
                    if (files && files.length > 0) {
                      uploadBulkImages(files, bulkUploadCategory)
                    }
                  }}
                  style={{ display: 'none' }}
                />
                <div
                  className={`placement-image-dropzone ${bulkDropZoneActive ? 'placement-image-dropzone--active' : ''} ${bulkUploading ? 'placement-image-dropzone--uploading' : ''}`}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    e.dataTransfer.dropEffect = 'copy'
                    setBulkDropZoneActive(true)
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setBulkDropZoneActive(false)
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setBulkDropZoneActive(false)
                    const files = e.dataTransfer.files
                    if (files && files.length > 0 && bulkUploadCategory) {
                      uploadBulkImages(files, bulkUploadCategory)
                    } else if (!bulkUploadCategory) {
                      alert('Please select a category first')
                    }
                  }}
                  onClick={() => !bulkUploading && bulkFileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                >
                  <span className="placement-image-dropzone-text">
                    {bulkUploading 
                      ? `Uploading ${bulkUploadProgress.current} of ${bulkUploadProgress.total}...`
                      : 'Click to select multiple images or drag and drop'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); bulkFileInputRef.current?.click() }}
                    className="btn-secondary"
                    disabled={bulkUploading || !bulkUploadCategory}
                  >
                    {bulkUploading 
                      ? `Uploading ${bulkUploadProgress.current}/${bulkUploadProgress.total}...`
                      : 'Select Images'}
                  </button>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    Select multiple files at once
                  </span>
                </div>
                {bulkUploading && (
                  <div style={{ marginTop: '16px', padding: '12px', background: '#f0f8ff', borderRadius: '8px' }}>
                    <div style={{ fontSize: '14px', color: '#009FFF', marginBottom: '8px' }}>
                      Upload Progress: {bulkUploadProgress.current} / {bulkUploadProgress.total}
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${(bulkUploadProgress.current / bulkUploadProgress.total) * 100}%`, 
                          height: '100%', 
                          background: '#009FFF',
                          transition: 'width 0.3s ease'
                        }} 
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="form-actions" style={{ marginTop: '20px' }}>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowBulkUploadModal(false)
                    setBulkUploadCategory('')
                    if (bulkFileInputRef.current) bulkFileInputRef.current.value = ''
                  }} 
                  className="btn-secondary"
                  disabled={bulkUploading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Form */}
      {showImageForm && (
        <div className="admin-form-modal" onClick={(e) => e.target === e.currentTarget && resetImageForm()}>
          <div className="admin-form-content admin-form-content--large" onClick={(e) => e.stopPropagation()}>
            <div className="admin-form-header">
              <h3>{editingImageId ? 'Edit Image' : 'Add Image'}</h3>
              <button type="button" className="admin-form-close" onClick={resetImageForm}>×</button>
            </div>
            <form onSubmit={handleImageSubmit}>
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={imageFormData.category}
                  onChange={(e) => setImageFormData({ ...imageFormData, category: e.target.value })}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Title (Optional)</label>
                <input
                  type="text"
                  value={imageFormData.title}
                  onChange={(e) => setImageFormData({ ...imageFormData, title: e.target.value })}
                  placeholder="Image title"
                />
              </div>
              <div className="form-group">
                <label>Image *</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <div
                  className={`placement-image-dropzone ${imageDropZoneActive ? 'placement-image-dropzone--active' : ''} ${(uploadingImage || bulkUploading) ? 'placement-image-dropzone--uploading' : ''}`}
                  onDragOver={handleImageDragOver}
                  onDragLeave={handleImageDragLeave}
                  onDrop={handleImageDrop}
                  onClick={() => !uploadingImage && !bulkUploading && fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                >
                  <span className="placement-image-dropzone-text">
                    {bulkUploading 
                      ? `Uploading ${bulkUploadProgress.current} of ${bulkUploadProgress.total}...`
                      : uploadingImage 
                        ? 'Uploading...' 
                        : 'Drag and drop image(s) here, or click to browse (supports multiple files)'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                    className="btn-secondary"
                    disabled={uploadingImage || bulkUploading}
                  >
                    {bulkUploading 
                      ? `Uploading ${bulkUploadProgress.current}/${bulkUploadProgress.total}...`
                      : uploadingImage 
                        ? 'Uploading...' 
                        : 'Upload Image(s)'}
                  </button>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {!uploadingImage && !bulkUploading && '(Select multiple files for bulk upload)'}
                  </span>
                  <input
                    type="text"
                    value={imageFormData.image}
                    onChange={(e) => setImageFormData({ ...imageFormData, image: e.target.value })}
                    placeholder="/images/Gallery/image.webp"
                    style={{ flex: 1 }}
                  />
                </div>
                {imageFormData.image && (
                  <div style={{ marginTop: '10px' }}>
                    <img
                      src={`${getImageUrl(imageFormData.image)}${imageFormData.image.includes('?') ? '&' : '?'}t=${Date.now()}`}
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
                    value={imageFormData.order}
                    onChange={(e) => setImageFormData({ ...imageFormData, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={imageFormData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setImageFormData({ ...imageFormData, isActive: e.target.value === 'active' })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={resetImageForm} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editingImageId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Table */}
      {activeTab === 'categories' && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Name</th>
                <th>Slug</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCategories.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                    No categories found. Click "Add Category" to get started.
                  </td>
                </tr>
              ) : (
                sortedCategories.map((category, index) => (
                  <tr
                    key={category._id}
                    draggable={!reorderingCategories}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index, 'categories')}
                    onDragEnd={handleDragEnd}
                    className={`${draggedIndex === index ? 'admin-table-row--dragging' : ''} ${dragOverIndex === index ? 'admin-table-row--drag-over' : ''}`}
                  >
                    <td>
                      <span className="admin-drag-handle" title="Drag to reorder">⋮⋮</span>
                    </td>
                    <td>{category.name}</td>
                    <td><code>{category.slug}</code></td>
                    <td>{category.order || 0}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: category.isActive ? '#c6f6d5' : '#fed7d7',
                        color: category.isActive ? '#22543d' : '#742a2a'
                      }}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button onClick={() => handleCategoryEdit(category)} className="btn-edit">Edit</button>
                        <button onClick={() => handleCategoryDelete(category._id)} className="btn-delete">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Images Table */}
      {activeTab === 'images' && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedImages.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    No images found. Click "Add Image" to get started.
                  </td>
                </tr>
              ) : (
                sortedImages.map((image, index) => (
                  <tr
                    key={image._id}
                    draggable={!reorderingImages}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index, 'images')}
                    onDragEnd={handleDragEnd}
                    className={`${draggedIndex === index ? 'admin-table-row--dragging' : ''} ${dragOverIndex === index ? 'admin-table-row--drag-over' : ''}`}
                  >
                    <td>
                      <span className="admin-drag-handle" title="Drag to reorder">⋮⋮</span>
                    </td>
                    <td>
                      <img
                        src={getImageUrl(image.image)}
                        alt={image.title || 'Gallery image'}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                        onError={(e) => { e.target.src = '/placeholder-image.png' }}
                      />
                    </td>
                    <td>{image.title || '-'}</td>
                    <td>{image.category?.name || '-'}</td>
                    <td>{image.order || 0}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: image.isActive ? '#c6f6d5' : '#fed7d7',
                        color: image.isActive ? '#22543d' : '#742a2a'
                      }}>
                        {image.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button onClick={() => handleImageEdit(image)} className="btn-edit">Edit</button>
                        <button onClick={() => handleImageDelete(image._id)} className="btn-delete">Delete</button>
                      </div>
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

export default GalleryPage
