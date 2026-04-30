import { usePageContent } from '../hooks/usePageContent'
import { PageContentProvider } from '../contexts/PageContentContext'
import SalesforceDeveloperHeroSection from '../components/SalesforceDeveloperHeroSection'
import SFDCTopicsSection from '../components/SFDCTopicsSection'
import SFDCCareerOpportunitiesSection from '../components/SFDCCareerOpportunitiesSection'

function SalesforceDeveloperPage() {
  const { page, content, loading } = usePageContent('salesforce-developer')
  return (
    <PageContentProvider content={content} page={page} loading={loading}>
      <div className="app">
        <SalesforceDeveloperHeroSection />
        <SFDCTopicsSection />
        <SFDCCareerOpportunitiesSection />
      </div>
    </PageContentProvider>
  )
}

export default SalesforceDeveloperPage
