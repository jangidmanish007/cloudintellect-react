import { usePageContent } from '../hooks/usePageContent'
import { PageContentProvider } from '../contexts/PageContentContext'
import PlacementsHeroSection from '../components/PlacementsHeroSection'
import PlacementsSection from '../components/PlacementsSection'

function PlacementsPage() {
  const { page, content, loading } = usePageContent('placements')
  return (
    <PageContentProvider content={content} page={page} loading={loading}>
      <div className="app">
        <PlacementsHeroSection />
        <PlacementsSection />
      </div>
    </PageContentProvider>
  )
}

export default PlacementsPage
