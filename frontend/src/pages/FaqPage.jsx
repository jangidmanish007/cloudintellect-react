import { usePageContent } from '../hooks/usePageContent'
import { PageContentProvider } from '../contexts/PageContentContext'
import FaqSection from '../components/FaqSection'

function FaqPage() {
  const { page, content, loading } = usePageContent('faq')
  return (
    <PageContentProvider content={content} page={page} loading={loading}>
      <div className="app">
        <FaqSection />
      </div>
    </PageContentProvider>
  )
}

export default FaqPage

