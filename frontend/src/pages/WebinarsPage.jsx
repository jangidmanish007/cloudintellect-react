import { usePageContent } from '../hooks/usePageContent'
import { PageContentProvider } from '../contexts/PageContentContext'
import WebinarsHeroSection from '../components/WebinarsHeroSection'
import UpcomingBatchesSection from '../components/UpcomingBatchesSection'
import WebinarsCoverSection from '../components/WebinarsCoverSection'
import WhoShouldAttendSection from '../components/WhoShouldAttendSection'
import MakeInformedDecisionSection from '../components/MakeInformedDecisionSection'
import MoreSuccessStoriesSection from '../components/MoreSuccessStoriesSection'

function WebinarsPage() {
  const { page, content, loading } = usePageContent('webinars')
  return (
    <PageContentProvider content={content} page={page} loading={loading}>
      <div className="app">
        <WebinarsHeroSection />
        <UpcomingBatchesSection />
        <WebinarsCoverSection />
        <WhoShouldAttendSection />
        <MoreSuccessStoriesSection />
        <MakeInformedDecisionSection />
      </div>
    </PageContentProvider>
  )
}

export default WebinarsPage
