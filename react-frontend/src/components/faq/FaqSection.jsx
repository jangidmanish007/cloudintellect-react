'use client';

import { useState } from "react";
import Link from "next/link";

// ─── Component ────────────────────────────────────────────────────────────────
export default function FaqSection({ pageData }) {
  const faq = pageData?.content?.faq || {};

  // ── Heading ───────────────────────────────────────────────────────────────
  const headingLight = (
    faq.headingLine1 ||
    faq.titleLight ||
    faq.title ||
    "Frequently Asked Questions"
  ).trim();

  // ── FAQ items ─────────────────────────────────────────────────────────────
  const items = Array.isArray(faq.items) ? faq.items : [];
  const normalizedItems = items
    .filter((x) => x && (x.question || x.title) && (x.answer || x.content))
    .map((x) => ({
      number:
        typeof x.number === "string" || typeof x.number === "number"
          ? String(x.number).trim()
          : "",
      question: (x.question || x.title || "").trim(),
      answer: (x.answer || x.content || "").trim(),
      image: typeof x.image === "string" ? x.image.trim() : "",
    }));

  const [activeIndex, setActiveIndex] = useState(0);
  const hasItems = normalizedItems.length > 0;

  // ── Hero background ───────────────────────────────────────────────────────
  const bgPath =
    typeof faq.backgroundImage === "string" ? faq.backgroundImage.trim() : "";
  const bgUrl = bgPath ? process.env.DYNAMIC_IMG_BASE_PATH + faq.backgroundImage : "";

  // ── CTA block ─────────────────────────────────────────────────────────────
  const cta = faq.cta && typeof faq.cta === "object" ? faq.cta : {};
  const ctaTitle = (cta.title || "").trim();
  const ctaDescription = (cta.description || "").trim();
  const ctaButtonText = (cta.buttonText || "").trim();
  const ctaButtonHref = (cta.buttonHref || "").trim();
  const badgeText = (cta.badgeText || "").trim();
  const badgeImageUrl = cta.badgeImage ? process.env.DYNAMIC_IMG_BASE_PATH + cta.badgeImage : "";
  const featureTexts = Array.isArray(cta.features)
    ? cta.features
      .map((f) => {
        if (!f) return "";
        if (typeof f === "string") return f.trim();
        if (typeof f === "object")
          return (f.text || f.label || "").toString().trim();
        return "";
      })
      .filter(Boolean)
    : [];
  const shouldRenderCta = !!(
    ctaTitle ||
    ctaDescription ||
    ctaButtonText ||
    badgeText ||
    badgeImageUrl ||
    featureTexts.length > 0
  );

  // ── CTA button: internal vs external ─────────────────────────────────────
  const isExternalCta =
    !ctaButtonHref ||
    ctaButtonHref === "#" ||
    /^(https?:\/\/|mailto:|tel:|#)/.test(ctaButtonHref);

  return (
    <>
      {/* ── Hero banner ── */}
      <section
        className="relative w-full min-h-[600px] flex items-center pt-[130px] md:pt-[206px] overflow-hidden"
      >
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${bgUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(7,15,28,0.55) 0%, rgba(7,15,28,0.68) 100%)",
          }}
        />
      </section>
      {/* ── FAQ accordion section ── */}
      <section
        className="py-20 px-[60px] lg:py-[60px] lg:px-6 sm:py-10 sm:px-4 min-h-[620px]"
        aria-labelledby="faq-page-heading"
      >
        <div className="max-w-[1200px] mx-auto">

          {/* Heading */}
          <h2
            id="faq-page-heading"
            className="flex flex-wrap gap-1.5 m-0 mb-11 leading-[1.15]"
          >
            <span className="text-[48px] lg:text-[1.8rem] sm:text-[1.45rem] font-bold text-[#1E1E1E]">
              {headingLight}
            </span>
          </h2>

          {/* Accordion list */}
          <div aria-label="FAQ accordion">
            <div
              className=""
              role="list"
            >
              {hasItems ? (
                normalizedItems.map((item, index) => {
                  const isActive = activeIndex === index;
                  const numberValue = (item.number || String(index + 1)).padStart(2, "0");
                  const rowImageUrl = item.image
                    ? resolveImageUrl(item.image)
                    : DEFAULT_FAQ_IMAGE;

                  return (
                    <div
                      key={`${item.number || index}-${item.question}`}
                      className="border-b border-black/[0.28]"
                      role="listitem"
                    >
                      <div
                        className="flex items-center gap-[22px] md:gap-[14px] py-5 md:py-4 cursor-pointer md:flex-wrap"
                        onClick={() => setActiveIndex(index)}
                        onKeyDown={(e) => e.key === "Enter" && setActiveIndex(index)}
                        role="button"
                        tabIndex={0}
                        aria-expanded={isActive}
                      >
                        {/* Number */}
                        <div className="w-[46px] md:w-[34px] shrink-0 text-[46px] md:text-[34px] leading-none font-normal text-[rgba(30,30,30,0.18)]">
                          {numberValue}
                        </div>

                        {/* Question + answer */}
                        <div className="flex-1 min-w-0">
                          <h3 className="m-0 text-[24px] md:text-[20px] sm:text-[16px] font-bold text-[#111] leading-[1.15]">
                            {item.question}
                          </h3>
                          {isActive && (
                            <p className="mt-2.5 sm:mt-2 text-[#4b5563] text-base sm:text-[14px] leading-[1.45] max-w-[560px] m-0">
                              {item.answer}
                            </p>
                          )}
                        </div>

                        {/* Images (active only) */}
                        {isActive && (
                          <div className="flex gap-2.5 shrink-0 md:w-full md:mt-2 md:order-5">
                            <img
                              decoding="async"
                              src={rowImageUrl}
                              alt=""
                              className="w-[140px] h-[120px] md:w-[calc(50%-5px)] md:h-[100px] rounded-sm object-cover"
                            />
                            <img
                              decoding="async"
                              src={rowImageUrl}
                              alt=""
                              className="w-[140px] h-[120px] md:w-[calc(50%-5px)] md:h-[100px] rounded-sm object-cover"
                            />
                          </div>
                        )}

                        {/* Arrow */}
                        <span className="w-[22px] shrink-0 text-[#111] text-[22px] sm:text-[18px] leading-none md:ml-auto">
                          →
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-[18px] pb-[22px]" role="status" aria-live="polite" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA block ── */}
      {shouldRenderCta && (
        <div
          className="w-full mt-[70px] lg:mt-[50px] sm:mt-[34px] py-[81px] px-6 lg:py-[60px] lg:px-5 sm:py-[44px] sm:px-4 text-center"
          style={{ background: "rgba(36,47,66,0.30)" }}
          role="region"
          aria-label="FAQ call to action"
        >
          <div className="max-w-[1200px] mx-auto">

            {/* Badge */}
            {(badgeText || badgeImageUrl) && (
              <div className="inline-flex items-center gap-[9px] bg-[#00ffe61a] px-4 py-2.5 rounded-full mb-3">
                {badgeImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={badgeImageUrl}
                    alt=""
                    width={16}
                    height={16}
                    className="w-4 h-4 object-contain"
                  />
                )}
                {badgeText && (
                  <span className="text-[#00ffe6] text-sm font-bold">
                    {badgeText}
                  </span>
                )}
              </div>
            )}

            {/* Title */}
            {ctaTitle && (
              <h2 className="text-[#f8fafc] text-[60px] lg:text-[42px] sm:text-[28px] font-bold text-center max-w-[618px] mx-auto mb-[9px] leading-[1.1] whitespace-pre-line">
                {ctaTitle}
              </h2>
            )}

            {/* Description */}
            {ctaDescription && (
              <p className="text-[#9096a2] text-[24px] lg:text-[18px] sm:text-[16px] text-center max-w-[895px] mx-auto mb-7 lg:mb-[18px] sm:mb-[14px] whitespace-pre-line">
                {ctaDescription}
              </p>
            )}

            {/* Button */}
            {ctaButtonText && ctaButtonHref && (
              isExternalCta ? (
                <a
                  href={ctaButtonHref}
                  className="inline-flex bg-[#00ffe6] text-[#0b121e] px-[14px] py-[13px] rounded text-lg font-bold no-underline hover:opacity-95 transition-opacity duration-200"
                >
                  {ctaButtonText}
                </a>
              ) : (
                <Link
                  href={ctaButtonHref}
                  className="inline-flex bg-[#00ffe6] text-[#0b121e] px-[14px] py-[13px] rounded text-lg font-bold no-underline hover:opacity-95 transition-opacity duration-200"
                >
                  {ctaButtonText}
                </Link>
              )
            )}

            {/* Features */}
            {featureTexts.length > 0 && (
              <div
                className="flex items-center justify-center gap-8 sm:gap-[18px] flex-wrap mt-[41px]"
                aria-label="Benefits"
              >
                {featureTexts.map((t, i) => (
                  <div key={`${t}-${i}`} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#00ffe6] shrink-0" aria-hidden="true" />
                    <span className="text-[#9096a2] text-sm">{t}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
