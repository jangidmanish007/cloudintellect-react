import { usePageContent } from '../hooks/usePageContent'
import { PageContentProvider } from '../contexts/PageContentContext'
import LandingPageExport from '../components/LandingPageExport'

/**
 * Standalone landing page (html-export static design) – no header, no footer.
 * Hero and CTAs are dynamic from Admin → Pages → Edit "landing".
 */
function LandingPage() {
  const { page, content, loading } = usePageContent('landing')

  return (
    <PageContentProvider content={content} page={page} loading={loading}>
      <div className="landing-page min-h-screen">
        <LandingPageExport />
      </div>
    </PageContentProvider>
  )
}

export default LandingPage
