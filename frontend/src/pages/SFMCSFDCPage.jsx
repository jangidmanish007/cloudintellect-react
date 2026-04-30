import { usePageContent } from '../hooks/usePageContent'
import { PageContentProvider } from '../contexts/PageContentContext'
import SFMCSFDCHeroSection from '../components/SFMCSFDCHeroSection'
import SelectYourPathSection from '../components/SelectYourPathSection'
import WhoCanApplySection from '../components/WhoCanApplySection'
import KeyAdvantagesSection from '../components/KeyAdvantagesSection'
import CompleteSupportEcosystemSection from '../components/CompleteSupportEcosystemSection'
import BecomeJobReadySection from '../components/BecomeJobReadySection'

function SFMCSFDCPage() {
  const { page, content, loading } = usePageContent('sfmc-sfdc')
  return (
    <PageContentProvider content={content} page={page} loading={loading}>
      <div className="app">
        <SFMCSFDCHeroSection />
        <SelectYourPathSection />
        <WhoCanApplySection />
        <KeyAdvantagesSection />
        <CompleteSupportEcosystemSection />
        <BecomeJobReadySection />
      </div>
    </PageContentProvider>
  )
}

export default SFMCSFDCPage
