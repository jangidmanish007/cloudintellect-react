const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api'

// Base URL for backend server (no /api) - used to load uploaded images from backend
export const getImageBaseUrl = () => {
  const base = API_BASE_URL.replace(/\/api\/?$/, '') || ''
  return base || (typeof window !== 'undefined' ? window.location.origin : '')
}

// Full URL for an image path (e.g. /images/Placements/file.webp) so it loads from backend when needed
export const getImageUrl = (path) => {
  if (!path || typeof path !== 'string') return ''
  // Already an absolute URL or data URI
  if (/^(https?:)?\/\//i.test(path) || /^data:/i.test(path)) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  const base = getImageBaseUrl()
  if (!base) return normalized
  return `${base}${normalized}`
}

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('admin_token')
}

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken()
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    
    // Provide more helpful error messages
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      const port = API_BASE_URL.match(/:(\d+)/)?.[1] || '5002'
      throw new Error(
        `Cannot connect to backend server at ${API_BASE_URL}. ` +
        `Please make sure the backend is running on port ${port}. ` +
        `Error: ${error.message}`
      )
    }
    
    throw error
  }
}

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (response.success && response.data.token) {
      localStorage.setItem('admin_token', response.data.token)
      localStorage.setItem('admin_user', JSON.stringify(response.data.user))
    }
    return response
  },

  logout: () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me')
  },

  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },
}

// Alumni API
export const alumniAPI = {
  getAll: () => apiRequest('/alumni'),
  getById: (id) => apiRequest(`/alumni/${id}`),
  create: (data) => apiRequest('/alumni', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/alumni/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/alumni/${id}`, { method: 'DELETE' }),
  reorder: (alumni) => apiRequest('/alumni/reorder', { method: 'PUT', body: JSON.stringify({ alumni }) }),
}

// Placements API
export const placementsAPI = {
  getAll: () => apiRequest('/placements'),
  getById: (id) => apiRequest(`/placements/${id}`),
  create: (data) => apiRequest('/placements', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/placements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/placements/${id}`, { method: 'DELETE' }),
  reorder: (placements) => apiRequest('/placements/reorder', { method: 'PUT', body: JSON.stringify({ placements }) }),
}

// Gallery API
export const galleryAPI = {
  // Categories
  getCategories: () => apiRequest('/gallery/categories'),
  getCategoriesAdmin: () => apiRequest('/gallery/categories/admin'),
  getCategory: (id) => apiRequest(`/gallery/categories/${id}`),
  createCategory: (data) => apiRequest('/gallery/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id, data) => apiRequest(`/gallery/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id) => apiRequest(`/gallery/categories/${id}`, { method: 'DELETE' }),
  reorderCategories: (categories) => apiRequest('/gallery/categories/reorder', { method: 'PUT', body: JSON.stringify({ categories }) }),
  
  // Images
  getImages: (categoryId) => {
    const query = categoryId && categoryId !== 'all' ? `?category=${categoryId}` : ''
    return apiRequest(`/gallery/images${query}`)
  },
  getImagesAdmin: () => apiRequest('/gallery/images/admin'),
  getImage: (id) => apiRequest(`/gallery/images/${id}`),
  createImage: (data) => apiRequest('/gallery/images', { method: 'POST', body: JSON.stringify(data) }),
  updateImage: (id, data) => apiRequest(`/gallery/images/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteImage: (id) => apiRequest(`/gallery/images/${id}`, { method: 'DELETE' }),
  reorderImages: (images) => apiRequest('/gallery/images/reorder', { method: 'PUT', body: JSON.stringify({ images }) }),
}

// Testimonials API
export const testimonialsAPI = {
  getAll: () => apiRequest('/testimonials'),
  getAllAdmin: () => apiRequest('/testimonials/admin/all'),
  getById: (id) => apiRequest(`/testimonials/${id}`),
  create: (data) => apiRequest('/testimonials', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/testimonials/${id}`, { method: 'DELETE' }),
  reorder: (testimonials) => apiRequest('/testimonials/reorder', { method: 'PUT', body: JSON.stringify({ testimonials }) }),
}

// Batches API
export const batchesAPI = {
  getAll: () => apiRequest('/batches'),
  getById: (id) => apiRequest(`/batches/${id}`),
  createOrUpdate: (data) => apiRequest('/batches', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/batches/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/batches/${id}`, { method: 'DELETE' }),
}

// Success Stories API
export const successStoriesAPI = {
  getAll: () => apiRequest('/success-stories'),
  getById: (id) => apiRequest(`/success-stories/${id}`),
  create: (data) => apiRequest('/success-stories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/success-stories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/success-stories/${id}`, { method: 'DELETE' }),
  reorder: (stories) => apiRequest('/success-stories/reorder', { method: 'PUT', body: JSON.stringify({ stories }) }),
}

// Webinars API
export const webinarsAPI = {
  // Topics
  getTopics: () => apiRequest('/webinars/topics'),
  createTopic: (data) => apiRequest('/webinars/topics', { method: 'POST', body: JSON.stringify(data) }),
  updateTopic: (id, data) => apiRequest(`/webinars/topics/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTopic: (id) => apiRequest(`/webinars/topics/${id}`, { method: 'DELETE' }),
  
  // Who Should Attend
  getWhoShouldAttend: () => apiRequest('/webinars/who-should-attend'),
  createWhoShouldAttend: (data) => apiRequest('/webinars/who-should-attend', { method: 'POST', body: JSON.stringify(data) }),
  updateWhoShouldAttend: (id, data) => apiRequest(`/webinars/who-should-attend/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteWhoShouldAttend: (id) => apiRequest(`/webinars/who-should-attend/${id}`, { method: 'DELETE' }),
}

// Pages API
export const pagesAPI = {
  getAll: () => apiRequest('/pages'),
  getNavbar: () => apiRequest('/pages/navbar'),
  getBySlug: (slug) => apiRequest(`/pages/slug/${slug}`),
  getById: (id) => apiRequest(`/pages/id/${id}`),
  create: (data) => apiRequest('/pages', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/pages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/pages/${id}`, { method: 'DELETE' }),
}

// Header Carousel API
export const headerCarouselAPI = {
  getAll: () => apiRequest('/header-carousel'),
  getAllAdmin: () => apiRequest('/header-carousel/all'),
  getById: (id) => apiRequest(`/header-carousel/${id}`),
  create: (data) => apiRequest('/header-carousel', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/header-carousel/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/header-carousel/${id}`, { method: 'DELETE' }),
  reorder: (slides) => apiRequest('/header-carousel/reorder', { method: 'PUT', body: JSON.stringify({ slides }) }),
}

// Header Settings API
export const headerSettingsAPI = {
  get: () => apiRequest('/header-settings'),
  update: (data) => apiRequest('/header-settings', { method: 'PUT', body: JSON.stringify(data) }),
}

// Footer Settings API
export const footerSettingsAPI = {
  get: () => apiRequest('/footer-settings'),
  update: (data) => apiRequest('/footer-settings', { method: 'PUT', body: JSON.stringify(data) }),
}

// Blog posts API
export const blogPostsAPI = {
  getPublished: (category) => {
    const q = category ? `?category=${encodeURIComponent(category)}` : ''
    return apiRequest(`/blog-posts${q}`)
  },
  getCategories: () => apiRequest('/blog-posts/meta/categories'),
  getBySlug: (slug) => apiRequest(`/blog-posts/slug/${encodeURIComponent(slug)}`),
  getAllAdmin: () => apiRequest('/blog-posts/admin/all'),
  create: (data) => apiRequest('/blog-posts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/blog-posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/blog-posts/${id}`, { method: 'DELETE' }),
}

// Career Leads API
export const careerLeadsAPI = {
  getAll: ({ status, page = 1, limit = 20 } = {}) => {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    if (page) params.append('page', String(page))
    if (limit) params.append('limit', String(limit))
    const query = params.toString() ? `?${params.toString()}` : ''
    return apiRequest(`/career-leads${query}`)
  },
  update: (id, data) => apiRequest(`/career-leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/career-leads/${id}`, {
    method: 'DELETE',
  }),
}

// Upload API
export const uploadAPI = {
  uploadFile: async (file, folder = 'general') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    
    const token = getAuthToken()
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }))
      throw new Error(error.message || 'Upload failed')
    }

    return await response.json()
  },

  uploadMultiple: async (files, folder = 'general') => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    formData.append('folder', folder)
    
    const token = getAuthToken()
    const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }))
      throw new Error(error.message || 'Upload failed')
    }

    return await response.json()
  },
}

/** Home page hero application → backend → Salesforce CRM */
export const heroApplicationAPI = {
  submit: (data) =>
    apiRequest('/hero-application/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

/** Contact page form → backend → Salesforce CRM + local admin log */
export const contactAPI = {
  submit: (data) =>
    apiRequest('/contact/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

export default apiRequest
