import { usePageContent } from '../hooks/usePageContent'
import { PageContentProvider } from '../contexts/PageContentContext'
import TestimonialsHeroSection from '../components/TestimonialsHeroSection'
import TestimonialsSection from '../components/TestimonialsSection'
import MoreSuccessStoriesSection from '../components/MoreSuccessStoriesSection'
import BeNextSuccessStorySection from '../components/BeNextSuccessStorySection'

function TestimonialsPage() {
  const { page, content, loading } = usePageContent('testimonials')
  return (
    <PageContentProvider content={content} page={page} loading={loading}>
      <div className="app">
        <TestimonialsHeroSection />
        <TestimonialsSection />
        <MoreSuccessStoriesSection />
        <BeNextSuccessStorySection />
      </div>
    </PageContentProvider>
  )
}

export default TestimonialsPage
