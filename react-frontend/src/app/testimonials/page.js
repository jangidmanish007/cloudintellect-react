import MainTestimonals from "@/components/testimonials/MainTestimonials";
import { getPageBySlug, getSuccessStories } from "@/_services/homeService";
import { getTestimonials } from "@/_services/testimonialsService";

export default async function TestimonalsPage() {
  let testimonialsPageData = null;

  // Page content (hero, section headings, etc.) from CMS
  const pageRes = await getPageBySlug("testimonials");
  if (pageRes?.status) {
    testimonialsPageData = { ...testimonialsPageData, pageData: pageRes.result };
  }

  // Testimonials list
  const testimonialsRes = await getTestimonials();
  if (testimonialsRes?.status) {
    testimonialsPageData = {
      ...testimonialsPageData,
      testimonials: testimonialsRes.result,
    };
  } 
 const successStoriesRes = await getSuccessStories();
  if (successStoriesRes?.status) {
   testimonialsPageData = {
      ...testimonialsPageData,
      successtoriesData: successStoriesRes.result,
    };
  }  
  
  return (
    <>
      <MainTestimonals testimonialsPageData={testimonialsPageData} />
    </>
  );
}
