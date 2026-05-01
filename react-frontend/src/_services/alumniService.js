import { serverFetch } from "@/_utils/ApiBase";

// Get all active testimonials (public)
export const getAlumniProfile = async () => {
  return serverFetch(process.env.GET_ALUMNI_PROFILE);
};
