import MainHome from "@/components/home/MainHome";
import { getPageBySlug, getHeaderCarousel, getSuccessStories } from "@/_services/homeService";

export default async function Home() {
  let homePageData = null;

  // why choose, achievements, news & events — all come from this single call)
  const pageRes = await getPageBySlug('home');
  if (pageRes?.status) {
    homePageData = { ...homePageData, pageData: pageRes.result };
  }

  // student success stories
  const successStoriesRes = await getSuccessStories();
  if (successStoriesRes?.status) {
    homePageData = { ...homePageData, successStories: successStoriesRes.result };
  }

  return (
    <>
      <MainHome homePageData={homePageData} />
    </>
  );
}
