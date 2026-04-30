import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './AdminLayout.css'

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/pages', label: 'Pages', icon: '📄' },
    { path: '/admin/blog-posts', label: 'Blog posts', icon: '📝' },
     { path: '/admin/career-leads', label: 'Career Leads', icon: '📥' },
    { path: '/admin/alumni', label: 'Alumni', icon: '👥' },
    { path: '/admin/batches', label: 'Batches', icon: '📅' },
    { path: '/admin/success-stories', label: 'Success Stories', icon: '⭐' },
    { path: '/admin/webinars', label: 'Webinars', icon: '🎓' },
    { path: '/admin/placements', label: 'Placements', icon: '💼' },
    { path: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
    { path: '/admin/testimonials', label: 'Testimonials', icon: '💬' },
    { path: '/admin/header-carousel', label: 'Header Carousel', icon: '🎠' },
    { path: '/admin/header-settings', label: 'Header Settings', icon: '⚙️' },
    { path: '/admin/footer-settings', label: 'Footer Settings', icon: '🦶' },
  ]

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Cloud Intellect</h2>
          <p>Admin Panel</p>
        </div>
        <nav className="admin-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${item.path === location.pathname || (item.path === '/admin/pages' && location.pathname.startsWith('/admin/pages/')) || (item.path === '/admin/blog-posts' && location.pathname.startsWith('/admin/blog-posts')) ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <p><strong>{user?.username || 'Admin'}</strong></p>
            <p className="admin-user-role">{user?.role || 'admin'}</p>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn">
            Logout
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <h1>
            {location.pathname.startsWith('/admin/pages/edit/')
              ? 'Page Content'
              : menuItems.find((item) => item.path === location.pathname || (item.path === '/admin/blog-posts' && location.pathname.startsWith('/admin/blog-posts')))?.label || 'Dashboard'}
          </h1>
        </header>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  )
}

export default AdminLayout
