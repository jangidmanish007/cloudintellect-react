import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { pagesAPI, alumniAPI, batchesAPI, successStoriesAPI } from '../../services/api'
import './DashboardPage.css'

const DashboardPage = () => {
  const [stats, setStats] = useState({
    pages: 0,
    alumni: 0,
    batches: 0,
    successStories: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pagesRes, alumniRes, batchesRes, storiesRes] = await Promise.all([
          pagesAPI.getAll(),
          alumniAPI.getAll(),
          batchesAPI.getAll(),
          successStoriesAPI.getAll(),
        ])

        setStats({
          pages: pagesRes.count || pagesRes.data?.length || 0,
          alumni: alumniRes.count || alumniRes.data?.length || 0,
          batches: batchesRes.count || batchesRes.data?.length || 0,
          successStories: storiesRes.count || storiesRes.data?.length || 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Pages',
      count: stats.pages,
      icon: '📄',
      link: '/admin/pages',
      color: '#9f7aea',
    },
    {
      title: 'Alumni',
      count: stats.alumni,
      icon: '👥',
      link: '/admin/alumni',
      color: '#4299e1',
    },
    {
      title: 'Batches',
      count: stats.batches,
      icon: '📅',
      link: '/admin/batches',
      color: '#48bb78',
    },
    {
      title: 'Success Stories',
      count: stats.successStories,
      icon: '⭐',
      link: '/admin/success-stories',
      color: '#ed8936',
    },
  ]

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <h2>Welcome to Admin Panel</h2>
        <p>Manage your website content from here</p>
      </div>

      <div className="dashboard-stats">
        {statCards.map((card) => (
          <Link key={card.title} to={card.link} className="dashboard-stat-card">
            <div className="stat-card-icon" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-card-content">
              <h3>{card.count}</h3>
              <p>{card.title}</p>
            </div>
            <div className="stat-card-arrow">→</div>
          </Link>
        ))}
      </div>

      <div className="dashboard-quick-actions">
        <h3>Quick Actions</h3>
        <div className="quick-actions-grid">
          <Link to="/admin/pages" className="quick-action-btn">
            Manage Pages
          </Link>
          <Link to="/admin/alumni" className="quick-action-btn">
            Add New Alumni
          </Link>
          <Link to="/admin/batches" className="quick-action-btn">
            Manage Batches
          </Link>
          <Link to="/admin/success-stories" className="quick-action-btn">
            Add Success Story
          </Link>
          <Link to="/admin/webinars" className="quick-action-btn">
            Manage Webinars
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
