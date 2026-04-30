import { useEffect, useState } from 'react'
import { footerSettingsAPI, uploadAPI, getImageUrl } from '../../services/api'
import './AdminPage.css'

const DEFAULT_FOOTER_FORM = {
  brand: {
    name: 'Cloud Intellect',
    tagline: 'IT Training | Placement | Consulting',
    description: "India's #1 Salesforce training institute, empowering careers since 2012.",
    logoImage: '',
  },
  contact: {
    locationText: 'Nagpur & Pune Centers',
    email: 'info@cloudintellect.in',
    phone: '+91 98765 43210',
  },
  socialLinks: [
    { platform: 'linkedin', href: '#', isActive: true },
    { platform: 'instagram', href: '#', isActive: true },
    { platform: 'facebook', href: '#', isActive: true },
    { platform: 'youtube', href: '#', isActive: true },
  ],
  columns: [
    {
      title: 'Institute',
      order: 0,
      isActive: true,
      links: [
        { label: 'Home Page', href: '/', order: 0, isActive: true },
        { label: 'About Us', href: '/about', order: 1, isActive: true },
        { label: 'Why Choose Cloud Intellect', href: '/why-choose-us', order: 2, isActive: true },
        { label: 'Leadership', href: '/leadership', order: 3, isActive: true },
        { label: 'Contact Us', href: '/contact', order: 4, isActive: true },
        { label: 'FAQ', href: '/faq', order: 5, isActive: true },
      ],
    },
    {
      title: 'Programs',
      order: 1,
      isActive: true,
      links: [
        { label: 'Salesforce Developer', href: '/salesforce-developer', order: 0, isActive: true },
        { label: 'Salesforce Marketing Cloud', href: '/salesforce-marketing-cloud', order: 1, isActive: true },
        { label: 'SFDC & SFMC', href: '/sfmc-sfdc', order: 2, isActive: true },
      ],
    },
    {
      title: 'Resources',
      order: 2,
      isActive: true,
      links: [
        { label: 'Placement', href: '/placements', order: 0, isActive: true },
        { label: 'Alumni Success', href: '/alumni-success', order: 1, isActive: true },
        { label: 'Testimonials', href: '/testimonials', order: 2, isActive: true },
        { label: 'Webinar', href: '/webinars', order: 3, isActive: true },
        { label: 'Blog', href: '#', order: 4, isActive: true },
        { label: 'Gallery', href: '/gallery', order: 5, isActive: true },
      ],
    },
  ],
  bottomBar: {
    copyrightText: '© 2026 Cloud Intellect. All rights reserved.',
    creditText: 'Design & Developed by Medisign',
  },
}

const FooterSettingsPage = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [formData, setFormData] = useState(DEFAULT_FOOTER_FORM)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await footerSettingsAPI.get()
      if (res?.success && res.data) {
        const socialLinks = Array.isArray(res.data.socialLinks) && res.data.socialLinks.length > 0
          ? res.data.socialLinks
          : DEFAULT_FOOTER_FORM.socialLinks
        const columns = Array.isArray(res.data.columns) && res.data.columns.length > 0
          ? res.data.columns
          : DEFAULT_FOOTER_FORM.columns

        setFormData({
          ...DEFAULT_FOOTER_FORM,
          ...res.data,
          brand: { ...DEFAULT_FOOTER_FORM.brand, ...(res.data.brand || {}) },
          contact: { ...DEFAULT_FOOTER_FORM.contact, ...(res.data.contact || {}) },
          bottomBar: { ...DEFAULT_FOOTER_FORM.bottomBar, ...(res.data.bottomBar || {}) },
          socialLinks,
          columns,
        })
      }
    } catch (e) {
      console.error('Failed to load footer settings:', e)
      alert('Failed to load footer settings')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await footerSettingsAPI.update(formData)
      alert('Footer settings updated successfully')
      fetchSettings()
    } catch (err) {
      alert(err.message || 'Failed to update footer settings')
    } finally {
      setSaving(false)
    }
  }

  const setBrand = (key, value) => setFormData((p) => ({ ...p, brand: { ...(p.brand || {}), [key]: value } }))
  const setContact = (key, value) => setFormData((p) => ({ ...p, contact: { ...(p.contact || {}), [key]: value } }))
  const setBottom = (key, value) => setFormData((p) => ({ ...p, bottomBar: { ...(p.bottomBar || {}), [key]: value } }))

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowedImageTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
    if (!allowedImageTypes.includes(file.type)) {
      alert('Please upload an image file (SVG, PNG, JPG, GIF, or WEBP)')
      return
    }
    setUploadingLogo(true)
    try {
      const response = await uploadAPI.uploadFile(file, 'images/footer')
      const imagePath = response?.data?.path || response?.path || ''
      if (!imagePath) throw new Error('Upload response missing image path')
      setBrand('logoImage', imagePath)
    } catch (err) {
      alert(err.message || 'Failed to upload logo')
    } finally {
      setUploadingLogo(false)
      e.target.value = ''
    }
  }

  const updateSocial = (i, key, value) => {
    setFormData((p) => ({
      ...p,
      socialLinks: (p.socialLinks || []).map((s, idx) => (idx === i ? { ...(s || {}), [key]: value } : s)),
    }))
  }

  const addSocial = () => {
    setFormData((p) => ({
      ...p,
      socialLinks: [...(p.socialLinks || []), { platform: 'linkedin', href: '', isActive: true }],
    }))
  }

  const removeSocial = (i) => {
    setFormData((p) => ({
      ...p,
      socialLinks: (p.socialLinks || []).filter((_, idx) => idx !== i),
    }))
  }

  const addColumn = () => setFormData((p) => ({
    ...p,
    columns: [...(p.columns || []), { title: '', order: (p.columns || []).length, isActive: true, links: [] }],
  }))

  const updateColumn = (i, key, value) => {
    setFormData((p) => ({
      ...p,
      columns: (p.columns || []).map((c, idx) => (idx === i ? { ...(c || {}), [key]: value } : c)),
    }))
  }

  const removeColumn = (i) => setFormData((p) => ({
    ...p,
    columns: (p.columns || []).filter((_, idx) => idx !== i),
  }))

  const addLink = (colIndex) => {
    setFormData((p) => ({
      ...p,
      columns: (p.columns || []).map((c, i) => {
        if (i !== colIndex) return c
        const links = Array.isArray(c.links) ? c.links : []
        return { ...c, links: [...links, { label: '', href: '/', order: links.length, isActive: true }] }
      }),
    }))
  }

  const updateLink = (colIndex, linkIndex, key, value) => {
    setFormData((p) => ({
      ...p,
      columns: (p.columns || []).map((c, i) => {
        if (i !== colIndex) return c
        const links = Array.isArray(c.links) ? c.links : []
        return { ...c, links: links.map((l, li) => (li === linkIndex ? { ...(l || {}), [key]: value } : l)) }
      }),
    }))
  }

  const removeLink = (colIndex, linkIndex) => {
    setFormData((p) => ({
      ...p,
      columns: (p.columns || []).map((c, i) => {
        if (i !== colIndex) return c
        const links = Array.isArray(c.links) ? c.links : []
        return { ...c, links: links.filter((_, li) => li !== linkIndex) }
      }),
    }))
  }

  if (loading) return <div className="admin-loading">Loading footer settings...</div>

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Footer Settings</h2>
        <p>Manage footer content (brand, contact, links, socials)</p>
      </div>

      <form onSubmit={onSubmit} className="header-settings-form">
        <section className="settings-section">
          <h3>Brand</h3>
          <div className="form-group">
            <label>Brand name</label>
            <input value={formData.brand?.name || ''} onChange={(e) => setBrand('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Tagline</label>
            <input value={formData.brand?.tagline || ''} onChange={(e) => setBrand('tagline', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={3} value={formData.brand?.description || ''} onChange={(e) => setBrand('description', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Logo image URL/path (optional)</label>
            <input value={formData.brand?.logoImage || ''} onChange={(e) => setBrand('logoImage', e.target.value)} placeholder="/images/logo.svg" />
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <label className="btn-secondary" style={{ cursor: uploadingLogo ? 'not-allowed' : 'pointer', opacity: uploadingLogo ? 0.7 : 1 }}>
                {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                <input
                  type="file"
                  accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  style={{ display: 'none' }}
                />
              </label>
              {formData.brand?.logoImage ? (
                <img
                  src={getImageUrl(formData.brand.logoImage)}
                  alt=""
                  style={{ height: 40, objectFit: 'contain', background: '#fff', borderRadius: 6, padding: 4 }}
                />
              ) : null}
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h3>Contact</h3>
          <div className="form-group">
            <label>Location text</label>
            <input value={formData.contact?.locationText || ''} onChange={(e) => setContact('locationText', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={formData.contact?.email || ''} onChange={(e) => setContact('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={formData.contact?.phone || ''} onChange={(e) => setContact('phone', e.target.value)} />
          </div>
        </section>

        <section className="settings-section">
          <h3>Social links</h3>
          {(formData.socialLinks || []).map((s, i) => (
            <div key={i} className="nav-item-form">
              <div className="form-row">
                <select value={s.platform} onChange={(e) => updateSocial(i, 'platform', e.target.value)}>
                  <option value="linkedin">LinkedIn</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="youtube">YouTube</option>
                  <option value="twitter">Twitter/X</option>
                </select>
                <input value={s.href || ''} onChange={(e) => updateSocial(i, 'href', e.target.value)} placeholder="https://..." />
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={s.isActive !== false} onChange={(e) => updateSocial(i, 'isActive', e.target.checked)} />
                  Active
                </label>
                <button type="button" className="btn-danger" onClick={() => removeSocial(i)}>Remove</button>
              </div>
            </div>
          ))}
          <button type="button" className="btn-secondary" onClick={addSocial}>+ Add social link</button>
        </section>

        <section className="settings-section">
          <h3>Footer columns</h3>
          {(formData.columns || []).map((col, i) => (
            <div key={i} className="nav-item-form">
              <div className="nav-item-header">
                <h4>Column {i + 1}</h4>
                <button type="button" onClick={() => removeColumn(i)} className="btn-danger">Remove</button>
              </div>
              <div className="form-row">
                <input value={col.title || ''} onChange={(e) => updateColumn(i, 'title', e.target.value)} placeholder="Column title" />
                <input type="number" value={col.order ?? i} onChange={(e) => updateColumn(i, 'order', Number(e.target.value))} placeholder="Order" />
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={col.isActive !== false} onChange={(e) => updateColumn(i, 'isActive', e.target.checked)} />
                  Active
                </label>
              </div>
              <div style={{ marginTop: 10 }}>
                <button type="button" className="btn-secondary" onClick={() => addLink(i)}>+ Add link</button>
              </div>
              {(col.links || []).map((l, li) => (
                <div key={li} className="form-row" style={{ marginTop: 10 }}>
                  <input value={l.label || ''} onChange={(e) => updateLink(i, li, 'label', e.target.value)} placeholder="Label" />
                  <input value={l.href || ''} onChange={(e) => updateLink(i, li, 'href', e.target.value)} placeholder="/path or https://..." />
                  <input type="number" value={l.order ?? li} onChange={(e) => updateLink(i, li, 'order', Number(e.target.value))} placeholder="Order" />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" checked={l.isActive !== false} onChange={(e) => updateLink(i, li, 'isActive', e.target.checked)} />
                    Active
                  </label>
                  <button type="button" className="btn-danger" onClick={() => removeLink(i, li)}>Remove</button>
                </div>
              ))}
            </div>
          ))}
          <button type="button" className="btn-secondary" onClick={addColumn}>+ Add column</button>
        </section>

        <section className="settings-section">
          <h3>Bottom bar</h3>
          <div className="form-group">
            <label>Copyright</label>
            <input value={formData.bottomBar?.copyrightText || ''} onChange={(e) => setBottom('copyrightText', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Credit</label>
            <input value={formData.bottomBar?.creditText || ''} onChange={(e) => setBottom('creditText', e.target.value)} />
          </div>
        </section>

        <div className="editor-form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Update footer settings'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FooterSettingsPage

