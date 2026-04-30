import MainTestimonals from "@/components/testimonals/MainTestimonials";
import { getPageBySlug } from "@/_services/homeService";
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

  console.log('hello', testimonialsPageData)

  return (
    <>
      <MainTestimonals testimonialsPageData={testimonialsPageData} />
    </>
  );
}
