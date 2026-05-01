import Link from "next/link";


export default function AlumniHeroSection({ pageData }) {
  const hero = pageData?.content?.hero || {};

  const backgroundImage = hero.backgroundImage || hero.bgImage || "images/BG (2).webp";
  const heading = hero.heading || hero.title || "Our Alumni Are Building Real Careers in Salesforce";
  const description = hero.description || hero.subtitle || "Different starts, one choice to learn Salesforce right. Now working on real projects.";
  const primaryButtonText = hero.primaryButtonText || hero.primaryBtnText || "Explore Program";
  const primaryButtonHref = hero.primaryButtonHref || hero.primaryBtnHref || "#";
  const secondaryButtonText = hero.secondaryButtonText || hero.secondaryBtnText || "View Placement";
  const secondaryButtonHref = hero.secondaryButtonHref || hero.secondaryBtnHref || "#";
  // Determine if buttons are external / hash links
  const isExternal = (href) =>
    !href || href === "#" || /^(https?:\/\/|mailto:|tel:|#)/.test(href);

  return (
    <section className="relative w-full min-h-[600px] flex items-center pt-[130px] md:pt-[180px] overflow-hidden">

      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${process.env.NEXT_PUBLIC_IMG_PATH}images/alumni/BG.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-[2] w-full max-w-[1280px] mx-auto px-6 py-14 md:py-20">
        <div className="flex flex-col gap-6 max-w-[750px]">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/95 rounded-full w-fit">
            <span
              className="w-2 h-2 rounded-full bg-[#009FFF] shrink-0"
              aria-hidden="true"
            />
            <span className="text-[#1E1E1E] text-[11px] font-semibold tracking-[0.5px] uppercase font-sans">
              {hero.tag || hero.label || "SUCCESS STORIES"}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-white text-[36px] sm:text-[48px] lg:text-[58px] font-bold leading-[1.2] m-0">
            {heading}
          </h1>

          {/* Description */}
          <p className="ranade-font text-white text-lg sm:text-xl lg:text-2xl font-light leading-relaxed m-0">
            {description}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-2">
            <Link
              href={primaryButtonHref}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-sm bg-[#009FFF] text-white text-base font-semibold no-underline transition-all duration-200 hover:bg-[#0088e6] hover:-translate-y-0.5"
            >
              {primaryButtonText}
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href={secondaryButtonHref}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-sm bg-white text-[#000000] text-base font-semibold no-underline transition-all duration-200 hover:bg-white/90 hover:-translate-y-0.5"
            >
              {secondaryButtonText}
            </Link>
          </div>
        </div>

        {/* Right: visual placeholder (hidden on mobile) */}
        <div className="shrink-0 w-[340px] min-h-[400px] md:w-[260px] md:min-h-[320px] sm:hidden" />

      </div>
    </section>
  );
}
