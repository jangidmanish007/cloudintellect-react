`'use client'`
import { getSuccessStories } from "@/_services/homeService";

// ─── Star rating ──────────────────────────────────────────────────────────────
function StarRating({ count = 5 }) {
  return (
    <span
      className="inline-flex gap-0.5 mt-1"
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="text-[#f5b400] text-base leading-none" aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MoreSuccessStoriesSection({ pageData, successStories }) {
  // Fetch success stories server-side
  const stories = successStories;

  if (!stories.length) return null;

  // Section heading from CMS with fallback
  const sectionContent = pageData?.content?.moreSuccessStories || {};
  const heading = sectionContent.heading || sectionContent.title || "More Success Stories";

  // Split heading: light part + bold "Success Stories"
  const headingMatch = heading.match(/^(.+?)\s*(Success\s+Stories)$/i);
  const headingLine1 = headingMatch ? headingMatch[1].trim() : heading.split(" ").slice(0, -2).join(" ") || "More";
  const headingLine2 = headingMatch ? headingMatch[2].trim() : "Success Stories";

  return (
    <section className="w-full bg-[#FFFBF2] py-20 md:py-24">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-4">

        {/* Section title */}
        <h2 className="text-[28px] md:text-[48px] font-light text-black text-center mb-10 sm:mb-15 leading-[1.2]">
          {headingLine1}{" "}
          <span className="font-bold">{headingLine2}</span>
        </h2>

        {/* Cards grid — 3 cols → 2 → 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-6 md:gap-5 sm:gap-4">
          {stories.map((review) => (
            <article
              key={review._id}
              className="bg-white rounded-xl p-[34px] sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-black/[0.06] flex flex-col gap-5"
            >
              {/* Card header: avatar + name/time + google icon */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={process.env.DYNAMIC_IMG_BASE_PATH + review.profileImage}
                    alt=""
                    width={48}
                    height={48}
                    decoding="async"
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <div className="min-w-0">
                    <h3 className="text-[#0f172a] text-base font-bold m-0 mb-1 leading-[1.3]">
                      {review.name}
                    </h3>
                    <span className="text-[#94a3b8] text-[13px] block">
                      {review.time}
                    </span>
                  </div>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${process.env.NEXT_PUBLIC_IMG_PATH}images/testimonals/svg.webp`}
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                  className="shrink-0 w-5 h-5"
                />
              </div>

              {/* Stars */}
              <StarRating count={review.rating} />

              {/* Review text — clamped to 4 lines */}
              <p className="text-[#475569] text-[15px] leading-relaxed m-0 line-clamp-4">
                {review.text}
              </p>

              {/* Read more */}
              <a
                href={review.readMoreUrl || "#"}
                className="text-[#94A3B8] text-sm font-bold leading-5 no-underline mt-auto self-start hover:text-[#64748b] hover:underline transition-colors duration-200"
              >
                Read more &gt;
              </a>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
