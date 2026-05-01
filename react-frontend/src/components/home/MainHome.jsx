import React from 'react';
import HomeBanner from './HomeBanner';
import PromoCarousel from './PromoCarousel';
import EcosystemSection from './EcosystemSection';
import CoursesSection from './CoursesSection';
import LegacySection from './LegacySection';
import RecognitionSection from './RecognitionSection';
import PlacementOverview from './PlacementOverview';
import PlacementNetwork from './PlacementNetwork';
import IndustryExperience from './IndustryExperience';
import CommunityImage from './CommunityImage';
import WhyChooseUs from './WhyChooseUs';

export default function MainHome({ homePageData }) {
  return (
    <>
      <HomeBanner pageData={homePageData?.pageData} />
      <PromoCarousel />
      <EcosystemSection ecosystem={homePageData?.pageData?.content?.ecosystem} />
      <CoursesSection courses={homePageData?.pageData?.content?.courses} />
      <LegacySection legacy={homePageData?.pageData?.content?.legacy} />
      <RecognitionSection />
      <PlacementOverview overview={homePageData?.pageData?.content?.placementsOverview} />
      <PlacementNetwork placementData={homePageData?.pageData?.content?.placementNetwork} />
      <IndustryExperience industryExperience={homePageData?.pageData?.content?.industryExperience} />
      <CommunityImage />
      <WhyChooseUs whyChoose={homePageData?.pageData?.content?.whyChoose} />
    </>
  );
}
