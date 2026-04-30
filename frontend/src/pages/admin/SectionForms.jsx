/**
 * Structured form components for page sections. Non-technical users edit via text boxes, not JSON.
 */
import React, { useRef, useState } from 'react'
import { uploadAPI, getImageUrl } from '../../services/api'

function Field({ label, children }) {
  return (
    <div className="editor-field">
      {label && <label>{label}</label>}
      {children}
    </div>
  )
}

function RowTwo({ children }) {
  return <div className="editor-form-row editor-form-row--two">{children}</div>
}

function Row({ children }) {
  return <div className="editor-form-row">{children}</div>
}

function AddRemoveRow({ items, onAdd, onRemove, renderRow, addLabel = '+ Add item' }) {
  return (
    <div className="editor-field">
      {items.map((item, i) => (
        <div key={i} className="editor-repeatable-row">
          {renderRow(item, i)}
          <button type="button" className="editor-remove-row" onClick={() => onRemove(i)} aria-label="Remove">×</button>
        </div>
      ))}
      <button type="button" className="editor-add-row" onClick={onAdd}>{addLabel}</button>
    </div>
  )
}

export function StudentSuccessForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })

  const learners = Array.isArray(d.learners) && d.learners.length > 0
    ? d.learners
    : [{ name: '', lastName: '', thumbnailImage: '', mainImage: '', headline: '', testimonial: '' }]

  const setLearner = (i, field, value) => {
    const next = learners.map((l, j) => (j === i ? { ...(l || {}), [field]: value } : l))
    set('learners', next)
  }
  const addLearner = () => set('learners', [...learners, { name: '', lastName: '', thumbnailImage: '', mainImage: '', headline: '', testimonial: '' }])
  const removeLearner = (i) => set('learners', learners.filter((_, j) => j !== i))

  const [uploadingTarget, setUploadingTarget] = useState(null) // { index, field }
  const [pendingUploadTarget, setPendingUploadTarget] = useState(null) // { index, field }
  const fileInputRef = useRef(null)
  const allowedImageTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']

  const uploadImageFile = async (file, learnerIndex, field) => {
    if (!file) return
    if (!allowedImageTypes.includes(file.type)) {
      alert('Please upload an image file (SVG, PNG, JPG, GIF, or WEBP)')
      return
    }
    setUploadingTarget({ index: learnerIndex, field })
    try {
      const folder = 'images/student-success'
      const response = await uploadAPI.uploadFile(file, folder)
      const imagePath =
        response?.data?.path ||
        response?.path ||
        (response?.success && response?.data?.path) ||
        ''
      if (!imagePath) throw new Error('Upload response missing image path')
      setLearner(learnerIndex, field, imagePath)
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload image: ${error.message || 'Unknown error'}`)
    } finally {
      setUploadingTarget(null)
      setPendingUploadTarget(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const onPickFile = (e) => {
    const file = e.target.files?.[0]
    if (file && pendingUploadTarget?.index !== null && pendingUploadTarget?.field) {
      uploadImageFile(file, pendingUploadTarget.index, pendingUploadTarget.field)
    }
  }

  const parseBoldList = (value) => value.split(',').map((s) => s.trim()).filter(Boolean)

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <Row>
        <Field label="Section title">
          <input
            type="text"
            value={d.title ?? ''}
            onChange={(e) => {
              set('title', e.target.value)
              set('heading', e.target.value)
            }}
            placeholder="Student Success Stories"
          />
        </Field>
      </Row>
      <Row>
        <Field label="Description / main text">
          <textarea
            value={d.description ?? ''}
            onChange={(e) => set('description', e.target.value)}
            rows={4}
            placeholder="Discover the inspiring stories..."
          />
        </Field>
      </Row>

      <h4 className="editor-form-subsection">Testimonial card headline</h4>
      <Row>
        <Field label="Card headline">
          <input
            type="text"
            value={d.cardHeadline ?? ''}
            onChange={(e) => set('cardHeadline', e.target.value)}
            placeholder="From Training to Real Implementation"
          />
        </Field>
      </Row>
      <Row>
        <Field label="Bold words (comma-separated)">
          <input
            type="text"
            value={Array.isArray(d.cardHeadlineBold) ? d.cardHeadlineBold.join(', ') : (d.cardHeadlineBoldText ?? '')}
            onChange={(e) => {
              set('cardHeadlineBold', parseBoldList(e.target.value))
              set('cardHeadlineBoldText', e.target.value)
            }}
            placeholder="Training, Real Implementation"
          />
        </Field>
      </Row>

      <h4 className="editor-form-subsection">Learner cards</h4>
      <p className="admin-form-help">
        These cards control the left thumbnails + the right testimonial/image. If you leave this list empty, the site will fall back to the Success Stories API.
      </p>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp"
        onChange={onPickFile}
        style={{ display: 'none' }}
      />

      <AddRemoveRow
        items={learners}
        onAdd={addLearner}
        onRemove={removeLearner}
        addLabel="+ Add learner"
        renderRow={(learner, i) => {
          const thumbnailPath = learner?.thumbnailImage || learner?.image || ''
          const mainPath = learner?.mainImage || learner?.image || ''
          const thumbPreviewUrl = thumbnailPath ? getImageUrl(thumbnailPath) : ''
          const mainPreviewUrl = mainPath ? getImageUrl(mainPath) : ''
          const isUploadingThumb = uploadingTarget?.index === i && uploadingTarget?.field === 'thumbnailImage'
          const isUploadingMain = uploadingTarget?.index === i && uploadingTarget?.field === 'mainImage'
          return (
            <div className="editor-card-fields" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input type="text" value={learner?.name ?? ''} onChange={(e) => setLearner(i, 'name', e.target.value)} placeholder="First name" />
              <input type="text" value={learner?.lastName ?? ''} onChange={(e) => setLearner(i, 'lastName', e.target.value)} placeholder="Last name" />
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Thumbnail image (left slider)">
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ width: 90, height: 70, borderRadius: 10, overflow: 'hidden', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {thumbPreviewUrl ? <img src={thumbPreviewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 12, color: '#6b7280' }}>No image</span>}
                    </div>
                    <input
                      type="text"
                      value={thumbnailPath}
                      onChange={(e) => setLearner(i, 'thumbnailImage', e.target.value)}
                      placeholder="/images/... or uploaded path"
                      style={{ flex: 1, minWidth: 220 }}
                    />
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => { if (uploadingTarget) return; setPendingUploadTarget({ index: i, field: 'thumbnailImage' }); fileInputRef.current?.click() }}
                      disabled={!!uploadingTarget}
                    >
                      {isUploadingThumb ? 'Uploading…' : 'Upload'}
                    </button>
                  </div>
                </Field>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Main image (right side)">
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ width: 90, height: 70, borderRadius: 10, overflow: 'hidden', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {mainPreviewUrl ? <img src={mainPreviewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 12, color: '#6b7280' }}>No image</span>}
                    </div>
                    <input
                      type="text"
                      value={mainPath}
                      onChange={(e) => setLearner(i, 'mainImage', e.target.value)}
                      placeholder="/images/... or uploaded path"
                      style={{ flex: 1, minWidth: 220 }}
                    />
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => { if (uploadingTarget) return; setPendingUploadTarget({ index: i, field: 'mainImage' }); fileInputRef.current?.click() }}
                      disabled={!!uploadingTarget}
                    >
                      {isUploadingMain ? 'Uploading…' : 'Upload'}
                    </button>
                  </div>
                </Field>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Headline (shown in the white card)">
                  <input type="text" value={learner?.headline ?? ''} onChange={(e) => setLearner(i, 'headline', e.target.value)} placeholder="From Training to Real Implementation" />
                </Field>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Testimonial text">
                  <textarea value={learner?.testimonial ?? ''} onChange={(e) => setLearner(i, 'testimonial', e.target.value)} rows={3} placeholder="Write the testimonial..." />
                </Field>
              </div>
            </div>
          )
        }}
      />

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

const ACHIEVEMENT_HIGHLIGHTS_IMAGE_FOLDER = 'images/achievement-highlights'

export function AchievementHighlightsForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })

  const defaultStats = () => [
    { number: '1400+', title: 'SUCCESSFUL CANDIDATE PLACEMENTS', description: 'Across top Salesforce Partner Companies' },
    { number: '5000+', title: 'LEARNERS TRAINED ACROSS INDIA', description: 'Workforce Programs & Online Batches' },
    { number: '11+ Years', title: 'STRONG TRACK RECORD', description: 'in Salesforce Workforce Upskilling' },
    { number: '20 +', title: 'INDUSTRY RECOGNIZED MENTORS & CONSULTANTS', description: 'Training students with real project exposure' },
  ]

  const stats = Array.isArray(d.stats) && d.stats.length > 0 ? d.stats : defaultStats()
  const setStat = (i, field, value) => set('stats', stats.map((s, j) => (j === i ? { ...(s || {}), [field]: value } : s)))
  const addStat = () => set('stats', [...stats, { number: '', title: '', description: '' }])
  const removeStat = (i) => set('stats', stats.filter((_, j) => j !== i))

  const gallery = Array.isArray(d.gallery) && d.gallery.length > 0 ? d.gallery : [{ image: '' }]
  const setGallery = (i, field, value) => set('gallery', gallery.map((g, j) => (j === i ? { ...(g || {}), [field]: value } : g)))
  const addGallery = () => set('gallery', [...gallery, { image: '' }])
  const removeGallery = (i) => set('gallery', gallery.filter((_, j) => j !== i))

  const [uploadingGalleryIndex, setUploadingGalleryIndex] = useState(null)
  const [pendingGalleryIndex, setPendingGalleryIndex] = useState(null)
  const galleryFileRef = useRef(null)
  const allowedImageTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']

  const uploadGalleryFile = async (file, index) => {
    if (!file) return
    if (!allowedImageTypes.includes(file.type)) {
      alert('Please upload an image file (SVG, PNG, JPG, GIF, or WEBP)')
      return
    }
    setUploadingGalleryIndex(index)
    try {
      const response = await uploadAPI.uploadFile(file, ACHIEVEMENT_HIGHLIGHTS_IMAGE_FOLDER)
      const imagePath =
        response?.data?.path ||
        response?.path ||
        (response?.success && response?.data?.path) ||
        ''
      if (!imagePath) throw new Error('Upload response missing image path')
      setGallery(index, 'image', imagePath)
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload image: ${error.message || 'Unknown error'}`)
    } finally {
      setUploadingGalleryIndex(null)
      setPendingGalleryIndex(null)
      if (galleryFileRef.current) galleryFileRef.current.value = ''
    }
  }

  const onGalleryPick = (e) => {
    const file = e.target.files?.[0]
    if (file && pendingGalleryIndex !== null) uploadGalleryFile(file, pendingGalleryIndex)
  }

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Section heading</h4>
      <RowTwo>
        <Field label="Heading (light part)">
          <input type="text" value={d.headingLight ?? ''} onChange={(e) => set('headingLight', e.target.value)} placeholder="CI Achievement" />
        </Field>
        <Field label="Heading (bold part)">
          <input type="text" value={d.headingBold ?? ''} onChange={(e) => set('headingBold', e.target.value)} placeholder="Highlights" />
        </Field>
      </RowTwo>

      <h4 className="editor-form-subsection">Stat columns</h4>
      <p className="admin-form-help">Large number, title (caps), and short description for each column.</p>
      {stats.map((stat, i) => (
        <div key={i} className="editor-card-block" style={{ flexDirection: 'column', alignItems: 'stretch', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span>Stat {i + 1}</span>
            <button type="button" className="editor-remove-row" onClick={() => removeStat(i)} aria-label="Remove">×</button>
          </div>
          <Row><Field label="Number"><input type="text" value={stat.number ?? ''} onChange={(e) => setStat(i, 'number', e.target.value)} placeholder="1400+" /></Field></Row>
          <Row><Field label="Title"><input type="text" value={stat.title ?? ''} onChange={(e) => setStat(i, 'title', e.target.value)} placeholder="SUCCESSFUL CANDIDATE PLACEMENTS" /></Field></Row>
          <Row><Field label="Description"><input type="text" value={stat.description ?? ''} onChange={(e) => setStat(i, 'description', e.target.value)} placeholder="Across top Salesforce Partner Companies" /></Field></Row>
        </div>
      ))}
      <button type="button" className="editor-add-row" onClick={addStat}>+ Add stat</button>

      <h4 className="editor-form-subsection">Image gallery (horizontal slider)</h4>
      <input
        type="file"
        ref={galleryFileRef}
        accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp"
        onChange={onGalleryPick}
        style={{ display: 'none' }}
      />
      {gallery.map((item, i) => {
        const path = item?.image || ''
        const preview = path ? getImageUrl(path.startsWith('/') ? path : `/${path}`) : ''
        return (
          <div key={i} className="editor-card-block" style={{ flexDirection: 'column', alignItems: 'stretch', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span>Image {i + 1}</span>
              <button type="button" className="editor-remove-row" onClick={() => removeGallery(i)} aria-label="Remove">×</button>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: 120, height: 80, borderRadius: 10, overflow: 'hidden', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {preview ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 12, color: '#6b7280' }}>No image</span>}
              </div>
              <input
                type="text"
                value={path}
                onChange={(e) => setGallery(i, 'image', e.target.value)}
                placeholder="/images/... or upload"
                style={{ flex: 1, minWidth: 200 }}
              />
              <button
                type="button"
                className="btn-secondary"
                onClick={() => { if (uploadingGalleryIndex !== null) return; setPendingGalleryIndex(i); galleryFileRef.current?.click() }}
                disabled={uploadingGalleryIndex !== null}
              >
                {uploadingGalleryIndex === i ? 'Uploading…' : 'Upload'}
              </button>
            </div>
          </div>
        )
      })}
      <button type="button" className="editor-add-row" onClick={addGallery}>+ Add gallery image</button>

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

/** FAQ page: heading + question/answer accordion items */
export function FaqForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })

  const items = Array.isArray(d.items) && d.items.length > 0
    ? d.items
    : [{ number: '', question: '', answer: '', image: '' }]

  const setItem = (i, field, value) => {
    set('items', items.map((it, j) => (j === i ? { ...(it || {}), [field]: value } : it)))
  }

  const addItem = () => set('items', [...items, { number: '', question: '', answer: '', image: '' }])
  const removeItem = (i) => set('items', items.filter((_, j) => j !== i))

  const [uploadingBackground, setUploadingBackground] = useState(false)
  const [backgroundDragActive, setBackgroundDragActive] = useState(false)
  const backgroundFileRef = useRef(null)
  const allowedImageTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
  const BACKGROUND_FOLDER = 'images/faq'

  const uploadBackgroundFile = async (file) => {
    if (!file) return
    if (!allowedImageTypes.includes(file.type)) {
      alert('Please upload an image file (SVG, PNG, JPG, GIF, or WEBP)')
      return
    }
    setUploadingBackground(true)
    try {
      const response = await uploadAPI.uploadFile(file, BACKGROUND_FOLDER)
      const imagePath =
        response?.data?.path ||
        response?.path ||
        (response?.success && response?.data?.path) ||
        ''
      if (!imagePath) throw new Error('Upload response missing image path')
      set('backgroundImage', imagePath)
    } catch (error) {
      console.error('Upload background error:', error)
      alert(error.message || 'Failed to upload background image')
    } finally {
      setUploadingBackground(false)
      setBackgroundDragActive(false)
      if (backgroundFileRef.current) backgroundFileRef.current.value = ''
    }
  }

  const onPickBackground = (e) => {
    const file = e.target.files?.[0]
    if (file) uploadBackgroundFile(file)
  }

  const onBackgroundDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setBackgroundDragActive(true)
  }

  const onBackgroundDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setBackgroundDragActive(false)
  }

  const onBackgroundDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setBackgroundDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadBackgroundFile(file)
  }

  const cta = d.cta && typeof d.cta === 'object' ? d.cta : {}
  const setCta = (key, value) => set('cta', { ...cta, [key]: value })
  const features = Array.isArray(cta.features) ? cta.features : []
  const badgePreviewUrl = (() => {
    const p = typeof cta.badgeImage === 'string' ? cta.badgeImage.trim() : ''
    if (!p) return ''
    if (p.startsWith('http')) return p
    return getImageUrl(p.startsWith('/') ? p : `/${p}`)
  })()

  const [uploadingBadge, setUploadingBadge] = useState(false)
  const badgeFileRef = useRef(null)

  const [uploadingItemImageIndex, setUploadingItemImageIndex] = useState(null)
  const [pendingFaqItemImageIndex, setPendingFaqItemImageIndex] = useState(null)
  const faqItemImageFileRef = useRef(null)
  const FAQ_ITEMS_IMAGE_FOLDER = 'images/faq'

  const allowedFaqItemImageTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']

  const uploadFaqItemImageFile = async (file, itemIndex) => {
    if (!file) return
    if (!allowedFaqItemImageTypes.includes(file.type)) {
      alert('Please upload an image file (SVG, PNG, JPG, GIF, or WEBP)')
      return
    }
    setUploadingItemImageIndex(itemIndex)
    try {
      const response = await uploadAPI.uploadFile(file, FAQ_ITEMS_IMAGE_FOLDER)
      const imagePath =
        response?.data?.path ||
        response?.path ||
        (response?.success && response?.data?.path) ||
        ''
      if (!imagePath) throw new Error('Upload response missing image path')
      setItem(itemIndex, 'image', imagePath)
    } catch (error) {
      console.error('Upload FAQ item image error:', error)
      alert(`Failed to upload image: ${error.message || 'Unknown error'}`)
    } finally {
      setUploadingItemImageIndex(null)
      setPendingFaqItemImageIndex(null)
      if (faqItemImageFileRef.current) faqItemImageFileRef.current.value = ''
    }
  }

  const CTA_BADGE_FOLDER = 'images/faq'

  const uploadBadgeFile = async (file) => {
    if (!file) return
    if (!allowedImageTypes.includes(file.type)) {
      alert('Please upload an image file (SVG, PNG, JPG, GIF, or WEBP)')
      return
    }
    setUploadingBadge(true)
    try {
      const response = await uploadAPI.uploadFile(file, CTA_BADGE_FOLDER)
      const imagePath =
        response?.data?.path ||
        response?.path ||
        (response?.success && response?.data?.path) ||
        ''
      if (!imagePath) throw new Error('Upload response missing image path')
      setCta('badgeImage', imagePath)
    } catch (error) {
      console.error('Upload badge error:', error)
      alert(error.message || 'Failed to upload badge image')
    } finally {
      setUploadingBadge(false)
      if (badgeFileRef.current) badgeFileRef.current.value = ''
    }
  }

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <input
        type="file"
        ref={faqItemImageFileRef}
        accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          const idx = pendingFaqItemImageIndex
          setPendingFaqItemImageIndex(null)
          if (file && typeof idx === 'number' && idx >= 0) uploadFaqItemImageFile(file, idx)
        }}
      />
      <h4 className="editor-form-subsection">FAQ Heading</h4>
      <RowTwo>
        <Field label="Heading (light / first line)">
          <input
            type="text"
            value={d.headingLine1 ?? ''}
            onChange={(e) => set('headingLine1', e.target.value)}
            placeholder="FAQ"
          />
        </Field>
        <Field label="Heading (bold / second line)">
          <input
            type="text"
            value={d.headingStrong ?? ''}
            onChange={(e) => set('headingStrong', e.target.value)}
            placeholder="Frequently Asked Questions"
          />
        </Field>
      </RowTwo>

      <h4 className="editor-form-subsection">Background (optional)</h4>
      <Row>
        <Field label="Background image (drag & drop)">
          <input
            type="file"
            ref={backgroundFileRef}
            accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp"
            onChange={onPickBackground}
            style={{ display: 'none' }}
          />

          <div
            className="faq-bg-dropzone"
            role="button"
            tabIndex={0}
            onClick={() => !uploadingBackground && backgroundFileRef.current?.click()}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !uploadingBackground) {
                e.preventDefault()
                backgroundFileRef.current?.click()
              }
            }}
            onDragOver={onBackgroundDragOver}
            onDragLeave={onBackgroundDragLeave}
            onDrop={onBackgroundDrop}
            aria-label="Upload background image by dragging and dropping"
            style={{
              border: `2px dashed ${backgroundDragActive ? '#4299e1' : '#cbd5e0'}`,
              borderRadius: 12,
              padding: 14,
              background: backgroundDragActive ? '#ebf8ff' : '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 56, height: 40, borderRadius: 10, overflow: 'hidden', background: '#e2e8f0', display: 'grid', placeItems: 'center' }}>
                {d.backgroundImage ? (
                  <img
                    src={getImageUrl(d.backgroundImage.startsWith('/') ? d.backgroundImage : `/${d.backgroundImage}`)}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: 12, color: '#64748b' }}>BG</span>
                )}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#1a202c' }}>
                  {uploadingBackground ? 'Uploading…' : 'Drag & drop image here'}
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  or click to browse (SVG/PNG/JPG/GIF/WEBP)
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-secondary"
              disabled={uploadingBackground}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                backgroundFileRef.current?.click()
              }}
            >
              {uploadingBackground ? 'Uploading…' : 'Select file'}
            </button>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Background image path (optional override)</label>
            <input
              type="text"
              value={d.backgroundImage ?? ''}
              onChange={(e) => set('backgroundImage', e.target.value)}
              placeholder="/images/BG (2).webp"
              style={{ width: '100%' }}
            />
          </div>
        </Field>
      </Row>

      <h4 className="editor-form-subsection">FAQ Items</h4>
      <p className="admin-form-help">
        Add FAQ accordion items. `Number (icon)` is the icon id used on the left; `Row image` is optional but matches the expanded UI style.
      </p>

      {items.map((item, i) => (
        <div key={i} className="editor-card-block" style={{ flexDirection: 'column', alignItems: 'stretch', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span>Item {i + 1}</span>
            <button type="button" className="editor-remove-row" onClick={() => removeItem(i)} aria-label="Remove">×</button>
          </div>
          <RowTwo>
            <Field label="Number (icon)">
              <input type="text" value={item?.number ?? ''} onChange={(e) => setItem(i, 'number', e.target.value)} placeholder="e.g. 12" />
            </Field>
            <Field label="Question">
              <input type="text" value={item?.question ?? ''} onChange={(e) => setItem(i, 'question', e.target.value)} placeholder="Enter question" />
            </Field>
          </RowTwo>
          <Row>
            <Field label="Answer">
              <textarea value={item?.answer ?? ''} onChange={(e) => setItem(i, 'answer', e.target.value)} rows={4} placeholder="Enter answer text" />
            </Field>
          </Row>
          <Field label="Row image (optional)">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 12 }}>
              <div
                className={`placement-image-dropzone ${uploadingItemImageIndex === i ? 'placement-image-dropzone--uploading' : ''}`}
                style={{ minWidth: 140, minHeight: 90, cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                aria-label={`Item ${i + 1} row image: drag image or click to upload`}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  e.dataTransfer.dropEffect = 'copy'
                }}
                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation() }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const file = e.dataTransfer.files?.[0]
                  if (file) uploadFaqItemImageFile(file, i)
                }}
                onClick={() => {
                  if (uploadingItemImageIndex !== null) return
                  setPendingFaqItemImageIndex(i)
                  faqItemImageFileRef.current?.click()
                }}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && uploadingItemImageIndex === null) {
                    e.preventDefault()
                    setPendingFaqItemImageIndex(i)
                    faqItemImageFileRef.current?.click()
                  }
                }}
              >
                {(() => {
                  const imagePath = item?.image || ''
                  const previewUrl = imagePath
                    ? getImageUrl(imagePath.startsWith('/') ? imagePath : `/${imagePath}`)
                    : ''
                  if (uploadingItemImageIndex === i) return 'Uploading…'
                  return previewUrl ? <img src={previewUrl} alt="" style={{ maxWidth: '100%', maxHeight: 90, objectFit: 'contain' }} /> : 'Drop or click'
                })()}
              </div>

              <div style={{ flex: 1, minWidth: 180 }}>
                <input
                  type="text"
                  value={item?.image ?? ''}
                  onChange={(e) => setItem(i, 'image', e.target.value)}
                  placeholder="Or paste image path"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </Field>
        </div>
      ))}

      <button type="button" className="editor-add-row" onClick={addItem}>+ Add FAQ</button>

      <h4 className="editor-form-subsection" style={{ marginTop: 26 }}>Final CTA (optional)</h4>
      <p className="admin-form-help">
        This block will appear below the FAQ accordion.
      </p>

      <Row>
        <Field label="Badge text (optional)">
          <input
            type="text"
            value={cta.badgeText ?? ''}
            onChange={(e) => setCta('badgeText', e.target.value)}
            placeholder="e.g. Limited Seats Available"
          />
        </Field>
      </Row>

      <Row>
        <Field label="Badge image (optional upload)">
          <input
            type="file"
            ref={badgeFileRef}
            accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) uploadBadgeFile(file)
            }}
            style={{ display: 'none' }}
          />
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: 90, height: 70, borderRadius: 10, overflow: 'hidden', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cta.badgeImage ? (
                <img
                  src={badgePreviewUrl}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: 12, color: '#6b7280' }}>No image</span>
              )}
            </div>

            <button
              type="button"
              className="btn-secondary"
              disabled={uploadingBadge}
              onClick={() => badgeFileRef.current?.click()}
            >
              {uploadingBadge ? 'Uploading…' : 'Upload badge'}
            </button>

            <input
              type="text"
              value={cta.badgeImage ?? ''}
              onChange={(e) => setCta('badgeImage', e.target.value)}
              placeholder="/images/.. or uploaded path"
              style={{ flex: 1, minWidth: 220 }}
            />
          </div>
        </Field>
      </Row>

      <Row>
        <Field label="CTA title">
          <input
            type="text"
            value={cta.title ?? ''}
            onChange={(e) => setCta('title', e.target.value)}
            placeholder="Start Your Salesforce Career Today"
          />
        </Field>
      </Row>

      <Row>
        <Field label="CTA description">
          <textarea
            value={cta.description ?? ''}
            onChange={(e) => setCta('description', e.target.value)}
            rows={4}
            placeholder="Join 10,000+ students who transformed their careers..."
          />
        </Field>
      </Row>

      <RowTwo>
        <Field label="Button text">
          <input
            type="text"
            value={cta.buttonText ?? ''}
            onChange={(e) => setCta('buttonText', e.target.value)}
            placeholder="Reserve Your Seat"
          />
        </Field>
        <Field label="Button href">
          <input
            type="text"
            value={cta.buttonHref ?? ''}
            onChange={(e) => setCta('buttonHref', e.target.value)}
            placeholder="#"
          />
        </Field>
      </RowTwo>

      <h4 className="editor-form-subsection" style={{ marginTop: 18 }}>CTA features (bullets)</h4>
      <p className="admin-form-help">
        Add short benefit lines (shown as dot + text).
      </p>
      {features.length === 0 ? (
        <div className="editor-repeatable-row" style={{ marginBottom: 12, color: '#64748b', fontSize: 12 }}>
          No features added.
        </div>
      ) : null}
      {features.map((f, i) => (
        <div key={i} className="editor-repeatable-row" style={{ alignItems: 'stretch' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={typeof f === 'string' ? f : f?.text ?? ''}
              onChange={(e) => setCta('features', features.map((x, j) => (j === i ? e.target.value : x)))}
              placeholder="e.g. Lifetime access"
              style={{ width: '100%' }}
            />
          </div>
          <button type="button" className="editor-remove-row" onClick={() => setCta('features', features.filter((_, j) => j !== i))} aria-label="Remove feature">×</button>
        </div>
      ))}
      <button
        type="button"
        className="editor-add-row"
        onClick={() => setCta('features', [...features, ''])}
        style={{ marginTop: 6 }}
      >
        + Add feature
      </button>

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update FAQ'}</button>
      </div>
    </form>
  )
}

export function BridgingForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const missionTags = Array.isArray(d.missionTags) ? d.missionTags : []
  const setTag = (i, value) => {
    const next = [...missionTags]
    next[i] = value
    set('missionTags', next)
  }
  const addTag = () => set('missionTags', [...missionTags, ''])
  const removeTag = (i) => set('missionTags', missionTags.filter((_, j) => j !== i))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <Row>
        <Field label="Heading line 1 (e.g. Education)">
          <input type="text" value={d.headingLine1 ?? ''} onChange={(e) => set('headingLine1', e.target.value)} placeholder="Education" />
        </Field>
      </Row>
      <Row>
        <Field label="Heading line 2 (e.g. & Industry)">
          <input type="text" value={d.headingLine2 ?? ''} onChange={(e) => set('headingLine2', e.target.value)} placeholder="& Industry" />
        </Field>
      </Row>
      <Row>
        <Field label="Intro paragraph">
          <textarea value={d.intro ?? ''} onChange={(e) => set('intro', e.target.value)} rows={3} placeholder="Main intro text..." />
        </Field>
      </Row>
      <RowTwo>
        <Field label="Vision title">
          <input type="text" value={d.visionTitle ?? ''} onChange={(e) => set('visionTitle', e.target.value)} placeholder="Our Vision" />
        </Field>
        <Field label="Mission title">
          <input type="text" value={d.missionTitle ?? ''} onChange={(e) => set('missionTitle', e.target.value)} placeholder="Our Mission" />
        </Field>
      </RowTwo>
      <Row>
        <Field label="Vision text">
          <textarea value={d.visionText ?? ''} onChange={(e) => set('visionText', e.target.value)} rows={2} />
        </Field>
      </Row>
      <Row>
        <Field label="Mission tags (one per line or add below)">
          {missionTags.map((tag, i) => (
            <div key={i} className="editor-stat-row" style={{ gridTemplateColumns: '1fr auto' }}>
              <input type="text" value={tag} onChange={(e) => setTag(i, e.target.value)} placeholder="e.g. Industry-aligned training" />
              <button type="button" className="editor-remove-row" onClick={() => removeTag(i)}>×</button>
            </div>
          ))}
          <button type="button" className="editor-add-row" onClick={addTag}>+ Add tag</button>
        </Field>
      </Row>
      <Row><Field label="Partner subtitle"><input type="text" value={d.partnerSubtitle ?? ''} onChange={(e) => set('partnerSubtitle', e.target.value)} placeholder="CLOUD INTELLECT SYSTEMS." /></Field></Row>
      <Row><Field label="Partner name"><input type="text" value={d.partnerName ?? ''} onChange={(e) => set('partnerName', e.target.value)} placeholder="Ridge Consulting Partner" /></Field></Row>
      <Row><Field label="Partner description"><textarea value={d.partnerDesc ?? ''} onChange={(e) => set('partnerDesc', e.target.value)} rows={2} /></Field></Row>
      <RowTwo>
        <Field label="Guarantee title"><input type="text" value={d.guaranteeTitle ?? ''} onChange={(e) => set('guaranteeTitle', e.target.value)} placeholder="Real Project Experience" /></Field>
        <Field label="Guarantee subtitle"><input type="text" value={d.guaranteeSub ?? ''} onChange={(e) => set('guaranteeSub', e.target.value)} placeholder="Guaranteed exposure" /></Field>
      </RowTwo>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

export function CloudIntellectEdgeForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const cards = Array.isArray(d.cards) && d.cards.length > 0 ? d.cards : [{ title: '', description: '', icon: '' }]
  const setCard = (i, field, value) => {
    const next = cards.map((c, j) => (j === i ? { ...c, [field]: value } : c))
    set('cards', next)
  }
  const addCard = () => set('cards', [...cards, { title: '', description: '', icon: '' }])
  const removeCard = (i) => set('cards', cards.filter((_, j) => j !== i))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <RowTwo>
        <Field label="Section heading (before bold part)">
          <input type="text" value={d.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="The Cloud Intellect" />
        </Field>
        <Field label="Bold part of heading">
          <input type="text" value={d.headingBold ?? ''} onChange={(e) => set('headingBold', e.target.value)} placeholder="Edge" />
        </Field>
      </RowTwo>
      <Field label="Cards (each card has title, description, and optional icon path)">
        {cards.map((card, i) => (
          <div key={i} className="editor-card-block">
            <div className="editor-card-fields">
              <input type="text" value={card.title ?? ''} onChange={(e) => setCard(i, 'title', e.target.value)} placeholder="Card title" />
              <input type="text" value={card.description ?? ''} onChange={(e) => setCard(i, 'description', e.target.value)} placeholder="Card description" />
              <input type="text" value={card.icon ?? ''} onChange={(e) => setCard(i, 'icon', e.target.value)} placeholder="Icon path (e.g. /images/icon.svg)" />
            </div>
            <button type="button" className="editor-remove-row" onClick={() => removeCard(i)}>×</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addCard}>+ Add card</button>
      </Field>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

const FACULTY_MENTORS_IMAGE_FOLDER = 'images/faculty'

export function FacultyMentorsForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const mentors = Array.isArray(d.mentors) && d.mentors.length > 0
    ? d.mentors
    : [
        { name: '', role: '', experience: '', image: '' },
      ]
  const setMentor = (i, field, value) => {
    const next = mentors.map((m, j) => (j === i ? { ...m, [field]: value } : m))
    set('mentors', next)
  }
  const addMentor = () => set('mentors', [...mentors, { name: '', role: '', experience: '', image: '' }])
  const removeMentor = (i) => set('mentors', mentors.filter((_, j) => j !== i))

  const [uploadingMentorIndex, setUploadingMentorIndex] = useState(null)
  const [pendingMentorIndex, setPendingMentorIndex] = useState(null)
  const mentorImageFileRef = useRef(null)

  const handleMentorImageUpload = async (index, file) => {
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10MB')
      return
    }
    setUploadingMentorIndex(index)
    try {
      const response = await uploadAPI.uploadFile(file, FACULTY_MENTORS_IMAGE_FOLDER)
      const path = parseUploadPathResponse(response)
      if (path) setMentor(index, 'image', path)
      else throw new Error('Upload response missing path')
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingMentorIndex(null)
      if (mentorImageFileRef.current) mentorImageFileRef.current.value = ''
    }
  }

  const onMentorImageDrop = (e, index) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer?.files?.[0]
    if (file) handleMentorImageUpload(index, file)
  }
  const onMentorImageDragOver = (e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy' }
  const onMentorImageDragLeave = (e) => { e.preventDefault(); e.stopPropagation() }

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <RowTwo>
        <Field label="Heading (before bold)">
          <input type="text" value={d.title ?? ''} onChange={(e) => set('title', e.target.value)} placeholder="Faculty &" />
        </Field>
        <Field label="Bold part of heading">
          <input type="text" value={d.titleBold ?? ''} onChange={(e) => set('titleBold', e.target.value)} placeholder="Industry Mentors" />
        </Field>
      </RowTwo>
      <Field label="Mentor cards (name, role, experience, photo)">
        <p className="admin-form-help">Drag & drop or click to upload each mentor photo. Or enter an image path.</p>
        <input
          type="file"
          ref={mentorImageFileRef}
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target?.files?.[0]
            const idx = pendingMentorIndex
            setPendingMentorIndex(null)
            if (file && typeof idx === 'number' && idx >= 0) handleMentorImageUpload(idx, file)
          }}
        />
        {mentors.map((m, i) => (
          <div key={i} className="editor-card-block" style={{ flexDirection: 'column', alignItems: 'stretch', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span>Mentor {i + 1}</span>
              <button type="button" className="editor-remove-row" onClick={() => removeMentor(i)} aria-label="Remove">×</button>
            </div>
            <Row><Field label="Name"><input type="text" value={m.name ?? ''} onChange={(e) => setMentor(i, 'name', e.target.value)} placeholder="e.g. Mr. Roshan Vishwakarma" /></Field></Row>
            <Row><Field label="Role"><input type="text" value={m.role ?? ''} onChange={(e) => setMentor(i, 'role', e.target.value)} placeholder="e.g. Salesforce LWC Expert" /></Field></Row>
            <Row><Field label="Experience"><input type="text" value={m.experience ?? ''} onChange={(e) => setMentor(i, 'experience', e.target.value)} placeholder="e.g. 07+ Years Experience" /></Field></Row>
            <Field label="Photo (drag & drop or click to upload)">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div
                  className={`placement-image-dropzone ${uploadingMentorIndex === i ? 'placement-image-dropzone--uploading' : ''}`}
                  style={{ minWidth: 100, minHeight: 80 }}
                  onDragOver={onMentorImageDragOver}
                  onDragLeave={onMentorImageDragLeave}
                  onDrop={(e) => onMentorImageDrop(e, i)}
                  onClick={() => { if (uploadingMentorIndex !== null) return; setPendingMentorIndex(i); mentorImageFileRef.current?.click(); }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && uploadingMentorIndex === null) { e.preventDefault(); setPendingMentorIndex(i); mentorImageFileRef.current?.click(); } }}
                  aria-label={`Mentor ${i + 1} photo: drag image or click to upload`}
                >
                  {uploadingMentorIndex === i ? 'Uploading…' : 'Drag & drop or click'}
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <input type="text" value={m.image ?? ''} onChange={(e) => setMentor(i, 'image', e.target.value)} placeholder="Or enter image path" style={{ width: '100%' }} />
                  {(m.image || '').trim() && (
                    <img src={(m.image || '').startsWith('/') || (m.image || '').includes('images/') ? getImageUrl(m.image) : m.image} alt="" style={{ maxWidth: 80, maxHeight: 80, objectFit: 'cover', marginTop: 6, borderRadius: 8 }} onError={(e) => { e.target.style.display = 'none' }} />
                  )}
                </div>
              </div>
            </Field>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addMentor}>+ Add mentor</button>
      </Field>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

const LEADERSHIP_BLOCK_ICON_FOLDER = 'images/leadership'

export function LeadershipEdgeForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const paras = Array.isArray(d.paras) && d.paras.length > 0 ? d.paras : ['']
  const setPara = (i, value) => set('paras', paras.map((p, j) => (j === i ? value : p)))
  const addPara = () => set('paras', [...paras, ''])
  const removePara = (i) => set('paras', paras.filter((_, j) => j !== i))
  const stats = Array.isArray(d.stats) && d.stats.length > 0 ? d.stats : [{ number: '', label: '' }]
  const setStat = (i, field, value) => set('stats', stats.map((s, j) => (j === i ? { ...s, [field]: value } : s)))
  const addStat = () => set('stats', [...stats, { number: '', label: '', detail: '' }])
  const removeStat = (i) => set('stats', stats.filter((_, j) => j !== i))
  const [uploadingBlockIcon, setUploadingBlockIcon] = useState(false)
  const [dropZoneBlockIconActive, setDropZoneBlockIconActive] = useState(false)
  const blockIconFileRef = useRef(null)

  const handleBlockIconUpload = async (e) => {
    const file = e?.target?.files?.[0]
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Icon must be under 2MB')
      return
    }
    setUploadingBlockIcon(true)
    try {
      const response = await uploadAPI.uploadFile(file, LEADERSHIP_BLOCK_ICON_FOLDER)
      const path = parseUploadPathResponse(response)
      if (path) set('blockIcon', path)
      else throw new Error('Upload response missing path')
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingBlockIcon(false)
      setDropZoneBlockIconActive(false)
      if (blockIconFileRef.current) blockIconFileRef.current.value = ''
    }
  }
  const onBlockIconDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropZoneBlockIconActive(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) handleBlockIconUpload({ target: { files: [file] } })
  }
  const onBlockIconDragOver = (e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; setDropZoneBlockIconActive(true) }
  const onBlockIconDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDropZoneBlockIconActive(false) }

  const [uploadingAchievementsIcon, setUploadingAchievementsIcon] = useState(false)
  const [dropZoneAchievementsIconActive, setDropZoneAchievementsIconActive] = useState(false)
  const achievementsIconFileRef = useRef(null)
  const handleAchievementsIconUpload = async (e) => {
    const file = e?.target?.files?.[0]
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Icon must be under 2MB')
      return
    }
    setUploadingAchievementsIcon(true)
    try {
      const response = await uploadAPI.uploadFile(file, LEADERSHIP_BLOCK_ICON_FOLDER)
      const path = parseUploadPathResponse(response)
      if (path) set('achievementsIcon', path)
      else throw new Error('Upload response missing path')
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingAchievementsIcon(false)
      setDropZoneAchievementsIconActive(false)
      if (achievementsIconFileRef.current) achievementsIconFileRef.current.value = ''
    }
  }
  const onAchievementsIconDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropZoneAchievementsIconActive(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) handleAchievementsIconUpload({ target: { files: [file] } })
  }
  const onAchievementsIconDragOver = (e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; setDropZoneAchievementsIconActive(true) }
  const onAchievementsIconDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDropZoneAchievementsIconActive(false) }

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <Row><Field label="Section title"><input type="text" value={d.title ?? ''} onChange={(e) => set('title', e.target.value)} placeholder="The Cloud Intellect Edge" /></Field></Row>
      <Row><Field label="Label (e.g. LEADERSHIP MESSAGE)"><input type="text" value={d.label ?? ''} onChange={(e) => set('label', e.target.value)} /></Field></Row>
      <Row><Field label="Quote (main quote text)"><textarea value={d.quote ?? ''} onChange={(e) => set('quote', e.target.value)} rows={2} placeholder="Our aim is to create an environment..." /></Field></Row>
      <Row><Field label="Quote highlight (part shown in bold)"><input type="text" value={d.quoteHighlight ?? ''} onChange={(e) => set('quoteHighlight', e.target.value)} placeholder="real skills." /></Field></Row>
      <Field label="Paragraphs">
        {paras.map((p, i) => (
          <div key={i} className="editor-repeatable-row">
            <textarea value={p} onChange={(e) => setPara(i, e.target.value)} rows={2} placeholder="Paragraph text" />
            <button type="button" className="editor-remove-row" onClick={() => removePara(i)}>×</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addPara}>+ Add paragraph</button>
      </Field>
      <Row><Field label="Key Achievements title"><input type="text" value={d.achievementsTitle ?? ''} onChange={(e) => set('achievementsTitle', e.target.value)} placeholder="Key Achievements Director" /></Field></Row>
      <Field label="Key Achievements list icon">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input type="file" ref={achievementsIconFileRef} accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml" style={{ display: 'none' }} onChange={handleAchievementsIconUpload} />
          <div className={`placement-image-dropzone ${dropZoneAchievementsIconActive ? 'placement-image-dropzone--active' : ''} ${uploadingAchievementsIcon ? 'placement-image-dropzone--uploading' : ''}`} onDragOver={onAchievementsIconDragOver} onDragLeave={onAchievementsIconDragLeave} onDrop={onAchievementsIconDrop} onClick={() => !uploadingAchievementsIcon && achievementsIconFileRef.current?.click()} role="button" tabIndex={0} onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !uploadingAchievementsIcon) { e.preventDefault(); achievementsIconFileRef.current?.click(); } }} aria-label="Upload icon for Key Achievements list">
            {uploadingAchievementsIcon ? 'Uploading…' : 'Drag & drop or click to upload icon'}
          </div>
          <input type="text" value={d.achievementsIcon ?? ''} onChange={(e) => set('achievementsIcon', e.target.value)} placeholder="Or enter path (leave empty to use block icon above)" style={{ width: '100%' }} />
          {(d.achievementsIcon || '').trim() && (
            <img src={(d.achievementsIcon || '').startsWith('/') || (d.achievementsIcon || '').includes('images/') ? getImageUrl(d.achievementsIcon) : d.achievementsIcon} alt="" style={{ maxWidth: 48, maxHeight: 48, objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none' }} />
          )}
        </div>
      </Field>
      <Field label="Key Achievements (list items)">
        <p className="admin-form-help" style={{ marginBottom: 8 }}>Shown below the paragraphs in a dark blue box. If empty, the site shows default achievements.</p>
        {(Array.isArray(d.achievements) ? d.achievements : []).map((item, i) => (
          <div key={i} className="editor-repeatable-row">
            <input type="text" value={item ?? ''} onChange={(e) => set('achievements', (d.achievements || []).map((a, j) => (j === i ? e.target.value : a)))} placeholder="Achievement text" style={{ width: '100%' }} />
            <button type="button" className="editor-remove-row" onClick={() => set('achievements', (d.achievements || []).filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={() => set('achievements', [...(d.achievements || []), ''])}>+ Add achievement</button>
      </Field>
      <RowTwo>
        <Field label="CTA button title"><input type="text" value={d.ctaTitle ?? ''} onChange={(e) => set('ctaTitle', e.target.value)} placeholder="Impact Highlights" /></Field>
        <Field label="CTA button subtitle"><input type="text" value={d.ctaSub ?? ''} onChange={(e) => set('ctaSub', e.target.value)} placeholder="5000+ Learners • 1400+ Placed" /></Field>
      </RowTwo>
      <Row><Field label="CTA link"><input type="text" value={d.ctaHref ?? ''} onChange={(e) => set('ctaHref', e.target.value)} placeholder="#impact-highlights" /></Field></Row>
      <Row><Field label="Section theme"><select value={d.theme ?? 'dark'} onChange={(e) => set('theme', e.target.value)}><option value="dark">Dark (About page)</option><option value="light">Light (Leadership page)</option></select></Field></Row>
      <Row><Field label="Profile name"><input type="text" value={d.profileName ?? ''} onChange={(e) => set('profileName', e.target.value)} placeholder="Sumit Mahakalkar" /></Field></Row>
      <Row><Field label="Profile title"><input type="text" value={d.profileTitle ?? ''} onChange={(e) => set('profileTitle', e.target.value)} placeholder="Director & Senior Salesforce Architect" /></Field></Row>
      <Row><Field label="Profile image path"><input type="text" value={d.profileImage ?? ''} onChange={(e) => set('profileImage', e.target.value)} placeholder="/images/Rectangle 2.webp" /></Field></Row>
      <Field label="Block icon (Experience & Credentials)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input type="file" ref={blockIconFileRef} accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml" style={{ display: 'none' }} onChange={handleBlockIconUpload} />
          <div className={`placement-image-dropzone ${dropZoneBlockIconActive ? 'placement-image-dropzone--active' : ''} ${uploadingBlockIcon ? 'placement-image-dropzone--uploading' : ''}`} onDragOver={onBlockIconDragOver} onDragLeave={onBlockIconDragLeave} onDrop={onBlockIconDrop} onClick={() => !uploadingBlockIcon && blockIconFileRef.current?.click()} role="button" tabIndex={0} onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !uploadingBlockIcon) { e.preventDefault(); blockIconFileRef.current?.click(); } }} aria-label="Upload icon for Experience and Credentials blocks">
            {uploadingBlockIcon ? 'Uploading…' : 'Drag & drop or click to upload icon'}
          </div>
          <input type="text" value={d.blockIcon ?? ''} onChange={(e) => set('blockIcon', e.target.value)} placeholder="Or enter icon path (leave empty to use default checkmark)" style={{ width: '100%' }} />
          {(d.blockIcon || '').trim() && (
            <img src={(d.blockIcon || '').startsWith('/') || (d.blockIcon || '').includes('images/') ? getImageUrl(d.blockIcon) : d.blockIcon} alt="" style={{ maxWidth: 48, maxHeight: 48, objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none' }} />
          )}
        </div>
      </Field>
      <Field label="Stats (number, label, optional detail for profile card)">
        {stats.map((s, i) => (
          <div key={i} className="editor-stat-row">
            <input type="text" value={s.number ?? ''} onChange={(e) => setStat(i, 'number', e.target.value)} placeholder="e.g. 14+" />
            <input type="text" value={s.label ?? ''} onChange={(e) => setStat(i, 'label', e.target.value)} placeholder="e.g. Years" />
            <input type="text" value={s.detail ?? ''} onChange={(e) => setStat(i, 'detail', e.target.value)} placeholder="Detail (e.g. Salesforce Consulting)" />
            <button type="button" className="editor-remove-row" onClick={() => removeStat(i)}>×</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addStat}>+ Add stat</button>
      </Field>
      <Row><Field label="Experience (profile card)"><input type="text" value={d.experienceValue ?? ''} onChange={(e) => set('experienceValue', e.target.value)} placeholder="e.g. 14+ Years" /></Field></Row>
      <Row><Field label="Experience detail"><input type="text" value={d.experienceDetail ?? ''} onChange={(e) => set('experienceDetail', e.target.value)} placeholder="e.g. Salesforce Consulting & Architecture" /></Field></Row>
      <Row><Field label="Credentials (profile card)"><input type="text" value={d.credentialsValue ?? ''} onChange={(e) => set('credentialsValue', e.target.value)} placeholder="e.g. 8+ Global Certifications" /></Field></Row>
      <Row><Field label="Credentials detail"><input type="text" value={d.credentialsDetail ?? ''} onChange={(e) => set('credentialsDetail', e.target.value)} placeholder="e.g. Salesforce Ecosystem" /></Field></Row>
      <Row><Field label="LinkedIn URL"><input type="url" value={d.linkedInUrl ?? ''} onChange={(e) => set('linkedInUrl', e.target.value)} placeholder="https://linkedin.com/in/..." /></Field></Row>
      <Row><Field label="LinkedIn button label"><input type="text" value={d.linkedInLabel ?? ''} onChange={(e) => set('linkedInLabel', e.target.value)} placeholder="Connect on LinkedIn" /></Field></Row>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

export function CoreValuesForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const values = Array.isArray(d.values) && d.values.length > 0 ? d.values : [{ title: '', subtitle: '', icon: '' }]
  const setValue = (i, field, value) => set('values', values.map((v, j) => (j === i ? { ...v, [field]: value } : v)))
  const addValue = () => set('values', [...values, { title: '', subtitle: '', icon: '' }])
  const removeValue = (i) => set('values', values.filter((_, j) => j !== i))
  const isrTags = Array.isArray(d.isrTags) ? d.isrTags : ['']
  const setTag = (i, value) => set('isrTags', isrTags.map((t, j) => (j === i ? value : t)))
  const addTag = () => set('isrTags', [...isrTags, ''])
  const removeTag = (i) => set('isrTags', isrTags.filter((_, j) => j !== i))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <RowTwo>
        <Field label="Section title (before bold)"><input type="text" value={d.title ?? ''} onChange={(e) => set('title', e.target.value)} placeholder="Our Core" /></Field>
        <Field label="Bold part"><input type="text" value={d.titleBold ?? ''} onChange={(e) => set('titleBold', e.target.value)} placeholder="Values" /></Field>
      </RowTwo>
      <Field label="Value items (title, subtitle, icon path)">
        {values.map((v, i) => (
          <div key={i} className="editor-card-block">
            <div className="editor-card-fields">
              <input type="text" value={v.title ?? ''} onChange={(e) => setValue(i, 'title', e.target.value)} placeholder="Title" />
              <input type="text" value={v.subtitle ?? ''} onChange={(e) => setValue(i, 'subtitle', e.target.value)} placeholder="Subtitle" />
              <input type="text" value={v.icon ?? ''} onChange={(e) => setValue(i, 'icon', e.target.value)} placeholder="Icon path" />
            </div>
            <button type="button" className="editor-remove-row" onClick={() => removeValue(i)}>×</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addValue}>+ Add value</button>
      </Field>
      <Row><Field label="ISR card title"><input type="text" value={d.isrTitle ?? ''} onChange={(e) => set('isrTitle', e.target.value)} placeholder="Institutional Social Responsibility" /></Field></Row>
      <Row><Field label="ISR description"><textarea value={d.isrDescription ?? ''} onChange={(e) => set('isrDescription', e.target.value)} rows={3} /></Field></Row>
      <Field label="ISR tags">
        {isrTags.map((tag, i) => (
          <div key={i} className="editor-repeatable-row" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input type="text" value={tag} onChange={(e) => setTag(i, e.target.value)} placeholder="e.g. Skill-to-employment programs" style={{ flex: 1 }} />
            <button type="button" className="editor-remove-row" onClick={() => removeTag(i)}>×</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addTag}>+ Add tag</button>
      </Field>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

export function CoreAdvantagesForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const advantages = Array.isArray(d.advantages) && d.advantages.length > 0 ? d.advantages : [{ title: '', description: '', bullets: [''], additionalText: '', icon: '' }]
  const setAdv = (i, field, value) => set('advantages', advantages.map((a, j) => (j === i ? { ...a, [field]: value } : a)))
  const setBullet = (i, bi, value) => {
    const adv = advantages[i] || {}
    const bullets = Array.isArray(adv.bullets) ? [...adv.bullets] : ['']
    bullets[bi] = value
    setAdv(i, 'bullets', bullets)
  }
  const addBullet = (i) => {
    const adv = advantages[i] || {}
    const bullets = Array.isArray(adv.bullets) ? [...adv.bullets, ''] : ['']
    setAdv(i, 'bullets', bullets)
  }
  const removeBullet = (i, bi) => {
    const adv = advantages[i] || {}
    const bullets = (adv.bullets || []).filter((_, j) => j !== bi)
    setAdv(i, 'bullets', bullets.length ? bullets : [''])
  }
  const addAdvantage = () => set('advantages', [...advantages, { title: '', description: '', bullets: [''], additionalText: '', icon: '' }])
  const removeAdvantage = (i) => set('advantages', advantages.filter((_, j) => j !== i))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <Row><Field label="Section title"><input type="text" value={d.title ?? ''} onChange={(e) => set('title', e.target.value)} placeholder="Core Advantages of Learning at Cloud Intellect" /></Field></Row>
      <Field label="Advantage items">
        {advantages.map((adv, i) => (
          <div key={i} className="editor-advantage-block">
            <input type="text" value={adv.title ?? ''} onChange={(e) => setAdv(i, 'title', e.target.value)} placeholder="Advantage title" />
            <textarea value={adv.description ?? ''} onChange={(e) => setAdv(i, 'description', e.target.value)} rows={2} placeholder="Description" />
            <Field label="Bullet points">
              {(Array.isArray(adv.bullets) ? adv.bullets : ['']).map((b, bi) => (
                <div key={bi} className="editor-stat-row" style={{ gridTemplateColumns: '1fr auto' }}>
                  <input type="text" value={b} onChange={(e) => setBullet(i, bi, e.target.value)} placeholder="Bullet point" />
                  <button type="button" className="editor-remove-row" onClick={() => removeBullet(i, bi)}>×</button>
                </div>
              ))}
              <button type="button" className="editor-add-row" onClick={() => addBullet(i)}>+ Add bullet</button>
            </Field>
            <input type="text" value={adv.additionalText ?? ''} onChange={(e) => setAdv(i, 'additionalText', e.target.value)} placeholder="Additional text (optional)" />
            <input type="text" value={adv.icon ?? ''} onChange={(e) => setAdv(i, 'icon', e.target.value)} placeholder="Icon path" />
            <button type="button" className="editor-remove-row" onClick={() => removeAdvantage(i)}>Remove this advantage</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addAdvantage}>+ Add advantage</button>
      </Field>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

const PLACEMENTS_OVERVIEW_SLIDER_FOLDER = 'PlacementsOverviewSlider'
const PLACEMENT_NETWORK_LOGOS_FOLDER = 'PlacementNetworkLogos'
const INDUSTRY_EXPERIENCE_ACCORDION_FOLDER = 'IndustryExperienceAccordion'
const WHY_CHOOSE_IMAGES_FOLDER = 'WhyChooseImages'
const NEWS_AND_EVENTS_FOLDER = 'NewsAndEvents'
const SFMC_CAREER_ICONS_FOLDER = 'SFMCCareerIcons'

function parseUploadPathResponse(response) {
  if (response?.success && response?.data?.path) return response.data.path
  if (response?.data?.path) return response.data.path
  if (response?.path) return response.path
  return null
}

/** Placements Overview (home page): left = image slider (upload here), right = headline, buttons, stats. */
export function PlacementsOverviewForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const sliderList = Array.isArray(d.sliderImages) && d.sliderImages.length > 0 ? d.sliderImages : []
  const setSlider = (i, field, value) => set('sliderImages', sliderList.map((s, j) => (j === i ? { ...(s || {}), [field]: value } : s)))
  const addSlider = () => set('sliderImages', [...sliderList, { image: '' }])
  const removeSlider = (i) => set('sliderImages', sliderList.filter((_, j) => j !== i))

  const [uploadingSliderIndex, setUploadingSliderIndex] = useState(null)
  const [pendingUploadIndex, setPendingUploadIndex] = useState(null)
  const sliderFileRef = useRef(null)

  const handleSliderImageUpload = async (index, file) => {
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10MB')
      return
    }
    setUploadingSliderIndex(index)
    try {
      const response = await uploadAPI.uploadFile(file, PLACEMENTS_OVERVIEW_SLIDER_FOLDER)
      const path = parseUploadPathResponse(response)
      if (path) setSlider(index, 'image', path)
      else throw new Error('Upload response missing path')
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingSliderIndex(null)
      if (sliderFileRef.current) sliderFileRef.current.value = ''
    }
  }

  const onSliderDrop = (e, index) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer?.files?.[0]
    if (file) handleSliderImageUpload(index, file)
  }
  const onSliderDragOver = (e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy' }
  const onSliderDragLeave = (e) => { e.preventDefault(); e.stopPropagation() }

  const statsTop = Array.isArray(d.statsTop) && d.statsTop.length > 0 ? d.statsTop : [
    { value: '1400+', label: 'Successful Placements' },
    { value: '300+', label: 'Hiring Partners' },
    { value: '32.5 LPA', label: 'Highest National Package' },
  ]
  const statsBottom = Array.isArray(d.statsBottom) && d.statsBottom.length > 0 ? d.statsBottom : [
    { value: '15', label: 'Packages Offered by Top Companies' },
    { value: '10', label: 'Packages Offered by Leading IT Firms' },
    { value: '7', label: 'Packages Offered by Mid & Large Enterprises' },
    { value: '5', label: 'Packages Offered by Consulting & Startup Companies' },
  ]
  const setStatTop = (i, field, value) => set('statsTop', statsTop.map((s, j) => (j === i ? { ...s, [field]: value } : s)))
  const setStatBottom = (i, field, value) => set('statsBottom', statsBottom.map((s, j) => (j === i ? { ...s, [field]: value } : s)))
  const addStatTop = () => set('statsTop', [...statsTop, { value: '', label: '' }])
  const addStatBottom = () => set('statsBottom', [...statsBottom, { value: '', label: '' }])
  const removeStatTop = (i) => set('statsTop', statsTop.filter((_, j) => j !== i))
  const removeStatBottom = (i) => set('statsBottom', statsBottom.filter((_, j) => j !== i))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Left side – Image slider</h4>
      <p className="admin-form-help">Upload images for the left side slider. Each image is one slide. Order below = slide order.</p>
      <Field label="Slider images (upload per slide)">
        <input
          type="file"
          ref={sliderFileRef}
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target?.files?.[0]
            const idx = pendingUploadIndex
            setPendingUploadIndex(null)
            if (file && typeof idx === 'number' && idx >= 0) handleSliderImageUpload(idx, file)
          }}
        />
        {sliderList.map((slide, i) => {
          const path = slide?.image || slide?.url || ''
          const previewUrl = path ? (path.startsWith('/') ? getImageUrl(path) : path) : ''
          return (
            <div key={i} className="editor-card-block" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
              <div
                className={`placement-image-dropzone ${uploadingSliderIndex === i ? 'placement-image-dropzone--uploading' : ''}`}
                style={{ minWidth: 140, minHeight: 100 }}
                onDragOver={onSliderDragOver}
                onDragLeave={onSliderDragLeave}
                onDrop={(e) => onSliderDrop(e, i)}
                onClick={() => {
                  if (uploadingSliderIndex !== null) return
                  setPendingUploadIndex(i)
                  sliderFileRef.current?.click?.()
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && uploadingSliderIndex === null) {
                    e.preventDefault()
                    setPendingUploadIndex(i)
                    sliderFileRef.current?.click?.()
                  }
                }}
                aria-label={`Slide ${i + 1}: drag image or click to upload`}
              >
                {uploadingSliderIndex === i ? (
                  'Uploading…'
                ) : previewUrl ? (
                  <img src={previewUrl} alt="" style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain' }} />
                ) : (
                  'Slide ' + (i + 1) + ': drop or click'
                )}
              </div>
              <div style={{ flex: '1 1 120px' }}>
                <span className="editor-form-row-label">Slide {i + 1}</span>
                <button type="button" className="editor-remove-row" onClick={() => removeSlider(i)}>Remove</button>
              </div>
            </div>
          )
        })}
        <button type="button" className="editor-add-row" onClick={addSlider}>+ Add slider image</button>
      </Field>

      <h4 className="editor-form-subsection">Right side – Headline &amp; stats</h4>
      <Row><Field label="Section label (small text above headline)"><input type="text" value={d.label ?? ''} onChange={(e) => set('label', e.target.value)} placeholder="Placements Overview" /></Field></Row>
      <Row><Field label="Headline part 1"><input type="text" value={d.headlinePart1 ?? ''} onChange={(e) => set('headlinePart1', e.target.value)} placeholder="The World's" /></Field></Row>
      <Row><Field label="Headline bold part"><input type="text" value={d.headlineBold ?? ''} onChange={(e) => set('headlineBold', e.target.value)} placeholder="Leading Companies Hire" /></Field></Row>
      <Row><Field label="Headline part 2"><input type="text" value={d.headlinePart2 ?? ''} onChange={(e) => set('headlinePart2', e.target.value)} placeholder="Our Talent" /></Field></Row>
      <RowTwo>
        <Field label="Apply button text"><input type="text" value={d.applyButtonText ?? ''} onChange={(e) => set('applyButtonText', e.target.value)} placeholder="Apply Today" /></Field>
        <Field label="Apply button link"><input type="text" value={d.applyButtonHref ?? ''} onChange={(e) => set('applyButtonHref', e.target.value)} placeholder="#apply" /></Field>
      </RowTwo>
      <RowTwo>
        <Field label="View Placements button text"><input type="text" value={d.viewPlacementsText ?? ''} onChange={(e) => set('viewPlacementsText', e.target.value)} placeholder="View Placements" /></Field>
        <Field label="View Placements link"><input type="text" value={d.viewPlacementsHref ?? ''} onChange={(e) => set('viewPlacementsHref', e.target.value)} placeholder="#placements" /></Field>
      </RowTwo>
      <Field label="Top row stats (3 boxes: value + label)">
        {statsTop.map((s, i) => (
          <div key={i} className="editor-stat-row">
            <input type="text" value={s.value ?? ''} onChange={(e) => setStatTop(i, 'value', e.target.value)} placeholder="e.g. 1400+" />
            <input type="text" value={s.label ?? ''} onChange={(e) => setStatTop(i, 'label', e.target.value)} placeholder="e.g. Successful Placements" />
            <button type="button" className="editor-remove-row" onClick={() => removeStatTop(i)}>×</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addStatTop}>+ Add stat</button>
      </Field>
      <Field label="Bottom row stats (4 boxes: value + label, value shown with LPA)">
        {statsBottom.map((s, i) => (
          <div key={i} className="editor-stat-row">
            <input type="text" value={s.value ?? ''} onChange={(e) => setStatBottom(i, 'value', e.target.value)} placeholder="e.g. 15" />
            <input type="text" value={s.label ?? ''} onChange={(e) => setStatBottom(i, 'label', e.target.value)} placeholder="e.g. Packages Offered by Top Companies" />
            <button type="button" className="editor-remove-row" onClick={() => removeStatBottom(i)}>×</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addStatBottom}>+ Add stat</button>
      </Field>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

/** Home page: The Salesforce Ecosystem section – title, description, trusted image, 5 cards. */
export function EcosystemForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const card = (key) => d[key] || {}
  const setCard = (key, field, value) => set(key, { ...card(key), [field]: value })

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Header</h4>
      <Row>
        <Field label="Section title">
          <input type="text" value={d.title ?? ''} onChange={(e) => set('title', e.target.value)} placeholder="The Salesforce Ecosystem" />
        </Field>
      </Row>
      <Row>
        <Field label="Description">
          <textarea value={d.description ?? ''} onChange={(e) => set('description', e.target.value)} rows={2} placeholder="Join the world's most innovative community..." />
        </Field>
      </Row>
      <Row>
        <Field label="Trusted image path (e.g. /images/eco-system.webp)">
          <input type="text" value={d.trustedImage ?? ''} onChange={(e) => set('trustedImage', e.target.value)} placeholder="/images/eco-system.webp" />
        </Field>
      </Row>

      <h4 className="editor-form-subsection">Card 1 – Global Leader (yellow)</h4>
      <Row><Field label="Tag"><input type="text" value={card('card1').tag ?? ''} onChange={(e) => setCard('card1', 'tag', e.target.value)} placeholder="GLOBAL LEADER" /></Field></Row>
      <RowTwo>
        <Field label="Big text"><input type="text" value={card('card1').bigText ?? ''} onChange={(e) => setCard('card1', 'bigText', e.target.value)} placeholder="World's No.1" /></Field>
        <Field label="Sub text"><input type="text" value={card('card1').subText ?? ''} onChange={(e) => setCard('card1', 'subText', e.target.value)} placeholder="CRM Platform" /></Field>
      </RowTwo>
      <Row><Field label="Note"><input type="text" value={card('card1').note ?? ''} onChange={(e) => setCard('card1', 'note', e.target.value)} placeholder="Recognized globally with the largest market share." /></Field></Row>

      <h4 className="editor-form-subsection">Card 2 – Market Share (white)</h4>
      <Row><Field label="Stat"><input type="text" value={card('card2').stat ?? ''} onChange={(e) => setCard('card2', 'stat', e.target.value)} placeholder="20.7%" /></Field></Row>
      <Row><Field label="Label"><input type="text" value={card('card2').label ?? ''} onChange={(e) => setCard('card2', 'label', e.target.value)} placeholder="Global CRM Market Share" /></Field></Row>
      <Row><Field label="Source"><input type="text" value={card('card2').source ?? ''} onChange={(e) => setCard('card2', 'source', e.target.value)} placeholder="IDC Worldwide Semiannual Tracker, 2024" /></Field></Row>

      <h4 className="editor-form-subsection">Card 3 – Customers (white)</h4>
      <Row><Field label="Stat"><input type="text" value={card('card3').stat ?? ''} onChange={(e) => setCard('card3', 'stat', e.target.value)} placeholder="150k+" /></Field></Row>
      <Row><Field label="Label"><input type="text" value={card('card3').label ?? ''} onChange={(e) => setCard('card3', 'label', e.target.value)} placeholder="Customers Worldwide" /></Field></Row>
      <Row><Field label="Source"><input type="text" value={card('card3').source ?? ''} onChange={(e) => setCard('card3', 'source', e.target.value)} placeholder="Including Fortune 500 companies" /></Field></Row>

      <h4 className="editor-form-subsection">Card 4 – Financials (white small)</h4>
      <Row><Field label="Tag"><input type="text" value={card('card4').tag ?? ''} onChange={(e) => setCard('card4', 'tag', e.target.value)} placeholder="FINANCIALS" /></Field></Row>
      <Row><Field label="Stat"><input type="text" value={card('card4').stat ?? ''} onChange={(e) => setCard('card4', 'stat', e.target.value)} placeholder="$34.86 B" /></Field></Row>
      <Row><Field label="Label"><input type="text" value={card('card4').label ?? ''} onChange={(e) => setCard('card4', 'label', e.target.value)} placeholder="Annual Revenue (FY 2024)" /></Field></Row>

      <h4 className="editor-form-subsection">Card 5 – Economic Impact (dark)</h4>
      <Row><Field label="Tag"><input type="text" value={card('card5').tag ?? ''} onChange={(e) => setCard('card5', 'tag', e.target.value)} placeholder="ECONOMIC IMPACT" /></Field></Row>
      <Row><Field label="Stat"><input type="text" value={card('card5').stat ?? ''} onChange={(e) => setCard('card5', 'stat', e.target.value)} placeholder="1.8 Million" /></Field></Row>
      <Row><Field label="Label"><input type="text" value={card('card5').label ?? ''} onChange={(e) => setCard('card5', 'label', e.target.value)} placeholder="New Jobs in India by 2028" /></Field></Row>
      <Row><Field label="Source"><input type="text" value={card('card5').source ?? ''} onChange={(e) => setCard('card5', 'source', e.target.value)} placeholder="Source: Salesforce India Economic Impact Report" /></Field></Row>

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

const COURSE_ICON_OPTIONS = [
  { value: 'code', label: 'Code (SFDC)' },
  { value: 'trophy', label: 'Trophy' },
  { value: 'roles', label: 'Roles' },
  { value: 'chart', label: 'Chart' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'audience', label: 'Audience' },
  { value: 'automation', label: 'Automation' },
  { value: 'analytics', label: 'Analytics' },
]

/** Home page: Our Courses section – title, tabs, developer/marketing content, CTA buttons. */
export function CoursesForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const dev = d.developer || {}
  const mkt = d.marketing || {}
  const setDev = (key, value) => set('developer', { ...dev, [key]: value })
  const setMkt = (key, value) => set('marketing', { ...mkt, [key]: value })
  const devCards = Array.isArray(dev.cards) && dev.cards.length >= 3 ? dev.cards : [
    { icon: 'trophy', stat: '#1 CRM used by 150,000+ companies' },
    { icon: 'roles', stat: 'High-demand roles : Admin, Developer, Consultant' },
    { icon: 'chart', stat: '6.6M+ job opportunities coming by 2026' },
  ]
  const mktCards = Array.isArray(mkt.cards) && mkt.cards.length >= 3 ? mkt.cards : [
    { icon: 'audience', stat: 'Unified customer data across channels' },
    { icon: 'automation', stat: 'Journey Builder & Automation Studio' },
    { icon: 'analytics', stat: 'Analytics & ROI measurement' },
  ]
  const setDevCard = (i, field, value) => setDev('cards', devCards.map((c, j) => (j === i ? { ...c, [field]: value } : c)))
  const setMktCard = (i, field, value) => setMkt('cards', mktCards.map((c, j) => (j === i ? { ...c, [field]: value } : c)))

  const tabs = Array.isArray(d.tabs) && d.tabs.length >= 2 ? d.tabs : [
    { id: 'developer', label: 'Salesforce Developer' },
    { id: 'marketing', label: 'Salesforce Marketing Cloud' },
  ]
  const setTab = (i, field, value) => set('tabs', tabs.map((t, j) => (j === i ? { ...t, [field]: value } : t)))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Section header</h4>
      <RowTwo>
        <Field label="Title (e.g. Our)">
          <input type="text" value={d.sectionTitle ?? ''} onChange={(e) => set('sectionTitle', e.target.value)} placeholder="Our" />
        </Field>
        <Field label="Title highlight (e.g. Courses)">
          <input type="text" value={d.sectionTitleHighlight ?? ''} onChange={(e) => set('sectionTitleHighlight', e.target.value)} placeholder="Courses" />
        </Field>
      </RowTwo>
      <h4 className="editor-form-subsection">Tab labels</h4>
      <RowTwo>
        <Field label="Tab 1 label"><input type="text" value={tabs[0]?.label ?? ''} onChange={(e) => setTab(0, 'label', e.target.value)} placeholder="Salesforce Developer" /></Field>
        <Field label="Tab 2 label"><input type="text" value={tabs[1]?.label ?? ''} onChange={(e) => setTab(1, 'label', e.target.value)} placeholder="Salesforce Marketing Cloud" /></Field>
      </RowTwo>
      <h4 className="editor-form-subsection">Developer tab – main card</h4>
      <Row><Field label="Main title"><input type="text" value={dev.mainTitle ?? ''} onChange={(e) => setDev('mainTitle', e.target.value)} placeholder="Salesforce Developer Cloud (SFDC)" /></Field></Row>
      <Row><Field label="Main description"><textarea value={dev.mainDescription ?? ''} onChange={(e) => setDev('mainDescription', e.target.value)} rows={2} placeholder="Build apps, automate..." /></Field></Row>
      <RowTwo>
        <Field label="Link text"><input type="text" value={dev.mainLinkText ?? ''} onChange={(e) => setDev('mainLinkText', e.target.value)} placeholder="Learn Salesforce Development" /></Field>
        <Field label="Link URL"><input type="text" value={dev.mainLinkHref ?? ''} onChange={(e) => setDev('mainLinkHref', e.target.value)} placeholder="#learn" /></Field>
      </RowTwo>
      <Field label="Developer – 3 stat cards (icon + stat)">
        {devCards.slice(0, 3).map((c, i) => (
          <div key={i} className="editor-card-block" style={{ marginBottom: 8 }}>
            <select value={c.icon ?? 'trophy'} onChange={(e) => setDevCard(i, 'icon', e.target.value)}>
              {COURSE_ICON_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <input type="text" value={c.stat ?? ''} onChange={(e) => setDevCard(i, 'stat', e.target.value)} placeholder="Stat text" style={{ marginLeft: 8, flex: 1, minWidth: 200 }} />
          </div>
        ))}
      </Field>
      <h4 className="editor-form-subsection">Marketing Cloud tab – main card</h4>
      <Row><Field label="Main title"><input type="text" value={mkt.mainTitle ?? ''} onChange={(e) => setMkt('mainTitle', e.target.value)} placeholder="Salesforce Marketing Cloud" /></Field></Row>
      <Row><Field label="Main description"><textarea value={mkt.mainDescription ?? ''} onChange={(e) => setMkt('mainDescription', e.target.value)} rows={2} placeholder="Master email, advertising..." /></Field></Row>
      <RowTwo>
        <Field label="Link text"><input type="text" value={mkt.mainLinkText ?? ''} onChange={(e) => setMkt('mainLinkText', e.target.value)} placeholder="Learn Marketing Cloud" /></Field>
        <Field label="Link URL"><input type="text" value={mkt.mainLinkHref ?? ''} onChange={(e) => setMkt('mainLinkHref', e.target.value)} placeholder="#learn" /></Field>
      </RowTwo>
      <Field label="Marketing – 3 stat cards (icon + stat)">
        {mktCards.slice(0, 3).map((c, i) => (
          <div key={i} className="editor-card-block" style={{ marginBottom: 8 }}>
            <select value={c.icon ?? 'audience'} onChange={(e) => setMktCard(i, 'icon', e.target.value)}>
              {COURSE_ICON_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <input type="text" value={c.stat ?? ''} onChange={(e) => setMktCard(i, 'stat', e.target.value)} placeholder="Stat text" style={{ marginLeft: 8, flex: 1, minWidth: 200 }} />
          </div>
        ))}
      </Field>
      <h4 className="editor-form-subsection">CTA buttons</h4>
      <RowTwo>
        <Field label="Apply button text"><input type="text" value={d.applyText ?? ''} onChange={(e) => set('applyText', e.target.value)} placeholder="Apply Today" /></Field>
        <Field label="Apply button URL"><input type="text" value={d.applyHref ?? ''} onChange={(e) => set('applyHref', e.target.value)} placeholder="#apply" /></Field>
      </RowTwo>
      <RowTwo>
        <Field label="Brochure button text"><input type="text" value={d.brochureText ?? ''} onChange={(e) => set('brochureText', e.target.value)} placeholder="Download Brochure" /></Field>
        <Field label="Brochure button URL"><input type="text" value={d.brochureHref ?? ''} onChange={(e) => set('brochureHref', e.target.value)} placeholder="#brochure" /></Field>
      </RowTwo>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

/** Home page: An Illustrious Legacy section – title, stats (5), news cards (2). */
export function LegacyForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const stats = Array.isArray(d.stats) && d.stats.length >= 5 ? d.stats : [
    { number: '5000+', label: 'LEARNERS TRAINED', description: 'Continuous skill development across India.' },
    { number: '1400+', label: 'SUCCESSFUL PLACEMENTS', description: 'Students placed in top MNCs & Salesforce partner companies.' },
    { number: '20+', label: 'EXPERT MENTORS', description: 'Certified Salesforce professionals from leading global firms.' },
    { number: '150+', label: 'CORPORATE CLIENTS', description: 'Strong industry network supporting Salesforce careers.' },
    { number: '10+', label: 'YEARS EXPERTISE', description: 'Backed by the strength of a Salesforce Ridge Partner company.' },
  ]
  const cards = Array.isArray(d.cards) && d.cards.length >= 2 ? d.cards : [
    { image: '/images/legacy.webp', title: 'Salesforce to Create 1.8 Million Jobs in India by 2028', description: 'Salesforce is powering major job growth in India, creating real opportunities for tech talent.', tags: 'Tech Growth | Salesforce', href: '#' },
    { image: '/images/legacy2.webp', title: 'Salesforce Hiring Surges Again in 2025', description: 'Salesforce roles are growing fast in 2025, especially for Admins and Developers.', tags: 'ACHIEVEMENT | CIBSUMMIT', href: '#' },
  ]
  const setStat = (i, field, value) => set('stats', stats.map((s, j) => (j === i ? { ...s, [field]: value } : s)))
  const setCard = (i, field, value) => set('cards', cards.map((c, j) => (j === i ? { ...c, [field]: value } : c)))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Section header</h4>
      <RowTwo>
        <Field label="Title (e.g. An Illustrious)">
          <input type="text" value={d.title ?? ''} onChange={(e) => set('title', e.target.value)} placeholder="An Illustrious" />
        </Field>
        <Field label="Title highlight (e.g. Legacy we continue to Shape)">
          <input type="text" value={d.titleHighlight ?? ''} onChange={(e) => set('titleHighlight', e.target.value)} placeholder="Legacy we continue to Shape" />
        </Field>
      </RowTwo>
      <h4 className="editor-form-subsection">Stats (5 items: number, label, description)</h4>
      {stats.slice(0, 5).map((s, i) => (
        <div key={i} className="editor-card-block" style={{ marginBottom: 12 }}>
          <Row><Field label={`Stat ${i + 1} – number`}><input type="text" value={s.number ?? ''} onChange={(e) => setStat(i, 'number', e.target.value)} placeholder="e.g. 5000+" /></Field></Row>
          <Row><Field label="Label"><input type="text" value={s.label ?? ''} onChange={(e) => setStat(i, 'label', e.target.value)} placeholder="e.g. LEARNERS TRAINED" /></Field></Row>
          <Row><Field label="Description"><input type="text" value={s.description ?? ''} onChange={(e) => setStat(i, 'description', e.target.value)} placeholder="Short description" /></Field></Row>
        </div>
      ))}
      <h4 className="editor-form-subsection">News cards (2 items)</h4>
      {cards.slice(0, 2).map((c, i) => (
        <div key={i} className="editor-card-block" style={{ marginBottom: 12 }}>
          <Row><Field label={`Card ${i + 1} – image path`}><input type="text" value={c.image ?? ''} onChange={(e) => setCard(i, 'image', e.target.value)} placeholder="/images/legacy.webp" /></Field></Row>
          <Row><Field label="Title"><input type="text" value={c.title ?? ''} onChange={(e) => setCard(i, 'title', e.target.value)} placeholder="Card title" /></Field></Row>
          <Row><Field label="Description"><textarea value={c.description ?? ''} onChange={(e) => setCard(i, 'description', e.target.value)} rows={2} placeholder="Short description" /></Field></Row>
          <RowTwo>
            <Field label="Tags"><input type="text" value={c.tags ?? ''} onChange={(e) => setCard(i, 'tags', e.target.value)} placeholder="Tech Growth | Salesforce" /></Field>
            <Field label="Link URL"><input type="text" value={c.href ?? ''} onChange={(e) => setCard(i, 'href', e.target.value)} placeholder="#" /></Field>
          </RowTwo>
        </div>
      ))}
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

const DEFAULT_RECOGNITION_BLOCKS = () => [
  { category: 'RECOGNIZED STATUS', image: '/images/Training & Industry Alignment/1734100666165 1.webp', title: 'Workforce Partner', subheading: 'Salesforce Workforce Development Partner', description: 'Cloud Intellect is officially listed as a Salesforce Workforce Development Partner, acknowledged for delivering high-quality, industry-ready Salesforce training programs.', bullets: ['Training aligned with Salesforce standards', 'Certification-focused modules', 'Real-world learning outcomes'] },
  { category: 'RECOGNIZED RANK', image: '/images/Training & Industry Alignment/1734100666165 1-1.webp', title: 'Ridge Partner', subheading: 'Salesforce Ridge Consulting Partner (via Cloud Intellect Systems)', description: 'Our consulting division, Cloud Intellect Systems, is a Salesforce Ridge Partner, enabling real-time project exposure for learners.', bullets: ['Enterprise project experience', 'Live org scenarios', 'Consulting-level learning environment'] },
  { category: 'VERIFIED OUTCOMES', image: '/images/Training & Industry Alignment/SVG.webp', title: 'Top Ranked', subheading: 'Training & Industry Reputation', description: "Ranked Among India's Trusted Salesforce Institutes based on learner success, mentorship quality, and placement outcomes.", bullets: ['Expert mentors', 'Strong placement network', 'Verified student success'] },
  { category: 'GLOBAL STANDARDS', image: '/images/Training & Industry Alignment/SVG-1.webp', title: 'Accredited', subheading: 'Ecosystem Accreditations', description: 'Follows official Salesforce learning frameworks, compliant with global certification guidelines.', bullets: ['Follows official learning frameworks', 'Recognized training pathways', 'Aligned with Salesforce roles'] },
]

/** Home page: Proudly Recognized – title + 4 blocks (category, image, title, subheading, description, bullets). */
export function RecognitionForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const blocks = Array.isArray(d.blocks) && d.blocks.length >= 4 ? d.blocks : DEFAULT_RECOGNITION_BLOCKS()
  const setBlock = (i, field, value) => set('blocks', blocks.map((b, j) => (j === i ? { ...b, [field]: value } : b)))
  const setBlockBullet = (blockIndex, bulletIndex, value) => set('blocks', blocks.map((b, j) => {
    if (j !== blockIndex) return b
    const arr = b.bullets || []
    const next = [...arr]
    while (next.length <= bulletIndex) next.push('')
    next[bulletIndex] = value
    return { ...b, bullets: next }
  }))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Section header</h4>
      <RowTwo>
        <Field label="Title (e.g. Proudly Recognized for)">
          <input type="text" value={d.title ?? ''} onChange={(e) => set('title', e.target.value)} placeholder="Proudly Recognized for" />
        </Field>
        <Field label="Title highlight">
          <input type="text" value={d.titleHighlight ?? ''} onChange={(e) => set('titleHighlight', e.target.value)} placeholder="Our Excellence in Salesforce Training & Industry Alignment" />
        </Field>
      </RowTwo>
      <h4 className="editor-form-subsection">Blocks (4 items)</h4>
      {blocks.slice(0, 4).map((block, i) => (
        <div key={i} className="editor-card-block" style={{ marginBottom: 16 }}>
          <Row><Field label={`Block ${i + 1} – category`}><input type="text" value={block.category ?? ''} onChange={(e) => setBlock(i, 'category', e.target.value)} placeholder="RECOGNIZED STATUS" /></Field></Row>
          <Row><Field label="Image path"><input type="text" value={block.image ?? ''} onChange={(e) => setBlock(i, 'image', e.target.value)} placeholder="/images/Training & Industry Alignment/..." /></Field></Row>
          <Row><Field label="Title"><input type="text" value={block.title ?? ''} onChange={(e) => setBlock(i, 'title', e.target.value)} placeholder="Workforce Partner" /></Field></Row>
          <Row><Field label="Subheading"><input type="text" value={block.subheading ?? ''} onChange={(e) => setBlock(i, 'subheading', e.target.value)} placeholder="Salesforce Workforce Development Partner" /></Field></Row>
          <Row><Field label="Description"><textarea value={block.description ?? ''} onChange={(e) => setBlock(i, 'description', e.target.value)} rows={2} placeholder="Description" /></Field></Row>
          <Field label="Bullets (3 items)">
            {(Array.isArray(block.bullets) ? block.bullets : ['', '', '']).slice(0, 3).map((bul, j) => (
              <input key={j} type="text" value={bul} onChange={(e) => setBlockBullet(i, j, e.target.value)} placeholder={`Bullet ${j + 1}`} style={{ display: 'block', marginBottom: 6 }} />
            ))}
          </Field>
        </div>
      ))}
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

const DEFAULT_INDUSTRY_BG = '/images/Accordian Images/Background image.webp'
const DEFAULT_INDUSTRY_TABS = () => [
  { label: 'Real Project-Based Training', title: 'Real Project-Based Training', description: 'Work on real-world projects and build a portfolio that demonstrates your skills to employers.', image: DEFAULT_INDUSTRY_BG },
  { label: 'Global Salesforce Ecosystem Exposure', title: 'Global Salesforce Ecosystem Exposure', description: 'Connect with industry leaders and gain exposure to the global Salesforce ecosystem through real projects and partnerships.', image: DEFAULT_INDUSTRY_BG },
  { label: 'Certified Mentor Guidance', title: 'Certified Mentor Guidance', description: 'Learn from certified Salesforce experts who bring years of industry experience and guide you through every step.', image: DEFAULT_INDUSTRY_BG },
  { label: 'Job-Oriented Curriculum', title: 'Job-Oriented Curriculum', description: 'Our curriculum is designed with input from hiring partners to ensure you develop the exact skills employers are looking for.', image: DEFAULT_INDUSTRY_BG },
  { label: 'Live Q&A Sessions', title: 'Live Q&A Sessions', description: 'Get your questions answered in real time by instructors and peers during live interactive sessions.', image: DEFAULT_INDUSTRY_BG },
]

/** Home page: Immerse yourself – Industry Experience accordion (heading + 5 tabs, each with its own image – drag & drop). */
export function IndustryExperienceForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const tabs = Array.isArray(d.tabs) && d.tabs.length >= 5 ? d.tabs : DEFAULT_INDUSTRY_TABS()
  const setTab = (i, field, value) => set('tabs', tabs.map((t, j) => (j === i ? { ...t, [field]: value } : t)))

  const [uploadingTabIndex, setUploadingTabIndex] = useState(null)
  const [pendingTabIndex, setPendingTabIndex] = useState(null)
  const industryFileRef = useRef(null)

  const handleIndustryImageUpload = async (tabIndex, file) => {
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10MB')
      return
    }
    setUploadingTabIndex(tabIndex)
    try {
      const response = await uploadAPI.uploadFile(file, INDUSTRY_EXPERIENCE_ACCORDION_FOLDER)
      const path = parseUploadPathResponse(response)
      if (path) setTab(tabIndex, 'image', path)
      else throw new Error('Upload response missing path')
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingTabIndex(null)
      if (industryFileRef.current) industryFileRef.current.value = ''
    }
  }

  const onIndustryDrop = (e, tabIndex) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer?.files?.[0]
    if (file) handleIndustryImageUpload(tabIndex, file)
  }
  const onIndustryDragOver = (e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy' }
  const onIndustryDragLeave = (e) => { e.preventDefault(); e.stopPropagation() }

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <input
        type="file"
        ref={industryFileRef}
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target?.files?.[0]
          const idx = pendingTabIndex
          setPendingTabIndex(null)
          if (file && typeof idx === 'number' && idx >= 0) handleIndustryImageUpload(idx, file)
        }}
      />
      <h4 className="editor-form-subsection">Section heading</h4>
      <Row><Field label="Intro text (before bold)"><input type="text" value={d.headingPart1 ?? ''} onChange={(e) => set('headingPart1', e.target.value)} placeholder="Immerse yourself in a" /></Field></Row>
      <Row><Field label="Bold line 1"><input type="text" value={d.headingStrong1 ?? ''} onChange={(e) => set('headingStrong1', e.target.value)} placeholder="Real Industry Experience with" /></Field></Row>
      <Row><Field label="Bold line 2"><input type="text" value={d.headingStrong2 ?? ''} onChange={(e) => set('headingStrong2', e.target.value)} placeholder="Global Salesforce Ecosystem Exposure" /></Field></Row>
      <h4 className="editor-form-subsection">Accordion tabs (5 items) – drag & drop or click to upload panel image</h4>
      <p className="admin-form-help">Each tab has its own panel background image. Drag an image onto the box or click to choose. You can also paste an image path below.</p>
      {tabs.slice(0, 5).map((tab, i) => {
        const imagePath = tab?.image || tab?.url || ''
        const previewUrl = imagePath ? (imagePath.startsWith('/') ? getImageUrl(imagePath) : imagePath) : ''
        return (
          <div key={i} className="editor-card-block" style={{ marginBottom: 16 }}>
            <Row><Field label={`Tab ${i + 1} – label (button text)`}><input type="text" value={tab.label ?? ''} onChange={(e) => setTab(i, 'label', e.target.value)} placeholder="e.g. Real Project-Based Training" /></Field></Row>
            <Field label="Panel background image">
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 12 }}>
                <div
                  className={`placement-image-dropzone ${uploadingTabIndex === i ? 'placement-image-dropzone--uploading' : ''}`}
                  style={{ minWidth: 140, minHeight: 90 }}
                  onDragOver={onIndustryDragOver}
                  onDragLeave={onIndustryDragLeave}
                  onDrop={(e) => onIndustryDrop(e, i)}
                  onClick={() => { if (uploadingTabIndex !== null) return; setPendingTabIndex(i); industryFileRef.current?.click(); }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && uploadingTabIndex === null) { e.preventDefault(); setPendingTabIndex(i); industryFileRef.current?.click(); } }}
                  aria-label={`Tab ${i + 1} panel image: drag image or click to upload`}
                >
                  {uploadingTabIndex === i ? 'Uploading…' : previewUrl ? <img src={previewUrl} alt="" style={{ maxWidth: '100%', maxHeight: 90, objectFit: 'contain' }} /> : 'Drop or click'}
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <input type="text" value={tab.image ?? ''} onChange={(e) => setTab(i, 'image', e.target.value)} placeholder="Or paste image path" style={{ width: '100%', marginTop: 4 }} />
                </div>
              </div>
            </Field>
            <Row><Field label="Title (in expanded panel)"><input type="text" value={tab.title ?? ''} onChange={(e) => setTab(i, 'title', e.target.value)} placeholder="Same as label or custom" /></Field></Row>
            <Row><Field label="Description"><textarea value={tab.description ?? ''} onChange={(e) => setTab(i, 'description', e.target.value)} rows={2} placeholder="Short description" /></Field></Row>
          </div>
        )
      })}
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

const DEFAULT_WHY_CHOOSE_ITEMS = () => [
  { number: '12', title: 'High-Impact Networking Connections', content: 'Connect with an extensive network of CEOs, Nobel Laureates, entrepreneurs, technologists, and global academicians.' },
  { number: '13', title: 'Tech-Driven Collaborative Learning', content: 'Learn through modern tools, real-time collaboration, and hands-on digital platforms.' },
  { number: '14', title: '360-Degree Personal Brand Building', content: 'Build your professional brand with mentoring, positioning, and visibility strategies.' },
  { number: '15', title: 'Multi-Disciplinary University Exposure', content: 'Learn across domains with interdisciplinary programs and global faculty exposure.' },
  { number: '19', title: 'Global Vision & Research Culture', content: 'Engage with global research initiatives and international academic collaborations.' },
  { number: '16', title: 'Industry-Ready Skill Development', content: 'Gain job-ready skills through practical exposure and industry-aligned curriculum.' },
  { number: '20', title: 'Leadership & Innovation Mindset', content: 'Develop leadership skills and an innovation-first approach.' },
  { number: '17', title: 'Strong Alumni & Community Network', content: 'Become part of a lifelong alumni ecosystem supporting growth and mentorship.' },
  { number: '18', title: 'Intercontinental Research Frontiers', content: 'Explore cross-border research initiatives shaping the future of education.' },
]

/** Home page: Why Should You Choose Cloud Intellect? – heading + FAQ accordion items (dynamic, drag-and-drop row images). */
export function WhyChooseForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const items = Array.isArray(d.items) && d.items.length > 0 ? d.items : DEFAULT_WHY_CHOOSE_ITEMS()
  const setItem = (i, field, value) => set('items', items.map((it, j) => (j === i ? { ...(it || {}), [field]: value } : it)))
  const addItem = () => set('items', [...items, { number: String(items.length + 1), title: '', content: '', image: '' }])
  const removeItem = (i) => set('items', items.filter((_, j) => j !== i))

  const [uploadingItemIndex, setUploadingItemIndex] = useState(null)
  const [pendingUploadItemIndex, setPendingUploadItemIndex] = useState(null)
  const whyChooseFileRef = useRef(null)

  const handleWhyChooseImageUpload = async (itemIndex, file) => {
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10MB')
      return
    }
    setUploadingItemIndex(itemIndex)
    try {
      const response = await uploadAPI.uploadFile(file, WHY_CHOOSE_IMAGES_FOLDER)
      const path = parseUploadPathResponse(response)
      if (path) setItem(itemIndex, 'image', path)
      else throw new Error('Upload response missing path')
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingItemIndex(null)
      if (whyChooseFileRef.current) whyChooseFileRef.current.value = ''
    }
  }

  const onWhyChooseDrop = (e, itemIndex) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer?.files?.[0]
    if (file) handleWhyChooseImageUpload(itemIndex, file)
  }
  const onWhyChooseDragOver = (e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy' }
  const onWhyChooseDragLeave = (e) => { e.preventDefault(); e.stopPropagation() }

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <input
        type="file"
        ref={whyChooseFileRef}
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target?.files?.[0]
          const idx = pendingUploadItemIndex
          setPendingUploadItemIndex(null)
          if (file && typeof idx === 'number' && idx >= 0) handleWhyChooseImageUpload(idx, file)
        }}
      />
      <h4 className="editor-form-subsection">Section heading</h4>
      <Row><Field label="Heading (before bold)"><input type="text" value={d.headingLine1 ?? ''} onChange={(e) => set('headingLine1', e.target.value)} placeholder="Why Should You Choose" /></Field></Row>
      <Row><Field label="Heading (bold part)"><input type="text" value={d.headingStrong ?? ''} onChange={(e) => set('headingStrong', e.target.value)} placeholder="Cloud Intellect?" /></Field></Row>
      <Row><Field label="Arrow icon URL (optional)"><input type="text" value={d.arrowIcon ?? ''} onChange={(e) => set('arrowIcon', e.target.value)} placeholder="https://..." /></Field></Row>
      <Row><Field label="FAQ row image URL (optional, default for all rows)"><input type="text" value={d.faqImage ?? ''} onChange={(e) => set('faqImage', e.target.value)} placeholder="https://..." /></Field></Row>
      <h4 className="editor-form-subsection">FAQ accordion items</h4>
      <p className="admin-form-help">Number = icon id. Drag an image onto the box or click to upload for each row; or paste an image path.</p>
      {items.map((item, i) => {
        const imagePath = item?.image || item?.url || ''
        const previewUrl = imagePath ? (imagePath.startsWith('/') ? getImageUrl(imagePath) : imagePath) : ''
        return (
          <div key={i} className="editor-card-block" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span className="editor-form-subsection">Item {i + 1}</span>
              <button type="button" className="editor-remove-row" onClick={() => removeItem(i)} aria-label="Remove">×</button>
            </div>
            <Row><Field label="Number (icon id)"><input type="text" value={item.number ?? ''} onChange={(e) => setItem(i, 'number', e.target.value)} placeholder="12" /></Field></Row>
            <Row><Field label="Title"><input type="text" value={item.title ?? ''} onChange={(e) => setItem(i, 'title', e.target.value)} placeholder="High-Impact Networking Connections" /></Field></Row>
            <Row><Field label="Content"><textarea value={item.content ?? ''} onChange={(e) => setItem(i, 'content', e.target.value)} rows={2} placeholder="Short description" /></Field></Row>
            <Field label="Row image (drag & drop or click)">
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 12 }}>
                <div
                  className={`placement-image-dropzone ${uploadingItemIndex === i ? 'placement-image-dropzone--uploading' : ''}`}
                  style={{ minWidth: 140, minHeight: 90 }}
                  onDragOver={onWhyChooseDragOver}
                  onDragLeave={onWhyChooseDragLeave}
                  onDrop={(e) => onWhyChooseDrop(e, i)}
                  onClick={() => { if (uploadingItemIndex !== null) return; setPendingUploadItemIndex(i); whyChooseFileRef.current?.click(); }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && uploadingItemIndex === null) { e.preventDefault(); setPendingUploadItemIndex(i); whyChooseFileRef.current?.click(); } }}
                  aria-label={`Item ${i + 1} row image: drag image or click to upload`}
                >
                  {uploadingItemIndex === i ? 'Uploading…' : previewUrl ? <img src={previewUrl} alt="" style={{ maxWidth: '100%', maxHeight: 90, objectFit: 'contain' }} /> : 'Drop or click'}
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <input type="text" value={item.image ?? ''} onChange={(e) => setItem(i, 'image', e.target.value)} placeholder="Or paste image path" style={{ width: '100%', marginTop: 4 }} />
                </div>
              </div>
            </Field>
          </div>
        )
      })}
      <button type="button" className="editor-add-row" onClick={addItem}>+ Add item</button>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

const IMG_BASE_NEWS = '/images/News and Events'
const DEFAULT_NEWS_TIMELINE_ITEMS = () => [
  { title: 'Knowledge Sessions', text: 'Cloud Intellect mentors delivered hands-on CRM, Apex & Marketing Cloud training during the event.', image: `${IMG_BASE_NEWS}/Event Image.webp` },
  { title: 'Marketing Workshop', text: 'Sumit Sir was honoured for impactful mentorship and his contribution to developing Salesforce talent.', image: `${IMG_BASE_NEWS}/Event Image-1.webp` },
  { title: 'Mentor Recognition', text: 'Our mentors engaged with industry professionals, sharing Salesforce trends and skills in demand.', image: `${IMG_BASE_NEWS}/IMG.webp` },
  { title: 'Industry Networking', text: 'Participants learned about Salesforce career paths, job roles, salaries & future growth options.', image: `${IMG_BASE_NEWS}/Event Image.webp` },
  { title: 'Knowledge Sessions', text: 'Cloud Intellect mentors delivered hands-on CRM, Apex & Marketing Cloud training during the event.', image: `${IMG_BASE_NEWS}/Event Image-1.webp` },
  { title: 'Knowledge Sessions', text: 'Cloud Intellect mentors delivered hands-on CRM, Apex & Marketing Cloud training during the event.', image: `${IMG_BASE_NEWS}/IMG.webp` },
  { title: 'Knowledge Sessions', text: 'Cloud Intellect mentors delivered hands-on CRM, Apex & Marketing Cloud training during the event.', image: `${IMG_BASE_NEWS}/Event Image.webp` },
]
const DEFAULT_NEWS_SIDE_ARTICLES = () => [
  { title: 'Career Guidance', text: 'Students received real-time guidance as they solved Salesforce-based problem statements.', image: `${IMG_BASE_NEWS}/Event Image-1.webp` },
  { title: 'Hackathon Support', text: 'Cloud Intellect supported the hackathon as an official sponsor, promoting tech education.', image: `${IMG_BASE_NEWS}/IMG.webp` },
]

/** Home page: News and Events – section heading, main feature, timeline items, side articles (dynamic, drag-and-drop images). */
export function NewsAndEventsForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const headingLine1 = d.headingLine1 ?? 'News and'
  const headingStrong = d.headingStrong ?? 'Events'
  const mainFeature = d.mainFeature && typeof d.mainFeature === 'object' ? d.mainFeature : {
    image: `${IMG_BASE_NEWS}/Event Image.webp`,
    title: 'Cloud Intellect Shines at Salesforce Hackathon Nagpur 2025',
    description: 'Cloud Intellect participated as a sponsor and delivered expert-led Salesforce mentorship at the Nagpur Hackathon, with special recognition awarded to Sumit Sir.',
    readMoreHref: '#read-more',
    readMoreLabel: 'READ MORE',
  }
  const setMainFeature = (field, value) => set('mainFeature', { ...mainFeature, [field]: value })
  const timelineItems = Array.isArray(d.timelineItems) && d.timelineItems.length > 0 ? d.timelineItems : DEFAULT_NEWS_TIMELINE_ITEMS()
  const setTimelineItem = (i, field, value) => set('timelineItems', timelineItems.map((it, j) => (j === i ? { ...(it || {}), [field]: value } : it)))
  const addTimelineItem = () => set('timelineItems', [...timelineItems, { image: '', title: '', text: '' }])
  const removeTimelineItem = (i) => set('timelineItems', timelineItems.filter((_, j) => j !== i))
  const sideArticles = Array.isArray(d.sideArticles) && d.sideArticles.length > 0 ? d.sideArticles : DEFAULT_NEWS_SIDE_ARTICLES()
  const setSideArticle = (i, field, value) => set('sideArticles', sideArticles.map((it, j) => (j === i ? { ...(it || {}), [field]: value } : it)))
  const addSideArticle = () => set('sideArticles', [...sideArticles, { image: '', title: '', text: '' }])
  const removeSideArticle = (i) => set('sideArticles', sideArticles.filter((_, j) => j !== i))

  const [uploadingTarget, setUploadingTarget] = useState(null) // 'main' | 'timeline-0' | 'side-0' etc
  const [pendingTarget, setPendingTarget] = useState(null)
  const newsFileRef = useRef(null)

  const handleNewsImageUpload = async (target, file) => {
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10MB')
      return
    }
    setUploadingTarget(target)
    try {
      const response = await uploadAPI.uploadFile(file, NEWS_AND_EVENTS_FOLDER)
      const path = parseUploadPathResponse(response)
      if (!path) throw new Error('Upload response missing path')
      if (target === 'main') setMainFeature('image', path)
      else if (target.startsWith('timeline-')) setTimelineItem(Number(target.replace('timeline-', '')), 'image', path)
      else if (target.startsWith('side-')) setSideArticle(Number(target.replace('side-', '')), 'image', path)
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingTarget(null)
      if (newsFileRef.current) newsFileRef.current.value = ''
    }
  }

  const onNewsDrop = (e, target) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer?.files?.[0]
    if (file) handleNewsImageUpload(target, file)
  }
  const onNewsDragOver = (e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy' }
  const onNewsDragLeave = (e) => { e.preventDefault(); e.stopPropagation() }

  const dropzone = (target, imagePath, label) => {
    const previewUrl = imagePath ? (imagePath.startsWith('/') ? getImageUrl(imagePath) : imagePath) : ''
    const isUploading = uploadingTarget === target
    return (
      <div
        className={`placement-image-dropzone ${isUploading ? 'placement-image-dropzone--uploading' : ''}`}
        style={{ minWidth: 120, minHeight: 80 }}
        onDragOver={onNewsDragOver}
        onDragLeave={onNewsDragLeave}
        onDrop={(e) => onNewsDrop(e, target)}
        onClick={() => { if (uploadingTarget != null) return; setPendingTarget(target); newsFileRef.current?.click(); }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && uploadingTarget == null) { e.preventDefault(); setPendingTarget(target); newsFileRef.current?.click(); } }}
        aria-label={label}
      >
        {isUploading ? 'Uploading…' : previewUrl ? <img src={previewUrl} alt="" style={{ maxWidth: '100%', maxHeight: 80, objectFit: 'contain' }} /> : 'Drop or click'}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <input
        type="file"
        ref={newsFileRef}
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target?.files?.[0]
          const t = pendingTarget
          setPendingTarget(null)
          if (file && t) handleNewsImageUpload(t, file)
        }}
      />
      <h4 className="editor-form-subsection">Section heading</h4>
      <Row><Field label="Heading (before bold)"><input type="text" value={headingLine1} onChange={(e) => set('headingLine1', e.target.value)} placeholder="News and" /></Field></Row>
      <Row><Field label="Heading (bold part)"><input type="text" value={headingStrong} onChange={(e) => set('headingStrong', e.target.value)} placeholder="Events" /></Field></Row>
      <h4 className="editor-form-subsection">Main feature (large block)</h4>
      <Field label="Image (drag & drop or click)">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 12 }}>
          {dropzone('main', mainFeature.image, 'Main feature image')}
          <div style={{ flex: 1, minWidth: 180 }}>
            <input type="text" value={mainFeature.image ?? ''} onChange={(e) => setMainFeature('image', e.target.value)} placeholder="Or paste image path" style={{ width: '100%', marginTop: 4 }} />
          </div>
        </div>
      </Field>
      <Row><Field label="Title"><input type="text" value={mainFeature.title ?? ''} onChange={(e) => setMainFeature('title', e.target.value)} placeholder="Cloud Intellect Shines at..." /></Field></Row>
      <Row><Field label="Description"><textarea value={mainFeature.description ?? ''} onChange={(e) => setMainFeature('description', e.target.value)} rows={2} placeholder="Short description" /></Field></Row>
      <Row><Field label="Read more URL"><input type="text" value={mainFeature.readMoreHref ?? ''} onChange={(e) => setMainFeature('readMoreHref', e.target.value)} placeholder="#read-more" /></Field></Row>
      <Row><Field label="Read more button text"><input type="text" value={mainFeature.readMoreLabel ?? ''} onChange={(e) => setMainFeature('readMoreLabel', e.target.value)} placeholder="READ MORE" /></Field></Row>
      <h4 className="editor-form-subsection">Timeline items (left column)</h4>
      <p className="admin-form-help">Drag an image onto the box or click to upload; or paste an image path.</p>
      {timelineItems.map((item, i) => (
        <div key={i} className="editor-card-block" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span>Timeline item {i + 1}</span>
            <button type="button" className="editor-remove-row" onClick={() => removeTimelineItem(i)} aria-label="Remove">×</button>
          </div>
          <Field label="Image (optional)">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 12 }}>
              {dropzone(`timeline-${i}`, item.image, `Timeline item ${i + 1} image`)}
              <div style={{ flex: 1, minWidth: 160 }}>
                <input type="text" value={item.image ?? ''} onChange={(e) => setTimelineItem(i, 'image', e.target.value)} placeholder="Or paste path" style={{ width: '100%', marginTop: 4 }} />
              </div>
            </div>
          </Field>
          <Row><Field label="Title"><input type="text" value={item.title ?? ''} onChange={(e) => setTimelineItem(i, 'title', e.target.value)} placeholder="Knowledge Sessions" /></Field></Row>
          <Row><Field label="Text"><textarea value={item.text ?? ''} onChange={(e) => setTimelineItem(i, 'text', e.target.value)} rows={2} placeholder="Short description" /></Field></Row>
        </div>
      ))}
      <button type="button" className="editor-add-row" onClick={addTimelineItem}>+ Add timeline item</button>
      <h4 className="editor-form-subsection">Side articles (right column)</h4>
      {sideArticles.map((article, i) => (
        <div key={i} className="editor-card-block" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span>Side article {i + 1}</span>
            <button type="button" className="editor-remove-row" onClick={() => removeSideArticle(i)} aria-label="Remove">×</button>
          </div>
          <Field label="Image (optional)">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 12 }}>
              {dropzone(`side-${i}`, article.image, `Side article ${i + 1} image`)}
              <div style={{ flex: 1, minWidth: 160 }}>
                <input type="text" value={article.image ?? ''} onChange={(e) => setSideArticle(i, 'image', e.target.value)} placeholder="Or paste path" style={{ width: '100%', marginTop: 4 }} />
              </div>
            </div>
          </Field>
          <Row><Field label="Title"><input type="text" value={article.title ?? ''} onChange={(e) => setSideArticle(i, 'title', e.target.value)} placeholder="Career Guidance" /></Field></Row>
          <Row><Field label="Text"><textarea value={article.text ?? ''} onChange={(e) => setSideArticle(i, 'text', e.target.value)} rows={2} placeholder="Short description" /></Field></Row>
        </div>
      ))}
      <button type="button" className="editor-add-row" onClick={addSideArticle}>+ Add side article</button>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

/** Home page: Our Placement Network – heading + logo images (drag-and-drop upload). */
export function PlacementNetworkForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const logoList = Array.isArray(d.logos) && d.logos.length > 0 ? d.logos : []
  const setLogo = (i, field, value) => set('logos', logoList.map((s, j) => (j === i ? { ...(s || {}), [field]: value } : s)))
  const addLogo = () => set('logos', [...logoList, { image: '' }])
  const removeLogo = (i) => set('logos', logoList.filter((_, j) => j !== i))

  const [uploadingIndex, setUploadingIndex] = useState(null)
  const [pendingUploadIndex, setPendingUploadIndex] = useState(null)
  const fileInputRef = useRef(null)

  const handleLogoUpload = async (index, file) => {
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10MB')
      return
    }
    setUploadingIndex(index)
    try {
      const response = await uploadAPI.uploadFile(file, PLACEMENT_NETWORK_LOGOS_FOLDER)
      const path = parseUploadPathResponse(response)
      if (path) {
        if (index >= logoList.length) {
          set('logos', [...logoList, { image: path }])
        } else {
          setLogo(index, 'image', path)
        }
      } else throw new Error('Upload response missing path')
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingIndex(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const onDrop = (e, index) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer?.files?.[0]
    if (file) handleLogoUpload(index, file)
  }
  const onDragOver = (e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy' }
  const onDragLeave = (e) => { e.preventDefault(); e.stopPropagation() }

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Section header</h4>
      <Row>
        <Field label="Heading">
          <input type="text" value={d.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Our Placement Network are" />
        </Field>
      </Row>
      <h4 className="editor-form-subsection">Company logos (drag & drop or click to upload)</h4>
      <p className="admin-form-help">Upload logo images. Order below = order in the carousel. Logos are shown in a scrolling strip.</p>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target?.files?.[0]
          const idx = pendingUploadIndex
          setPendingUploadIndex(null)
          if (file && typeof idx === 'number' && idx >= 0) handleLogoUpload(idx, file)
        }}
      />
      <Field label="Logos">
        {logoList.length === 0 ? (
          <div
            className="placement-image-dropzone"
            style={{ minWidth: 140, minHeight: 100 }}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={(e) => { e.preventDefault(); e.stopPropagation(); const file = e.dataTransfer?.files?.[0]; if (file) handleLogoUpload(0, file); }}
            onClick={() => { setPendingUploadIndex(0); fileInputRef.current?.click(); }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !uploadingIndex) { e.preventDefault(); setPendingUploadIndex(0); fileInputRef.current?.click(); } }}
            aria-label="Add first logo: drag image or click to upload"
          >
            {uploadingIndex === 0 ? 'Uploading…' : 'Drag image here or click to add first logo'}
          </div>
        ) : (
          <>
            {logoList.map((logo, i) => {
              const path = logo?.image || logo?.url || ''
              const previewUrl = path ? (path.startsWith('/') ? getImageUrl(path) : path) : ''
              return (
                <div key={i} className="editor-card-block" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div
                    className={`placement-image-dropzone ${uploadingIndex === i ? 'placement-image-dropzone--uploading' : ''}`}
                    style={{ minWidth: 100, minHeight: 70 }}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={(e) => onDrop(e, i)}
                    onClick={() => { if (uploadingIndex !== null) return; setPendingUploadIndex(i); fileInputRef.current?.click(); }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && uploadingIndex === null) { e.preventDefault(); setPendingUploadIndex(i); fileInputRef.current?.click(); } }}
                    aria-label={`Logo ${i + 1}: drag image or click to upload`}
                  >
                    {uploadingIndex === i ? 'Uploading…' : previewUrl ? <img src={previewUrl} alt="" style={{ maxWidth: '100%', maxHeight: 70, objectFit: 'contain' }} /> : 'Drop or click'}
                  </div>
                  <div style={{ flex: 1, minWidth: 100 }}>
                    <span className="editor-form-row-label">Logo {i + 1}</span>
                    <button type="button" className="editor-remove-row" onClick={() => removeLogo(i)} style={{ marginLeft: 8 }}>Remove</button>
                  </div>
                </div>
              )
            })}
            <button type="button" className="editor-add-row" onClick={() => { addLogo(); setPendingUploadIndex(logoList.length); setTimeout(() => fileInputRef.current?.click(), 100); }}>+ Add logo (then click to upload)</button>
          </>
        )}
      </Field>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

/** Hero carousel slides: one row per slide with text inputs. */
export function HeroSlidesForm({ slides, onChange, onSubmit, saving }) {
  const list = Array.isArray(slides) && slides.length > 0 ? slides : [{ name: '', lastName: '', designation: '', package: '', image: '', logo: '' }]
  const setSlide = (i, field, value) => {
    const next = list.map((s, j) => (j === i ? { ...s, [field]: value } : s))
    onChange(next)
  }
  const addSlide = () => onChange([...list, { name: '', lastName: '', designation: '', package: '', image: '', logo: '' }])
  const removeSlide = (i) => onChange(list.filter((_, j) => j !== i))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <p className="admin-form-help" style={{ marginBottom: '12px' }}>Each row is one slide in the hero carousel. Fill in the fields and click Update.</p>
      {list.map((slide, i) => (
        <div key={i} className="editor-card-block">
          <div className="editor-card-fields">
            <input type="text" value={slide.name ?? ''} onChange={(e) => setSlide(i, 'name', e.target.value)} placeholder="First name" />
            <input type="text" value={slide.lastName ?? ''} onChange={(e) => setSlide(i, 'lastName', e.target.value)} placeholder="Last name" />
            <input type="text" value={slide.designation ?? ''} onChange={(e) => setSlide(i, 'designation', e.target.value)} placeholder="Designation" />
            <input type="text" value={slide.package ?? ''} onChange={(e) => setSlide(i, 'package', e.target.value)} placeholder="Package (e.g. 18.5)" />
            <input type="text" value={slide.image ?? ''} onChange={(e) => setSlide(i, 'image', e.target.value)} placeholder="Image URL or path" />
            <input type="text" value={slide.logo ?? ''} onChange={(e) => setSlide(i, 'logo', e.target.value)} placeholder="Logo name (e.g. metacube)" />
          </div>
          <button type="button" className="editor-remove-row" onClick={() => removeSlide(i)} aria-label="Remove slide">×</button>
        </div>
      ))}
      <button type="button" className="editor-add-row" onClick={addSlide}>+ Add slide</button>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update hero slides'}</button>
      </div>
    </form>
  )
}

/** Custom form for Webinars Cover Section */
export function WebinarsCoverForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const setMultiple = (updates) => onChange({ ...d, ...updates })

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <Row>
        <Field label="Section Heading (e.g. 'What These Webinars Cover')">
          <input 
            type="text" 
            value={d.heading || d.title || ''} 
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ heading: value, title: value })
            }} 
            placeholder="What These Webinars Cover" 
          />
        </Field>
      </Row>
      <Row>
        <Field label="Intro Text">
          <textarea 
            value={d.intro || d.description || ''} 
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ intro: value, description: value })
            }} 
            rows={3} 
            placeholder="We focus on clarity, not theory overload..." 
          />
        </Field>
      </Row>
      <Row>
        <Field label="Why Attend Title">
          <input 
            type="text" 
            value={d.whyAttendTitle || ''} 
            onChange={(e) => set('whyAttendTitle', e.target.value)} 
            placeholder="Why Attend?" 
          />
        </Field>
      </Row>
      <Row>
        <Field label="Why Attend Text">
          <textarea 
            value={d.whyAttendText || ''} 
            onChange={(e) => set('whyAttendText', e.target.value)} 
            rows={2} 
            placeholder="Choosing the right track is crucial..." 
          />
        </Field>
      </Row>
      <RowTwo>
        <Field label="Project Title">
          <input 
            type="text" 
            value={d.projectTitle || ''} 
            onChange={(e) => set('projectTitle', e.target.value)} 
            placeholder="Real Project Experience" 
          />
        </Field>
        <Field label="Project Subtitle">
          <input 
            type="text" 
            value={d.projectSubtitle || ''} 
            onChange={(e) => set('projectSubtitle', e.target.value)} 
            placeholder="Guaranteed exposure" 
          />
        </Field>
      </RowTwo>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

/** Custom form for Who Should Attend Section */
export function WhoShouldAttendForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <Row>
        <Field label="Section Heading (e.g. 'Who Should Attend?')">
          <input 
            type="text" 
            value={d.heading || d.title || ''} 
            onChange={(e) => {
              set('heading', e.target.value)
              set('title', e.target.value)
            }} 
            placeholder="Who Should Attend?" 
          />
        </Field>
      </Row>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
        Note: The attendee cards are managed separately in the Webinars admin section.
      </p>
    </form>
  )
}

/** Custom form for Make Informed Decision Section */
export function MakeInformedDecisionForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const benefits = Array.isArray(d.benefits) && d.benefits.length > 0 ? d.benefits : ['', '', '', '']
  const setBenefit = (i, value) => {
    const next = [...benefits]
    next[i] = value
    set('benefits', next.filter(b => b.trim() !== ''))
  }
  const addBenefit = () => set('benefits', [...benefits, ''])
  const removeBenefit = (i) => set('benefits', benefits.filter((_, j) => j !== i))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <Row>
        <Field label="Section Heading">
          <input 
            type="text" 
            value={d.heading || d.title || ''} 
            onChange={(e) => {
              set('heading', e.target.value)
              set('title', e.target.value)
            }} 
            placeholder="Make an Informed Decision" 
          />
        </Field>
      </Row>
      <Row>
        <Field label="Subheading / Description">
          <textarea 
            value={d.subheading || d.description || ''} 
            onChange={(e) => {
              set('subheading', e.target.value)
              set('description', e.target.value)
            }} 
            rows={3} 
            placeholder="Attend the webinar, understand both tracks clearly, and choose your path with confidence." 
          />
        </Field>
      </Row>
      <Row>
        <Field label="Benefits List">
          {benefits.map((benefit, i) => (
            <div key={i} className="editor-stat-row" style={{ gridTemplateColumns: '1fr auto', marginBottom: '8px' }}>
              <input 
                type="text" 
                value={benefit} 
                onChange={(e) => setBenefit(i, e.target.value)} 
                placeholder={`Benefit ${i + 1} (e.g. Learn before committing time or money)`}
              />
              {benefits.length > 1 && (
                <button type="button" className="editor-remove-row" onClick={() => removeBenefit(i)}>×</button>
              )}
            </div>
          ))}
          <button type="button" className="editor-add-row" onClick={addBenefit}>+ Add benefit</button>
        </Field>
      </Row>
      <RowTwo>
        <Field label="Primary Button Text">
          <input 
            type="text" 
            value={d.primaryButtonText || ''} 
            onChange={(e) => set('primaryButtonText', e.target.value)} 
            placeholder="Explore Programs" 
          />
        </Field>
        <Field label="Primary Button Link">
          <input 
            type="text" 
            value={d.primaryButtonHref || ''} 
            onChange={(e) => set('primaryButtonHref', e.target.value)} 
            placeholder="#programs" 
          />
        </Field>
      </RowTwo>
      <RowTwo>
        <Field label="Secondary Button Text">
          <input 
            type="text" 
            value={d.secondaryButtonText || ''} 
            onChange={(e) => set('secondaryButtonText', e.target.value)} 
            placeholder="View Placements" 
          />
        </Field>
        <Field label="Secondary Button Link">
          <input 
            type="text" 
            value={d.secondaryButtonHref || ''} 
            onChange={(e) => set('secondaryButtonHref', e.target.value)} 
            placeholder="#placements" 
          />
        </Field>
      </RowTwo>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

/** Custom form for More Success Stories Section */
export function MoreSuccessStoriesForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <Row>
        <Field label="Section Heading (e.g. 'More Success Stories')">
          <input 
            type="text" 
            value={d.heading || d.title || ''} 
            onChange={(e) => {
              set('heading', e.target.value)
              set('title', e.target.value)
            }} 
            placeholder="More Success Stories" 
          />
        </Field>
      </Row>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
        Note: The success stories are managed separately in the Success Stories admin section.
      </p>
    </form>
  )
}

const ALLOWED_IMAGE_TYPES = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
const YOUR_JOURNEY_ICON_FOLDER = 'images/Your_Journey'

/** Custom form for Your Journey Section (alumni-success) */
export function YourJourneyForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const defaultBenefits = [
    { text: 'The right learning path', icon: '/images/Your_Journey/psychology.svg' },
    { text: 'Practical exposure', icon: '/images/Your_Journey/sensor_occupied.svg' },
    { text: 'Honest guidance', icon: '/images/Your_Journey/airline_stops.svg' },
  ]
  const benefits = Array.isArray(d.benefits) && d.benefits.length > 0 ? d.benefits : defaultBenefits

  const [uploadingBenefitIndex, setUploadingBenefitIndex] = useState(null)
  const [dropZoneActiveIndex, setDropZoneActiveIndex] = useState(null)
  const [fileTargetBenefitIndex, setFileTargetBenefitIndex] = useState(null)
  const benefitIconInputRef = useRef(null)

  const setBenefit = (index, field, value) => {
    const next = benefits.map((b, i) => (i === index ? { ...b, [field]: value } : b))
    set('benefits', next)
  }
  const addBenefit = () => set('benefits', [...benefits, { text: '', icon: '' }])
  const removeBenefit = (index) => set('benefits', benefits.filter((_, i) => i !== index))

  const uploadIconFile = async (index, file) => {
    if (!file || !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert('Please use an image file (SVG, PNG, JPG, GIF, or WEBP)')
      return
    }
    setUploadingBenefitIndex(index)
    try {
      const response = await uploadAPI.uploadFile(file, YOUR_JOURNEY_ICON_FOLDER)
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
      setBenefit(index, 'icon', imagePath)
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload icon: ${error.message || 'Unknown error'}`)
    } finally {
      setUploadingBenefitIndex(null)
      setFileTargetBenefitIndex(null)
      if (benefitIconInputRef.current) benefitIconInputRef.current.value = ''
    }
  }

  const handleIconDrop = (e, index) => {
    e.preventDefault()
    e.stopPropagation()
    setDropZoneActiveIndex(null)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadIconFile(index, file)
  }

  const handleIconDragOver = (e, index) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
    setDropZoneActiveIndex(index)
  }

  const handleIconDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropZoneActiveIndex(null)
  }

  const handleIconClick = (index) => {
    if (uploadingBenefitIndex !== null) return
    setFileTargetBenefitIndex(index)
    benefitIconInputRef.current?.click()
  }

  const handleIconFileSelect = (e) => {
    const file = e.target.files?.[0]
    const index = fileTargetBenefitIndex
    if (file && index !== null && index !== undefined) uploadIconFile(index, file)
    setFileTargetBenefitIndex(null)
  }

  const benefitIconPreviewUrl = (iconPath) => {
    if (!iconPath) return ''
    const path = iconPath.startsWith('/') ? iconPath : `/${iconPath}`
    if (path.startsWith('/images/') || path.includes('images/')) return getImageUrl(path)
    return path
  }

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <input
        type="file"
        ref={benefitIconInputRef}
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        style={{ display: 'none' }}
        onChange={handleIconFileSelect}
      />
      <Row>
        <Field label="Heading">
          <input
            type="text"
            value={d.heading || d.title || ''}
            onChange={(e) => { const v = e.target.value; set('heading', v); set('title', v) }}
            placeholder="Your Journey Can Start Here"
          />
        </Field>
      </Row>
      <Row>
        <Field label="Tagline">
          <textarea
            value={d.tagline || ''}
            onChange={(e) => set('tagline', e.target.value)}
            rows={2}
            placeholder="You don't need a perfect background. You don't need years of experience."
          />
        </Field>
      </Row>
      <Field label="Benefits (icon + text)">
        {benefits.map((benefit, i) => (
          <div key={i} className="editor-repeatable-row">
            <div className="editor-form-row editor-form-row--two">
              <Field label={`Benefit ${i + 1} – Text`}>
                <input
                  type="text"
                  value={benefit.text || ''}
                  onChange={(e) => setBenefit(i, 'text', e.target.value)}
                  placeholder="e.g. The right learning path"
                />
              </Field>
              <Field label={`Benefit ${i + 1} – Icon`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    className={`placement-image-dropzone ${dropZoneActiveIndex === i ? 'placement-image-dropzone--active' : ''} ${uploadingBenefitIndex === i ? 'placement-image-dropzone--uploading' : ''}`}
                    onDragOver={(e) => handleIconDragOver(e, i)}
                    onDragLeave={handleIconDragLeave}
                    onDrop={(e) => handleIconDrop(e, i)}
                    onClick={() => handleIconClick(i)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && uploadingBenefitIndex === null) {
                        e.preventDefault()
                        handleIconClick(i)
                      }
                    }}
                    aria-label="Drag and drop icon image or click to browse"
                  >
                    <span className="placement-image-dropzone-text">
                      {uploadingBenefitIndex === i ? 'Uploading...' : 'Drag and drop icon here, or click to browse'}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={benefit.icon || ''}
                    onChange={(e) => setBenefit(i, 'icon', e.target.value)}
                    placeholder="/images/Your_Journey/icon.svg"
                    style={{ width: '100%' }}
                  />
                  {benefit.icon && (
                    <div style={{ marginTop: '4px' }}>
                      <img
                        src={`${benefitIconPreviewUrl(benefit.icon)}${benefit.icon.includes('?') ? '&' : '?'}t=${Date.now()}`}
                        alt=""
                        style={{ maxWidth: '64px', maxHeight: '64px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px' }}
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    </div>
                  )}
                </div>
              </Field>
            </div>
            <button type="button" className="editor-remove-row" onClick={() => removeBenefit(i)} aria-label="Remove">×</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addBenefit}>+ Add benefit</button>
      </Field>
      <Row>
        <Field label="Conclusion text">
          <textarea
            value={d.conclusion || ''}
            onChange={(e) => set('conclusion', e.target.value)}
            rows={2}
            placeholder="That's how these careers were built. Yours can be next."
          />
        </Field>
      </Row>
      <RowTwo>
        <Field label="Primary button text">
          <input
            type="text"
            value={d.primaryButtonText || ''}
            onChange={(e) => set('primaryButtonText', e.target.value)}
            placeholder="Explore Programs"
          />
        </Field>
        <Field label="Primary button link">
          <input
            type="text"
            value={d.primaryButtonHref || ''}
            onChange={(e) => set('primaryButtonHref', e.target.value)}
            placeholder="#programs"
          />
        </Field>
      </RowTwo>
      <RowTwo>
        <Field label="Secondary button text">
          <input
            type="text"
            value={d.secondaryButtonText || ''}
            onChange={(e) => set('secondaryButtonText', e.target.value)}
            placeholder="View Placements"
          />
        </Field>
        <Field label="Secondary button link">
          <input
            type="text"
            value={d.secondaryButtonHref || ''}
            onChange={(e) => set('secondaryButtonHref', e.target.value)}
            placeholder="#placements"
          />
        </Field>
      </RowTwo>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

/** Custom form for Placements Hero Section */
export function PlacementsHeroForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const setMultiple = (updates) => onChange({ ...d, ...updates })
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      console.log('No file selected')
      return
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image file (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB')
      return
    }

    setUploadingImage(true)
    try {
      // Save to images directory (can create a placements subfolder if needed)
      const folder = 'images/placements'
      console.log('Uploading background image:', { 
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
      setMultiple({ backgroundImage: imagePath, bgImage: imagePath })
      console.log('Form data updated with image path:', imagePath)
      
      // Verify the file exists by trying to load it
      const img = new Image()
      img.onload = () => {
        console.log('Image preview loaded successfully:', imagePath)
        alert(`Background image uploaded successfully! Path: ${imagePath}`)
      }
      img.onerror = () => {
        console.error('Image preview failed to load:', imagePath)
        alert(`Warning: Image uploaded but preview failed. Path: ${imagePath}\nPlease check if the file exists at: ${imagePath}`)
      }
      // Add cache busting to force reload
      img.src = `${imagePath}?t=${Date.now()}`
      
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

  const backgroundImage = d.backgroundImage || d.bgImage || '/images/BG (1).webp'

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <Row>
        <Field label="Tag/Label (e.g. '100% PLACEMENT SUPPORT')">
          <input
            type="text"
            value={d.tag || d.label || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ tag: value, label: value })
            }}
            placeholder="100% PLACEMENT SUPPORT"
          />
        </Field>
      </Row>
      <Row>
        <Field label="Heading">
          <input
            type="text"
            value={d.heading || d.title || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ heading: value, title: value })
            }}
            placeholder="Our Students Work at Top Companies."
          />
        </Field>
      </Row>
      <Row>
        <Field label="Description">
          <textarea
            value={d.description || d.subtitle || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ description: value, subtitle: value })
            }}
            rows={3}
            placeholder="Meet our recent students now working in real Salesforce roles at leading companies."
          />
        </Field>
      </Row>
      <Row>
        <Field label="Background Image">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="btn-secondary"
                style={{ whiteSpace: 'nowrap' }}
              >
                {uploadingImage ? 'Uploading...' : 'Upload Image'}
              </button>
              <input
                type="text"
                value={backgroundImage}
                onChange={(e) => {
                  const value = e.target.value
                  setMultiple({ backgroundImage: value, bgImage: value })
                }}
                placeholder="/images/BG (1).webp"
                style={{ flex: 1 }}
              />
            </div>
            {backgroundImage && (
              <div style={{ marginTop: '8px' }}>
                <img
                  src={`${backgroundImage.startsWith('http') ? backgroundImage : getImageUrl(backgroundImage)}?t=${Date.now()}`}
                  alt="Background preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Current: {backgroundImage}
                </p>
              </div>
            )}
            <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Default: /images/BG (1).webp • Supported formats: PNG, JPG, GIF, WEBP, SVG (max 10MB)
            </p>
          </div>
        </Field>
      </Row>
      <RowTwo>
        <Field label="Primary Button Text">
          <input
            type="text"
            value={d.primaryButtonText || d.primaryBtnText || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ primaryButtonText: value, primaryBtnText: value })
            }}
            placeholder="Explore Programs"
          />
        </Field>
        <Field label="Primary Button Link">
          <input
            type="text"
            value={d.primaryButtonHref || d.primaryBtnHref || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ primaryButtonHref: value, primaryBtnHref: value })
            }}
            placeholder="#programs or /programs"
          />
        </Field>
      </RowTwo>
      <RowTwo>
        <Field label="Secondary Button Text">
          <input
            type="text"
            value={d.secondaryButtonText || d.secondaryBtnText || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ secondaryButtonText: value, secondaryBtnText: value })
            }}
            placeholder="View Placements"
          />
        </Field>
        <Field label="Secondary Button Link">
          <input
            type="text"
            value={d.secondaryButtonHref || d.secondaryBtnHref || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ secondaryButtonHref: value, secondaryBtnHref: value })
            }}
            placeholder="#placements or /placements"
          />
        </Field>
      </RowTwo>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

/** Custom form for Placements Stats Section */
export function PlacementsStatsForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  
  const stats = Array.isArray(d.stats) && d.stats.length > 0 ? d.stats : [
    { value: '5000+', label: 'Learners Trained' },
    { value: '1400+', label: 'Placed' },
    { value: '90%', label: 'Satisfaction' },
    { value: '100%', label: 'Compliance' },
  ]

  const setStat = (index, field, value) => {
    const next = [...stats]
    next[index] = { ...next[index], [field]: value }
    set('stats', next)
  }

  const addStat = () => {
    set('stats', [...stats, { value: '', label: '' }])
  }

  const removeStat = (index) => {
    set('stats', stats.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <AddRemoveRow
        items={stats}
        onAdd={addStat}
        onRemove={removeStat}
        addLabel="+ Add Statistic"
        renderRow={(stat, index) => (
          <RowTwo>
            <Field label={`Stat ${index + 1} - Value`}>
              <input
                type="text"
                value={stat.value || ''}
                onChange={(e) => setStat(index, 'value', e.target.value)}
                placeholder="5000+"
              />
            </Field>
            <Field label={`Stat ${index + 1} - Label`}>
              <input
                type="text"
                value={stat.label || ''}
                onChange={(e) => setStat(index, 'label', e.target.value)}
                placeholder="Learners Trained"
              />
            </Field>
          </RowTwo>
        )}
      />
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

/** Custom form for Gallery Hero Section */
export function GalleryHeroForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const setMultiple = (updates) => onChange({ ...d, ...updates })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [dropZoneActive, setDropZoneActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image file (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB')
      return
    }

    setUploadingImage(true)
    try {
      const folder = 'images/gallery'
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
      setMultiple({ backgroundImage: imagePath, bgImage: imagePath })
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload image: ${error.message || 'Unknown error'}`)
    } finally {
      setUploadingImage(false)
      setDropZoneActive(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleImageDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropZoneActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const fakeEvent = { target: { files: [file] } }
      handleImageUpload(fakeEvent)
    }
  }

  const handleImageDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
    setDropZoneActive(true)
  }

  const handleImageDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropZoneActive(false)
  }

  const backgroundImage = d.backgroundImage || d.bgImage || '/images/BG (2).webp'
  const imageUrl = backgroundImage.startsWith('/images/') || backgroundImage.includes('images/')
    ? getImageUrl(backgroundImage)
    : backgroundImage

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <Row>
        <Field label="Tag/Label (e.g. 'GLIMPSE OF OUR CAMPUS')">
          <input
            type="text"
            value={d.tag || d.label || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ tag: value, label: value })
            }}
            placeholder="GLIMPSE OF OUR CAMPUS"
          />
        </Field>
      </Row>
      <Row>
        <Field label="Heading">
          <input
            type="text"
            value={d.heading || d.title || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ heading: value, title: value })
            }}
            placeholder="Life at Cloud Intellect"
          />
        </Field>
      </Row>
      <Row>
        <Field label="Description">
          <textarea
            value={d.description || d.subtitle || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ description: value, subtitle: value })
            }}
            rows={3}
            placeholder="A glimpse into our vibrant learning ecosystem. From intense classroom sessions to celebratory moments, see what makes our community special."
          />
        </Field>
      </Row>
      <Row>
        <Field label="Background Image">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <div
              className={`placement-image-dropzone ${dropZoneActive ? 'placement-image-dropzone--active' : ''} ${uploadingImage ? 'placement-image-dropzone--uploading' : ''}`}
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
              aria-label="Drag and drop background image or click to browse"
            >
              <span className="placement-image-dropzone-text">
                {uploadingImage ? 'Uploading...' : 'Drag and drop background image here, or click to browse'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                disabled={uploadingImage}
                className="btn-secondary"
                style={{ whiteSpace: 'nowrap' }}
              >
                {uploadingImage ? 'Uploading...' : 'Upload Image'}
              </button>
              <input
                type="text"
                value={backgroundImage}
                onChange={(e) => {
                  const value = e.target.value
                  setMultiple({ backgroundImage: value, bgImage: value })
                }}
                placeholder="/images/BG (2).webp"
                style={{ flex: 1 }}
              />
            </div>
            {backgroundImage && (
              <div style={{ marginTop: '8px' }}>
                <img
                  src={`${imageUrl}?t=${Date.now()}`}
                  alt="Background preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    display: 'block'
                  }}
                  onError={(e) => {
                    console.error('Failed to load image preview:', backgroundImage)
                    e.target.style.display = 'none'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Current: {backgroundImage}
                </p>
              </div>
            )}
            <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Default: /images/BG (2).webp • Supported formats: PNG, JPG, GIF, WEBP, SVG (max 10MB)
            </p>
          </div>
        </Field>
      </Row>
      <RowTwo>
        <Field label="Primary Button Text">
          <input
            type="text"
            value={d.primaryButtonText || d.primaryBtnText || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ primaryButtonText: value, primaryBtnText: value })
            }}
            placeholder="Explore Programs"
          />
        </Field>
        <Field label="Primary Button Link">
          <input
            type="text"
            value={d.primaryButtonHref || d.primaryBtnHref || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ primaryButtonHref: value, primaryBtnHref: value })
            }}
            placeholder="#programs or /programs"
          />
        </Field>
      </RowTwo>
      <RowTwo>
        <Field label="Secondary Button Text">
          <input
            type="text"
            value={d.secondaryButtonText || d.secondaryBtnText || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ secondaryButtonText: value, secondaryBtnText: value })
            }}
            placeholder="View Placements"
          />
        </Field>
        <Field label="Secondary Button Link">
          <input
            type="text"
            value={d.secondaryButtonHref || d.secondaryBtnHref || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ secondaryButtonHref: value, secondaryBtnHref: value })
            }}
            placeholder="#placements or /placements"
          />
        </Field>
      </RowTwo>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

/** Custom form for Be Our Next Success Story Section */
export function BeNextSuccessStoryForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <Row>
        <Field label="Heading">
          <input
            type="text"
            value={d.heading || d.title || ''}
            onChange={(e) => {
              const value = e.target.value
              set('heading', value)
              set('title', value)
            }}
            placeholder="Be Our Next Success Story"
          />
        </Field>
      </Row>
      <Row>
        <Field label="Description">
          <textarea
            value={d.description || d.text || ''}
            onChange={(e) => {
              const value = e.target.value
              set('description', value)
              set('text', value)
            }}
            rows={3}
            placeholder="Join 5000+ learners who have successfully transitioned into the Salesforce ecosystem. Your journey starts here."
          />
        </Field>
      </Row>
      <RowTwo>
        <Field label="Button Text">
          <input
            type="text"
            value={d.buttonText || d.buttonLabel || ''}
            onChange={(e) => {
              const value = e.target.value
              set('buttonText', value)
              set('buttonLabel', value)
            }}
            placeholder="Apply Today"
          />
        </Field>
        <Field label="Button Link">
          <input
            type="text"
            value={d.buttonHref || d.buttonLink || ''}
            onChange={(e) => {
              const value = e.target.value
              set('buttonHref', value)
              set('buttonLink', value)
            }}
            placeholder="#apply or /apply"
          />
        </Field>
      </RowTwo>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

/** Custom form for Contact Hero Section */
export function ContactHeroForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const setMultiple = (updates) => onChange({ ...d, ...updates })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [dropZoneActive, setDropZoneActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image file (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB')
      return
    }

    setUploadingImage(true)
    try {
      const folder = 'images/contact'
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
      setMultiple({ backgroundImage: imagePath, bgImage: imagePath })
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload image: ${error.message || 'Unknown error'}`)
    } finally {
      setUploadingImage(false)
      setDropZoneActive(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleImageDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropZoneActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const fakeEvent = { target: { files: [file] } }
      handleImageUpload(fakeEvent)
    }
  }

  const handleImageDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
    setDropZoneActive(true)
  }

  const handleImageDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropZoneActive(false)
  }

  const backgroundImage = d.backgroundImage || d.bgImage || '/images/BG (2).webp'
  const imageUrl = backgroundImage.startsWith('/images/') || backgroundImage.includes('images/')
    ? getImageUrl(backgroundImage)
    : backgroundImage

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <Row>
        <Field label="Tag/Label (e.g. 'GET IN TOUCH')">
          <input
            type="text"
            value={d.tag || d.label || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ tag: value, label: value })
            }}
            placeholder="GET IN TOUCH"
          />
        </Field>
      </Row>
      <Row>
        <Field label="Heading">
          <input
            type="text"
            value={d.heading || d.title || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ heading: value, title: value })
            }}
            placeholder="Start Your Journey With Cloud Intellect"
          />
        </Field>
      </Row>
      <Row>
        <Field label="Description">
          <textarea
            value={d.description || d.subtitle || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ description: value, subtitle: value })
            }}
            rows={3}
            placeholder="Whether you have questions about our courses, placements, or just want to say hello, we're here to help you navigate your Salesforce career."
          />
        </Field>
      </Row>
      <Row>
        <Field label="Background Image">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <div
              className={`placement-image-dropzone ${dropZoneActive ? 'placement-image-dropzone--active' : ''} ${uploadingImage ? 'placement-image-dropzone--uploading' : ''}`}
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
              aria-label="Drag and drop background image or click to browse"
            >
              <span className="placement-image-dropzone-text">
                {uploadingImage ? 'Uploading...' : 'Drag and drop background image here, or click to browse'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                disabled={uploadingImage}
                className="btn-secondary"
                style={{ whiteSpace: 'nowrap' }}
              >
                {uploadingImage ? 'Uploading...' : 'Upload Image'}
              </button>
              <input
                type="text"
                value={backgroundImage}
                onChange={(e) => {
                  const value = e.target.value
                  setMultiple({ backgroundImage: value, bgImage: value })
                }}
                placeholder="/images/BG (2).webp"
                style={{ flex: 1 }}
              />
            </div>
            {backgroundImage && (
              <div style={{ marginTop: '8px' }}>
                <img
                  src={`${imageUrl}?t=${Date.now()}`}
                  alt="Background preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    display: 'block'
                  }}
                  onError={(e) => {
                    console.error('Failed to load image preview:', backgroundImage)
                    e.target.style.display = 'none'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Current: {backgroundImage}
                </p>
              </div>
            )}
            <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Default: /images/BG (2).webp • Supported formats: PNG, JPG, GIF, WEBP, SVG (max 10MB)
            </p>
          </div>
        </Field>
      </Row>
      <RowTwo>
        <Field label="Primary Button Text">
          <input
            type="text"
            value={d.primaryButtonText || d.primaryBtnText || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ primaryButtonText: value, primaryBtnText: value })
            }}
            placeholder="Explore Programs"
          />
        </Field>
        <Field label="Primary Button Link">
          <input
            type="text"
            value={d.primaryButtonHref || d.primaryBtnHref || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ primaryButtonHref: value, primaryBtnHref: value })
            }}
            placeholder="#programs or /programs"
          />
        </Field>
      </RowTwo>
      <RowTwo>
        <Field label="Secondary Button Text">
          <input
            type="text"
            value={d.secondaryButtonText || d.secondaryBtnText || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ secondaryButtonText: value, secondaryBtnText: value })
            }}
            placeholder="View Placements"
          />
        </Field>
        <Field label="Secondary Button Link">
          <input
            type="text"
            value={d.secondaryButtonHref || d.secondaryBtnHref || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ secondaryButtonHref: value, secondaryBtnHref: value })
            }}
            placeholder="#placements or /placements"
          />
        </Field>
      </RowTwo>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

/** About Cloud Intellect page: full-width hero background + copy (no side image column). */
export function AboutCloudIntellectHeroForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const setMultiple = (updates) => onChange({ ...d, ...updates })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [dropZoneActive, setDropZoneActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10MB')
      return
    }
    setUploadingImage(true)
    try {
      const response = await uploadAPI.uploadFile(file, 'images/about-cloudintellect')
      const path = parseUploadPathResponse(response)
      if (path) setMultiple({ backgroundImage: path, bgImage: path, sideImage: '' })
      else throw new Error('Upload response missing path')
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingImage(false)
      setDropZoneActive(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const onDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDropZoneActive(false); const file = e.dataTransfer?.files?.[0]; if (file) handleImageUpload({ target: { files: [file] } }) }
  const onDragOver = (e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; setDropZoneActive(true) }
  const onDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDropZoneActive(false) }

  const backgroundPath = d.backgroundImage || d.bgImage || d.sideImage || ''
  const previewUrl = (backgroundPath.startsWith('/') || backgroundPath.includes('images/'))
    ? getImageUrl(backgroundPath)
    : backgroundPath

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <Row><Field label="Badge / tag"><input type="text" value={d.tag ?? ''} onChange={(e) => set('tag', e.target.value)} placeholder="SALESFORCE WORKFORCE PARTNER" /></Field></Row>
      <Row><Field label="Headline (single line)"><input type="text" value={d.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Building Industry-Ready Salesforce Professionals" /></Field></Row>
      <Row><Field label="Headline line 2 (optional accent)"><input type="text" value={d.headingAccent ?? ''} onChange={(e) => set('headingAccent', e.target.value)} placeholder="Leave empty for one-line headline" /></Field></Row>
      <Row><Field label="Description"><textarea value={d.description ?? ''} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="Supporting line under the headline" /></Field></Row>
      <Row><Field label="Description emphasis (bold substring)"><input type="text" value={d.descriptionEmphasis ?? ''} onChange={(e) => set('descriptionEmphasis', e.target.value)} placeholder="Exact phrase from description to bold" /></Field></Row>
      <RowTwo>
        <Field label="Primary button text"><input type="text" value={d.primaryButtonText ?? ''} onChange={(e) => set('primaryButtonText', e.target.value)} placeholder="Explore Programs" /></Field>
        <Field label="Primary button link"><input type="text" value={d.primaryButtonHref ?? ''} onChange={(e) => set('primaryButtonHref', e.target.value)} placeholder="/salesforce-developer" /></Field>
      </RowTwo>
      <RowTwo>
        <Field label="Secondary button text"><input type="text" value={d.secondaryButtonText ?? ''} onChange={(e) => set('secondaryButtonText', e.target.value)} placeholder="Download Brochure" /></Field>
        <Field label="Secondary button link"><input type="text" value={d.secondaryButtonHref ?? ''} onChange={(e) => set('secondaryButtonHref', e.target.value)} placeholder="#brochure or file URL" /></Field>
      </RowTwo>
      <Field label="Hero background image (full section)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input type="file" ref={fileInputRef} accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml" style={{ display: 'none' }} onChange={handleImageUpload} />
          <div className={`placement-image-dropzone ${dropZoneActive ? 'placement-image-dropzone--active' : ''} ${uploadingImage ? 'placement-image-dropzone--uploading' : ''}`} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onClick={() => !uploadingImage && fileInputRef.current?.click()} role="button" tabIndex={0} onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !uploadingImage) { e.preventDefault(); fileInputRef.current?.click(); } }} aria-label="Upload hero background image">
            {uploadingImage ? 'Uploading…' : 'Drag & drop or click to upload'}
          </div>
          <input
            type="text"
            value={d.backgroundImage || d.bgImage || ''}
            onChange={(e) => setMultiple({ backgroundImage: e.target.value, bgImage: e.target.value })}
            placeholder="/images/about-cloudintellect/hero.webp"
            style={{ width: '100%' }}
          />
          <p className="admin-form-help" style={{ margin: 0 }}>
            Covers the full hero behind the text. Older content using “side image” still works until you save again.
          </p>
          {backgroundPath ? <img src={previewUrl} alt="" style={{ maxWidth: '100%', maxHeight: 140, objectFit: 'cover', borderRadius: 8 }} onError={(e) => { e.target.style.display = 'none' }} /> : null}
        </div>
      </Field>
      <div className="editor-form-actions"><button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button></div>
    </form>
  )
}

const DEFAULT_CIA_CARDS = () => [
  {
    headerColor: '#1a365d',
    icon: '',
    title: 'Cloud Intellect Academy',
    description:
      'Focused on Salesforce training, skill development, and career preparation. Recognized as an official Salesforce Workforce Development Partner.',
    bullets: [
      'Career-oriented training programs',
      'Practical learning on real Salesforce orgs',
      'Certification-aligned preparation',
    ],
  },
  {
    headerColor: '#009fff',
    icon: '',
    title: 'Cloud Intellect Systems',
    description:
      'A Salesforce Ridge Consulting Partner, actively working on real client projects across industries, providing real-world project exposure.',
    bullets: [
      'Salesforce CRM implementation',
      'Marketing automation solutions (SFMC)',
      'Real project workflows & use cases',
    ],
  },
]

/** About Cloud Intellect: The Cloud Intellect Advantage — two-column cards (header color, icon, bullets). */
export function CloudIntellectAdvantageForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const cards = Array.isArray(d.cards) && d.cards.length > 0 ? d.cards : DEFAULT_CIA_CARDS()
  const iconFileRefs = useRef([])
  const [uploadingIconIndex, setUploadingIconIndex] = useState(null)

  const setCard = (i, field, value) =>
    set(
      'cards',
      cards.map((c, j) => (j === i ? { ...(c || {}), [field]: value } : c))
    )

  const handleCardIconUpload = async (cardIndex, e) => {
    const file = e.target?.files?.[0]
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Icon file must be under 5MB')
      return
    }
    setUploadingIconIndex(cardIndex)
    try {
      const response = await uploadAPI.uploadFile(file, 'images/about-cloudintellect')
      const path = parseUploadPathResponse(response)
      if (path) setCard(cardIndex, 'icon', path)
      else throw new Error('Upload response missing path')
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingIconIndex(null)
      const input = iconFileRefs.current[cardIndex]
      if (input) input.value = ''
    }
  }
  const setBullet = (cardIndex, bulletIndex, value) => {
    const c = cards[cardIndex] || {}
    const bullets = Array.isArray(c.bullets) ? [...c.bullets] : []
    bullets[bulletIndex] = value
    setCard(cardIndex, 'bullets', bullets)
  }
  const addBullet = (cardIndex) => {
    const c = cards[cardIndex] || {}
    const bullets = Array.isArray(c.bullets) ? [...c.bullets] : []
    bullets.push('')
    setCard(cardIndex, 'bullets', bullets)
  }
  const removeBullet = (cardIndex, bulletIndex) => {
    const c = cards[cardIndex] || {}
    const bullets = (Array.isArray(c.bullets) ? c.bullets : []).filter((_, j) => j !== bulletIndex)
    setCard(cardIndex, 'bullets', bullets)
  }
  const addCard = () =>
    set('cards', [
      ...cards,
      { headerColor: '#1a365d', icon: '', title: '', description: '', bullets: [''] },
    ])
  const removeCard = (i) => set('cards', cards.filter((_, j) => j !== i))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Section heading</h4>
      <RowTwo>
        <Field label="Heading (regular)">
          <input
            type="text"
            value={d.headingLine1 ?? ''}
            onChange={(e) => set('headingLine1', e.target.value)}
            placeholder="The Cloud Intellect"
          />
        </Field>
        <Field label="Heading (bold part)">
          <input
            type="text"
            value={d.headingBold ?? ''}
            onChange={(e) => set('headingBold', e.target.value)}
            placeholder="Advantage"
          />
        </Field>
      </RowTwo>

      <h4 className="editor-form-subsection">Cards</h4>
      <p className="admin-form-help">
        Leave icon empty to use the default graduation cap / cloud icons. Header color is a CSS hex (e.g. #1a365d).
      </p>
      {cards.map((card, i) => (
        <div key={i} className="editor-card-block" style={{ flexDirection: 'column', alignItems: 'stretch', marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="editor-form-subsection">Card {i + 1}</span>
            <button type="button" className="editor-remove-row" onClick={() => removeCard(i)} aria-label="Remove card">
              ×
            </button>
          </div>
          <Row>
            <Field label="Header color (hex)">
              <input
                type="text"
                value={card.headerColor ?? ''}
                onChange={(e) => setCard(i, 'headerColor', e.target.value)}
                placeholder="#1a365d"
              />
            </Field>
          </Row>
          <Field label="Card icon (optional)">
            <input
              ref={(el) => {
                iconFileRefs.current[i] = el
              }}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
              style={{ display: 'none' }}
              onChange={(e) => handleCardIconUpload(i, e)}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 8 }}>
              <button
                type="button"
                className="btn-secondary"
                disabled={uploadingIconIndex === i}
                onClick={() => iconFileRefs.current[i]?.click()}
              >
                {uploadingIconIndex === i ? 'Uploading…' : 'Upload icon image'}
              </button>
              {(card.icon || '').trim() ? (
                <button
                  type="button"
                  className="editor-remove-row"
                  style={{ position: 'static' }}
                  onClick={() => setCard(i, 'icon', '')}
                  aria-label="Clear icon"
                >
                  Clear icon
                </button>
              ) : null}
            </div>
            <input
              type="text"
              value={card.icon ?? ''}
              onChange={(e) => setCard(i, 'icon', e.target.value)}
              placeholder="/images/about-cloudintellect/… (or use Upload)"
              style={{ width: '100%', marginBottom: 8 }}
            />
            {(card.icon || '').trim() ? (
              <img
                src={
                  (card.icon || '').startsWith('http')
                    ? card.icon
                    : getImageUrl((card.icon || '').startsWith('/') ? card.icon : `/${card.icon}`)
                }
                alt=""
                style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)' }}
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            ) : null}
          </Field>
          <Row>
            <Field label="Title">
              <input
                type="text"
                value={card.title ?? ''}
                onChange={(e) => setCard(i, 'title', e.target.value)}
                placeholder="Cloud Intellect Academy"
              />
            </Field>
          </Row>
          <Row>
            <Field label="Description">
              <textarea
                value={card.description ?? ''}
                onChange={(e) => setCard(i, 'description', e.target.value)}
                rows={3}
                placeholder="Paragraph under the title"
              />
            </Field>
          </Row>
          <Field label="Bullet points">
            {(Array.isArray(card.bullets) ? card.bullets : ['']).map((b, bi) => (
              <div key={bi} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <input
                  type="text"
                  value={b}
                  onChange={(e) => setBullet(i, bi, e.target.value)}
                  placeholder="Bullet text"
                  style={{ flex: 1 }}
                />
                <button type="button" className="editor-remove-row" onClick={() => removeBullet(i, bi)} aria-label="Remove bullet">
                  ×
                </button>
              </div>
            ))}
            <button type="button" className="editor-add-row" onClick={() => addBullet(i)}>
              + Add bullet
            </button>
          </Field>
        </div>
      ))}
      <button type="button" className="editor-add-row" onClick={addCard}>
        + Add card
      </button>

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Update section'}
        </button>
      </div>
    </form>
  )
}

/** About Cloud Intellect: Salesforce Ecosystem Showcase (badge, two-line heading, culture bullets, right image). */
export function SalesforceEcosystemShowcaseForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const bullets = Array.isArray(d.bullets) && d.bullets.length > 0 ? d.bullets : ['']
  const setBullet = (i, value) => set('bullets', bullets.map((b, j) => (j === i ? value : b)))
  const addBullet = () => set('bullets', [...bullets, ''])
  const removeBullet = (i) => set('bullets', bullets.filter((_, j) => j !== i))

  const [uploadingImage, setUploadingImage] = useState(false)
  const [dropZoneActive, setDropZoneActive] = useState(false)
  const fileRef = useRef(null)

  const uploadFile = async (file) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10MB')
      return
    }
    setUploadingImage(true)
    try {
      const response = await uploadAPI.uploadFile(file, 'images/about-cloudintellect')
      const path = parseUploadPathResponse(response)
      if (path) set('image', path)
      else throw new Error('Upload response missing path')
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingImage(false)
      setDropZoneActive(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropZoneActive(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) uploadFile(file)
  }
  const onDragOver = (e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; setDropZoneActive(true) }
  const onDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDropZoneActive(false) }

  const imagePath = d.image || ''
  const previewUrl = imagePath
    ? (imagePath.startsWith('/') ? getImageUrl(imagePath) : imagePath)
    : ''

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Header</h4>
      <Row><Field label="Badge text"><input type="text" value={d.badgeText ?? ''} onChange={(e) => set('badgeText', e.target.value)} placeholder="UNIQUE OPPORTUNITY" /></Field></Row>
      <RowTwo>
        <Field label="Heading line 1"><input type="text" value={d.headingLine1 ?? ''} onChange={(e) => set('headingLine1', e.target.value)} placeholder="The Salesforce" /></Field>
        <Field label="Heading line 2"><input type="text" value={d.headingLine2 ?? ''} onChange={(e) => set('headingLine2', e.target.value)} placeholder="Ecosystem" /></Field>
      </RowTwo>
      <Row><Field label="Description"><textarea value={d.description ?? ''} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="Short supporting paragraph" /></Field></Row>

      <h4 className="editor-form-subsection">Culture card</h4>
      <Row><Field label="Card title"><input type="text" value={d.cultureTitle ?? ''} onChange={(e) => set('cultureTitle', e.target.value)} placeholder="Our Culture" /></Field></Row>
      <Field label="Bullet points">
        {bullets.map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input type="text" value={b} onChange={(e) => setBullet(i, e.target.value)} placeholder="Bullet text" style={{ flex: 1 }} />
            <button type="button" className="editor-remove-row" onClick={() => removeBullet(i)} aria-label="Remove bullet">×</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addBullet}>+ Add bullet</button>
      </Field>

      <h4 className="editor-form-subsection">Right image</h4>
      <Field label="Image">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input type="file" ref={fileRef} accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml" style={{ display: 'none' }} onChange={(e) => { const file = e.target?.files?.[0]; if (file) uploadFile(file) }} />
          <div className={`placement-image-dropzone ${dropZoneActive ? 'placement-image-dropzone--active' : ''} ${uploadingImage ? 'placement-image-dropzone--uploading' : ''}`} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onClick={() => !uploadingImage && fileRef.current?.click()} role="button" tabIndex={0} onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !uploadingImage) { e.preventDefault(); fileRef.current?.click(); } }} aria-label="Upload ecosystem image">
            {uploadingImage ? 'Uploading…' : 'Drag & drop or click to upload'}
          </div>
          <input type="text" value={imagePath} onChange={(e) => set('image', e.target.value)} placeholder="/images/about-cloudintellect/..." style={{ width: '100%' }} />
          {previewUrl ? <img src={previewUrl} alt="" style={{ maxWidth: '100%', maxHeight: 140, objectFit: 'cover', borderRadius: 10 }} onError={(e) => { e.target.style.display = 'none' }} /> : null}
        </div>
      </Field>

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

/** About Cloud Intellect: Training + Placement Model (badge, two-line heading, feature chips, services list). */
export function TrainingPlacementModelForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })

  const features = Array.isArray(d.features) && d.features.length > 0 ? d.features : [{ label: '', icon: '' }]
  const setFeature = (i, field, value) =>
    set('features', features.map((f, j) => (j === i ? { ...(f || {}), [field]: value } : f)))
  const addFeature = () => set('features', [...features, { label: '', icon: '' }])
  const removeFeature = (i) => set('features', features.filter((_, j) => j !== i))

  const serviceItems = Array.isArray(d.serviceItems) && d.serviceItems.length > 0 ? d.serviceItems : [{ text: '', icon: '' }]
  const setService = (i, field, value) =>
    set('serviceItems', serviceItems.map((x, j) => (j === i ? { ...(x || {}), [field]: value } : x)))
  const addService = () => set('serviceItems', [...serviceItems, { text: '', icon: '' }])
  const removeService = (i) => set('serviceItems', serviceItems.filter((_, j) => j !== i))

  const [uploadingTarget, setUploadingTarget] = useState(null) // e.g. "feature:0" or "service:2"
  const [pendingTarget, setPendingTarget] = useState(null)
  const iconFileRef = useRef(null)

  const uploadIcon = async (target, file) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Icon file must be under 5MB')
      return
    }
    setUploadingTarget(target)
    try {
      const response = await uploadAPI.uploadFile(file, 'images/about-cloudintellect')
      const path = parseUploadPathResponse(response)
      if (!path) throw new Error('Upload response missing path')

      const [kind, idxStr] = String(target).split(':')
      const idx = Number(idxStr)
      if (kind === 'feature') setFeature(idx, 'icon', path)
      if (kind === 'service') setService(idx, 'icon', path)
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingTarget(null)
      setPendingTarget(null)
      if (iconFileRef.current) iconFileRef.current.value = ''
    }
  }

  const dropzone = (target, iconPath, ariaLabel) => {
    const previewUrl = iconPath
      ? (iconPath.startsWith('http') ? iconPath : getImageUrl(iconPath.startsWith('/') ? iconPath : `/${iconPath}`))
      : ''
    const isUploading = uploadingTarget === target
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <div
          className={`placement-image-dropzone ${isUploading ? 'placement-image-dropzone--uploading' : ''}`}
          style={{ width: 120, minHeight: 64, cursor: isUploading ? 'not-allowed' : 'pointer' }}
          role="button"
          tabIndex={0}
          aria-label={ariaLabel}
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
            e.dataTransfer.dropEffect = 'copy'
          }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation() }}
          onDrop={(e) => {
            e.preventDefault()
            e.stopPropagation()
            const file = e.dataTransfer.files?.[0]
            if (file && !isUploading) uploadIcon(target, file)
          }}
          onClick={() => {
            if (isUploading) return
            setPendingTarget(target)
            iconFileRef.current?.click()
          }}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !isUploading) {
              e.preventDefault()
              setPendingTarget(target)
              iconFileRef.current?.click()
            }
          }}
        >
          {isUploading
            ? 'Uploading…'
            : previewUrl
              ? <img src={previewUrl} alt="" style={{ maxWidth: '100%', maxHeight: 56, objectFit: 'contain' }} />
              : 'Drop or click'}
        </div>
        {iconPath ? (
          <button
            type="button"
            className="editor-remove-row"
            style={{ position: 'static' }}
            onClick={() => {
              const [kind, idxStr] = String(target).split(':')
              const idx = Number(idxStr)
              if (kind === 'feature') setFeature(idx, 'icon', '')
              if (kind === 'service') setService(idx, 'icon', '')
            }}
          >
            Clear
          </button>
        ) : null}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <input
        type="file"
        ref={iconFileRef}
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target?.files?.[0]
          const t = pendingTarget
          if (file && t) uploadIcon(t, file)
        }}
      />
      <h4 className="editor-form-subsection">Left content</h4>
      <Row><Field label="Badge text"><input type="text" value={d.badgeText ?? ''} onChange={(e) => set('badgeText', e.target.value)} placeholder="UNIQUE OPPORTUNITY" /></Field></Row>
      <RowTwo>
        <Field label="Heading line 1"><input type="text" value={d.headingLine1 ?? ''} onChange={(e) => set('headingLine1', e.target.value)} placeholder="Training + Placement" /></Field>
        <Field label="Heading line 2"><input type="text" value={d.headingLine2 ?? ''} onChange={(e) => set('headingLine2', e.target.value)} placeholder="Model" /></Field>
      </RowTwo>
      <Row><Field label="Intro (short)"><input type="text" value={d.intro ?? ''} onChange={(e) => set('intro', e.target.value)} placeholder="At Cloud Intellect, training and placement are linked." /></Field></Row>
      <Row><Field label="Description (paragraph)"><textarea value={d.description ?? ''} onChange={(e) => set('description', e.target.value)} rows={4} placeholder="Main paragraph" /></Field></Row>

      <h4 className="editor-form-subsection">Feature chips (below paragraph)</h4>
      {features.map((f, i) => (
        <div key={i} className="editor-card-block" style={{ flexDirection: 'column', alignItems: 'stretch', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span>Chip {i + 1}</span>
            <button type="button" className="editor-remove-row" onClick={() => removeFeature(i)} aria-label="Remove chip">×</button>
          </div>
          <RowTwo>
            <Field label="Label"><input type="text" value={f.label ?? ''} onChange={(e) => setFeature(i, 'label', e.target.value)} placeholder="Resume Building" /></Field>
            <Field label="Icon path (optional)"><input type="text" value={f.icon ?? ''} onChange={(e) => setFeature(i, 'icon', e.target.value)} placeholder="/images/... (optional)" /></Field>
          </RowTwo>
          <Field label="Upload icon (drag & drop)">
            {dropzone(`feature:${i}`, f.icon ?? '', `Chip ${i + 1} icon: drag image or click to upload`)}
          </Field>
        </div>
      ))}
      <button type="button" className="editor-add-row" onClick={addFeature}>+ Add chip</button>

      <h4 className="editor-form-subsection">Right panel</h4>
      <Row><Field label="Panel title"><input type="text" value={d.panelTitle ?? ''} onChange={(e) => set('panelTitle', e.target.value)} placeholder="What Services Do We Provide?" /></Field></Row>
      <Row><Field label="Panel subtitle (optional)"><input type="text" value={d.panelSubtitle ?? ''} onChange={(e) => set('panelSubtitle', e.target.value)} placeholder="" /></Field></Row>

      <h4 className="editor-form-subsection">Panel items</h4>
      {serviceItems.map((x, i) => (
        <div key={i} className="editor-card-block" style={{ flexDirection: 'column', alignItems: 'stretch', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span>Item {i + 1}</span>
            <button type="button" className="editor-remove-row" onClick={() => removeService(i)} aria-label="Remove item">×</button>
          </div>
          <RowTwo>
            <Field label="Text"><input type="text" value={x.text ?? ''} onChange={(e) => setService(i, 'text', e.target.value)} placeholder="End-to-end Salesforce career enablement" /></Field>
            <Field label="Icon path (optional)"><input type="text" value={x.icon ?? ''} onChange={(e) => setService(i, 'icon', e.target.value)} placeholder="/images/... (optional)" /></Field>
          </RowTwo>
          <Field label="Upload icon (drag & drop)">
            {dropzone(`service:${i}`, x.icon ?? '', `Item ${i + 1} icon: drag image or click to upload`)}
          </Field>
        </div>
      ))}
      <button type="button" className="editor-add-row" onClick={addService}>+ Add item</button>

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

/** About Cloud Intellect: Why Salesforce + Industry Mentors (two cards). */
export function WhySalesforceMentorsForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })

  const left = d.leftCard && typeof d.leftCard === 'object' ? d.leftCard : {}
  const right = d.rightCard && typeof d.rightCard === 'object' ? d.rightCard : {}

  const setLeft = (key, value) => set('leftCard', { ...left, [key]: value })
  const setRight = (key, value) => set('rightCard', { ...right, [key]: value })

  const leftBullets = Array.isArray(left.bullets) && left.bullets.length > 0 ? left.bullets : ['']
  const rightBullets = Array.isArray(right.bullets) && right.bullets.length > 0 ? right.bullets : ['']

  const setLeftBullet = (i, value) => setLeft('bullets', leftBullets.map((x, j) => (j === i ? value : x)))
  const addLeftBullet = () => setLeft('bullets', [...leftBullets, ''])
  const removeLeftBullet = (i) => setLeft('bullets', leftBullets.filter((_, j) => j !== i))

  const setRightBullet = (i, value) => setRight('bullets', rightBullets.map((x, j) => (j === i ? value : x)))
  const addRightBullet = () => setRight('bullets', [...rightBullets, ''])
  const removeRightBullet = (i) => setRight('bullets', rightBullets.filter((_, j) => j !== i))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Section</h4>
      <Row>
        <Field label="Background color (hex)">
          <input type="text" value={d.backgroundColor ?? ''} onChange={(e) => set('backgroundColor', e.target.value)} placeholder="#fbf5ef" />
        </Field>
      </Row>

      <h4 className="editor-form-subsection">Left card</h4>
      <RowTwo>
        <Field label="Icon path (optional)"><input type="text" value={left.icon ?? ''} onChange={(e) => setLeft('icon', e.target.value)} placeholder="/images/..." /></Field>
        <Field label="Title"><input type="text" value={left.title ?? ''} onChange={(e) => setLeft('title', e.target.value)} placeholder="Why Salesforce?" /></Field>
      </RowTwo>
      <Row><Field label="Description"><textarea value={left.description ?? ''} onChange={(e) => setLeft('description', e.target.value)} rows={3} placeholder="Paragraph" /></Field></Row>
      <Field label="Bullets">
        {leftBullets.map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input type="text" value={b} onChange={(e) => setLeftBullet(i, e.target.value)} placeholder="Bullet text" style={{ flex: 1 }} />
            <button type="button" className="editor-remove-row" onClick={() => removeLeftBullet(i)} aria-label="Remove bullet">×</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addLeftBullet}>+ Add bullet</button>
      </Field>
      <Row><Field label="Note (italic)"><input type="text" value={left.note ?? ''} onChange={(e) => setLeft('note', e.target.value)} placeholder="Optional note" /></Field></Row>

      <h4 className="editor-form-subsection">Right card</h4>
      <RowTwo>
        <Field label="Icon path (optional)"><input type="text" value={right.icon ?? ''} onChange={(e) => setRight('icon', e.target.value)} placeholder="/images/..." /></Field>
        <Field label="Title"><input type="text" value={right.title ?? ''} onChange={(e) => setRight('title', e.target.value)} placeholder="Industry-Experienced Mentors" /></Field>
      </RowTwo>
      <Row><Field label="Description"><textarea value={right.description ?? ''} onChange={(e) => setRight('description', e.target.value)} rows={2} placeholder="Paragraph" /></Field></Row>
      <Field label="Bullets">
        {rightBullets.map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input type="text" value={b} onChange={(e) => setRightBullet(i, e.target.value)} placeholder="Bullet text" style={{ flex: 1 }} />
            <button type="button" className="editor-remove-row" onClick={() => removeRightBullet(i)} aria-label="Remove bullet">×</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addRightBullet}>+ Add bullet</button>
      </Field>

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

/** Leadership page: Hero section (tag, heading, description, buttons, background image). */
export function LeadershipHeroForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const setMultiple = (updates) => onChange({ ...d, ...updates })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [dropZoneActive, setDropZoneActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10MB')
      return
    }
    setUploadingImage(true)
    try {
      const response = await uploadAPI.uploadFile(file, 'images/leadership')
      const path = parseUploadPathResponse(response)
      if (path) setMultiple({ backgroundImage: path, bgImage: path })
      else throw new Error('Upload response missing path')
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingImage(false)
      setDropZoneActive(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const onDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDropZoneActive(false); const file = e.dataTransfer?.files?.[0]; if (file) handleImageUpload({ target: { files: [file] } }) }
  const onDragOver = (e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; setDropZoneActive(true) }
  const onDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDropZoneActive(false) }

  const backgroundImage = d.backgroundImage || d.bgImage || '/images/BG (7).webp'
  const imageUrl = (backgroundImage.startsWith('/') || backgroundImage.includes('images/')) ? getImageUrl(backgroundImage) : backgroundImage

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <Row><Field label="Tag"><input type="text" value={d.tag ?? ''} onChange={(e) => set('tag', e.target.value)} placeholder="LEADERSHIP MESSAGE" /></Field></Row>
      <RowTwo>
        <Field label="Heading (line 1)"><input type="text" value={d.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Leadership at" /></Field>
        <Field label="Heading (accent line 2)"><input type="text" value={d.headingAccent ?? ''} onChange={(e) => set('headingAccent', e.target.value)} placeholder="Cloud Intellect" /></Field>
      </RowTwo>
      <Row><Field label="Description"><textarea value={d.description ?? ''} onChange={(e) => set('description', e.target.value)} rows={2} placeholder="Vision-driven leadership backed by real industry experience." /></Field></Row>
      <RowTwo>
        <Field label="Primary button text"><input type="text" value={d.primaryButtonText ?? ''} onChange={(e) => set('primaryButtonText', e.target.value)} placeholder="Explore Programs" /></Field>
        <Field label="Primary button link"><input type="text" value={d.primaryButtonHref ?? ''} onChange={(e) => set('primaryButtonHref', e.target.value)} placeholder="#programs" /></Field>
      </RowTwo>
      <RowTwo>
        <Field label="Secondary button text"><input type="text" value={d.secondaryButtonText ?? ''} onChange={(e) => set('secondaryButtonText', e.target.value)} placeholder="Download Brochure" /></Field>
        <Field label="Secondary button link"><input type="text" value={d.secondaryButtonHref ?? ''} onChange={(e) => set('secondaryButtonHref', e.target.value)} placeholder="#brochure" /></Field>
      </RowTwo>
      <Field label="Background image">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input type="file" ref={fileInputRef} accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml" style={{ display: 'none' }} onChange={handleImageUpload} />
          <div className={`placement-image-dropzone ${dropZoneActive ? 'placement-image-dropzone--active' : ''} ${uploadingImage ? 'placement-image-dropzone--uploading' : ''}`} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onClick={() => !uploadingImage && fileInputRef.current?.click()} role="button" tabIndex={0} onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !uploadingImage) { e.preventDefault(); fileInputRef.current?.click(); } }} aria-label="Drag and drop or click to upload background">
            {uploadingImage ? 'Uploading…' : 'Drag & drop or click to upload'}
          </div>
          <input type="text" value={backgroundImage} onChange={(e) => setMultiple({ backgroundImage: e.target.value, bgImage: e.target.value })} placeholder="/images/BG (7).webp" style={{ width: '100%' }} />
          {backgroundImage && <img src={imageUrl} alt="" style={{ maxWidth: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 8 }} onError={(e) => { e.target.style.display = 'none' }} />}
        </div>
      </Field>
      <div className="editor-form-actions"><button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button></div>
    </form>
  )
}

export function CareerHeroForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const setMultiple = (updates) => onChange({ ...d, ...updates })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [dropZoneActive, setDropZoneActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10MB')
      return
    }
    setUploadingImage(true)
    try {
      const response = await uploadAPI.uploadFile(file, 'images/career')
      const path = parseUploadPathResponse(response)
      if (path) setMultiple({ heroImage: path })
      else throw new Error('Upload response missing path')
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingImage(false)
      setDropZoneActive(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const onDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDropZoneActive(false); const file = e.dataTransfer?.files?.[0]; if (file) handleImageUpload({ target: { files: [file] } }) }
  const onDragOver = (e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; setDropZoneActive(true) }
  const onDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDropZoneActive(false) }

  const heroImage = d.heroImage || '/images/career-hero.webp'
  const imageUrl = heroImage.startsWith('/images/') || heroImage.includes('images/') ? getImageUrl(heroImage) : heroImage

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <Row><Field label="Tag"><input type="text" value={d.tag ?? ''} onChange={(e) => set('tag', e.target.value)} placeholder="LIVE SESSIONS" /></Field></Row>
      <Row><Field label="Heading line 1"><input type="text" value={d.headingLine1 ?? ''} onChange={(e) => set('headingLine1', e.target.value)} placeholder="Elevate Your Career" /></Field></Row>
      <Row><Field label="Heading line 2"><input type="text" value={d.headingLine2 ?? ''} onChange={(e) => set('headingLine2', e.target.value)} placeholder="and Empower Others" /></Field></Row>
      <Row><Field label="Description"><textarea value={d.description ?? ''} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="Join Cloud Intellect for impactful education and accelerate your tech career in the Salesforce world." /></Field></Row>
      <RowTwo>
        <Field label="Primary button text"><input type="text" value={d.primaryButtonText ?? ''} onChange={(e) => set('primaryButtonText', e.target.value)} placeholder="View Open Positions" /></Field>
        <Field label="Primary button link"><input type="text" value={d.primaryButtonHref ?? ''} onChange={(e) => set('primaryButtonHref', e.target.value)} placeholder="#open-positions" /></Field>
      </RowTwo>
      <RowTwo>
        <Field label="Secondary button text"><input type="text" value={d.secondaryButtonText ?? ''} onChange={(e) => set('secondaryButtonText', e.target.value)} placeholder="Apply Now" /></Field>
        <Field label="Secondary button link"><input type="text" value={d.secondaryButtonHref ?? ''} onChange={(e) => set('secondaryButtonHref', e.target.value)} placeholder="#apply" /></Field>
      </RowTwo>
      <Field label="Hero image (right side)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input type="file" ref={fileInputRef} accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml" style={{ display: 'none' }} onChange={handleImageUpload} />
          <div className={`placement-image-dropzone ${dropZoneActive ? 'placement-image-dropzone--active' : ''} ${uploadingImage ? 'placement-image-dropzone--uploading' : ''}`} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onClick={() => !uploadingImage && fileInputRef.current?.click()} role="button" tabIndex={0} onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !uploadingImage) { e.preventDefault(); fileInputRef.current?.click(); } }} aria-label="Drag and drop or click to upload hero image">
            {uploadingImage ? 'Uploading…' : 'Drag & drop or click to upload'}
          </div>
          <input type="text" value={heroImage} onChange={(e) => setMultiple({ heroImage: e.target.value })} placeholder="/images/career-hero.webp" style={{ width: '100%' }} />
          {heroImage && <img src={imageUrl} alt="" style={{ maxWidth: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 12 }} onError={(e) => { e.target.style.display = 'none' }} />}
        </div>
      </Field>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

export function CareerWhyWorkForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const cards = Array.isArray(d.cards) && d.cards.length > 0
    ? d.cards
    : [
        { title: 'Career Impact', description: 'We work on real student outcomes.', icon: '' },
        { title: 'Industry Exposure', description: 'Hands-on work in the Salesforce ecosystem.', icon: '' },
        { title: 'Ownership Culture', description: 'Ideas > hierarchy. Execution > excuses.', icon: '' },
      ]
  const setCard = (i, field, value) => set('cards', cards.map((c, j) => (j === i ? { ...c, [field]: value } : c)))
  const addCard = () => set('cards', [...cards, { title: '', description: '', icon: '' }])
  const removeCard = (i) => set('cards', cards.filter((_, j) => j !== i))

  const [uploadingIconIndex, setUploadingIconIndex] = useState(null)
  const [pendingIconIndex, setPendingIconIndex] = useState(null)
  const iconFileRef = useRef(null)

  const handleIconUpload = async (index, file) => {
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File must be under 5MB')
      return
    }
    setUploadingIconIndex(index)
    try {
      const response = await uploadAPI.uploadFile(file, 'images/career-icons')
      const path = parseUploadPathResponse(response)
      if (path) setCard(index, 'icon', path)
      else throw new Error('Upload response missing path')
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingIconIndex(null)
      if (iconFileRef.current) iconFileRef.current.value = ''
    }
  }

  const onIconDrop = (e, index) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer?.files?.[0]
    if (file) handleIconUpload(index, file)
  }
  const onIconDragOver = (e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy' }
  const onIconDragLeave = (e) => { e.preventDefault(); e.stopPropagation() }

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <RowTwo>
        <Field label="Heading (before bold)">
          <input type="text" value={d.headingLine1 ?? ''} onChange={(e) => set('headingLine1', e.target.value)} placeholder="Why Work With" />
        </Field>
        <Field label="Heading (bold part)">
          <input type="text" value={d.headingStrong ?? ''} onChange={(e) => set('headingStrong', e.target.value)} placeholder="Cloud Intellect?" />
        </Field>
      </RowTwo>
      <Field label="Cards (icon, title, text)">
        <p className="admin-form-help">Icons can be filenames under /images/career-icons or full image paths. You can drag & drop or click to upload.</p>
        <input
          type="file"
          ref={iconFileRef}
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target?.files?.[0]
            const idx = pendingIconIndex
            setPendingIconIndex(null)
            if (file && typeof idx === 'number' && idx >= 0) handleIconUpload(idx, file)
          }}
        />
        {cards.map((card, i) => {
          const iconPath = card.icon ?? ''
          const previewUrl = iconPath
            ? (iconPath.startsWith('/') || iconPath.includes('images/')
              ? getImageUrl(iconPath)
              : iconPath)
            : ''
          return (
            <div key={i} className="editor-card-block" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span>Card {i + 1}</span>
                <button type="button" className="editor-remove-row" onClick={() => removeCard(i)} aria-label="Remove">×</button>
              </div>
              <Field label="Icon (drag & drop or click to upload)">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div
                    className={`placement-image-dropzone ${uploadingIconIndex === i ? 'placement-image-dropzone--uploading' : ''}`}
                    style={{ minWidth: 80, minHeight: 60 }}
                    onDragOver={onIconDragOver}
                    onDragLeave={onIconDragLeave}
                    onDrop={(e) => onIconDrop(e, i)}
                    onClick={() => { if (uploadingIconIndex !== null) return; setPendingIconIndex(i); iconFileRef.current?.click(); }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && uploadingIconIndex === null) { e.preventDefault(); setPendingIconIndex(i); iconFileRef.current?.click(); } }}
                    aria-label={`Card ${i + 1} icon: drag image or click to upload`}
                  >
                    {uploadingIconIndex === i ? 'Uploading…' : 'Drag & drop or click'}
                  </div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <input
                      type="text"
                      value={card.icon ?? ''}
                      onChange={(e) => setCard(i, 'icon', e.target.value)}
                      placeholder="Icon path or filename"
                      style={{ width: '100%' }}
                    />
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt=""
                        style={{ maxWidth: 40, maxHeight: 40, objectFit: 'contain', marginTop: 6 }}
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    )}
                  </div>
                </div>
              </Field>
              <div className="editor-card-fields">
                <input type="text" value={card.title ?? ''} onChange={(e) => setCard(i, 'title', e.target.value)} placeholder="Card title" />
                <input type="text" value={card.description ?? ''} onChange={(e) => setCard(i, 'description', e.target.value)} placeholder="Short description" />
              </div>
            </div>
          )
        })}
        <button type="button" className="editor-add-row" onClick={addCard}>+ Add card</button>
      </Field>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

export function CareerCultureForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const bullets = Array.isArray(d.bullets) && d.bullets.length > 0 ? d.bullets : ['']
  const setBullet = (i, value) => set('bullets', bullets.map((b, j) => (j === i ? value : b)))
  const addBullet = () => set('bullets', [...bullets, ''])
  const removeBullet = (i) => set('bullets', bullets.filter((_, j) => j !== i))

  const [uploadingImage, setUploadingImage] = useState(false)
  const [dropZoneActive, setDropZoneActive] = useState(false)
  const fileInputRef = useRef(null)
  const [uploadingBulletIcon, setUploadingBulletIcon] = useState(false)
  const [dropZoneBulletActive, setDropZoneBulletActive] = useState(false)
  const bulletIconFileRef = useRef(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10MB')
      return
    }
    setUploadingImage(true)
    try {
      const response = await uploadAPI.uploadFile(file, 'images/career')
      const path = parseUploadPathResponse(response)
      if (path) set('image', path)
      else throw new Error('Upload response missing path')
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingImage(false)
      setDropZoneActive(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const onDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDropZoneActive(false); const file = e.dataTransfer?.files?.[0]; if (file) handleImageUpload({ target: { files: [file] } }) }
  const onDragOver = (e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; setDropZoneActive(true) }
  const onDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDropZoneActive(false) }

  const imagePath = d.image || '/images/career-culture.webp'
  const imageUrl = imagePath.startsWith('/images/') || imagePath.includes('images/') ? getImageUrl(imagePath) : imagePath
  const bulletIconPath = d.bulletIcon || ''
  const bulletIconUrl = bulletIconPath.startsWith('/images/') || bulletIconPath.includes('images/')
    ? getImageUrl(bulletIconPath)
    : bulletIconPath

  const handleBulletIconUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Icon must be under 5MB')
      return
    }
    setUploadingBulletIcon(true)
    try {
      const response = await uploadAPI.uploadFile(file, 'images/career-icons')
      const path = parseUploadPathResponse(response)
      if (path) set('bulletIcon', path)
      else throw new Error('Upload response missing path')
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingBulletIcon(false)
      setDropZoneBulletActive(false)
      if (bulletIconFileRef.current) bulletIconFileRef.current.value = ''
    }
  }

  const onBulletIconDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropZoneBulletActive(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) handleBulletIconUpload({ target: { files: [file] } })
  }
  const onBulletIconDragOver = (e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; setDropZoneBulletActive(true) }
  const onBulletIconDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDropZoneBulletActive(false) }

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <Row><Field label="Heading"><input type="text" value={d.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="A Team That Grows Together" /></Field></Row>
      <Row><Field label="Description"><textarea value={d.description ?? ''} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="We believe that a strong culture is the foundation of great work..." /></Field></Row>
      <Row><Field label="Panel title"><input type="text" value={d.panelTitle ?? ''} onChange={(e) => set('panelTitle', e.target.value)} placeholder="Our Culture" /></Field></Row>
      <Field label="Bullet icon (for culture list)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            type="file"
            ref={bulletIconFileRef}
            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
            style={{ display: 'none' }}
            onChange={handleBulletIconUpload}
          />
          <div
            className={`placement-image-dropzone ${dropZoneBulletActive ? 'placement-image-dropzone--active' : ''} ${uploadingBulletIcon ? 'placement-image-dropzone--uploading' : ''}`}
            onDragOver={onBulletIconDragOver}
            onDragLeave={onBulletIconDragLeave}
            onDrop={onBulletIconDrop}
            onClick={() => !uploadingBulletIcon && bulletIconFileRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !uploadingBulletIcon) {
                e.preventDefault()
                bulletIconFileRef.current?.click()
              }
            }}
            aria-label="Drag and drop or click to upload bullet icon"
          >
            {uploadingBulletIcon ? 'Uploading…' : 'Drag & drop or click to upload icon'}
          </div>
          <input
            type="text"
            value={bulletIconPath}
            onChange={(e) => set('bulletIcon', e.target.value)}
            placeholder="Or enter icon path (optional)"
            style={{ width: '100%' }}
          />
          {bulletIconUrl && (
            <img
              src={bulletIconUrl}
              alt=""
              style={{ maxWidth: 32, maxHeight: 32, objectFit: 'contain', marginTop: 6 }}
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          )}
        </div>
      </Field>
      <Field label="Culture bullets">
        {bullets.map((b, i) => (
          <div key={i} className="editor-repeatable-row">
            <input type="text" value={b ?? ''} onChange={(e) => setBullet(i, e.target.value)} placeholder="Bullet text" style={{ width: '100%' }} />
            <button type="button" className="editor-remove-row" onClick={() => removeBullet(i)}>×</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addBullet}>+ Add bullet</button>
      </Field>
      <Field label="Right-side image (drag & drop or click to upload)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input type="file" ref={fileInputRef} accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml" style={{ display: 'none' }} onChange={handleImageUpload} />
          <div className={`placement-image-dropzone ${dropZoneActive ? 'placement-image-dropzone--active' : ''} ${uploadingImage ? 'placement-image-dropzone--uploading' : ''}`} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onClick={() => !uploadingImage && fileInputRef.current?.click()} role="button" tabIndex={0} onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !uploadingImage) { e.preventDefault(); fileInputRef.current?.click(); } }} aria-label="Drag and drop or click to upload culture image">
            {uploadingImage ? 'Uploading…' : 'Drag & drop or click to upload'}
          </div>
          <input type="text" value={imagePath} onChange={(e) => set('image', e.target.value)} placeholder="/images/career-culture.webp" style={{ width: '100%' }} />
          {imagePath && <img src={imageUrl} alt="" style={{ maxWidth: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 12 }} onError={(e) => { e.target.style.display = 'none' }} />}
        </div>
      </Field>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

export function CareerOpeningsForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const openings = Array.isArray(d.openings) && d.openings.length > 0
    ? d.openings
    : [
        { title: 'Salesforce Trainer', description: 'Deliver practical Salesforce training, guide students, and support certification + placement readiness.', linkText: 'Apply Now', linkHref: '#apply-salesforce-trainer', icon: '' },
        { title: 'Academic Counsellor', description: 'Help students choose the right career path and guide them through admissions and learning journeys.', linkText: 'Apply Now', linkHref: '#apply-academic-counsellor', icon: '' },
        { title: 'Digital Marketing Exec.', description: 'Plan and execute campaigns across Meta, Google, and content platforms to generate quality leads.', linkText: 'Apply Now', linkHref: '#apply-digital-marketing', icon: '' },
        { title: 'Content & Social Media Exec.', description: 'Create engaging reels, creatives, and educational content that drives awareness and trust.', linkText: 'Apply Now', linkHref: '#apply-content-social', icon: '' },
        { title: 'Placement Coordinator', description: 'Provide resume and interview guidance, career counselling, and connect graduates with our industry partners.', linkText: 'Apply Now', linkHref: '#apply-placement-coordinator', icon: '' },
        { title: "Don't see a fit?", description: 'Send us your resume anyway. We are always looking for great talent.', linkText: 'Drop Resume', linkHref: '#drop-resume', icon: '' },
      ]
  const setOpening = (i, field, value) => set('openings', openings.map((o, j) => (j === i ? { ...o, [field]: value } : o)))
  const addOpening = () => set('openings', [...openings, { title: '', description: '', linkText: '', linkHref: '', icon: '' }])
  const removeOpening = (i) => set('openings', openings.filter((_, j) => j !== i))

  const [uploadingIconIndex, setUploadingIconIndex] = useState(null)
  const [pendingIconIndex, setPendingIconIndex] = useState(null)
  const iconFileRef = useRef(null)

  const handleIconUpload = async (index, file) => {
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File must be under 5MB')
      return
    }
    setUploadingIconIndex(index)
    try {
      const response = await uploadAPI.uploadFile(file, 'images/career-icons')
      const path = parseUploadPathResponse(response)
      if (path) setOpening(index, 'icon', path)
      else throw new Error('Upload response missing path')
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingIconIndex(null)
      if (iconFileRef.current) iconFileRef.current.value = ''
    }
  }

  const onIconDrop = (e, index) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer?.files?.[0]
    if (file) handleIconUpload(index, file)
  }
  const onIconDragOver = (e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy' }
  const onIconDragLeave = (e) => { e.preventDefault(); e.stopPropagation() }

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <Row><Field label="Heading"><input type="text" value={d.heading ?? ''} onChange={(e) => set('heading', e.target.value)} placeholder="Current Openings" /></Field></Row>
      <Field label="Opening cards">
        <p className="admin-form-help">Each opening has an optional icon, title, description, and Apply link. Icons can be uploaded or set via path.</p>
        <input
          type="file"
          ref={iconFileRef}
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target?.files?.[0]
            const idx = pendingIconIndex
            setPendingIconIndex(null)
            if (file && typeof idx === 'number' && idx >= 0) handleIconUpload(idx, file)
          }}
        />
        {openings.map((job, i) => {
          const iconPath = job.icon ?? ''
          const previewUrl = iconPath
            ? (iconPath.startsWith('/') || iconPath.includes('images/')
              ? getImageUrl(iconPath)
              : iconPath)
            : ''
          return (
            <div key={i} className="editor-card-block" style={{ flexDirection: 'column', alignItems: 'stretch', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span>Opening {i + 1}</span>
                <button type="button" className="editor-remove-row" onClick={() => removeOpening(i)} aria-label="Remove">×</button>
              </div>
              <Field label="Icon (drag & drop or click to upload)">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div
                    className={`placement-image-dropzone ${uploadingIconIndex === i ? 'placement-image-dropzone--uploading' : ''}`}
                    style={{ minWidth: 80, minHeight: 60 }}
                    onDragOver={onIconDragOver}
                    onDragLeave={onIconDragLeave}
                    onDrop={(e) => onIconDrop(e, i)}
                    onClick={() => { if (uploadingIconIndex !== null) return; setPendingIconIndex(i); iconFileRef.current?.click(); }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && uploadingIconIndex === null) { e.preventDefault(); setPendingIconIndex(i); iconFileRef.current?.click(); } }}
                    aria-label={`Opening ${i + 1} icon: drag image or click to upload`}
                  >
                    {uploadingIconIndex === i ? 'Uploading…' : 'Drag & drop or click'}
                  </div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <input
                      type="text"
                      value={job.icon ?? ''}
                      onChange={(e) => setOpening(i, 'icon', e.target.value)}
                      placeholder="Icon path or filename"
                      style={{ width: '100%' }}
                    />
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt=""
                        style={{ maxWidth: 40, maxHeight: 40, objectFit: 'contain', marginTop: 6 }}
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    )}
                  </div>
                </div>
              </Field>
              <Row><Field label="Title"><input type="text" value={job.title ?? ''} onChange={(e) => setOpening(i, 'title', e.target.value)} placeholder="Salesforce Trainer" /></Field></Row>
              <Row><Field label="Description"><textarea value={job.description ?? ''} onChange={(e) => setOpening(i, 'description', e.target.value)} rows={2} placeholder="Short description of the role" /></Field></Row>
              <RowTwo>
                <Field label="Link text"><input type="text" value={job.linkText ?? ''} onChange={(e) => setOpening(i, 'linkText', e.target.value)} placeholder="Apply Now" /></Field>
                <Field label="Link URL"><input type="text" value={job.linkHref ?? ''} onChange={(e) => setOpening(i, 'linkHref', e.target.value)} placeholder="#apply-role" /></Field>
              </RowTwo>
            </div>
          )
        })}
        <button type="button" className="editor-add-row" onClick={addOpening}>+ Add opening</button>
      </Field>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

/** Custom form for Testimonials Hero Section */
export function TestimonialsHeroForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const setMultiple = (updates) => onChange({ ...d, ...updates })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [dropZoneActive, setDropZoneActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image file (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB')
      return
    }

    setUploadingImage(true)
    try {
      const folder = 'images/testimonials'
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
      setMultiple({ backgroundImage: imagePath, bgImage: imagePath })
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload image: ${error.message || 'Unknown error'}`)
    } finally {
      setUploadingImage(false)
      setDropZoneActive(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleImageDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropZoneActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const fakeEvent = { target: { files: [file] } }
      handleImageUpload(fakeEvent)
    }
  }

  const handleImageDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
    setDropZoneActive(true)
  }

  const handleImageDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropZoneActive(false)
  }

  const backgroundImage = d.backgroundImage || d.bgImage || '/images/BG (2).webp'
  const imageUrl = backgroundImage.startsWith('/images/') || backgroundImage.includes('images/')
    ? getImageUrl(backgroundImage)
    : backgroundImage

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <Row>
        <Field label="Tag/Label (e.g. 'SPECIALIZATION PROGRAM')">
          <input
            type="text"
            value={d.tag || d.label || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ tag: value, label: value })
            }}
            placeholder="SPECIALIZATION PROGRAM"
          />
        </Field>
      </Row>
      <Row>
        <Field label="Heading">
          <input
            type="text"
            value={d.heading || d.title || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ heading: value, title: value })
            }}
            placeholder="Real Stories. Real Careers."
          />
        </Field>
      </Row>
      <Row>
        <Field label="Description">
          <textarea
            value={d.description || d.subtitle || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ description: value, subtitle: value })
            }}
            rows={3}
            placeholder="These are real students from Cloud Intellect who started from different backgrounds and built their careers in Salesforce."
          />
        </Field>
      </Row>
      <Row>
        <Field label="Background Image">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <div
              className={`placement-image-dropzone ${dropZoneActive ? 'placement-image-dropzone--active' : ''} ${uploadingImage ? 'placement-image-dropzone--uploading' : ''}`}
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
              aria-label="Drag and drop background image or click to browse"
            >
              <span className="placement-image-dropzone-text">
                {uploadingImage ? 'Uploading...' : 'Drag and drop background image here, or click to browse'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                disabled={uploadingImage}
                className="btn-secondary"
                style={{ whiteSpace: 'nowrap' }}
              >
                {uploadingImage ? 'Uploading...' : 'Upload Image'}
              </button>
              <input
                type="text"
                value={backgroundImage}
                onChange={(e) => {
                  const value = e.target.value
                  setMultiple({ backgroundImage: value, bgImage: value })
                }}
                placeholder="/images/BG (2).webp"
                style={{ flex: 1 }}
              />
            </div>
            {backgroundImage && (
              <div style={{ marginTop: '8px' }}>
                <img
                  src={`${imageUrl}?t=${Date.now()}`}
                  alt="Background preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    display: 'block'
                  }}
                  onError={(e) => {
                    console.error('Failed to load image preview:', backgroundImage)
                    e.target.style.display = 'none'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Current: {backgroundImage}
                </p>
              </div>
            )}
            <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Default: /images/BG (2).webp • Supported formats: PNG, JPG, GIF, WEBP, SVG (max 10MB)
            </p>
          </div>
        </Field>
      </Row>
      <RowTwo>
        <Field label="Primary Button Text">
          <input
            type="text"
            value={d.primaryButtonText || d.primaryBtnText || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ primaryButtonText: value, primaryBtnText: value })
            }}
            placeholder="Explore Programs"
          />
        </Field>
        <Field label="Primary Button Link">
          <input
            type="text"
            value={d.primaryButtonHref || d.primaryBtnHref || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ primaryButtonHref: value, primaryBtnHref: value })
            }}
            placeholder="#programs or /programs"
          />
        </Field>
      </RowTwo>
      <RowTwo>
        <Field label="Secondary Button Text">
          <input
            type="text"
            value={d.secondaryButtonText || d.secondaryBtnText || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ secondaryButtonText: value, secondaryBtnText: value })
            }}
            placeholder="View Placements"
          />
        </Field>
        <Field label="Secondary Button Link">
          <input
            type="text"
            value={d.secondaryButtonHref || d.secondaryBtnHref || ''}
            onChange={(e) => {
              const value = e.target.value
              setMultiple({ secondaryButtonHref: value, secondaryBtnHref: value })
            }}
            placeholder="#placements or /placements"
          />
        </Field>
      </RowTwo>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

/** Simple form for sections that don't have a custom form: title + description. */
/** Custom form for Contact Information Section */
export function ContactInfoForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const setMultiple = (updates) => onChange({ ...d, ...updates })
  
  const [uploadingPhoneIcon, setUploadingPhoneIcon] = useState(false)
  const [uploadingEmailIcon, setUploadingEmailIcon] = useState(false)
  const [phoneIconDropZoneActive, setPhoneIconDropZoneActive] = useState(false)
  const [emailIconDropZoneActive, setEmailIconDropZoneActive] = useState(false)
  const phoneIconInputRef = useRef(null)
  const emailIconInputRef = useRef(null)
  
  const phoneNumbers = Array.isArray(d.phoneNumbers) ? d.phoneNumbers : [
    { number: '+91 876-699-6944', label: 'Call Us' },
    { number: '+91 876-699-6945', label: 'Call Us' }
  ]
  const programs = Array.isArray(d.programs) ? d.programs : ['SFDC', 'SFMC']

  const handlePhoneIconUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image file (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('File size must be less than 5MB')
      return
    }

    setUploadingPhoneIcon(true)
    try {
      const folder = 'images/contact'
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
      set('phoneIcon', imagePath)
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload icon: ${error.message || 'Unknown error'}`)
    } finally {
      setUploadingPhoneIcon(false)
      setPhoneIconDropZoneActive(false)
      if (phoneIconInputRef.current) phoneIconInputRef.current.value = ''
    }
  }

  const handleEmailIconUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image file (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('File size must be less than 5MB')
      return
    }

    setUploadingEmailIcon(true)
    try {
      const folder = 'images/contact'
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
      set('emailIcon', imagePath)
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload icon: ${error.message || 'Unknown error'}`)
    } finally {
      setUploadingEmailIcon(false)
      setEmailIconDropZoneActive(false)
      if (emailIconInputRef.current) emailIconInputRef.current.value = ''
    }
  }

  const handlePhoneIconDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setPhoneIconDropZoneActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const fakeEvent = { target: { files: [file] } }
      handlePhoneIconUpload(fakeEvent)
    }
  }

  const handleEmailIconDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setEmailIconDropZoneActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const fakeEvent = { target: { files: [file] } }
      handleEmailIconUpload(fakeEvent)
    }
  }

  const handlePhoneIconDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
    setPhoneIconDropZoneActive(true)
  }

  const handleEmailIconDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
    setEmailIconDropZoneActive(true)
  }

  const handlePhoneIconDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setPhoneIconDropZoneActive(false)
  }

  const handleEmailIconDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setEmailIconDropZoneActive(false)
  }

  const phoneIcon = d.phoneIcon || ''
  const emailIcon = d.emailIcon || ''
  const phoneIconUrl = phoneIcon ? getImageUrl(phoneIcon) : ''
  const emailIconUrl = emailIcon ? getImageUrl(emailIcon) : ''

  const updatePhoneNumber = (index, field, value) => {
    const updated = [...phoneNumbers]
    updated[index] = { ...updated[index], [field]: value }
    set('phoneNumbers', updated)
  }

  const addPhoneNumber = () => {
    set('phoneNumbers', [...phoneNumbers, { number: '', label: 'Call Us' }])
  }

  const removePhoneNumber = (index) => {
    set('phoneNumbers', phoneNumbers.filter((_, i) => i !== index))
  }

  const updateProgram = (index, value) => {
    const updated = [...programs]
    updated[index] = value
    set('programs', updated)
  }

  const addProgram = () => {
    set('programs', [...programs, ''])
  }

  const removeProgram = (index) => {
    set('programs', programs.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <Row>
        <Field label="Email Address">
          <input
            type="email"
            value={d.email || ''}
            onChange={(e) => set('email', e.target.value)}
            placeholder="info@cloudintellect.in"
          />
        </Field>
      </Row>

      <Row>
        <Field label="Phone Icon">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="file"
              ref={phoneIconInputRef}
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
              style={{ display: 'none' }}
              onChange={handlePhoneIconUpload}
            />
            <div
              className={`placement-image-dropzone ${phoneIconDropZoneActive ? 'placement-image-dropzone--active' : ''} ${uploadingPhoneIcon ? 'placement-image-dropzone--uploading' : ''}`}
              onDragOver={handlePhoneIconDragOver}
              onDragLeave={handlePhoneIconDragLeave}
              onDrop={handlePhoneIconDrop}
              onClick={() => !uploadingPhoneIcon && phoneIconInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !uploadingPhoneIcon) {
                  e.preventDefault()
                  phoneIconInputRef.current?.click()
                }
              }}
              aria-label="Drag and drop phone icon or click to browse"
            >
              <span className="placement-image-dropzone-text">
                {uploadingPhoneIcon ? 'Uploading...' : 'Drag and drop phone icon here, or click to browse'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); phoneIconInputRef.current?.click() }}
                disabled={uploadingPhoneIcon}
                className="btn-secondary"
                style={{ whiteSpace: 'nowrap' }}
              >
                {uploadingPhoneIcon ? 'Uploading...' : 'Upload Icon'}
              </button>
              <input
                type="text"
                value={phoneIcon}
                onChange={(e) => set('phoneIcon', e.target.value)}
                placeholder="/images/contact/phone-icon.svg"
                style={{ flex: 1 }}
              />
            </div>
            {phoneIconUrl && (
              <div style={{ marginTop: '8px' }}>
                <img
                  src={`${phoneIconUrl}?t=${Date.now()}`}
                  alt="Phone icon preview"
                  style={{
                    maxWidth: '48px',
                    maxHeight: '48px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    display: 'block',
                    backgroundColor: '#10B981',
                    padding: '8px'
                  }}
                  onError={(e) => {
                    console.error('Failed to load icon preview:', phoneIcon)
                    e.target.style.display = 'none'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Current: {phoneIcon}
                </p>
              </div>
            )}
          </div>
        </Field>
      </Row>

      <Row>
        <Field label="Email Icon">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="file"
              ref={emailIconInputRef}
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
              style={{ display: 'none' }}
              onChange={handleEmailIconUpload}
            />
            <div
              className={`placement-image-dropzone ${emailIconDropZoneActive ? 'placement-image-dropzone--active' : ''} ${uploadingEmailIcon ? 'placement-image-dropzone--uploading' : ''}`}
              onDragOver={handleEmailIconDragOver}
              onDragLeave={handleEmailIconDragLeave}
              onDrop={handleEmailIconDrop}
              onClick={() => !uploadingEmailIcon && emailIconInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !uploadingEmailIcon) {
                  e.preventDefault()
                  emailIconInputRef.current?.click()
                }
              }}
              aria-label="Drag and drop email icon or click to browse"
            >
              <span className="placement-image-dropzone-text">
                {uploadingEmailIcon ? 'Uploading...' : 'Drag and drop email icon here, or click to browse'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); emailIconInputRef.current?.click() }}
                disabled={uploadingEmailIcon}
                className="btn-secondary"
                style={{ whiteSpace: 'nowrap' }}
              >
                {uploadingEmailIcon ? 'Uploading...' : 'Upload Icon'}
              </button>
              <input
                type="text"
                value={emailIcon}
                onChange={(e) => set('emailIcon', e.target.value)}
                placeholder="/images/contact/email-icon.svg"
                style={{ flex: 1 }}
              />
            </div>
            {emailIconUrl && (
              <div style={{ marginTop: '8px' }}>
                <img
                  src={`${emailIconUrl}?t=${Date.now()}`}
                  alt="Email icon preview"
                  style={{
                    maxWidth: '48px',
                    maxHeight: '48px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    display: 'block',
                    backgroundColor: '#10B981',
                    padding: '8px'
                  }}
                  onError={(e) => {
                    console.error('Failed to load icon preview:', emailIcon)
                    e.target.style.display = 'none'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Current: {emailIcon}
                </p>
              </div>
            )}
          </div>
        </Field>
      </Row>
      
      <Row>
        <Field label="Phone Numbers">
          {phoneNumbers.map((phone, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-start' }}>
              <input
                type="text"
                value={phone.number}
                onChange={(e) => updatePhoneNumber(index, 'number', e.target.value)}
                placeholder="+91 876-699-6944"
                style={{ flex: 1 }}
              />
              <input
                type="text"
                value={phone.label}
                onChange={(e) => updatePhoneNumber(index, 'label', e.target.value)}
                placeholder="Call Us"
                style={{ width: '120px' }}
              />
              {phoneNumbers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePhoneNumber(index)}
                  className="editor-remove-row"
                  style={{ marginTop: 0 }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addPhoneNumber} className="btn-secondary" style={{ marginTop: '8px' }}>
            + Add Phone Number
          </button>
        </Field>
      </Row>

      <Row>
        <Field label="Programs (for dropdown)">
          {programs.map((program, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                value={program}
                onChange={(e) => updateProgram(index, e.target.value)}
                placeholder="Salesforce Developer"
                style={{ flex: 1 }}
              />
              {programs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProgram(index)}
                  className="editor-remove-row"
                  style={{ marginTop: 0 }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addProgram} className="btn-secondary" style={{ marginTop: '8px' }}>
            + Add Program
          </button>
        </Field>
      </Row>

      <Row>
        <Field label="Google Maps Embed URL">
          <input
            type="text"
            value={d.mapEmbedUrl || ''}
            onChange={(e) => set('mapEmbedUrl', e.target.value)}
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Get embed URL from Google Maps: Share → Embed a map → Copy HTML → Extract src URL
          </p>
        </Field>
      </Row>

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

/** Custom form for Locations Section */
export function LocationsForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const setMultiple = (updates) => onChange({ ...d, ...updates })
  const DEFAULT_LOCATION_ICON = '/images/Icon Container (3).svg'
  const locations = Array.isArray(d.locations) && d.locations.length > 0 ? d.locations : [
    { city: 'Pune', address: '3rd floor block 306, Baner Biz Bay, Laxman Nagar, Baner, Pune, Maharashtra 411045', mapUrl: '', icon: DEFAULT_LOCATION_ICON },
    { city: 'Nagpur', address: 'Cloud Intellect, Plot no. 5, Sanjay Heights, Beltarodi Rd, near ICICI Bank, Besa, Nagpur, Maharashtra 440037', mapUrl: '', icon: DEFAULT_LOCATION_ICON }
  ]

  const [uploadingIcons, setUploadingIcons] = useState({})
  const [dropZoneActive, setDropZoneActive] = useState({})
  const iconInputRefs = useRef({})

  const handleLocationIconUpload = async (index, e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image file (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('File size must be less than 5MB')
      return
    }

    setUploadingIcons(prev => ({ ...prev, [index]: true }))
    try {
      const folder = 'images/contact'
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
      updateLocation(index, 'icon', imagePath)
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload icon: ${error.message || 'Unknown error'}`)
    } finally {
      setUploadingIcons(prev => ({ ...prev, [index]: false }))
      setDropZoneActive(prev => ({ ...prev, [index]: false }))
      if (iconInputRefs.current[index]) iconInputRefs.current[index].value = ''
    }
  }

  const handleLocationIconDrop = (index, e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropZoneActive(prev => ({ ...prev, [index]: false }))
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const fakeEvent = { target: { files: [file] } }
      handleLocationIconUpload(index, fakeEvent)
    }
  }

  const handleLocationIconDragOver = (index, e) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
    setDropZoneActive(prev => ({ ...prev, [index]: true }))
  }

  const handleLocationIconDragLeave = (index, e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropZoneActive(prev => ({ ...prev, [index]: false }))
  }

  const updateLocation = (index, field, value) => {
    const updated = [...locations]
    updated[index] = { ...updated[index], [field]: value }
    setMultiple({ locations: updated })
  }

  const addLocation = () => {
    setMultiple({ locations: [...locations, { city: '', address: '', mapUrl: '', icon: DEFAULT_LOCATION_ICON }] })
  }

  const removeLocation = (index) => {
    setMultiple({ locations: locations.filter((_, i) => i !== index) })
  }

  return (
    <form onSubmit={onSubmit} className="editor-form">
      {locations.map((location, index) => (
        <div key={index} style={{ marginBottom: '24px', padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ margin: 0 }}>Location {index + 1}</h4>
            {locations.length > 1 && (
              <button
                type="button"
                onClick={() => removeLocation(index)}
                className="editor-remove-row"
              >
                ×
              </button>
            )}
          </div>
          <Row>
            <Field label="City">
              <input
                type="text"
                value={location.city}
                onChange={(e) => updateLocation(index, 'city', e.target.value)}
                placeholder="Pune"
              />
            </Field>
          </Row>
          <Row>
            <Field label="Address">
              <textarea
                value={location.address}
                onChange={(e) => updateLocation(index, 'address', e.target.value)}
                rows={3}
                placeholder="Full address"
              />
            </Field>
          </Row>
          <Row>
            <Field label="Location Icon">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="file"
                  ref={el => iconInputRefs.current[index] = el}
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
                  style={{ display: 'none' }}
                  onChange={(e) => handleLocationIconUpload(index, e)}
                />
                <div
                  className={`placement-image-dropzone ${dropZoneActive[index] ? 'placement-image-dropzone--active' : ''} ${uploadingIcons[index] ? 'placement-image-dropzone--uploading' : ''}`}
                  onDragOver={(e) => handleLocationIconDragOver(index, e)}
                  onDragLeave={(e) => handleLocationIconDragLeave(index, e)}
                  onDrop={(e) => handleLocationIconDrop(index, e)}
                  onClick={() => !uploadingIcons[index] && iconInputRefs.current[index]?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !uploadingIcons[index]) {
                      e.preventDefault()
                      iconInputRefs.current[index]?.click()
                    }
                  }}
                  aria-label="Drag and drop location icon or click to browse"
                >
                  <span className="placement-image-dropzone-text">
                    {uploadingIcons[index] ? 'Uploading...' : 'Drag and drop location icon here, or click to browse'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); iconInputRefs.current[index]?.click() }}
                    disabled={uploadingIcons[index]}
                    className="btn-secondary"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {uploadingIcons[index] ? 'Uploading...' : 'Upload Icon'}
                  </button>
                  <input
                    type="text"
                    value={location.icon || ''}
                    onChange={(e) => updateLocation(index, 'icon', e.target.value)}
                    placeholder="/images/Icon Container (3).svg"
                    style={{ flex: 1 }}
                  />
                </div>
                {location.icon && (
                  <div style={{ marginTop: '8px' }}>
                    <img
                      src={`${getImageUrl(location.icon)}?t=${Date.now()}`}
                      alt="Location icon preview"
                      style={{
                        maxWidth: '48px',
                        maxHeight: '48px',
                        objectFit: 'contain',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        display: 'block',
                        backgroundColor: '#E0F2FE',
                        padding: '8px'
                      }}
                      onError={(e) => {
                        console.error('Failed to load icon preview:', location.icon)
                        e.target.style.display = 'none'
                      }}
                    />
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      Current: {location.icon}
                    </p>
                  </div>
                )}
              </div>
            </Field>
          </Row>
          <Row>
            <Field label="Google Maps URL (optional)">
              <input
                type="url"
                value={location.mapUrl || ''}
                onChange={(e) => updateLocation(index, 'mapUrl', e.target.value)}
                placeholder="https://maps.google.com/..."
              />
            </Field>
          </Row>
        </div>
      ))}
      <button type="button" onClick={addLocation} className="btn-secondary">
        + Add Location
      </button>
      <div className="editor-form-actions" style={{ marginTop: '24px' }}>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

const DEFAULT_SELECT_YOUR_PATH_PATHS = () => [
  {
    id: 'sfdc',
    icon: '/images/Icon Container.svg',
    bannerBg: '#1A202C',
    title: 'Salesforce Developer Cloud (SFDC)',
    bullets: [
      'Focuses on CRM configuration, automation, and development.',
      'Used mainly for Sales and Service operations.',
      'Ideal for those interested in logic, coding, and system architecture.',
    ],
    batchStart: '17th January',
    nextBatch: '31st January',
    linkText: 'Learn Salesforce Development',
    linkHref: '/salesforce-developer',
  },
  {
    id: 'sfmc',
    icon: '/images/Icon Container copy.svg',
    bannerBg: '#007BFF',
    title: 'Salesforce Marketing Cloud (SFMC)',
    bullets: [
      'Focuses on marketing automation, customer journeys, and campaigns.',
      'Used mainly for digital marketing and customer engagement.',
      'Ideal for marketers and tech-savvy creative professionals.',
    ],
    batchStart: '18th January',
    nextBatch: '1st February',
    linkText: 'Explore Marketing Cloud Career',
    linkHref: '/salesforce-marketing-cloud',
  },
]

/** SFMC-SFDC page: Select Your Path – heading + path cards (id, icon, bannerBg, title, bullets, batch dates, link). */
export function SelectYourPathForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const paths = Array.isArray(d.paths) && d.paths.length > 0 ? d.paths : DEFAULT_SELECT_YOUR_PATH_PATHS()
  const setPath = (i, field, value) => set('paths', paths.map((p, j) => (j === i ? { ...(p || {}), [field]: value } : p)))
  const addPath = () => set('paths', [...paths, { id: `path-${paths.length + 1}`, icon: '', bannerBg: '#1A202C', title: '', bullets: [], batchStart: '', nextBatch: '', linkText: '', linkHref: '' }])
  const removePath = (i) => set('paths', paths.filter((_, j) => j !== i))
  const setPathBullet = (pathIndex, bulletIndex, value) => {
    const p = paths[pathIndex] || {}
    const bullets = Array.isArray(p.bullets) ? [...p.bullets] : []
    bullets[bulletIndex] = value
    setPath(pathIndex, 'bullets', bullets)
  }
  const addPathBullet = (pathIndex) => {
    const p = paths[pathIndex] || {}
    const bullets = Array.isArray(p.bullets) ? [...p.bullets] : []
    setPath(pathIndex, 'bullets', [...bullets, ''])
  }
  const removePathBullet = (pathIndex, bulletIndex) => {
    const p = paths[pathIndex] || {}
    const bullets = Array.isArray(p.bullets) ? (p.bullets.filter((_, j) => j !== bulletIndex)) : []
    setPath(pathIndex, 'bullets', bullets)
  }

  return (
    <form onSubmit={onSubmit} className="editor-form select-path-form">
      <div className="select-path-form__section">
        <h4 className="editor-form-subsection">Section heading</h4>
        <RowTwo>
          <Field label="Heading (before bold)"><input type="text" value={d.headingLine1 ?? ''} onChange={(e) => set('headingLine1', e.target.value)} placeholder="Select" /></Field>
          <Field label="Heading (bold part)"><input type="text" value={d.headingStrong ?? ''} onChange={(e) => set('headingStrong', e.target.value)} placeholder="Your Path" /></Field>
        </RowTwo>
      </div>

      <div className="select-path-form__section">
        <h4 className="editor-form-subsection">Path cards</h4>
        <p className="admin-form-help">Each card appears as a choice on the page. Set identity, appearance, content, batch dates, and the call-to-action link.</p>
      </div>

      {paths.map((path, i) => (
        <div key={path.id || i} className="select-path-card">
          <div className="select-path-card__header">
            <span className="select-path-card__title">Path {i + 1}{path.title ? ` · ${path.title}` : ''}</span>
            <button type="button" className="select-path-card__remove" onClick={() => removePath(i)} aria-label="Remove path">Remove path</button>
          </div>

          <div className="select-path-card__body">
            <div className="select-path-card__group">
              <span className="select-path-card__group-label">Card identity</span>
              <RowTwo>
                <Field label="ID (e.g. sfdc, sfmc)"><input type="text" value={path.id ?? ''} onChange={(e) => setPath(i, 'id', e.target.value)} placeholder="sfdc" /></Field>
                <Field label="Card title"><input type="text" value={path.title ?? ''} onChange={(e) => setPath(i, 'title', e.target.value)} placeholder="Salesforce Developer Cloud (SFDC)" /></Field>
              </RowTwo>
            </div>

            <div className="select-path-card__group">
              <span className="select-path-card__group-label">Appearance</span>
              <RowTwo>
                <Field label="Icon image URL"><input type="text" value={path.icon ?? ''} onChange={(e) => setPath(i, 'icon', e.target.value)} placeholder="/images/Icon Container.svg" /></Field>
                <Field label="Banner background color"><input type="text" value={path.bannerBg ?? ''} onChange={(e) => setPath(i, 'bannerBg', e.target.value)} placeholder="#1A202C" /></Field>
              </RowTwo>
            </div>

            <div className="select-path-card__group">
              <span className="select-path-card__group-label">Bullet points</span>
              <div className="select-path-bullets">
                {(Array.isArray(path.bullets) ? path.bullets : []).map((bullet, bi) => (
                  <div key={bi} className="select-path-bullet-row">
                    <input type="text" value={bullet} onChange={(e) => setPathBullet(i, bi, e.target.value)} placeholder="Bullet point" className="select-path-bullet-input" />
                    <button type="button" className="select-path-bullet-remove" onClick={() => removePathBullet(i, bi)} aria-label="Remove bullet">×</button>
                  </div>
                ))}
                <button type="button" className="editor-add-row" onClick={() => addPathBullet(i)}>+ Add bullet</button>
              </div>
            </div>

            <div className="select-path-card__group">
              <span className="select-path-card__group-label">Batch dates</span>
              <RowTwo>
                <Field label="Batch start"><input type="text" value={path.batchStart ?? ''} onChange={(e) => setPath(i, 'batchStart', e.target.value)} placeholder="17th January" /></Field>
                <Field label="Next batch"><input type="text" value={path.nextBatch ?? ''} onChange={(e) => setPath(i, 'nextBatch', e.target.value)} placeholder="31st January" /></Field>
              </RowTwo>
            </div>

            <div className="select-path-card__group">
              <span className="select-path-card__group-label">Call-to-action link</span>
              <RowTwo>
                <Field label="Button text"><input type="text" value={path.linkText ?? ''} onChange={(e) => setPath(i, 'linkText', e.target.value)} placeholder="Learn Salesforce Development" /></Field>
                <Field label="Link URL"><input type="text" value={path.linkHref ?? ''} onChange={(e) => setPath(i, 'linkHref', e.target.value)} placeholder="/salesforce-developer" /></Field>
              </RowTwo>
            </div>
          </div>
        </div>
      ))}

      <button type="button" className="editor-add-row select-path-form__add" onClick={addPath}>+ Add path card</button>

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

const ICON_BASE_WHO_APPLY = '/images/SFMC_SFDC_Apply'
const DEFAULT_WHO_CAN_APPLY_CARDS = () => [
  { title: 'Engineering & Freshers', icon: 'dashboard_2_gear.svg', bullets: ['BE / BTech / Diploma students', 'Final-year (BCA, MCA, BSC IT-CS)'] },
  { title: 'Non-Tech Graduates', icon: 'psychology.svg', bullets: ['BBA, B.Com, BA, BSc backgrounds', 'Interested in Marketing Automation & CRM'] },
  { title: 'Working Professionals', icon: 'person.svg', bullets: ['Looking to upskill/switch', '0-10+ years experience'] },
  { title: 'Career Switchers', icon: 'business_center.svg', bullets: ['Transitioning from non-IT to IT', 'Strong learning intent required'] },
]
const DEFAULT_SFMC_NOTES = () => [
  'Freshers are NOT allowed in the SFMC Track.',
  'Minimum 3 Years Experience required in any field.',
  'Pass-out year should be 2023 or earlier.',
]

/** SFMC-SFDC page: Who Can Apply? – heading + eligibility cards + Notes for SFMC/SFDC. */
export function WhoCanApplyForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const cards = Array.isArray(d.cards) && d.cards.length > 0 ? d.cards : DEFAULT_WHO_CAN_APPLY_CARDS()
  const setCard = (i, field, value) => set('cards', cards.map((c, j) => (j === i ? { ...(c || {}), [field]: value } : c)))
  const addCard = () => set('cards', [...cards, { title: '', icon: '', bullets: [] }])
  const removeCard = (i) => set('cards', cards.filter((_, j) => j !== i))
  const setCardBullet = (cardIndex, bulletIndex, value) => {
    const c = cards[cardIndex] || {}
    const bullets = Array.isArray(c.bullets) ? [...c.bullets] : []
    bullets[bulletIndex] = value
    setCard(cardIndex, 'bullets', bullets)
  }
  const addCardBullet = (cardIndex) => {
    const c = cards[cardIndex] || {}
    const bullets = Array.isArray(c.bullets) ? [...c.bullets] : []
    setCard(cardIndex, 'bullets', [...bullets, ''])
  }
  const removeCardBullet = (cardIndex, bulletIndex) => {
    const c = cards[cardIndex] || {}
    const bullets = Array.isArray(c.bullets) ? c.bullets.filter((_, j) => j !== bulletIndex) : []
    setCard(cardIndex, 'bullets', bullets)
  }

  const notesSfmc = d.notesSfmc && typeof d.notesSfmc === 'object' ? d.notesSfmc : { title: 'Notes For SFMC', icon: `${ICON_BASE_WHO_APPLY}/offline_bolt.svg`, items: DEFAULT_SFMC_NOTES() }
  const notesSfdc = d.notesSfdc && typeof d.notesSfdc === 'object' ? d.notesSfdc : { title: 'Notes For SFDC', icon: `${ICON_BASE_WHO_APPLY}/offline_bolt.svg`, items: [] }
  const setNotesSfmc = (field, value) => set('notesSfmc', { ...notesSfmc, [field]: value })
  const setNotesSfdc = (field, value) => set('notesSfdc', { ...notesSfdc, [field]: value })
  const setNotesSfmcItem = (i, value) => setNotesSfmc('items', (notesSfmc.items || []).map((item, j) => (j === i ? value : item)))
  const addNotesSfmcItem = () => setNotesSfmc('items', [...(notesSfmc.items || []), ''])
  const removeNotesSfmcItem = (i) => setNotesSfmc('items', (notesSfmc.items || []).filter((_, j) => j !== i))
  const setNotesSfdcItem = (i, value) => setNotesSfdc('items', (notesSfdc.items || []).map((item, j) => (j === i ? value : item)))
  const addNotesSfdcItem = () => setNotesSfdc('items', [...(notesSfdc.items || []), ''])
  const removeNotesSfdcItem = (i) => setNotesSfdc('items', (notesSfdc.items || []).filter((_, j) => j !== i))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Section heading</h4>
      <RowTwo>
        <Field label="Heading (before bold)"><input type="text" value={d.headingLine1 ?? ''} onChange={(e) => set('headingLine1', e.target.value)} placeholder="Who" /></Field>
        <Field label="Heading (bold part)"><input type="text" value={d.headingStrong ?? ''} onChange={(e) => set('headingStrong', e.target.value)} placeholder="Can Apply?" /></Field>
      </RowTwo>

      <h4 className="editor-form-subsection">Eligibility cards</h4>
      <p className="admin-form-help">Each card has a title, icon filename (e.g. dashboard_2_gear.svg), and bullet points.</p>
      {cards.map((card, i) => (
        <div key={i} className="editor-card-block" style={{ flexDirection: 'column', alignItems: 'stretch', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="editor-form-subsection">Card {i + 1}</span>
            <button type="button" className="editor-remove-row" onClick={() => removeCard(i)} aria-label="Remove card">×</button>
          </div>
          <Row><Field label="Title"><input type="text" value={card.title ?? ''} onChange={(e) => setCard(i, 'title', e.target.value)} placeholder="Engineering & Freshers" /></Field></Row>
          <Row><Field label="Icon (filename under /images/SFMC_SFDC_Apply/)"><input type="text" value={card.icon ?? ''} onChange={(e) => setCard(i, 'icon', e.target.value)} placeholder="dashboard_2_gear.svg" /></Field></Row>
          <Field label="Bullets">
            {(Array.isArray(card.bullets) ? card.bullets : []).map((bullet, bi) => (
              <div key={bi} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <input type="text" value={bullet} onChange={(e) => setCardBullet(i, bi, e.target.value)} placeholder="Bullet point" style={{ flex: 1 }} />
                <button type="button" className="editor-remove-row" onClick={() => removeCardBullet(i, bi)} aria-label="Remove bullet">×</button>
              </div>
            ))}
            <button type="button" className="editor-add-row" onClick={() => addCardBullet(i)}>+ Add bullet</button>
          </Field>
        </div>
      ))}
      <button type="button" className="editor-add-row" onClick={addCard}>+ Add card</button>

      <h4 className="editor-form-subsection">Notes For SFMC</h4>
      <Row><Field label="Block title"><input type="text" value={notesSfmc.title ?? ''} onChange={(e) => setNotesSfmc('title', e.target.value)} placeholder="Notes For SFMC" /></Field></Row>
      <Row><Field label="Icon URL (optional)"><input type="text" value={notesSfmc.icon ?? ''} onChange={(e) => setNotesSfmc('icon', e.target.value)} placeholder="/images/SFMC_SFDC_Apply/offline_bolt.svg" /></Field></Row>
      <Field label="Note items">
        {(Array.isArray(notesSfmc.items) ? notesSfmc.items : []).map((note, ni) => (
          <div key={ni} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input type="text" value={note} onChange={(e) => setNotesSfmcItem(ni, e.target.value)} placeholder="e.g. Freshers are NOT allowed..." style={{ flex: 1 }} />
            <button type="button" className="editor-remove-row" onClick={() => removeNotesSfmcItem(ni)} aria-label="Remove">×</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addNotesSfmcItem}>+ Add note</button>
      </Field>

      <h4 className="editor-form-subsection">Notes For SFDC</h4>
      <Row><Field label="Block title"><input type="text" value={notesSfdc.title ?? ''} onChange={(e) => setNotesSfdc('title', e.target.value)} placeholder="Notes For SFDC" /></Field></Row>
      <Row><Field label="Icon URL (optional)"><input type="text" value={notesSfdc.icon ?? ''} onChange={(e) => setNotesSfdc('icon', e.target.value)} placeholder="/images/SFMC_SFDC_Apply/offline_bolt.svg" /></Field></Row>
      <Field label="Note items (optional)">
        {(Array.isArray(notesSfdc.items) ? notesSfdc.items : []).map((note, ni) => (
          <div key={ni} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input type="text" value={note} onChange={(e) => setNotesSfdcItem(ni, e.target.value)} placeholder="Note text" style={{ flex: 1 }} />
            <button type="button" className="editor-remove-row" onClick={() => removeNotesSfdcItem(ni)} aria-label="Remove">×</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addNotesSfdcItem}>+ Add note</button>
      </Field>

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

const ICON_BASE_KEY_ADVANTAGES = '/images/Key_Advantages'
const DEFAULT_KEY_ADVANTAGES_ITEMS = () => [
  { title: 'Practical-First Training', description: 'Every concept is taught with real implementation on Salesforce org. Students learn by doing — not by memorizing.', icon: 'productivity.svg' },
  { title: 'Real Industry-Level Exposure', description: 'Training includes live business scenarios and project simulations that build strong hands-on confidence.', icon: 'home_work.svg' },
  { title: 'Structured Assignments', description: 'Each topic is followed by practical exercises, quizzes, and real use-case based tasks to track progress.', icon: 'order_approve.svg' },
  { title: 'Lifetime LMS Recording Access', description: 'All lectures, materials, and case studies remain available anytime for revision and continuous learning.', icon: 'exit_to_app.svg' },
  { title: 'Industry-Relevant Curriculum', description: 'Course modules are updated regularly to match current Salesforce market demand and platform changes.', icon: 'library_books.svg' },
  { title: 'Certified & Experienced Trainers', description: 'Sessions are handled by working Salesforce professionals with real project backgrounds.', icon: 'diversity_2.svg' },
  { title: 'Corporate & Alumni Network', description: 'Learners benefit from referrals, guidance, and opportunities shared by our partner companies and alumni.', icon: 'book.svg' },
  { title: 'Interview & Career Grooming', description: 'Focus on professional behaviour, IT work culture, confidence building, and job readiness.', icon: 'record_voice_over.svg' },
]

/** SFMC-SFDC page: Key Advantages of Learning at Cloud Intellect – heading + advantage cards (title, description, icon). */
export function KeyAdvantagesForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const items = Array.isArray(d.items) && d.items.length > 0 ? d.items : DEFAULT_KEY_ADVANTAGES_ITEMS()
  const setItem = (i, field, value) => set('items', items.map((it, j) => (j === i ? { ...(it || {}), [field]: value } : it)))
  const addItem = () => set('items', [...items, { title: '', description: '', icon: '' }])
  const removeItem = (i) => set('items', items.filter((_, j) => j !== i))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Section heading</h4>
      <RowTwo>
        <Field label="Heading (before bold)"><input type="text" value={d.headingLine1 ?? ''} onChange={(e) => set('headingLine1', e.target.value)} placeholder="Key Advantages of" /></Field>
        <Field label="Heading (bold part)"><input type="text" value={d.headingStrong ?? ''} onChange={(e) => set('headingStrong', e.target.value)} placeholder="Learning at Cloud Intellect" /></Field>
      </RowTwo>

      <h4 className="editor-form-subsection">Advantage cards</h4>
      <p className="admin-form-help">Each card has a title, description, and icon filename (under /images/Key_Advantages/).</p>
      {items.map((item, i) => (
        <div key={i} className="editor-card-block" style={{ flexDirection: 'column', alignItems: 'stretch', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span className="editor-form-subsection">Card {i + 1}</span>
            <button type="button" className="editor-remove-row" onClick={() => removeItem(i)} aria-label="Remove card">×</button>
          </div>
          <Row><Field label="Title"><input type="text" value={item.title ?? ''} onChange={(e) => setItem(i, 'title', e.target.value)} placeholder="Practical-First Training" /></Field></Row>
          <Row><Field label="Description"><textarea value={item.description ?? ''} onChange={(e) => setItem(i, 'description', e.target.value)} rows={2} placeholder="Short description" /></Field></Row>
          <Row><Field label="Icon (filename)"><input type="text" value={item.icon ?? ''} onChange={(e) => setItem(i, 'icon', e.target.value)} placeholder="productivity.svg" /></Field></Row>
        </div>
      ))}
      <button type="button" className="editor-add-row" onClick={addItem}>+ Add card</button>

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

const DEFAULT_PORTAL_FEATURES = () => [
  'Book mock interview slots',
  'Schedule 1:1 mentor sessions',
  'Access assignments & submit projects',
  'Download notes & recordings anytime',
  'Track course progress step-by-step',
  'Receive placement & interview updates',
]
const DEFAULT_PLACEMENT_FEATURES = () => [
  'Professional resume preparation',
  'Mock interviews with expert feedback',
  'Soft-skill & communication training',
  'Daily job openings & referrals',
  'Interview scheduling guidance',
  'Continuous mentor support till placement',
]

/** SFMC-SFDC page: Complete Support Ecosystem – heading + two cards (portal + placement) with title, description, feature list. */
export function CompleteSupportEcosystemForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const portalCard = d.portalCard && typeof d.portalCard === 'object' ? d.portalCard : { title: 'Smart Student Portal Access', description: 'A powerful dashboard built specially for Cloud Intellect learners to manage learning and career in one place.', items: DEFAULT_PORTAL_FEATURES() }
  const placementCard = d.placementCard && typeof d.placementCard === 'object' ? d.placementCard : { title: 'Dedicated Placement Assistance', description: 'Complete career support to help students move from training to real Salesforce jobs.', items: DEFAULT_PLACEMENT_FEATURES() }
  const setPortal = (field, value) => set('portalCard', { ...portalCard, [field]: value })
  const setPlacement = (field, value) => set('placementCard', { ...placementCard, [field]: value })
  const setPortalItem = (i, value) => setPortal('items', (portalCard.items || []).map((item, j) => (j === i ? value : item)))
  const addPortalItem = () => setPortal('items', [...(portalCard.items || []), ''])
  const removePortalItem = (i) => setPortal('items', (portalCard.items || []).filter((_, j) => j !== i))
  const setPlacementItem = (i, value) => setPlacement('items', (placementCard.items || []).map((item, j) => (j === i ? value : item)))
  const addPlacementItem = () => setPlacement('items', [...(placementCard.items || []), ''])
  const removePlacementItem = (i) => setPlacement('items', (placementCard.items || []).filter((_, j) => j !== i))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Section heading</h4>
      <RowTwo>
        <Field label="Heading (before bold)"><input type="text" value={d.headingLine1 ?? ''} onChange={(e) => set('headingLine1', e.target.value)} placeholder="Complete" /></Field>
        <Field label="Heading (bold part)"><input type="text" value={d.headingStrong ?? ''} onChange={(e) => set('headingStrong', e.target.value)} placeholder="Support Ecosystem" /></Field>
      </RowTwo>

      <h4 className="editor-form-subsection">Card 1 – Smart Student Portal</h4>
      <Row><Field label="Title"><input type="text" value={portalCard.title ?? ''} onChange={(e) => setPortal('title', e.target.value)} placeholder="Smart Student Portal Access" /></Field></Row>
      <Row><Field label="Description"><textarea value={portalCard.description ?? ''} onChange={(e) => setPortal('description', e.target.value)} rows={2} placeholder="Short description" /></Field></Row>
      <Field label="Feature list">
        {(Array.isArray(portalCard.items) ? portalCard.items : []).map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input type="text" value={item} onChange={(e) => setPortalItem(i, e.target.value)} placeholder="Feature item" style={{ flex: 1 }} />
            <button type="button" className="editor-remove-row" onClick={() => removePortalItem(i)} aria-label="Remove">×</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addPortalItem}>+ Add item</button>
      </Field>

      <h4 className="editor-form-subsection">Card 2 – Placement Assistance</h4>
      <Row><Field label="Title"><input type="text" value={placementCard.title ?? ''} onChange={(e) => setPlacement('title', e.target.value)} placeholder="Dedicated Placement Assistance" /></Field></Row>
      <Row><Field label="Description"><textarea value={placementCard.description ?? ''} onChange={(e) => setPlacement('description', e.target.value)} rows={2} placeholder="Short description" /></Field></Row>
      <Field label="Feature list">
        {(Array.isArray(placementCard.items) ? placementCard.items : []).map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input type="text" value={item} onChange={(e) => setPlacementItem(i, e.target.value)} placeholder="Feature item" style={{ flex: 1 }} />
            <button type="button" className="editor-remove-row" onClick={() => removePlacementItem(i)} aria-label="Remove">×</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addPlacementItem}>+ Add item</button>
      </Field>

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

/** SFMC-SFDC page: Become Job-Ready in 3 to 6 Months – single card with icon, title, description, CTA. */
export function BecomeJobReadyForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const title = d.title ?? 'Become Job-Ready in 3 to 6 Months'
  const description = d.description ?? 'Our training model is designed to bridge the gap between education and employability, providing practical exposure equivalent to industry experience.'
  const icon = d.icon ?? '/images/person_heart.svg'
  const ctaText = d.ctaText ?? 'Download Brochure'
  const ctaHref = d.ctaHref ?? '#brochure'

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Content</h4>
      <Row><Field label="Title"><input type="text" value={title} onChange={(e) => set('title', e.target.value)} placeholder="Become Job-Ready in 3 to 6 Months" /></Field></Row>
      <Row><Field label="Description"><textarea value={description} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="Short description" /></Field></Row>
      <Row><Field label="Icon image URL"><input type="text" value={icon} onChange={(e) => set('icon', e.target.value)} placeholder="/images/person_heart.svg" /></Field></Row>
      <RowTwo>
        <Field label="Button text"><input type="text" value={ctaText} onChange={(e) => set('ctaText', e.target.value)} placeholder="Download Brochure" /></Field>
        <Field label="Button link"><input type="text" value={ctaHref} onChange={(e) => set('ctaHref', e.target.value)} placeholder="#brochure" /></Field>
      </RowTwo>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

const PLACEMENT_ASSISTANCE_IMAGE_BASE = '/images/Placement Assistance'
const DEFAULT_PLACEMENT_ASSISTANCE_ITEMS = () => [
  'Resume building workshops',
  'Interview preparation & grooming',
  'Alumni referral support',
  'Mock interviews (HR & Technical)',
  'Direct referrals to partner companies',
]

/** Why-choose-us page: Dedicated Placement Assistance Until You Get Hired – heading, description, support subheading, feature list, icon, image. */
export function PlacementAssistanceForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const items = Array.isArray(d.items) && d.items.length > 0 ? d.items : DEFAULT_PLACEMENT_ASSISTANCE_ITEMS()
  const setItem = (i, value) => set('items', items.map((item, j) => (j === i ? value : item)))
  const addItem = () => set('items', [...items, ''])
  const removeItem = (i) => set('items', items.filter((_, j) => j !== i))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Main heading</h4>
      <RowTwo>
        <Field label="Heading (before bold)"><input type="text" value={d.headingLine1 ?? ''} onChange={(e) => set('headingLine1', e.target.value)} placeholder="Dedicated Placement Assistance" /></Field>
        <Field label="Heading (bold part)"><input type="text" value={d.headingStrong ?? ''} onChange={(e) => set('headingStrong', e.target.value)} placeholder="Until You Get Hired" /></Field>
      </RowTwo>
      <Row><Field label="Description"><textarea value={d.description ?? ''} onChange={(e) => set('description', e.target.value)} rows={2} placeholder="Placements are an integral part of the Cloud Intellect learning journey." /></Field></Row>

      <h4 className="editor-form-subsection">Support subheading</h4>
      <RowTwo>
        <Field label="Light text"><input type="text" value={d.supportHeadingLight ?? ''} onChange={(e) => set('supportHeadingLight', e.target.value)} placeholder="Placement support" /></Field>
        <Field label="Bold text"><input type="text" value={d.supportHeadingBold ?? ''} onChange={(e) => set('supportHeadingBold', e.target.value)} placeholder="includes" /></Field>
      </RowTwo>

      <Field label="Feature list">
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input type="text" value={item} onChange={(e) => setItem(i, e.target.value)} placeholder="Feature item" style={{ flex: 1 }} />
            <button type="button" className="editor-remove-row" onClick={() => removeItem(i)} aria-label="Remove">×</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addItem}>+ Add item</button>
      </Field>

      <h4 className="editor-form-subsection">Images</h4>
      <Row><Field label="Icon URL"><input type="text" value={d.icon ?? ''} onChange={(e) => set('icon', e.target.value)} placeholder={`${PLACEMENT_ASSISTANCE_IMAGE_BASE}/Icon.svg`} /></Field></Row>
      <Row><Field label="Right-side image URL"><input type="text" value={d.image ?? ''} onChange={(e) => set('image', e.target.value)} placeholder={`${PLACEMENT_ASSISTANCE_IMAGE_BASE}/Container (20).webp`} /></Field></Row>

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

const DEFAULT_SFDC_MODULES = () => [
  { id: '01', title: 'Cloud & Salesforce Basics', topics: ['Cloud Computing Overview', 'Introduction to Salesforce', 'Admin Setup & Navigation'] },
  { id: '02', title: 'Configuration', topics: ['Apps, Objects, Fields, Tabs', 'Security in Salesforce', 'Reports & Dashboards'] },
  { id: '04', title: 'Apex Programming', topics: ['Data Types, Loops, Classes, Interfaces', 'SOQL & SOSL', 'Triggers & Test Classes', 'Asynchronous Apex'] },
  { id: '05', title: 'Lightning & LWC', topics: ['HTML, CSS, JavaScript', 'LWC Basics & Lifecycle Hooks', 'LWC Events (Parent-Child, Pub-Sub, LMS)', 'SLDS, Promises, Apex with LWC', 'Best Practices in LWC'] },
  { id: '03', title: 'Automation Tools', topics: ['Flow (Record Trigger, Schedule, Screen Flow)', 'Process Builder'] },
  { id: '06', title: 'Integration & Deployment', topics: ['API Callouts (Remote Site, Named Credentials)', 'Connected App Setup', 'Postman Tool', 'Sandbox, Deployment Strategies', 'CI/CD & Change Set'] },
]
const DEFAULT_SFDC_CAREER_CARD = () => ({
  brand: 'CLOUD INTELLECT',
  title: 'Career Outcomes',
  metrics: [
    { value: '1400+', label: 'SUCCESSFUL PLACEMENTS' },
    { value: '5000+', label: 'LEARNERS TRAINED' },
    { value: '32.5 LPA', label: 'HIGHEST PACKAGE' },
  ],
  applyText: 'APPLY NOW',
  applyHref: '#apply',
  batchDate: 'Next Batch Starts Feb 15th',
  batchType: 'Weekend Batch',
  batchIcon: '/images/SVG (5) copy 2.svg',
})

/** Salesforce Developer page: Topics Covered in SFDC Program – heading + modules (id, title, topics) + right-side career card. */
export function SFDCTopicsForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const modules = Array.isArray(d.modules) && d.modules.length > 0 ? d.modules : DEFAULT_SFDC_MODULES()
  const setModule = (i, field, value) => set('modules', modules.map((m, j) => (j === i ? { ...(m || {}), [field]: value } : m)))
  const setModuleTopic = (modIndex, topicIndex, value) => {
    const mod = modules[modIndex] || {}
    const topics = Array.isArray(mod.topics) ? [...mod.topics] : []
    topics[topicIndex] = value
    setModule(modIndex, 'topics', topics)
  }
  const addModuleTopic = (modIndex) => {
    const mod = modules[modIndex] || {}
    const topics = Array.isArray(mod.topics) ? [...mod.topics] : []
    setModule(modIndex, 'topics', [...topics, ''])
  }
  const removeModuleTopic = (modIndex, topicIndex) => {
    const mod = modules[modIndex] || {}
    const topics = Array.isArray(mod.topics) ? mod.topics.filter((_, j) => j !== topicIndex) : []
    setModule(modIndex, 'topics', topics)
  }
  const addModule = () => set('modules', [...modules, { id: '', title: '', topics: [] }])
  const removeModule = (i) => set('modules', modules.filter((_, j) => j !== i))

  const career = d.careerCard && typeof d.careerCard === 'object' ? { ...DEFAULT_SFDC_CAREER_CARD(), ...d.careerCard } : DEFAULT_SFDC_CAREER_CARD()
  const setCareer = (field, value) => set('careerCard', { ...career, [field]: value })
  const careerMetrics = Array.isArray(career.metrics) ? career.metrics : DEFAULT_SFDC_CAREER_CARD().metrics
  const setCareerMetric = (i, field, value) => setCareer('metrics', careerMetrics.map((m, j) => (j === i ? { ...(m || {}), [field]: value } : m)))
  const addCareerMetric = () => setCareer('metrics', [...careerMetrics, { value: '', label: '' }])
  const removeCareerMetric = (i) => setCareer('metrics', careerMetrics.filter((_, j) => j !== i))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Section heading</h4>
      <RowTwo>
        <Field label="Heading (before bold)"><input type="text" value={d.headingLine1 ?? ''} onChange={(e) => set('headingLine1', e.target.value)} placeholder="Topics Covered in" /></Field>
        <Field label="Heading (bold part)"><input type="text" value={d.headingStrong ?? ''} onChange={(e) => set('headingStrong', e.target.value)} placeholder="SFDC Program" /></Field>
      </RowTwo>

      <h4 className="editor-form-subsection">Modules (left column)</h4>
      <p className="admin-form-help">Each module has an ID (e.g. 01), title, and list of topic strings.</p>
      {modules.map((mod, i) => (
        <div key={i} className="editor-card-block" style={{ flexDirection: 'column', alignItems: 'stretch', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span>Module {i + 1}</span>
            <button type="button" className="editor-remove-row" onClick={() => removeModule(i)} aria-label="Remove module">×</button>
          </div>
          <RowTwo>
            <Field label="ID"><input type="text" value={mod.id ?? ''} onChange={(e) => setModule(i, 'id', e.target.value)} placeholder="01" /></Field>
            <Field label="Title"><input type="text" value={mod.title ?? ''} onChange={(e) => setModule(i, 'title', e.target.value)} placeholder="Cloud & Salesforce Basics" /></Field>
          </RowTwo>
          <Field label="Topics">
            {(Array.isArray(mod.topics) ? mod.topics : []).map((topic, ti) => (
              <div key={ti} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <input type="text" value={topic} onChange={(e) => setModuleTopic(i, ti, e.target.value)} placeholder="Topic" style={{ flex: 1 }} />
                <button type="button" className="editor-remove-row" onClick={() => removeModuleTopic(i, ti)} aria-label="Remove">×</button>
              </div>
            ))}
            <button type="button" className="editor-add-row" onClick={() => addModuleTopic(i)}>+ Add topic</button>
          </Field>
        </div>
      ))}
      <button type="button" className="editor-add-row" onClick={addModule}>+ Add module</button>

      <h4 className="editor-form-subsection">Career card (right column)</h4>
      <Row><Field label="Brand text"><input type="text" value={career.brand ?? ''} onChange={(e) => setCareer('brand', e.target.value)} placeholder="CLOUD INTELLECT" /></Field></Row>
      <Row><Field label="Card title"><input type="text" value={career.title ?? ''} onChange={(e) => setCareer('title', e.target.value)} placeholder="Career Outcomes" /></Field></Row>
      <Field label="Metrics">
        {careerMetrics.map((m, mi) => (
          <div key={mi} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input type="text" value={m.value ?? ''} onChange={(e) => setCareerMetric(mi, 'value', e.target.value)} placeholder="1400+" style={{ width: 100 }} />
            <input type="text" value={m.label ?? ''} onChange={(e) => setCareerMetric(mi, 'label', e.target.value)} placeholder="SUCCESSFUL PLACEMENTS" style={{ flex: 1 }} />
            <button type="button" className="editor-remove-row" onClick={() => removeCareerMetric(mi)} aria-label="Remove">×</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addCareerMetric}>+ Add metric</button>
      </Field>
      <RowTwo>
        <Field label="Apply button text"><input type="text" value={career.applyText ?? ''} onChange={(e) => setCareer('applyText', e.target.value)} placeholder="APPLY NOW" /></Field>
        <Field label="Apply button link"><input type="text" value={career.applyHref ?? ''} onChange={(e) => setCareer('applyHref', e.target.value)} placeholder="#apply" /></Field>
      </RowTwo>
      <RowTwo>
        <Field label="Batch date"><input type="text" value={career.batchDate ?? ''} onChange={(e) => setCareer('batchDate', e.target.value)} placeholder="Next Batch Starts Feb 15th" /></Field>
        <Field label="Batch type"><input type="text" value={career.batchType ?? ''} onChange={(e) => setCareer('batchType', e.target.value)} placeholder="Weekend Batch" /></Field>
      </RowTwo>
      <Row><Field label="Batch icon URL"><input type="text" value={career.batchIcon ?? ''} onChange={(e) => setCareer('batchIcon', e.target.value)} placeholder="/images/SVG (5) copy 2.svg" /></Field></Row>

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

const DEFAULT_SFDC_CAREER_ROLES = () => [
  { title: 'Salesforce Developer', description: 'Build custom applications and integrations on Salesforce.' },
  { title: 'Salesforce Administrator', description: 'Manage user setup, permissions, and data.' },
  { title: 'Salesforce Consultant', description: 'Analyze business requirements and implement solutions.' },
  { title: 'Salesforce Analyst', description: 'Work with clients to gather requirements and optimize processes.' },
  { title: 'Salesforce App Developer', description: 'Create and deploy custom applications.' },
  { title: 'Salesforce Architect', description: 'Design complex solutions and lead development teams.' },
]

/** Salesforce Developer page: Career Opportunities After SFDC Certification – heading + list of role cards (title, description). */
export function SFDCCareerOpportunitiesForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const roles = Array.isArray(d.roles) && d.roles.length > 0 ? d.roles : DEFAULT_SFDC_CAREER_ROLES()
  const setRole = (i, field, value) => set('roles', roles.map((r, j) => (j === i ? { ...(r || {}), [field]: value } : r)))
  const addRole = () => set('roles', [...roles, { title: '', description: '' }])
  const removeRole = (i) => set('roles', roles.filter((_, j) => j !== i))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Section heading</h4>
      <RowTwo>
        <Field label="Heading (before bold)"><input type="text" value={d.headingLine1 ?? ''} onChange={(e) => set('headingLine1', e.target.value)} placeholder="Career Opportunities After" /></Field>
        <Field label="Heading (bold part)"><input type="text" value={d.headingStrong ?? ''} onChange={(e) => set('headingStrong', e.target.value)} placeholder="SFDC Certification" /></Field>
      </RowTwo>

      <h4 className="editor-form-subsection">Icon (optional)</h4>
      <Row><Field label="Icon URL"><input type="text" value={d.icon ?? ''} onChange={(e) => set('icon', e.target.value)} placeholder="/images/code.svg" /></Field></Row>

      <h4 className="editor-form-subsection">Career roles</h4>
      <p className="admin-form-help">Each card has a title and description.</p>
      {roles.map((role, i) => (
        <div key={i} className="editor-card-block" style={{ flexDirection: 'column', alignItems: 'stretch', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span>Role {i + 1}</span>
            <button type="button" className="editor-remove-row" onClick={() => removeRole(i)} aria-label="Remove">×</button>
          </div>
          <Row><Field label="Title"><input type="text" value={role.title ?? ''} onChange={(e) => setRole(i, 'title', e.target.value)} placeholder="Salesforce Developer" /></Field></Row>
          <Row><Field label="Description"><input type="text" value={role.description ?? ''} onChange={(e) => setRole(i, 'description', e.target.value)} placeholder="Build custom applications and integrations on Salesforce." /></Field></Row>
        </div>
      ))}
      <button type="button" className="editor-add-row" onClick={addRole}>+ Add role</button>

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

const DEFAULT_SFMC_MODULES = () => [
  { id: '01', title: 'Setup & Administration', topics: ['User Management', 'Platform Tools', 'Content Builder', 'Email Studio Configuration', 'Security & SAP'], icon: 'manage_accounts.svg' },
  { id: '02', title: 'Subscribers & Data Management', topics: ['Data Extensions', 'Lists', 'Measures & Data Filters', 'Share Items & Subscriber Management Review'], icon: 'format_indent_increase.svg' },
  { id: '03', title: 'Content Creation (Email Studio)', topics: ['Creating Email Messages & Templates', 'Content Blocks', 'Uploading & Managing Content', 'Building & Testing Emails'], icon: 'article.svg' },
  { id: '04', title: 'Interactions, A/B Testing & Tracking', topics: ['Interaction Setup', 'A/B Testing', 'Tracking', 'Admin'], icon: 'autopause.svg' },
  { id: '05', title: 'HTML, CSS & Design Functions', topics: ['HTML Basics (Structure, Tables, Divs)', 'Styling (Inline, Embedded & Linked CSS)', 'AMPscript Embeds (Variables, Conditionals)', 'Function Basics & Styling Integration'], icon: 'developer_mode_tv.svg' },
  { id: '06', title: 'AMPscript Programming', topics: ['Variables & Output', 'Data Extension Functions', 'Conditional Logic & Loops', 'String & Math Functions', 'URL, Redirect, HTTP & API Integration'], icon: 'terminal.svg' },
  { id: '07', title: 'SQL Queries & Automation Studio', topics: ['SQL: SELECT, Joins, Aggregations, CASE Conditions', 'Automation Studio: Schedule, File Drop, Trigger', 'Activities: Import, Extract, Transfer, Filter, Query, Script', 'Data Management (FTP, Key Management)'], icon: 'integration_instructions.svg' },
  { id: '08', title: 'MC Connect & Journey Builder', topics: ['MC Connect: Managed Package, CRM Settings, Testing', 'Journey Builder: Multi-Step, Single-Step, Transactional', 'Entry Sources: Data Extension, Salesforce Data, API Event', 'Journey Settings & Goals'], icon: 'playlist_add_check_circle.svg' },
  { id: '09', title: 'Contact Builder, Analytics & Web Studio', topics: ['Contact Builder (Data Designer, Attribute Groups)', 'Analytics Builder (Catalogue, Activity Reports)', 'Web Studio (Cloud Pages, Microsites, Preference Centers)'], icon: 'chat.svg' },
  { id: '10', title: 'SSJS & API Integration', topics: ['SSJS (Core Functions, HTTP Functions)', 'API & Postman (Authentication, Journey Management)', 'Managing Unsubscribers via API'], icon: 'highlight_mouse_cursor.svg' },
]
const DEFAULT_SFMC_TOOLS = () => [
  { tool: 'Journey Builder', purpose: 'Designs personalized, automated customer journeys.' },
  { tool: 'Automation Studio', purpose: 'Automates data imports, segmentation, and campaign sends.' },
  { tool: 'Email Studio', purpose: 'Designs and sends professional marketing emails.' },
  { tool: 'Content Builder', purpose: 'Creates and manages reusable email and landing page content.' },
  { tool: 'Contact Builder', purpose: 'Manages subscriber data and relationships.' },
  { tool: 'Analytics Builder', purpose: 'Generates performance reports and insights.' },
  { tool: 'Mobile Studio', purpose: 'Sends targeted SMS and push notifications.' },
  { tool: 'Web Studio', purpose: 'Creates landing pages and forms using Cloud Pages.' },
  { tool: 'Developer Console', purpose: 'Used by developers to test code, run queries, and debug.' },
  { tool: 'Postman', purpose: 'Tool for testing Salesforce and SFMC APIs.' },
]
const DEFAULT_SFMC_CAREER_CARD = () => ({
  brand: 'CLOUD INTELLECT',
  title: 'Career Outcomes',
  metrics: [
    { value: '1400+', label: 'SUCCESSFUL PLACEMENTS' },
    { value: '5000+', label: 'LEARNERS TRAINED' },
    { value: '32.5 LPA', label: 'HIGHEST PACKAGE' },
  ],
  applyText: 'APPLY NOW',
  applyHref: '#apply',
  batchDate: 'Next Batch Starts Jan 15th',
  batchType: 'Weekend Batch',
  batchIcon: '/images/SVG (5) copy 2.svg',
})

/** Salesforce Marketing Cloud page: Topics Covered – heading + modules (id, title, topics, icon) + tools table + career card. */
export function SFMCTopicsForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const modules = Array.isArray(d.modules) && d.modules.length > 0 ? d.modules : DEFAULT_SFMC_MODULES()
  const setModule = (i, field, value) => set('modules', modules.map((m, j) => (j === i ? { ...(m || {}), [field]: value } : m)))
  const setModuleTopic = (modIndex, topicIndex, value) => {
    const mod = modules[modIndex] || {}
    const topics = Array.isArray(mod.topics) ? [...mod.topics] : []
    topics[topicIndex] = value
    setModule(modIndex, 'topics', topics)
  }
  const addModuleTopic = (modIndex) => {
    const mod = modules[modIndex] || {}
    const topics = Array.isArray(mod.topics) ? [...mod.topics] : []
    setModule(modIndex, 'topics', [...topics, ''])
  }
  const removeModuleTopic = (modIndex, topicIndex) => {
    const mod = modules[modIndex] || {}
    const topics = Array.isArray(mod.topics) ? mod.topics.filter((_, j) => j !== topicIndex) : []
    setModule(modIndex, 'topics', topics)
  }
  const addModule = () => set('modules', [...modules, { id: '', title: '', topics: [], icon: '' }])
  const removeModule = (i) => set('modules', modules.filter((_, j) => j !== i))

  const toolsTable = Array.isArray(d.toolsTable) && d.toolsTable.length > 0 ? d.toolsTable : DEFAULT_SFMC_TOOLS()
  const setToolRow = (i, field, value) => set('toolsTable', toolsTable.map((r, j) => (j === i ? { ...(r || {}), [field]: value } : r)))
  const addToolRow = () => set('toolsTable', [...toolsTable, { tool: '', purpose: '' }])
  const removeToolRow = (i) => set('toolsTable', toolsTable.filter((_, j) => j !== i))

  const career = d.careerCard && typeof d.careerCard === 'object' ? { ...DEFAULT_SFMC_CAREER_CARD(), ...d.careerCard } : DEFAULT_SFMC_CAREER_CARD()
  const setCareer = (field, value) => set('careerCard', { ...career, [field]: value })
  const careerMetrics = Array.isArray(career.metrics) ? career.metrics : DEFAULT_SFMC_CAREER_CARD().metrics
  const setCareerMetric = (i, field, value) => setCareer('metrics', careerMetrics.map((m, j) => (j === i ? { ...(m || {}), [field]: value } : m)))
  const addCareerMetric = () => setCareer('metrics', [...careerMetrics, { value: '', label: '' }])
  const removeCareerMetric = (i) => setCareer('metrics', careerMetrics.filter((_, j) => j !== i))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Section heading</h4>
      <RowTwo>
        <Field label="Heading (before bold)"><input type="text" value={d.headingLine1 ?? ''} onChange={(e) => set('headingLine1', e.target.value)} placeholder="Topics" /></Field>
        <Field label="Heading (bold part)"><input type="text" value={d.headingStrong ?? ''} onChange={(e) => set('headingStrong', e.target.value)} placeholder="Covered" /></Field>
      </RowTwo>

      <h4 className="editor-form-subsection">Modules (left column)</h4>
      <p className="admin-form-help">Icon is filename under /images/Salesforce Marketing Cloud/ (e.g. manage_accounts.svg).</p>
      {modules.map((mod, i) => (
        <div key={i} className="editor-card-block" style={{ flexDirection: 'column', alignItems: 'stretch', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span>Module {i + 1}</span>
            <button type="button" className="editor-remove-row" onClick={() => removeModule(i)} aria-label="Remove module">×</button>
          </div>
          <RowTwo>
            <Field label="ID"><input type="text" value={mod.id ?? ''} onChange={(e) => setModule(i, 'id', e.target.value)} placeholder="01" /></Field>
            <Field label="Title"><input type="text" value={mod.title ?? ''} onChange={(e) => setModule(i, 'title', e.target.value)} placeholder="Setup & Administration" /></Field>
          </RowTwo>
          <Row><Field label="Icon filename"><input type="text" value={mod.icon ?? ''} onChange={(e) => setModule(i, 'icon', e.target.value)} placeholder="manage_accounts.svg" /></Field></Row>
          <Field label="Topics">
            {(Array.isArray(mod.topics) ? mod.topics : []).map((topic, ti) => (
              <div key={ti} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <input type="text" value={topic} onChange={(e) => setModuleTopic(i, ti, e.target.value)} placeholder="Topic" style={{ flex: 1 }} />
                <button type="button" className="editor-remove-row" onClick={() => removeModuleTopic(i, ti)} aria-label="Remove">×</button>
              </div>
            ))}
            <button type="button" className="editor-add-row" onClick={() => addModuleTopic(i)}>+ Add topic</button>
          </Field>
        </div>
      ))}
      <button type="button" className="editor-add-row" onClick={addModule}>+ Add module</button>

      <h4 className="editor-form-subsection">Tools table</h4>
      <Row><Field label="Tools heading"><input type="text" value={d.toolsHeading ?? ''} onChange={(e) => set('toolsHeading', e.target.value)} placeholder="Tools Commonly Used" /></Field></Row>
      <p className="admin-form-help">Rows for Studios & Builders / Purpose.</p>
      {toolsTable.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
          <input type="text" value={row.tool ?? ''} onChange={(e) => setToolRow(i, 'tool', e.target.value)} placeholder="Journey Builder" style={{ flex: 1, minWidth: 120 }} />
          <input type="text" value={row.purpose ?? ''} onChange={(e) => setToolRow(i, 'purpose', e.target.value)} placeholder="Purpose" style={{ flex: 1, minWidth: 120 }} />
          <button type="button" className="editor-remove-row" onClick={() => removeToolRow(i)} aria-label="Remove">×</button>
        </div>
      ))}
      <button type="button" className="editor-add-row" onClick={addToolRow}>+ Add row</button>

      <h4 className="editor-form-subsection">Career card (right column)</h4>
      <Row><Field label="Brand text"><input type="text" value={career.brand ?? ''} onChange={(e) => setCareer('brand', e.target.value)} placeholder="CLOUD INTELLECT" /></Field></Row>
      <Row><Field label="Card title"><input type="text" value={career.title ?? ''} onChange={(e) => setCareer('title', e.target.value)} placeholder="Career Outcomes" /></Field></Row>
      <Field label="Metrics">
        {careerMetrics.map((m, mi) => (
          <div key={mi} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input type="text" value={m.value ?? ''} onChange={(e) => setCareerMetric(mi, 'value', e.target.value)} placeholder="1400+" style={{ width: 100 }} />
            <input type="text" value={m.label ?? ''} onChange={(e) => setCareerMetric(mi, 'label', e.target.value)} placeholder="SUCCESSFUL PLACEMENTS" style={{ flex: 1 }} />
            <button type="button" className="editor-remove-row" onClick={() => removeCareerMetric(mi)} aria-label="Remove">×</button>
          </div>
        ))}
        <button type="button" className="editor-add-row" onClick={addCareerMetric}>+ Add metric</button>
      </Field>
      <RowTwo>
        <Field label="Apply button text"><input type="text" value={career.applyText ?? ''} onChange={(e) => setCareer('applyText', e.target.value)} placeholder="APPLY NOW" /></Field>
        <Field label="Apply button link"><input type="text" value={career.applyHref ?? ''} onChange={(e) => setCareer('applyHref', e.target.value)} placeholder="#apply" /></Field>
      </RowTwo>
      <RowTwo>
        <Field label="Batch date"><input type="text" value={career.batchDate ?? ''} onChange={(e) => setCareer('batchDate', e.target.value)} placeholder="Next Batch Starts Jan 15th" /></Field>
        <Field label="Batch type"><input type="text" value={career.batchType ?? ''} onChange={(e) => setCareer('batchType', e.target.value)} placeholder="Weekend Batch" /></Field>
      </RowTwo>
      <Row><Field label="Batch icon URL"><input type="text" value={career.batchIcon ?? ''} onChange={(e) => setCareer('batchIcon', e.target.value)} placeholder="/images/SVG (5) copy 2.svg" /></Field></Row>

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

const DEFAULT_SFMC_CAREER_ROLES = () => [
  { title: 'Administrator', description: 'Manages user setup, permissions, roles, business units, and ensures smooth operation.', icon: 'tune.svg' },
  { title: 'Developer', description: 'Supports marketing teams in managing data extensions, lists, and running basic campaigns.', icon: 'business_messages.svg' },
  { title: 'Consultant', description: 'Advises on Marketing Cloud strategy, implementation, and optimization.', icon: 'bar_chart_4_bars.svg' },
  { title: 'Quality Analyst', description: 'Tests emails, journeys, automations, and integrations before campaigns go live.', icon: 'star_shine.svg' },
  { title: 'Business Analyst', description: 'Translates business requirements into Salesforce Marketing Cloud campaigns and workflows.', icon: 'add_chart.svg' },
  { title: 'Architect', description: 'Designs and executes personalized email campaigns using Content Builder and Journey Builder.', icon: 'edit_square.svg' },
]

/** Salesforce Marketing Cloud page: Career Opportunities After SFMC – heading + list of role cards (title, description, icon – drag & drop or path). */
export function SFMCCareerOpportunitiesForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const roles = Array.isArray(d.roles) && d.roles.length > 0 ? d.roles : DEFAULT_SFMC_CAREER_ROLES()
  const setRole = (i, field, value) => set('roles', roles.map((r, j) => (j === i ? { ...(r || {}), [field]: value } : r)))
  const addRole = () => set('roles', [...roles, { title: '', description: '', icon: '' }])
  const removeRole = (i) => set('roles', roles.filter((_, j) => j !== i))

  const [uploadingIconIndex, setUploadingIconIndex] = useState(null)
  const [pendingIconIndex, setPendingIconIndex] = useState(null)
  const iconFileRef = useRef(null)

  const handleIconUpload = async (index, file) => {
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File must be under 5MB')
      return
    }
    setUploadingIconIndex(index)
    try {
      const response = await uploadAPI.uploadFile(file, SFMC_CAREER_ICONS_FOLDER)
      const path = parseUploadPathResponse(response)
      if (path) setRole(index, 'icon', path)
      else throw new Error('Upload response missing path')
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingIconIndex(null)
      if (iconFileRef.current) iconFileRef.current.value = ''
    }
  }

  const onIconDrop = (e, index) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer?.files?.[0]
    if (file) handleIconUpload(index, file)
  }
  const onIconDragOver = (e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy' }
  const onIconDragLeave = (e) => { e.preventDefault(); e.stopPropagation() }

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Section heading</h4>
      <RowTwo>
        <Field label="Heading (before bold)"><input type="text" value={d.headingLine1 ?? ''} onChange={(e) => set('headingLine1', e.target.value)} placeholder="Career Opportunities" /></Field>
        <Field label="Heading (bold part)"><input type="text" value={d.headingStrong ?? ''} onChange={(e) => set('headingStrong', e.target.value)} placeholder="After SFMC" /></Field>
      </RowTwo>

      <h4 className="editor-form-subsection">Icon base (optional)</h4>
      <Row><Field label="Icon base URL"><input type="text" value={d.iconBase ?? ''} onChange={(e) => set('iconBase', e.target.value)} placeholder="/images/Career_Opportunities_SFMC" /></Field></Row>
      <p className="admin-form-help">Used when role icon is a filename only (e.g. tune.svg). Uploaded icons use their full path.</p>

      <h4 className="editor-form-subsection">Career roles (drag & drop or click to upload icon)</h4>
      <p className="admin-form-help">Each card has title, description, and icon. Upload an image or enter a path/filename.</p>
      <input
        type="file"
        ref={iconFileRef}
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target?.files?.[0]
          const idx = pendingIconIndex
          setPendingIconIndex(null)
          if (file && typeof idx === 'number' && idx >= 0) handleIconUpload(idx, file)
        }}
      />
      {roles.map((role, i) => {
        const iconPath = role.icon ?? ''
        const previewUrl = iconPath ? (iconPath.startsWith('/') ? getImageUrl(iconPath) : (d.iconBase || '/images/Career_Opportunities_SFMC') + '/' + iconPath) : ''
        return (
          <div key={i} className="editor-card-block" style={{ flexDirection: 'column', alignItems: 'stretch', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span>Role {i + 1}</span>
              <button type="button" className="editor-remove-row" onClick={() => removeRole(i)} aria-label="Remove">×</button>
            </div>
            <Row><Field label="Title"><input type="text" value={role.title ?? ''} onChange={(e) => setRole(i, 'title', e.target.value)} placeholder="Administrator" /></Field></Row>
            <Row><Field label="Description"><input type="text" value={role.description ?? ''} onChange={(e) => setRole(i, 'description', e.target.value)} placeholder="Manages user setup..." /></Field></Row>
            <Field label="Icon (drag & drop or click to upload)">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div
                  className={`placement-image-dropzone ${uploadingIconIndex === i ? 'placement-image-dropzone--uploading' : ''}`}
                  style={{ minWidth: 80, minHeight: 60 }}
                  onDragOver={onIconDragOver}
                  onDragLeave={onIconDragLeave}
                  onDrop={(e) => onIconDrop(e, i)}
                  onClick={() => { if (uploadingIconIndex !== null) return; setPendingIconIndex(i); iconFileRef.current?.click(); }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && uploadingIconIndex === null) { e.preventDefault(); setPendingIconIndex(i); iconFileRef.current?.click(); } }}
                  aria-label={`Role ${i + 1} icon: drag image or click to upload`}
                >
                  {uploadingIconIndex === i ? 'Uploading…' : previewUrl ? <img src={previewUrl} alt="" style={{ maxWidth: '100%', maxHeight: 56, objectFit: 'contain' }} /> : 'Drop or click'}
                </div>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <span className="editor-form-row-label">Or enter path/filename</span>
                  <input type="text" value={iconPath} onChange={(e) => setRole(i, 'icon', e.target.value)} placeholder="tune.svg or /images/..." style={{ width: '100%', marginTop: 4 }} />
                </div>
              </div>
            </Field>
          </div>
        )
      })}
      <button type="button" className="editor-add-row" onClick={addRole}>+ Add role</button>

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

export function SimpleSectionForm({ data, onChange, onSubmit, saving, titleLabel = 'Section title', descriptionLabel = 'Description' }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <Row><Field label={titleLabel}><input type="text" value={d.title ?? ''} onChange={(e) => {
        set('title', e.target.value)
        // Also set heading for compatibility
        set('heading', e.target.value)
      }} placeholder="Section title" /></Field></Row>
      <Row><Field label={descriptionLabel}><textarea value={d.description ?? ''} onChange={(e) => set('description', e.target.value)} rows={5} placeholder="Main content or description" /></Field></Row>
      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

const TRUST_RECOGNITION_ICON_BASE = '/images/Trust and Recognition'
const DEFAULT_TRUST_RECOGNITION_ITEMS = () => [
  { text: 'Salesforce Workforce Development Partner', icon: `${TRUST_RECOGNITION_ICON_BASE}/verified.svg` },
  { text: 'Training aligned with Salesforce role frameworks', icon: `${TRUST_RECOGNITION_ICON_BASE}/book_ribbon.svg` },
  { text: 'Expert trainers from the Salesforce ecosystem', icon: `${TRUST_RECOGNITION_ICON_BASE}/group.svg` },
  { text: 'Strong alumni & corporate network', icon: `${TRUST_RECOGNITION_ICON_BASE}/account_tree.svg` },
]

/** Why-choose-us page: Institutional Trust & Recognition – heading + list of trust items (text + icon). */
export function TrustRecognitionForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const items = Array.isArray(d.items) && d.items.length > 0 ? d.items : DEFAULT_TRUST_RECOGNITION_ITEMS()
  const setItem = (i, field, value) => set('items', items.map((it, j) => (j === i ? { ...(it || {}), [field]: value } : it)))
  const addItem = () => set('items', [...items, { text: '', icon: '' }])
  const removeItem = (i) => set('items', items.filter((_, j) => j !== i))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Section heading</h4>
      <RowTwo>
        <Field label="Heading (light part)"><input type="text" value={d.headingLight ?? ''} onChange={(e) => set('headingLight', e.target.value)} placeholder="Institutional" /></Field>
        <Field label="Heading (bold part)"><input type="text" value={d.headingBold ?? ''} onChange={(e) => set('headingBold', e.target.value)} placeholder="Trust & Recognition" /></Field>
      </RowTwo>

      <h4 className="editor-form-subsection">Trust items</h4>
      <p className="admin-form-help">Each item has text and an icon image URL.</p>
      {items.map((item, i) => (
        <div key={i} className="editor-card-block" style={{ flexDirection: 'column', alignItems: 'stretch', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span>Item {i + 1}</span>
            <button type="button" className="editor-remove-row" onClick={() => removeItem(i)} aria-label="Remove">×</button>
          </div>
          <Row><Field label="Text"><input type="text" value={item.text ?? ''} onChange={(e) => setItem(i, 'text', e.target.value)} placeholder="Salesforce Workforce Development Partner" /></Field></Row>
          <Row><Field label="Icon URL"><input type="text" value={item.icon ?? ''} onChange={(e) => setItem(i, 'icon', e.target.value)} placeholder="/images/Trust and Recognition/verified.svg" /></Field></Row>
        </div>
      ))}
      <button type="button" className="editor-add-row" onClick={addItem}>+ Add item</button>

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

const DEFAULT_IMPACT_METRICS = () => [
  { value: '5000+', label: 'LEARNERS TRAINED' },
  { value: '1400+', label: 'SUCCESSFUL PLACEMENTS' },
  { value: '20+', label: 'CERTIFIED INDUSTRY MENTORS' },
  { value: '11+', label: 'YEARS EXPERIENCE' },
]

/** Why-choose-us page: CI Impact Snapshot – heading + metrics + CTA card (tagline, heading, description, button). */
export function ImpactSnapshotForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const metrics = Array.isArray(d.metrics) && d.metrics.length > 0 ? d.metrics : DEFAULT_IMPACT_METRICS()
  const setMetric = (i, field, value) => set('metrics', metrics.map((m, j) => (j === i ? { ...(m || {}), [field]: value } : m)))
  const addMetric = () => set('metrics', [...metrics, { value: '', label: '' }])
  const removeMetric = (i) => set('metrics', metrics.filter((_, j) => j !== i))

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Section heading</h4>
      <RowTwo>
        <Field label="Heading (light part)"><input type="text" value={d.headingLight ?? ''} onChange={(e) => set('headingLight', e.target.value)} placeholder="CI Impact" /></Field>
        <Field label="Heading (bold part)"><input type="text" value={d.headingBold ?? ''} onChange={(e) => set('headingBold', e.target.value)} placeholder="Snapshot" /></Field>
      </RowTwo>

      <h4 className="editor-form-subsection">Metrics</h4>
      <p className="admin-form-help">Number/value and label for each stat (e.g. 5000+, LEARNERS TRAINED).</p>
      {metrics.map((metric, i) => (
        <div key={i} className="editor-card-block" style={{ flexDirection: 'column', alignItems: 'stretch', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span>Metric {i + 1}</span>
            <button type="button" className="editor-remove-row" onClick={() => removeMetric(i)} aria-label="Remove">×</button>
          </div>
          <RowTwo>
            <Field label="Value"><input type="text" value={metric.value ?? ''} onChange={(e) => setMetric(i, 'value', e.target.value)} placeholder="5000+" /></Field>
            <Field label="Label"><input type="text" value={metric.label ?? ''} onChange={(e) => setMetric(i, 'label', e.target.value)} placeholder="LEARNERS TRAINED" /></Field>
          </RowTwo>
        </div>
      ))}
      <button type="button" className="editor-add-row" onClick={addMetric}>+ Add metric</button>

      <h4 className="editor-form-subsection">CTA card</h4>
      <Row><Field label="Tagline (uppercase line)"><input type="text" value={d.tagline ?? ''} onChange={(e) => set('tagline', e.target.value)} placeholder="CHOOSING CLOUD INTELLECT MEANS CHOOSING PRACTICAL LEARNING" /></Field></Row>
      <Row><Field label="CTA heading"><input type="text" value={d.ctaHeading ?? ''} onChange={(e) => set('ctaHeading', e.target.value)} placeholder="industry exposure, and long-term career growth." /></Field></Row>
      <Row><Field label="CTA description"><textarea value={d.ctaDescription ?? ''} onChange={(e) => set('ctaDescription', e.target.value)} rows={2} placeholder="With structured training..." /></Field></Row>
      <RowTwo>
        <Field label="Button text"><input type="text" value={d.ctaText ?? ''} onChange={(e) => set('ctaText', e.target.value)} placeholder="Apply Today" /></Field>
        <Field label="Button link"><input type="text" value={d.ctaHref ?? ''} onChange={(e) => set('ctaHref', e.target.value)} placeholder="#apply" /></Field>
      </RowTwo>

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}

const LANDING_IMAGE_FOLDER = 'images/landing'

function parseUploadPath(response) {
  if (response?.success && response?.data?.path) return response.data.path
  if (response?.data?.path) return response.data.path
  if (response?.path) return response.path
  return null
}

/** Landing page hero (no header/footer) – top bar, event bar, headline, stats, video, CTA */
export function LandingHeroForm({ data, onChange, onSubmit, saving }) {
  const d = data || {}
  const set = (key, value) => onChange({ ...d, [key]: value })
  const setNested = (parent, key, value) => {
    const parentObj = d[parent] || {}
    set(parent, { ...parentObj, [key]: value })
  }
  const topBar = d.topBar || {}
  const eventBar = d.eventBar || {}
  const video = d.video || {}
  const cta = d.cta || {}
  const stats = Array.isArray(d.stats) ? d.stats : [
    { value: '2000+', label: 'Students Placed' },
    { value: '200+', label: 'Hiring Partners' },
    { value: '₹8 LPA', label: 'Avg Salary' }
  ]
  const setStat = (i, field, value) => {
    const next = stats.map((s, j) => (j === i ? { ...s, [field]: value } : s))
    set('stats', next)
  }
  const addStat = () => set('stats', [...stats, { value: '', label: '' }])
  const removeStat = (i) => set('stats', stats.filter((_, j) => j !== i))

  const logoFileRef = useRef(null)
  const thumbFileRef = useRef(null)
  const bgFileRef = useRef(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingThumb, setUploadingThumb] = useState(false)
  const [uploadingBg, setUploadingBg] = useState(false)
  const [dropZoneLogoActive, setDropZoneLogoActive] = useState(false)
  const [dropZoneThumbActive, setDropZoneThumbActive] = useState(false)
  const [dropZoneBgActive, setDropZoneBgActive] = useState(false)

  const handleBgUpload = async (e) => {
    const file = e?.target?.files?.[0]
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10MB')
      return
    }
    setUploadingBg(true)
    try {
      const response = await uploadAPI.uploadFile(file, LANDING_IMAGE_FOLDER)
      const path = parseUploadPath(response)
      if (path) set('backgroundImage', path)
      else throw new Error('Upload response missing path')
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingBg(false)
      setDropZoneBgActive(false)
      if (bgFileRef.current) bgFileRef.current.value = ''
    }
  }
  const onBgDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropZoneBgActive(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) handleBgUpload({ target: { files: [file] } })
  }
  const onBgDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
    setDropZoneBgActive(true)
  }
  const onBgDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropZoneBgActive(false)
  }

  const handleLogoUpload = async (e) => {
    const file = e?.target?.files?.[0]
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10MB')
      return
    }
    setUploadingLogo(true)
    try {
      const response = await uploadAPI.uploadFile(file, LANDING_IMAGE_FOLDER)
      const path = parseUploadPath(response)
      if (path) setNested('topBar', 'logoUrl', path)
      else throw new Error('Upload response missing path')
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingLogo(false)
      setDropZoneLogoActive(false)
      if (logoFileRef.current) logoFileRef.current.value = ''
    }
  }

  const onLogoDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropZoneLogoActive(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) handleLogoUpload({ target: { files: [file] } })
  }
  const onLogoDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
    setDropZoneLogoActive(true)
  }
  const onLogoDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropZoneLogoActive(false)
  }

  const handleThumbUpload = async (e) => {
    const file = e?.target?.files?.[0]
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, or SVG)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10MB')
      return
    }
    setUploadingThumb(true)
    try {
      const response = await uploadAPI.uploadFile(file, LANDING_IMAGE_FOLDER)
      const path = parseUploadPath(response)
      if (path) setNested('video', 'thumbnailUrl', path)
      else throw new Error('Upload response missing path')
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingThumb(false)
      setDropZoneThumbActive(false)
      if (thumbFileRef.current) thumbFileRef.current.value = ''
    }
  }

  const onThumbDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropZoneThumbActive(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) handleThumbUpload({ target: { files: [file] } })
  }
  const onThumbDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
    setDropZoneThumbActive(true)
  }
  const onThumbDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropZoneThumbActive(false)
  }

  const logoPath = topBar.logoUrl ?? ''
  const thumbPath = video.thumbnailUrl ?? ''
  const bgPath = d.backgroundImage ?? ''
  const logoPreviewUrl = logoPath && (logoPath.startsWith('/') ? getImageUrl(logoPath) : logoPath)
  const thumbPreviewUrl = thumbPath && (thumbPath.startsWith('/') ? getImageUrl(thumbPath) : thumbPath)
  const bgPreviewUrl = bgPath && (bgPath.startsWith('/') ? getImageUrl(bgPath) : bgPath)

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <h4 className="editor-form-subsection">Background</h4>
      <Row>
        <Field label="Background image">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="file" ref={bgFileRef} accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml" style={{ display: 'none' }} onChange={handleBgUpload} />
            <div
              className={`placement-image-dropzone ${dropZoneBgActive ? 'placement-image-dropzone--active' : ''} ${uploadingBg ? 'placement-image-dropzone--uploading' : ''}`}
              onDragOver={onBgDragOver}
              onDragLeave={onBgDragLeave}
              onDrop={onBgDrop}
              onClick={() => !uploadingBg && bgFileRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !uploadingBg) {
                  e.preventDefault()
                  bgFileRef.current?.click()
                }
              }}
              aria-label="Drag and drop background image here, or click to browse"
            >
              <span className="placement-image-dropzone-text">
                {uploadingBg ? 'Uploading…' : 'Drag and drop background image here, or click to browse'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <button type="button" className="btn-secondary" onClick={(e) => { e.stopPropagation(); bgFileRef.current?.click(); }} disabled={uploadingBg}>
                {uploadingBg ? 'Uploading…' : 'Upload background'}
              </button>
              <input type="text" value={bgPath} onChange={(e) => set('backgroundImage', e.target.value)} placeholder="Or paste image path" style={{ flex: 1, minWidth: 200 }} />
            </div>
            {bgPreviewUrl && (
              <div style={{ marginTop: '4px' }}>
                <img src={bgPreviewUrl} alt="Background preview" style={{ maxWidth: '100%', maxHeight: 140, objectFit: 'cover', border: '1px solid #e2e8f0', borderRadius: 6 }} onError={(e) => { e.target.style.display = 'none' }} />
              </div>
            )}
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>If empty, a solid dark background is used. No gradient.</p>
          </div>
        </Field>
      </Row>

      <h4 className="editor-form-subsection">Top Bar (logo, phone, contact button)</h4>
      <Row>
        <Field label="Logo">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="file" ref={logoFileRef} accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml" style={{ display: 'none' }} onChange={handleLogoUpload} />
            <div
              className={`placement-image-dropzone ${dropZoneLogoActive ? 'placement-image-dropzone--active' : ''} ${uploadingLogo ? 'placement-image-dropzone--uploading' : ''}`}
              onDragOver={onLogoDragOver}
              onDragLeave={onLogoDragLeave}
              onDrop={onLogoDrop}
              onClick={() => !uploadingLogo && logoFileRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !uploadingLogo) {
                  e.preventDefault()
                  logoFileRef.current?.click()
                }
              }}
              aria-label="Drag and drop logo image here, or click to browse"
            >
              <span className="placement-image-dropzone-text">
                {uploadingLogo ? 'Uploading…' : 'Drag and drop logo here, or click to browse'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <button type="button" className="btn-secondary" onClick={(e) => { e.stopPropagation(); logoFileRef.current?.click(); }} disabled={uploadingLogo}>
                {uploadingLogo ? 'Uploading…' : 'Upload logo'}
              </button>
              <input type="text" value={logoPath} onChange={(e) => setNested('topBar', 'logoUrl', e.target.value)} placeholder="/images/Logo (1).webp" style={{ flex: 1, minWidth: 200 }} />
            </div>
            {logoPreviewUrl && (
              <div style={{ marginTop: '4px' }}>
                <img src={logoPreviewUrl} alt="Logo preview" style={{ maxHeight: 60, objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: 6 }} onError={(e) => { e.target.style.display = 'none' }} />
              </div>
            )}
          </div>
        </Field>
      </Row>
      <Row><Field label="Tagline"><input type="text" value={topBar.tagline ?? ''} onChange={(e) => setNested('topBar', 'tagline', e.target.value)} placeholder="IT Training | Placements | Consulting" /></Field></Row>
      <RowTwo>
        <Field label="Phone"><input type="text" value={topBar.phone ?? ''} onChange={(e) => setNested('topBar', 'phone', e.target.value)} placeholder="8766996944" /></Field>
        <Field label="Contact button text"><input type="text" value={topBar.contactButtonText ?? ''} onChange={(e) => setNested('topBar', 'contactButtonText', e.target.value)} placeholder="Contact Us" /></Field>
      </RowTwo>
      <Row><Field label="Contact button URL"><input type="text" value={topBar.contactButtonHref ?? ''} onChange={(e) => setNested('topBar', 'contactButtonHref', e.target.value)} placeholder="/contact" /></Field></Row>

      <h4 className="editor-form-subsection">Event Bar (date & time)</h4>
      <RowTwo>
        <Field label="Event date"><input type="text" value={eventBar.date ?? ''} onChange={(e) => setNested('eventBar', 'date', e.target.value)} placeholder="8th November" /></Field>
        <Field label="Event time"><input type="text" value={eventBar.time ?? ''} onChange={(e) => setNested('eventBar', 'time', e.target.value)} placeholder="08:30 AM" /></Field>
      </RowTwo>

      <h4 className="editor-form-subsection">Headline</h4>
      <Row><Field label="Main headline"><textarea value={d.headline ?? ''} onChange={(e) => set('headline', e.target.value)} rows={2} placeholder="Become a Salesforce Developer in 90 Days & Land a ₹5-22 LPA IT Job." /></Field></Row>
      <RowTwo>
        <Field label="Accent phrase 1 (highlighted)"><input type="text" value={d.headlineAccent1 ?? ''} onChange={(e) => set('headlineAccent1', e.target.value)} placeholder="90 Days" /></Field>
        <Field label="Accent phrase 2 (highlighted)"><input type="text" value={d.headlineAccent2 ?? ''} onChange={(e) => set('headlineAccent2', e.target.value)} placeholder="₹5-22 LPA IT Job" /></Field>
      </RowTwo>
      <Row><Field label="Sub-headline"><input type="text" value={d.subHeadline ?? ''} onChange={(e) => set('subHeadline', e.target.value)} placeholder="Even if You're from Non-IT." /></Field></Row>
      <Row><Field label="Supporting text"><textarea value={d.supportingText ?? ''} onChange={(e) => set('supportingText', e.target.value)} rows={2} placeholder="Join 1200+ students who transformed their career..." /></Field></Row>

      <h4 className="editor-form-subsection">Stats (circles)</h4>
      <AddRemoveRow
        items={stats}
        onAdd={addStat}
        onRemove={removeStat}
        addLabel="+ Add stat"
        renderRow={(item, i) => (
          <RowTwo>
            <Field label="Value"><input type="text" value={item.value ?? ''} onChange={(e) => setStat(i, 'value', e.target.value)} placeholder="2000+" /></Field>
            <Field label="Label"><input type="text" value={item.label ?? ''} onChange={(e) => setStat(i, 'label', e.target.value)} placeholder="Students Placed" /></Field>
          </RowTwo>
        )}
      />

      <h4 className="editor-form-subsection">Video</h4>
      <Row>
        <Field label="Video thumbnail">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="file" ref={thumbFileRef} accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml" style={{ display: 'none' }} onChange={handleThumbUpload} />
            <div
              className={`placement-image-dropzone ${dropZoneThumbActive ? 'placement-image-dropzone--active' : ''} ${uploadingThumb ? 'placement-image-dropzone--uploading' : ''}`}
              onDragOver={onThumbDragOver}
              onDragLeave={onThumbDragLeave}
              onDrop={onThumbDrop}
              onClick={() => !uploadingThumb && thumbFileRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !uploadingThumb) {
                  e.preventDefault()
                  thumbFileRef.current?.click()
                }
              }}
              aria-label="Drag and drop video thumbnail here, or click to browse"
            >
              <span className="placement-image-dropzone-text">
                {uploadingThumb ? 'Uploading…' : 'Drag and drop thumbnail here, or click to browse'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <button type="button" className="btn-secondary" onClick={(e) => { e.stopPropagation(); thumbFileRef.current?.click(); }} disabled={uploadingThumb}>
                {uploadingThumb ? 'Uploading…' : 'Upload thumbnail'}
              </button>
              <input type="text" value={thumbPath} onChange={(e) => setNested('video', 'thumbnailUrl', e.target.value)} placeholder="Or paste image URL" style={{ flex: 1, minWidth: 200 }} />
            </div>
            {thumbPreviewUrl && (
              <div style={{ marginTop: '4px' }}>
                <img src={thumbPreviewUrl} alt="Thumbnail preview" style={{ maxWidth: '100%', maxHeight: 180, objectFit: 'cover', border: '1px solid #e2e8f0', borderRadius: 6 }} onError={(e) => { e.target.style.display = 'none' }} />
              </div>
            )}
          </div>
        </Field>
      </Row>
      <Row><Field label="Video URL (YouTube, etc.)"><input type="text" value={video.videoUrl ?? ''} onChange={(e) => setNested('video', 'videoUrl', e.target.value)} placeholder="https://..." /></Field></Row>

      <h4 className="editor-form-subsection">Call to Action Button</h4>
      <Row><Field label="Button text"><input type="text" value={cta.buttonText ?? ''} onChange={(e) => setNested('cta', 'buttonText', e.target.value)} placeholder="Register for a free 3-day Masterclass" /></Field></Row>
      <Row><Field label="Button text accent (optional highlight)"><input type="text" value={cta.buttonTextAccent ?? ''} onChange={(e) => setNested('cta', 'buttonTextAccent', e.target.value)} placeholder="3-day Masterclass" /></Field></Row>
      <Row><Field label="Button URL"><input type="text" value={cta.buttonHref ?? ''} onChange={(e) => setNested('cta', 'buttonHref', e.target.value)} placeholder="#register" /></Field></Row>

      <div className="editor-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update section'}</button>
      </div>
    </form>
  )
}
