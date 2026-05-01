'use client'
import MoreSuccessStoriesSection from "../testimonials/MoreSuccessStoriesSection";
import AlumniHeroSection from "./AlumniHeroSection";
import AlumniProfilesSection from "./AlumniProfilesSection";
import YourJourney from "./YourJourney";

export default function MainAlumni({ alumniPageData }) {
  return (
    <>
      <AlumniHeroSection pageData={alumniPageData?.pageData} />
      <AlumniProfilesSection pageData={alumniPageData?.pageData} alumniProfile={alumniPageData?.alumniProfileData} />
      <MoreSuccessStoriesSection pageData={alumniPageData?.pageData} successStories={alumniPageData?.successtoriesData} />
      <YourJourney />
    </>
  );
}
