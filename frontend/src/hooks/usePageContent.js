import { useState, useEffect } from 'react'
import { pagesAPI } from '../services/api'

/**
 * Fetches page content from API by slug.
 * @param {string} slug - Page slug (e.g. 'home', 'about', 'why-choose-us')
 * @returns {{ page: object|null, content: object, loading: boolean, error: string|null }}
 */
export function usePageContent(slug) {
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    let cancelled = false

    const fetchPage = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await pagesAPI.getBySlug(slug)
        console.log('response', response)
        if (!cancelled && response?.success) {
          setPage(response.data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load page content')
          setPage(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchPage()
    return () => { cancelled = true }
  }, [slug])

  return {
    page,
    content: page?.content || {},
    loading,
    error
  }
}

export default usePageContent
