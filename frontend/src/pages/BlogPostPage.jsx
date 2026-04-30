import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { blogPostsAPI, getImageUrl } from '../services/api'

function formatPostDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) {
      setNotFound(true)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    blogPostsAPI
      .getBySlug(slug)
      .then((res) => {
        if (!cancelled) setPost(res.data || null)
      })
      .catch(() => {
        if (!cancelled) {
          setPost(null)
          setNotFound(true)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  const heroImage = (() => {
    const p = post?.featuredImage?.trim()
    if (!p) return ''
    if (p.startsWith('http')) return p
    return getImageUrl(p.startsWith('/') ? p : `/${p}`)
  })()

  if (loading) {
    return (
      <div className="app blog-post-app">
        <div className="blog-post-page blog-post-page--loading">
          <p>Loading article…</p>
        </div>
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="app blog-post-app">
        <div className="blog-post-page blog-post-page--not-found">
          <h1>Post not found</h1>
          <p>This article may have been removed or the link is incorrect.</p>
          <Link to="/blog" className="blog-post-back-link">← Back to Blog</Link>
        </div>
      </div>
    )
  }

  const heroSectionClass =
    'blog-post-hero-section' + (heroImage ? '' : ' blog-post-hero-section--no-image')

  return (
    <div className="app blog-post-app">
      <article className="blog-post-page">
        <header className={heroSectionClass} aria-label="Article hero">
          {heroImage ? (
            <div
              className="blog-post-hero-bg"
              style={{ backgroundImage: `url(${encodeURI(heroImage)})` }}
              aria-hidden="true"
            />
          ) : null}
          <div className="blog-post-hero-overlay" aria-hidden="true" />
          <div className="blog-post-hero-container">
            <div className="blog-post-hero-content">
              <nav className="blog-post-breadcrumb blog-post-breadcrumb--hero" aria-label="Breadcrumb">
                <Link to="/blog">Blog</Link>
                <span className="blog-post-breadcrumb-sep" aria-hidden>/</span>
                <span className="blog-post-breadcrumb-current">{post.category || 'Article'}</span>
              </nav>
              <p className="blog-post-hero-tag">
                <span className="blog-post-hero-tag-dot" aria-hidden />
                <span>{post.category || 'Knowledge hub'}</span>
              </p>
              <h1 className="blog-post-hero-title">{post.title}</h1>
              <p className="blog-post-hero-date">{formatPostDate(post.publishedAt || post.createdAt)}</p>
            </div>
          </div>
        </header>

        <div className="blog-post-body">
          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />

          <footer className="blog-post-footer">
            <Link to="/blog" className="blog-post-back-link">← Back to all posts</Link>
          </footer>
        </div>
      </article>
    </div>
  )
}

export default BlogPostPage
