"use client";
import TestimonialsHeroSection from "./TestimonialsHeroSection";
import TestimonialsGrid from "./TestimonialsGrid";
import MoreSuccessStoriesSection from "./MoreSuccessStoriesSection";
import BeNextSuccessStorySection from "./BeNextSuccessStorySection";

export default function MainTestimonials({ testimonialsPageData }) { 
  return (
    <>
      <TestimonialsHeroSection pageData={testimonialsPageData?.pageData} />
      <TestimonialsGrid
        testimonials={testimonialsPageData?.testimonials || []}
        pageData={testimonialsPageData?.pageData}
      />
      <MoreSuccessStoriesSection pageData={testimonialsPageData?.pageData} successStories={testimonialsPageData?.successtoriesData}/>
      <BeNextSuccessStorySection pageData={testimonialsPageData?.pageData} />
    </>
  );
}
