import { usePageContent } from '../hooks/usePageContent'
import { PageContentProvider } from '../contexts/PageContentContext'
import ContactHeroSection from '../components/ContactHeroSection'
import ContactFormSection from '../components/ContactFormSection'

function ContactPage() {
  const { page, content, loading } = usePageContent('contact')
  return (
    <PageContentProvider content={content} page={page} loading={loading}>
      <div className="app">
        <ContactHeroSection />
        <ContactFormSection />
      </div>
    </PageContentProvider>
  )
}

export default ContactPage
