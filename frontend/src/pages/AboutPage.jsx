import { usePageContent } from '../hooks/usePageContent'
import { PageContentProvider } from '../contexts/PageContentContext'
import AboutHeroSection from '../components/AboutHeroSection'
import BridgingSection from '../components/BridgingSection'
import CloudIntellectEdgeSection from '../components/CloudIntellectEdgeSection'
import LeadershipEdgeSection from '../components/LeadershipEdgeSection'
import CoreValuesSection from '../components/CoreValuesSection'

function AboutPage() {
  const { page, content, loading } = usePageContent('about')

  return (
    <PageContentProvider content={content} page={page} loading={loading}>
      <div className="app">
        <AboutHeroSection />
        <BridgingSection />
        <CloudIntellectEdgeSection />
        <LeadershipEdgeSection />
        <CoreValuesSection />
      </div>
    </PageContentProvider>
  )
}

export default AboutPage
