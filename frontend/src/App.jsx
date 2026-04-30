import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import AboutCloudIntellectPage from './pages/AboutCloudIntellectPage'
import WhyChooseUsPage from './pages/WhyChooseUsPage'
import SalesforceDeveloperPage from './pages/SalesforceDeveloperPage'
import SalesforceMarketingCloudPage from './pages/SalesforceMarketingCloudPage'
import SFMCSFDCPage from './pages/SFMCSFDCPage'
import AlumniSuccessPage from './pages/AlumniSuccessPage'
import WebinarsPage from './pages/WebinarsPage'
import PlacementsPage from './pages/PlacementsPage'
import GalleryPage from './pages/GalleryPage'
import TestimonialsPage from './pages/TestimonialsPage'
import ContactPage from './pages/ContactPage'
import LeadershipPage from './pages/LeadershipPage'
import CareerPage from './pages/CareerPage'
import LandingPage from './pages/LandingPage'
import FaqPage from './pages/FaqPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'

// Admin Pages
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import PagesPageAdmin from './pages/admin/PagesPage'
import PageContentEditorPage from './pages/admin/PageContentEditorPage'
import AlumniPageAdmin from './pages/admin/AlumniPage'
import BatchesPageAdmin from './pages/admin/BatchesPage'
import SuccessStoriesPageAdmin from './pages/admin/SuccessStoriesPage'
import WebinarsPageAdmin from './pages/admin/WebinarsPage'
import PlacementsPageAdmin from './pages/admin/PlacementsPage'
import GalleryPageAdmin from './pages/admin/GalleryPage'
import TestimonialsPageAdmin from './pages/admin/TestimonialsPage'
import CareerLeadsPageAdmin from './pages/admin/CareerLeadsPage'
import BlogPostsPageAdmin from './pages/admin/BlogPostsPage'
import HeaderCarouselPage from './pages/admin/HeaderCarouselPage'
import HeaderSettingsPage from './pages/admin/HeaderSettingsPage'
import FooterSettingsPage from './pages/admin/FooterSettingsPage'

// Components
import Layout from './components/Layout'

// Admin Components
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/about-cloudintellect" element={<Layout><AboutCloudIntellectPage /></Layout>} />
        <Route path="/why-choose-us" element={<Layout><WhyChooseUsPage /></Layout>} />
        <Route path="/salesforce-developer" element={<Layout><SalesforceDeveloperPage /></Layout>} />
        <Route path="/salesforce-marketing-cloud" element={<Layout><SalesforceMarketingCloudPage /></Layout>} />
        <Route path="/sfmc-sfdc" element={<Layout><SFMCSFDCPage /></Layout>} />
        <Route path="/alumni-success" element={<Layout><AlumniSuccessPage /></Layout>} />
        <Route path="/webinars" element={<Layout><WebinarsPage /></Layout>} />
        <Route path="/placements" element={<Layout><PlacementsPage /></Layout>} />
        <Route path="/gallery" element={<Layout><GalleryPage /></Layout>} />
        <Route path="/testimonials" element={<Layout><TestimonialsPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/leadership" element={<Layout><LeadershipPage /></Layout>} />
        <Route path="/career" element={<Layout><CareerPage /></Layout>} />
        <Route path="/faq" element={<Layout><FaqPage /></Layout>} />
        <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
        <Route path="/blog/:slug" element={<Layout><BlogPostPage /></Layout>} />
        {/* Landing page: no header, no footer */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pages"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <PagesPageAdmin />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pages/edit/:slug"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <PageContentEditorPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/alumni"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AlumniPageAdmin />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/batches"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <BatchesPageAdmin />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/success-stories"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <SuccessStoriesPageAdmin />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/webinars"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <WebinarsPageAdmin />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/placements"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <PlacementsPageAdmin />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <GalleryPageAdmin />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/testimonials"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <TestimonialsPageAdmin />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/career-leads"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <CareerLeadsPageAdmin />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blog-posts"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <BlogPostsPageAdmin />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/header-carousel"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <HeaderCarouselPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/header-settings"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <HeaderSettingsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/footer-settings"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <FooterSettingsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
