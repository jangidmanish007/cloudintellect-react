import { usePageContent } from '../hooks/usePageContent'
import { PageContentProvider } from '../contexts/PageContentContext'
import BlogHeroSection from '../components/BlogHeroSection'
import BlogListingSection from '../components/BlogListingSection'

function BlogPage() {
  const { page, content, loading } = usePageContent('blog')
  return (
    <PageContentProvider content={content} page={page} loading={loading}>
      <div className="app">
        <BlogHeroSection />
        <BlogListingSection />
      </div>
    </PageContentProvider>
  )
}

export default BlogPage
