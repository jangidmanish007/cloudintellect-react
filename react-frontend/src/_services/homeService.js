import { fetcher, fetchAPI, serverFetch } from "@/_utils/ApiBase";

export const getPageBySlug = async (slug) => {
  return serverFetch(`${process.env.GET_PAGE_BY_SLUG}${slug}`);
};

// get header carousel slides
export const getHeaderCarousel = async () => {
  return serverFetch(process.env.GET_HEADER_CAROUSEL);
};

// get success stories (StudentSuccessSection)
export const getSuccessStories = async () => {
  return serverFetch(process.env.GET_SUCCESS_STORIES);
};

// submit hero application form (POST)
export const submitHeroApplication = async (params) => {
  try {
    const response = await fetchAPI(process.env.HERO_APPLICATION_SUBMIT, {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return response;
  } catch (err) {
    return null;
  }
};
