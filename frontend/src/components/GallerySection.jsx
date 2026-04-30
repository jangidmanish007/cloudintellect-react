import { useState, useEffect } from 'react'
import { galleryAPI, getImageUrl } from '../services/api'

function GallerySection() {
  const [categories, setCategories] = useState([])
  const [images, setImages] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchImages()
  }, [activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [categoriesRes, imagesRes] = await Promise.all([
        galleryAPI.getCategories(),
        galleryAPI.getImages('all')
      ])
      setCategories(categoriesRes.data || [])
      setImages(imagesRes.data || [])
    } catch (error) {
      console.error('Error fetching gallery data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchImages = async () => {
    try {
      const categoryId = activeTab === 'all' ? 'all' : activeTab
      const response = await galleryAPI.getImages(categoryId)
      setImages(response.data || [])
    } catch (error) {
      console.error('Error fetching images:', error)
    }
  }

  if (loading) {
    return (
      <section className="gallery-section">
        <div className="gallery-container">
          <div className="gallery-loading">Loading gallery...</div>
        </div>
      </section>
    )
  }

  // Create tabs: "All Photos" + categories
  const tabs = [
    { id: 'all', name: 'All Photos' },
    ...categories.map(cat => ({ id: cat._id, name: cat.name }))
  ]

  return (
    <section className="gallery-section">
      <div className="gallery-container">
        <div className="gallery-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`gallery-tab ${activeTab === tab.id ? 'gallery-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {images.length === 0 ? (
            <div className="gallery-empty">
              <p>No images found in this category.</p>
            </div>
          ) : (
            images.map((image) => (
              <div key={image._id} className="gallery-item">
                <img
                  src={getImageUrl(image.image)}
                  alt={image.title || 'Gallery image'}
                  className="gallery-image"
                  loading="lazy"
                  onError={(e) => {
                    console.error('Failed to load image:', image.image)
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default GallerySection
