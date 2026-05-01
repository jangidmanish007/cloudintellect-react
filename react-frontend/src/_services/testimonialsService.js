import { serverFetch } from "@/_utils/ApiBase";

// Get all active testimonials (public)
export const getTestimonials = async () => {
  return serverFetch(process.env.GET_TESTIMONIALS);
};
