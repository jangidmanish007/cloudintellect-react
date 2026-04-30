import { usePageContent } from '../hooks/usePageContent'
import { PageContentProvider } from '../contexts/PageContentContext'
import LeadershipHeroSection from '../components/LeadershipHeroSection'
import LeadershipEdgeSection from '../components/LeadershipEdgeSection'
import FacultyMentorsSection from '../components/FacultyMentorsSection'

function LeadershipPage() {
  const { page, content, loading } = usePageContent('leadership')
  return (
    <PageContentProvider content={content} page={page} loading={loading}>
      <div className="app">
        <LeadershipHeroSection />
        <LeadershipEdgeSection />
        <FacultyMentorsSection />
      </div>
    </PageContentProvider>
  )
}

export default LeadershipPage
