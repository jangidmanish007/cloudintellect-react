import { usePageContent } from '../hooks/usePageContent'
import { PageContentProvider } from '../contexts/PageContentContext'
import AboutCloudIntellectHeroSection from '../components/AboutCloudIntellectHeroSection'
import CloudIntellectAdvantageSection from '../components/CloudIntellectAdvantageSection'
import SalesforceEcosystemShowcaseSection from '../components/SalesforceEcosystemShowcaseSection'
import TrainingPlacementModelSection from '../components/TrainingPlacementModelSection'
import WhySalesforceMentorsSection from '../components/WhySalesforceMentorsSection'

function AboutCloudIntellectPage() {
  const { page, content, loading } = usePageContent('about-cloudintellect')

  return (
    <PageContentProvider content={content} page={page} loading={loading}>
      <div className="app">
        <AboutCloudIntellectHeroSection />
        <CloudIntellectAdvantageSection />
        <SalesforceEcosystemShowcaseSection />
        <TrainingPlacementModelSection />
        <WhySalesforceMentorsSection />
      </div>
    </PageContentProvider>
  )
}

export default AboutCloudIntellectPage
