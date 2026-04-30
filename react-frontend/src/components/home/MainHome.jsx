import React from 'react';
import HomeBanner from './HomeBanner';
import PromoCarousel from './PromoCarousel';
import EcosystemSection from './EcosystemSection';
import CoursesSection from './CoursesSection';
import LegacySection from './LegacySection';
import RecognitionSection from './RecognitionSection';

export default function MainHome({ homePageData }) {
  console.log('homePageData?.pageData?.content?.courses', homePageData?.pageData?.content);

  return (
    <>
      <HomeBanner pageData={homePageData?.pageData} />
      <PromoCarousel />
      <EcosystemSection ecosystem={homePageData?.pageData?.content?.ecosystem} />
      <CoursesSection courses={homePageData?.pageData?.content?.courses} />
      <LegacySection legacy={homePageData?.pageData?.content?.legacy} />
      <RecognitionSection />
    </>
  );
}
