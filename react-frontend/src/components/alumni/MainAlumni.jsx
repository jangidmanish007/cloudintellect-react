import AlumniHeroSection from "./AlumniHeroSection";

export default function MainAlumni({ alumniPageData }) {
  return (
    <>
      <AlumniHeroSection pageData={alumniPageData?.pageData} />
    </>
  );
}
