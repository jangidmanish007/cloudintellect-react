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
    console.log("alumniPageData",alumniPageData,pageRes)
  return (
    <> 
    <MainAlumni  alumniPageData={alumniPageData} />
    </>
  );
}
