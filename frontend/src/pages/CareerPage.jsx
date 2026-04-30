import { usePageContent } from '../hooks/usePageContent'
import { PageContentProvider } from '../contexts/PageContentContext'
import CareerHeroSection from '../components/CareerHeroSection'
import CareerWhyWorkSection from '../components/CareerWhyWorkSection'
import CareerCultureSection from '../components/CareerCultureSection'
import CareerOpeningsSection from '../components/CareerOpeningsSection'

function CareerPage() {
  const { page, content, loading } = usePageContent('career')

  return (
    <PageContentProvider content={content} page={page} loading={loading}>
      <div className="app">
        <CareerHeroSection />
        <CareerWhyWorkSection />
        <CareerCultureSection />
        <CareerOpeningsSection />
      </div>
    </PageContentProvider>
  )
}

export default CareerPage

