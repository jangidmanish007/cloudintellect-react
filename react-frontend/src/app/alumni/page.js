import { getAlumniProfile } from "@/_services/alumniService";
import { getPageBySlug, getSuccessStories } from "@/_services/homeService";
import MainAlumni from "@/components/alumni/MainAlumni";

export default async function AlumniPage() {
  let alumniPageData = null;

  // Page content (hero, section headings, etc.) from CMS
  const pageRes = await getPageBySlug("alumni-success");
  if (pageRes?.status) {
    alumniPageData = { ...alumniPageData, pageData: pageRes.result };
  }

  const successStoriesRes = await getSuccessStories("success-stories");
  if (successStoriesRes?.status) {
    alumniPageData = {
      ...alumniPageData,
      successtoriesData: successStoriesRes.result,
    };
  }
  const alumniProfileRes = await getAlumniProfile("alumni");
  if (alumniProfileRes?.status) {
    alumniPageData = {
      ...alumniPageData,
      alumniProfileData: alumniProfileRes.result,
    };
  }
  return (
    <>
      <MainAlumni alumniPageData={alumniPageData} />
    </>
  );
}
