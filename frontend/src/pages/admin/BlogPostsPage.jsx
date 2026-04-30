import { useEffect, useState, useRef } from 'react'
import { blogPostsAPI, uploadAPI, getImageUrl } from '../../services/api'
import './AdminPage.css'

const CATEGORY_PRESETS = [
  'Development (Apex/LWC)',
  'Admin & Reports',
  'Training & Career',
  'Clouds & AI',
]

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  category: 'Development (Apex/LWC)',
  publishedAt: '',
  isPublished: true,
}

function toDatetimeLocal(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function fromDatetimeLocal(local) {
  if (!local) return new Date().toISOString()
  const d = new Date(local)
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}

function BlogPostsPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)

  const fetchPosts = async () => {
    try {
      const res = await blogPostsAPI.getAllAdmin()
      setPosts(Array.isArray(res.data) ? res.data : [])
    } catch (e) {
      console.error(e)
      alert(e.message || 'Failed to load blog posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const resetForm = () => {
    setFormData(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title?.trim()) {
      alert('Title is required')
      return
    }
    const payload = {
      title: formData.title.trim(),
      excerpt: formData.excerpt || '',
      content: formData.content || '',
      featuredImage: formData.featuredImage || '',
      category: formData.category?.trim() || '',
      isPublished: !!formData.isPublished,
      publishedAt: fromDatetimeLocal(formData.publishedAt),
    }
    const s = formData.slug?.trim()
    if (s) payload.slug = s
    try {
      if (editingId) {
        await blogPostsAPI.update(editingId, payload)
      } else {
        await blogPostsAPI.create(payload)
      }
      await fetchPosts()
      resetForm()
      alert(editingId ? 'Post updated' : 'Post created')
    } catch (err) {
      alert(err.message || 'Save failed')
    }
  }

  const handleEdit = (post) => {
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      featuredImage: post.featuredImage || '',
      category: post.category || CATEGORY_PRESETS[0],
      publishedAt: toDatetimeLocal(post.publishedAt),
      isPublished: post.isPublished !== false,
    })
    setEditingId(post._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    try {
      await blogPostsAPI.delete(id)
      await fetchPosts()
      if (editingId === id) resetForm()
    } catch (e) {
      alert(e.message || 'Delete failed')
    }
  }

  const uploadFeatured = async (file) => {
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      alert('Please upload an image (PNG, JPG, GIF, WEBP, SVG)')
      return
    }
    setUploadingImage(true)
    try {
      const response = await uploadAPI.uploadFile(file, 'images/blog')
      const path =
        response?.data?.path || response?.path || (response?.success && response?.data?.path) || ''
      if (!path) throw new Error('Upload response missing path')
      setFormData((f) => ({ ...f, featuredImage: path }))
    } catch (err) {
      alert(err.message || 'Upload failed')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Loading blog posts…</div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2>Blog posts</h2>
        <button type="button" className="btn-primary" onClick={() => { setShowForm(true); setEditingId(null); setFormData(emptyForm) }}>
          + New post
        </button>
      </div>
      <p className="admin-form-help" style={{ marginBottom: 20 }}>
        Public URL: <code>/blog/your-slug</code> (e.g. <code>/blog/types-of-reports-in-salesforce-2025</code>). Use <strong>Full article</strong> for HTML (headings, lists, links). Slug is auto-generated from title if left empty.
      </p>

      {showForm && (
        <form onSubmit={handleSubmit} className="editor-form" style={{ marginBottom: 32, padding: 20, border: '1px solid #e2e8f0', borderRadius: 12 }}>
          <h3>{editingId ? 'Edit post' : 'New post'}</h3>
          <div className="editor-form-row">
            <div className="editor-field">
              <label>Title *</label>
              <input value={formData.title} onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))} required />
            </div>
          </div>
          <div className="editor-form-row">
            <div className="editor-field">
              <label>Slug (URL)</label>
              <input value={formData.slug} onChange={(e) => setFormData((f) => ({ ...f, slug: e.target.value }))} placeholder="auto from title if empty" />
            </div>
          </div>
          <div className="editor-form-row editor-form-row--two">
            <div className="editor-field">
              <label>Category</label>
              <input list="blog-category-presets" value={formData.category} onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))} />
              <datalist id="blog-category-presets">
                {CATEGORY_PRESETS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div className="editor-field">
              <label>Published at</label>
              <input type="datetime-local" value={formData.publishedAt} onChange={(e) => setFormData((f) => ({ ...f, publishedAt: e.target.value }))} />
            </div>
          </div>
          <div className="editor-form-row">
            <div className="editor-field">
              <label>Excerpt (card summary)</label>
              <textarea rows={3} value={formData.excerpt} onChange={(e) => setFormData((f) => ({ ...f, excerpt: e.target.value }))} />
            </div>
          </div>
          <div className="editor-form-row">
            <div className="editor-field">
              <label>Featured image</label>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => uploadFeatured(e.target.files?.[0])} />
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <button type="button" className="btn-secondary" disabled={uploadingImage} onClick={() => fileInputRef.current?.click()}>
                  {uploadingImage ? 'Uploading…' : 'Upload'}
                </button>
                <input style={{ flex: 1, minWidth: 200 }} value={formData.featuredImage} onChange={(e) => setFormData((f) => ({ ...f, featuredImage: e.target.value }))} placeholder="/images/..." />
                {formData.featuredImage ? (
                  <img src={getImageUrl(formData.featuredImage.startsWith('/') ? formData.featuredImage : `/${formData.featuredImage}`)} alt="" style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 6 }} />
                ) : null}
              </div>
            </div>
          </div>
          <div className="editor-form-row">
            <div className="editor-field">
              <label>Full article (HTML)</label>
              <textarea rows={14} value={formData.content} onChange={(e) => setFormData((f) => ({ ...f, content: e.target.value }))} placeholder="<p>Your article…</p>" />
            </div>
          </div>
          <div className="editor-form-row">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData((f) => ({ ...f, isPublished: e.target.checked }))} />
              Published (visible on site)
            </label>
          </div>
          <div className="editor-form-actions">
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Category</th>
              <th>Published</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5}>No posts yet. Create one above.</td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td><code>{p.slug}</code></td>
                  <td>{p.category || '—'}</td>
                  <td>{p.isPublished ? 'Yes' : 'No'}</td>
                  <td>
                    <button type="button" className="btn-secondary" style={{ marginRight: 8 }} onClick={() => handleEdit(p)}>Edit</button>
                    <button type="button" className="editor-remove-row" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#b91c1c' }} onClick={() => handleDelete(p._id)}>Delete</button>
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

export default BlogPostsPage
