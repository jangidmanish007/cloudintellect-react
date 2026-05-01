import MainFaq from "@/components/faq/MainFaq";
import { getPageBySlug } from "@/_services/homeService";

export default async function FaqPage() {
  let faqPageData = null;

  const pageRes = await getPageBySlug("faq");
  if (pageRes?.status) {
    faqPageData = { pageData: pageRes.result };
  } 
  return (
    <>
      <MainFaq faqPageData={faqPageData} />
    </>
  );
}
