import { usePageContent } from '../hooks/usePageContent'
import { PageContentProvider } from '../contexts/PageContentContext'
import SalesforceMarketingCloudHeroSection from '../components/SalesforceMarketingCloudHeroSection'
import SFMCTopicsSection from '../components/SFMCTopicsSection'
import SFMCCareerOpportunitiesSection from '../components/SFMCCareerOpportunitiesSection'

function SalesforceMarketingCloudPage() {
  const { page, content, loading } = usePageContent('salesforce-marketing-cloud')
  return (
    <PageContentProvider content={content} page={page} loading={loading}>
      <div className="app">
        <SalesforceMarketingCloudHeroSection />
        <SFMCTopicsSection />
        <SFMCCareerOpportunitiesSection />
      </div>
    </PageContentProvider>
  )
}

export default SalesforceMarketingCloudPage
