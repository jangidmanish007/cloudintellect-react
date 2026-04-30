import { usePageContent } from '../hooks/usePageContent'
import { PageContentProvider } from '../contexts/PageContentContext'
import SuccessStoriesSection from '../components/SuccessStoriesSection'
import AlumniProfilesSection from '../components/AlumniProfilesSection'
import MoreSuccessStoriesSection from '../components/MoreSuccessStoriesSection'
import YourJourneySection from '../components/YourJourneySection'

function AlumniSuccessPage() {
  const { page, content, loading } = usePageContent('alumni-success')
  return (
    <PageContentProvider content={content} page={page} loading={loading}>
      <div className="app">
        <SuccessStoriesSection />
        <AlumniProfilesSection />
        <MoreSuccessStoriesSection />
        <YourJourneySection />
      </div>
    </PageContentProvider>
  )
}

export default AlumniSuccessPage
