import { usePageContent } from '../hooks/usePageContent'
import { PageContentProvider } from '../contexts/PageContentContext'
import GalleryHeroSection from '../components/GalleryHeroSection'
import GallerySection from '../components/GallerySection'

function GalleryPage() {
  const { page, content, loading } = usePageContent('gallery')
  return (
    <PageContentProvider content={content} page={page} loading={loading}>
      <div className="app">
        <GalleryHeroSection />
        <GallerySection />
      </div>
    </PageContentProvider>
  )
}

export default GalleryPage
