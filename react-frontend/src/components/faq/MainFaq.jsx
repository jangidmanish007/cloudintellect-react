import FaqSection from "./FaqSection";

export default function MainFaq({ faqPageData }) {
  return (
    <>
      <FaqSection pageData={faqPageData?.pageData} />
    </>
  );
}
