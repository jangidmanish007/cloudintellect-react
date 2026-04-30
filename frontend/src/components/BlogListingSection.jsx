import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { blogPostsAPI, getImageUrl } from '../services/api'

const PRESET_CATEGORIES = [
  'Development (Apex/LWC)',
  'Admin & Reports',
  'Training & Career',
  'Clouds & AI',
]

function formatPostDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function CalendarIcon() {
  return (
    <svg className="blog-card-date-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 2v3M16 2v3M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BlogListingSection() {
  const [activeCategory, setActiveCategory] = useState('')
  const [apiCategories, setApiCategories] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const filterTabs = useMemo(() => {
    const merged = [...new Set([...PRESET_CATEGORIES, ...apiCategories])].sort((a, b) =>
      a.localeCompare(b)
    )
    return [{ value: '', label: 'All Posts' }, ...merged.map((c) => ({ value: c, label: c }))]
  }, [apiCategories])

  useEffect(() => {
    let cancelled = false
    blogPostsAPI
      .getCategories()
      .then((res) => {
        if (!cancelled) setApiCategories(Array.isArray(res.data) ? res.data : [])
      })
      .catch(() => {
        if (!cancelled) setApiCategories([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    blogPostsAPI
      .getPublished(activeCategory || undefined)
      .then((res) => {
        if (!cancelled) setPosts(Array.isArray(res.data) ? res.data : [])
      })
      .catch((err) => {
        if (!cancelled) {
          setPosts([])
          setError(err.message || 'Could not load posts')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [activeCategory])

  const imageSrc = (path) => {
    if (!path || typeof path !== 'string') return ''
    const p = path.trim()
    if (!p) return ''
    if (p.startsWith('http')) return p
    return getImageUrl(p.startsWith('/') ? p : `/${p}`)
  }

  return (
    <section className="blog-listing-section" aria-label="Blog posts">
      <div className="blog-listing-inner">
        <div className="blog-listing-filters" role="tablist" aria-label="Filter by category">
          {filterTabs.map((tab) => {
            const isActive = activeCategory === tab.value
            return (
              <button
                key={tab.value || 'all'}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`blog-filter-pill ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCategory(tab.value)}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {error && <p className="blog-listing-error" role="alert">{error}</p>}

        {loading ? (
          <p className="blog-listing-loading">Loading posts…</p>
        ) : posts.length === 0 ? (
          <p className="blog-listing-empty">No posts in this category yet. Add posts from Admin → Blog posts.</p>
        ) : (
          <ul className="blog-card-grid">
            {posts.map((post) => {
              const img = imageSrc(post.featuredImage)
              const slug = post.slug || ''
              return (
                <li key={post._id || slug} className="blog-card">
                  <div className="blog-card-image-wrap">
                    {img ? (
                      <img src={img} alt="" className="blog-card-image" />
                    ) : (
                      <div className="blog-card-image-placeholder" aria-hidden />
                    )}
                  </div>
                  <div className="blog-card-body">
                    <div className="blog-card-date">
                      <CalendarIcon />
                      <span>{formatPostDate(post.publishedAt || post.createdAt)}</span>
                    </div>
                    <h2 className="blog-card-title">{post.title}</h2>
                    <p className="blog-card-excerpt">{post.excerpt || ''}</p>
                    <Link to={`/blog/${encodeURIComponent(slug)}`} className="blog-card-read-more">
                      Read More <span aria-hidden>→</span>
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}

export default BlogListingSection
