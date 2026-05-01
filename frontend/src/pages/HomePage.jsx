import { usePageContent } from '../hooks/usePageContent';
import { PageContentProvider } from '../contexts/PageContentContext';
import HeroSection from '../components/HeroSection';
import PromoCarousel from '../components/PromoCarousel';
import EcosystemSection from '../components/EcosystemSection';
import CoursesSection from '../components/CoursesSection';
import LegacySection from '../components/LegacySection';
import RecognitionSection from '../components/RecognitionSection';
import PlacementsOverviewSection from '../components/PlacementsOverviewSection';
import PlacementsSection from '../components/PlacementsSection';
import PlacementNetworkSection from '../components/PlacementNetworkSection';
import IndustryExperienceSection from '../components/IndustryExperienceSection';
import CommunityImageSection from '../components/CommunityImageSection';
import WhyChooseSection from '../components/WhyChooseSection';
import StudentSuccessSection from '../components/StudentSuccessSection';
import StudentReviewsSection from '../components/StudentReviewsSection';
import CiAchievementHighlightsSection from '../components/CiAchievementHighlightsSection';
import NewsAndEventsSection from '../components/NewsAndEventsSection';

const DEFAULT_SLIDES = [
  {
    name: 'Shubham',
    lastName: 'Khanorkar',
    designation: 'Sr. Product Manager',
    package: '18.5',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/33c2013dd5b7fc82e1bdf2e56da159309fc675a9?width=940',
    logo: 'metacube',
  },
  {
    name: 'Shivam',
    lastName: 'Armakar',
    designation: 'Sr. Project Manager',
    package: '15.5',
    image: 'images/vaibhav.webp',
    logo: 'cognizant',
  },
  {
    name: 'Vaibhav',
    lastName: 'Kawale',
    designation: 'Sr. Product Manager',
    package: '14',
    image: 'images/IMG.webp',
    logo: 'deloitte',
  },
  {
    name: 'Vinay',
    lastName: 'Jaiswal',
    designation: 'Sr. Salesforce Developer',
    package: '11.5',
    image: 'images/vinay.webp',
    logo: 'mindsay',
  },
];

function HomePage() {
  const { page, content, loading } = usePageContent('home');
  const slides = content?.heroSlides && Array.isArray(content.heroSlides) ? content.heroSlides : DEFAULT_SLIDES;
  return (
    <PageContentProvider content={content} page={page} loading={loading}>
      <div className="app">
        <HeroSection slides={slides} />
        <PromoCarousel />
        <EcosystemSection />
        <CoursesSection />
        <LegacySection />
        <RecognitionSection />
        <PlacementsOverviewSection />
        {/* <PlacementsSection /> */}
        <PlacementNetworkSection />
        <IndustryExperienceSection />
        <CommunityImageSection />
        <WhyChooseSection />
        <StudentSuccessSection />
        <StudentReviewsSection />
        <CiAchievementHighlightsSection />
        <NewsAndEventsSection />
      </div>
    </PageContentProvider>
  );
}

export default HomePage;
