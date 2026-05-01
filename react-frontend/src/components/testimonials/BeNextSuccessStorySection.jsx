"use client";
import Link from "next/link";

export default function BeNextSuccessStorySection({ pageData }) {
  const section = pageData?.content?.beNextSuccessStory || {};

  const heading = section.heading || section.title || "Be Our Next Success Story";
  const description =
    section.description ||
    section.text ||
    "Join 5000+ learners who have successfully transitioned into the Salesforce ecosystem. Your journey starts here.";
  const buttonText = section.buttonText || section.buttonLabel || "Apply Today";
  const buttonHref = section.buttonHref || section.buttonLink || "#apply";

  // Use Next.js Link for internal paths, plain <a> for external / hash
  const isExternal =
    !buttonHref ||
    buttonHref === "#" ||
    /^(https?:\/\/|mailto:|tel:|#)/.test(buttonHref);

  return (
    <section className="bg-white py-20 px-4 md:py-[60px] md:px-6">
      <div className="max-w-[1280px] mx-auto">

        {/* Card */}
        <div className="bg-[#F8FAFC] border border-[#0000001A] rounded-[32px] md:rounded-3xl lg:py-16 md:py-16 py-10 px-10 flex flex-col align-items-center justify-contet-center text-center">

          <h2 className="text-black text-[24px] md:text-[34px] font-bold leading-[1.2] m-0 mb-6">
            {heading}
          </h2>

          <p className="ranade-font text-[#1E1E1E] text-lg md:text-base font-normal leading-relaxed m-0 mb-8 max-w-[700px] mx-auto">
            {description}
          </p>

          {isExternal ? (
            <a
              href={buttonHref}
              className="w-fit mx-auto inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-[#009FFF] text-white rounded-xl md:text-lg text-base font-semibold no-underline transition-all duration-200 hover:bg-[#0088e6] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,159,255,0.3)]"
            >
              {buttonText}
              <span aria-hidden="true">→</span>
            </a>
          ) : (
            <Link
              href={buttonHref}
              className="w-fit mx-auto inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-[#009FFF] text-white rounded-sm md:text-lg text-base font-semibold no-underline transition-all duration-200 hover:bg-[#0088e6] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,159,255,0.3)]"
            >
              {buttonText}
              <span aria-hidden="true">→</span>
            </Link>
          )}

        </div>
      </div>
    </section>
  );
}
