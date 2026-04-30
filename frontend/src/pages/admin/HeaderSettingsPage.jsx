import { useEffect, useState } from 'react'
import { headerSettingsAPI } from '../../services/api'
import './AdminPage.css'

const HeaderSettingsPage = () => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    registerButton: { text: 'REGISTER NOW', link: '#', isActive: true },
    whatsapp: { text: 'WhatsApp', link: '#', isActive: true },
    callUs: { text: 'Call Us', link: '#', isActive: true },
    socialLinks: [],
    mainNavItems: [],
    loginButton: { text: 'Login Portals', link: '#', hasDropdown: false, dropdownItems: [], isActive: true },
    helpline: { label: 'Admission Helpline', phoneNumber: '+91 8766 9969 44', link: '#', isActive: true },
    secondaryNavItems: []
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await headerSettingsAPI.get()
      if (response.success && response.data) {
        setSettings(response.data)
        setFormData({
          registerButton: response.data.registerButton || formData.registerButton,
          whatsapp: response.data.whatsapp || formData.whatsapp,
          callUs: response.data.callUs || formData.callUs,
          socialLinks: response.data.socialLinks || [],
          mainNavItems: (response.data.mainNavItems || []).map(item => ({
            ...item,
            dropdownItems: item.dropdownItems || [],
            showOnHomePageOnly: item.showOnHomePageOnly || false
          })),
          loginButton: {
            ...(response.data.loginButton || formData.loginButton),
            hasDropdown: response.data.loginButton?.hasDropdown || false,
            dropdownItems: response.data.loginButton?.dropdownItems || []
          },
          helpline: response.data.helpline || formData.helpline,
          secondaryNavItems: (response.data.secondaryNavItems || []).map(item => ({
            ...item,
            dropdownItems: item.dropdownItems || [],
            showOnHomePageOnly: item.showOnHomePageOnly || false
          }))
        })
      }
    } catch (error) {
      console.error('Error fetching header settings:', error)
      alert('Failed to load header settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await headerSettingsAPI.update(formData)
      alert('Header settings updated successfully')
      fetchSettings()
    } catch (error) {
      alert(error.message || 'Failed to update header settings')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const addNavItem = (type) => {
    const newItem = {
      label: '',
      href: '#',
      hasDropdown: false,
      dropdownItems: [],
      showOnHomePageOnly: false,
      order: formData[type].length,
      isActive: true
    }
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], newItem]
    }))
  }

  const addDropdownItem = (type, navIndex) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => 
        i === navIndex 
          ? { 
              ...item, 
              dropdownItems: [...(item.dropdownItems || []), { label: '', href: '#', order: (item.dropdownItems || []).length, isActive: true }]
            }
          : item
      )
    }))
  }

  const updateDropdownItem = (type, navIndex, dropdownIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => 
        i === navIndex 
          ? {
              ...item,
              dropdownItems: (item.dropdownItems || []).map((dropdownItem, di) =>
                di === dropdownIndex ? { ...dropdownItem, [field]: value } : dropdownItem
              )
            }
          : item
      )
    }))
  }

  const removeDropdownItem = (type, navIndex, dropdownIndex) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => 
        i === navIndex 
          ? {
              ...item,
              dropdownItems: (item.dropdownItems || []).filter((_, di) => di !== dropdownIndex)
            }
          : item
      )
    }))
  }

  const updateNavItem = (type, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const removeNavItem = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: 'facebook', url: '', isActive: true }]
    }))
  }

  const updateSocialLink = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }))
  }

  const removeSocialLink = (index) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }))
  }

  if (loading) {
    return <div className="admin-loading">Loading header settings...</div>
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Header Settings</h2>
        <p>Manage all header content including navigation, buttons, and links</p>
      </div>

      <form onSubmit={handleSubmit} className="header-settings-form">
        {/* Top Bar Settings */}
        <section className="settings-section">
          <h3>Top Bar Settings</h3>
          
          <div className="form-group">
            <label>Register Button</label>
            <div className="form-row">
              <input
                type="text"
                value={formData.registerButton.text}
                onChange={(e) => updateField('registerButton', 'text', e.target.value)}
                placeholder="Button Text"
              />
              <input
                type="url"
                value={formData.registerButton.link}
                onChange={(e) => updateField('registerButton', 'link', e.target.value)}
                placeholder="Button Link"
              />
              <label>
                <input
                  type="checkbox"
                  checked={formData.registerButton.isActive}
                  onChange={(e) => updateField('registerButton', 'isActive', e.target.checked)}
                />
                Active
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>WhatsApp</label>
            <div className="form-row">
              <input
                type="text"
                value={formData.whatsapp.text}
                onChange={(e) => updateField('whatsapp', 'text', e.target.value)}
                placeholder="Link Text"
              />
              <input
                type="url"
                value={formData.whatsapp.link}
                onChange={(e) => updateField('whatsapp', 'link', e.target.value)}
                placeholder="WhatsApp Link"
              />
              <label>
                <input
                  type="checkbox"
                  checked={formData.whatsapp.isActive}
                  onChange={(e) => updateField('whatsapp', 'isActive', e.target.checked)}
                />
                Active
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Call Us</label>
            <div className="form-row">
              <input
                type="text"
                value={formData.callUs.text}
                onChange={(e) => updateField('callUs', 'text', e.target.value)}
                placeholder="Link Text"
              />
              <input
                type="url"
                value={formData.callUs.link}
                onChange={(e) => updateField('callUs', 'link', e.target.value)}
                placeholder="Call Link"
              />
              <label>
                <input
                  type="checkbox"
                  checked={formData.callUs.isActive}
                  onChange={(e) => updateField('callUs', 'isActive', e.target.checked)}
                />
                Active
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Social Media Links</label>
            {formData.socialLinks.map((link, index) => (
              <div key={index} className="form-row" style={{ marginBottom: '10px' }}>
                <select
                  value={link.platform}
                  onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                >
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                </select>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                  placeholder="Social Media URL"
                />
                <label>
                  <input
                    type="checkbox"
                    checked={link.isActive}
                    onChange={(e) => updateSocialLink(index, 'isActive', e.target.checked)}
                  />
                  Active
                </label>
                <button type="button" onClick={() => removeSocialLink(index)} className="btn-delete">
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addSocialLink} className="btn-secondary">
              + Add Social Link
            </button>
          </div>
        </section>

        {/* Main Navigation */}
        <section className="settings-section">
          <h3>Main Navigation</h3>
          
          {formData.mainNavItems.map((item, index) => (
            <div key={index} className="form-group" style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <div className="form-row">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateNavItem('mainNavItems', index, 'label', e.target.value)}
                  placeholder="Menu Label"
                />
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => updateNavItem('mainNavItems', index, 'href', e.target.value)}
                  placeholder="Link URL"
                />
                <input
                  type="number"
                  value={item.order}
                  onChange={(e) => updateNavItem('mainNavItems', index, 'order', parseInt(e.target.value) || 0)}
                  placeholder="Order"
                  style={{ width: '80px' }}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={item.hasDropdown || false}
                    onChange={(e) => updateNavItem('mainNavItems', index, 'hasDropdown', e.target.checked)}
                  />
                  Has Dropdown
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={item.showOnHomePageOnly || false}
                    onChange={(e) => updateNavItem('mainNavItems', index, 'showOnHomePageOnly', e.target.checked)}
                  />
                  HomePage Only
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={item.isActive}
                    onChange={(e) => updateNavItem('mainNavItems', index, 'isActive', e.target.checked)}
                  />
                  Active
                </label>
                <button type="button" onClick={() => removeNavItem('mainNavItems', index)} className="btn-delete">
                  Remove
                </button>
              </div>
              
              {item.hasDropdown && (
                <div style={{ marginTop: '16px', paddingLeft: '20px', borderLeft: '3px solid #667eea' }}>
                  <label style={{ fontWeight: 600, marginBottom: '12px', display: 'block' }}>Dropdown Items:</label>
                  {(item.dropdownItems || []).map((dropdownItem, dIndex) => (
                    <div key={dIndex} className="form-row" style={{ marginBottom: '10px' }}>
                      <input
                        type="text"
                        value={dropdownItem.label}
                        onChange={(e) => updateDropdownItem('mainNavItems', index, dIndex, 'label', e.target.value)}
                        placeholder="Dropdown Label"
                        style={{ flex: 1 }}
                      />
                      <input
                        type="text"
                        value={dropdownItem.href}
                        onChange={(e) => updateDropdownItem('mainNavItems', index, dIndex, 'href', e.target.value)}
                        placeholder="Dropdown Link"
                        style={{ flex: 1 }}
                      />
                      <input
                        type="number"
                        value={dropdownItem.order}
                        onChange={(e) => updateDropdownItem('mainNavItems', index, dIndex, 'order', parseInt(e.target.value) || 0)}
                        placeholder="Order"
                        style={{ width: '80px' }}
                      />
                      <label>
                        <input
                          type="checkbox"
                          checked={dropdownItem.isActive}
                          onChange={(e) => updateDropdownItem('mainNavItems', index, dIndex, 'isActive', e.target.checked)}
                        />
                        Active
                      </label>
                      <button type="button" onClick={() => removeDropdownItem('mainNavItems', index, dIndex)} className="btn-delete">
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addDropdownItem('mainNavItems', index)} className="btn-secondary" style={{ marginTop: '8px' }}>
                    + Add Dropdown Item
                  </button>
                </div>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addNavItem('mainNavItems')} className="btn-secondary">
            + Add Main Nav Item
          </button>

          <div className="form-group" style={{ marginTop: '20px' }}>
            <label>Login Button</label>
            <div className="form-row">
              <input
                type="text"
                value={formData.loginButton.text}
                onChange={(e) => updateField('loginButton', 'text', e.target.value)}
                placeholder="Button Text"
              />
              <input
                type="url"
                value={formData.loginButton.link}
                onChange={(e) => updateField('loginButton', 'link', e.target.value)}
                placeholder="Button Link"
                disabled={formData.loginButton.hasDropdown}
              />
              <label>
                <input
                  type="checkbox"
                  checked={formData.loginButton.hasDropdown}
                  onChange={(e) => updateField('loginButton', 'hasDropdown', e.target.checked)}
                />
                Has Dropdown
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formData.loginButton.isActive}
                  onChange={(e) => updateField('loginButton', 'isActive', e.target.checked)}
                />
                Active
              </label>
            </div>
            
            {formData.loginButton.hasDropdown && (
              <div style={{ marginTop: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <strong>Dropdown Items</strong>
                  <button
                    type="button"
                    onClick={() => {
                      const newItem = {
                        label: '',
                        href: '#',
                        order: formData.loginButton.dropdownItems.length,
                        isActive: true
                      }
                      setFormData(prev => ({
                        ...prev,
                        loginButton: {
                          ...prev.loginButton,
                          dropdownItems: [...prev.loginButton.dropdownItems, newItem]
                        }
                      }))
                    }}
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    Add Dropdown Item
                  </button>
                </div>
                {formData.loginButton.dropdownItems.map((item, index) => (
                  <div key={index} className="form-row" style={{ marginBottom: '10px' }}>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          loginButton: {
                            ...prev.loginButton,
                            dropdownItems: prev.loginButton.dropdownItems.map((it, i) =>
                              i === index ? { ...it, label: e.target.value } : it
                            )
                          }
                        }))
                      }}
                      placeholder="Label"
                    />
                    <input
                      type="url"
                      value={item.href}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          loginButton: {
                            ...prev.loginButton,
                            dropdownItems: prev.loginButton.dropdownItems.map((it, i) =>
                              i === index ? { ...it, href: e.target.value } : it
                            )
                          }
                        }))
                      }}
                      placeholder="Link"
                    />
                    <input
                      type="number"
                      value={item.order}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          loginButton: {
                            ...prev.loginButton,
                            dropdownItems: prev.loginButton.dropdownItems.map((it, i) =>
                              i === index ? { ...it, order: parseInt(e.target.value) || 0 } : it
                            )
                          }
                        }))
                      }}
                      placeholder="Order"
                      style={{ width: '80px' }}
                    />
                    <label>
                      <input
                        type="checkbox"
                        checked={item.isActive}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            loginButton: {
                              ...prev.loginButton,
                              dropdownItems: prev.loginButton.dropdownItems.map((it, i) =>
                                i === index ? { ...it, isActive: e.target.checked } : it
                              )
                            }
                          }))
                        }}
                      />
                      Active
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          loginButton: {
                            ...prev.loginButton,
                            dropdownItems: prev.loginButton.dropdownItems.filter((_, i) => i !== index)
                          }
                        }))
                      }}
                      style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Admission Helpline</label>
            <div className="form-row">
              <input
                type="text"
                value={formData.helpline.label}
                onChange={(e) => updateField('helpline', 'label', e.target.value)}
                placeholder="Label Text"
              />
              <input
                type="tel"
                value={formData.helpline.phoneNumber}
                onChange={(e) => updateField('helpline', 'phoneNumber', e.target.value)}
                placeholder="Phone Number"
              />
              <input
                type="url"
                value={formData.helpline.link}
                onChange={(e) => updateField('helpline', 'link', e.target.value)}
                placeholder="Link URL"
              />
              <label>
                <input
                  type="checkbox"
                  checked={formData.helpline.isActive}
                  onChange={(e) => updateField('helpline', 'isActive', e.target.checked)}
                />
                Active
              </label>
            </div>
          </div>
        </section>

        {/* Secondary Navigation */}
        <section className="settings-section">
          <h3>Secondary Navigation</h3>
          
          {formData.secondaryNavItems.map((item, index) => (
            <div key={index} className="form-group" style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <div className="form-row">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateNavItem('secondaryNavItems', index, 'label', e.target.value)}
                  placeholder="Menu Label"
                />
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => updateNavItem('secondaryNavItems', index, 'href', e.target.value)}
                  placeholder="Link URL"
                />
                <input
                  type="number"
                  value={item.order}
                  onChange={(e) => updateNavItem('secondaryNavItems', index, 'order', parseInt(e.target.value) || 0)}
                  placeholder="Order"
                  style={{ width: '80px' }}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={item.hasDropdown || false}
                    onChange={(e) => updateNavItem('secondaryNavItems', index, 'hasDropdown', e.target.checked)}
                  />
                  Has Dropdown
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={item.showOnHomePageOnly || false}
                    onChange={(e) => updateNavItem('secondaryNavItems', index, 'showOnHomePageOnly', e.target.checked)}
                  />
                  HomePage Only
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={item.isActive}
                    onChange={(e) => updateNavItem('secondaryNavItems', index, 'isActive', e.target.checked)}
                  />
                  Active
                </label>
                <button type="button" onClick={() => removeNavItem('secondaryNavItems', index)} className="btn-delete">
                  Remove
                </button>
              </div>
              
              {item.hasDropdown && (
                <div style={{ marginTop: '16px', paddingLeft: '20px', borderLeft: '3px solid #667eea' }}>
                  <label style={{ fontWeight: 600, marginBottom: '12px', display: 'block' }}>Dropdown Items:</label>
                  {(item.dropdownItems || []).map((dropdownItem, dIndex) => (
                    <div key={dIndex} className="form-row" style={{ marginBottom: '10px' }}>
                      <input
                        type="text"
                        value={dropdownItem.label}
                        onChange={(e) => updateDropdownItem('secondaryNavItems', index, dIndex, 'label', e.target.value)}
                        placeholder="Dropdown Label"
                        style={{ flex: 1 }}
                      />
                      <input
                        type="text"
                        value={dropdownItem.href}
                        onChange={(e) => updateDropdownItem('secondaryNavItems', index, dIndex, 'href', e.target.value)}
                        placeholder="Dropdown Link"
                        style={{ flex: 1 }}
                      />
                      <input
                        type="number"
                        value={dropdownItem.order}
                        onChange={(e) => updateDropdownItem('secondaryNavItems', index, dIndex, 'order', parseInt(e.target.value) || 0)}
                        placeholder="Order"
                        style={{ width: '80px' }}
                      />
                      <label>
                        <input
                          type="checkbox"
                          checked={dropdownItem.isActive}
                          onChange={(e) => updateDropdownItem('secondaryNavItems', index, dIndex, 'isActive', e.target.checked)}
                        />
                        Active
                      </label>
                      <button type="button" onClick={() => removeDropdownItem('secondaryNavItems', index, dIndex)} className="btn-delete">
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addDropdownItem('secondaryNavItems', index)} className="btn-secondary" style={{ marginTop: '8px' }}>
                    + Add Dropdown Item
                  </button>
                </div>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addNavItem('secondaryNavItems')} className="btn-secondary">
            + Add Secondary Nav Item
          </button>
        </section>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Header Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default HeaderSettingsPage
