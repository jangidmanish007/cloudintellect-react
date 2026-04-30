import { usePageContent } from '../hooks/usePageContent'
import { PageContentProvider } from '../contexts/PageContentContext'
import WhyChooseUsHeroSection from '../components/WhyChooseUsHeroSection'
import CoreAdvantagesSection from '../components/CoreAdvantagesSection'
import PlacementAssistanceSection from '../components/PlacementAssistanceSection'
import TrustRecognitionSection from '../components/TrustRecognitionSection'
import ImpactSnapshotSection from '../components/ImpactSnapshotSection'

function WhyChooseUsPage() {
  const { page, content, loading } = usePageContent('why-choose-us')
  return (
    <PageContentProvider content={content} page={page} loading={loading}>
      <div className="app">
        <WhyChooseUsHeroSection />
        <CoreAdvantagesSection />
        <PlacementAssistanceSection />
        <TrustRecognitionSection />
        <ImpactSnapshotSection />
      </div>
    </PageContentProvider>
  )
}

export default WhyChooseUsPage
