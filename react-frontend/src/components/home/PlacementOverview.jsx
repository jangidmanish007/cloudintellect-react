'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import { motion, useInView } from 'framer-motion';
import placementOverview from './static-data/placementOverview.json';
import { ArrowRight } from 'lucide-react';

/* ─────────────────────────────────────────────
   Animation variants
───────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const statCard = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─────────────────────────────────────────────
   Custom Slider Arrows
───────────────────────────────────────────── */
function PrevArrow({ onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Previous slide"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      className="w-8 h-8 rounded-full cursor-pointer border border-[#e2e8f0] bg-white text-[#64748b] flex items-center justify-center transition-colors duration-200 hover:bg-[#f8fafc]"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </motion.button>
  );
}

function NextArrow({ onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Next slide"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      className="w-8 h-8 cursor-pointer rounded-full bg-(--color-cyan) border border-(--color-cyan) text-white flex items-center justify-center transition-colors duration-200 hover:bg-[#0088e6]"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </motion.button>
  );
}

function SliderNav({ sliderRef, slideCount, visibleSlides }) {
  if (slideCount <= visibleSlides) return null;
  return (
    <motion.div
      className="flex justify-end gap-2 mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <PrevArrow onClick={() => sliderRef.current?.slickPrev()} />
      <NextArrow onClick={() => sliderRef.current?.slickNext()} />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function PlacementOverview({ overview }) {
  const sliderRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const {
    label,
    headlinePart1,
    headlineBold,
    headlinePart2,
    applyButtonText: applyText,
    applyButtonHref: applyHref,
    viewPlacementsText: viewText,
    viewPlacementsHref: viewHref,
    statsTop,
    statsBottom,
    sliderImages: rawSliderImages = [],
  } = { ...placementOverview, ...overview };

  const sliderImages = rawSliderImages?.filter((s) => s?.image || s?.url);

  const slickSettings = {
    dots: false,
    arrows: false,
    infinite: sliderImages?.length > 2,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    responsive: [
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, slidesToScroll: 1, infinite: sliderImages?.length > 1 },
      },
    ],
  };

  return (
    <section ref={sectionRef} className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-6 items-stretch">
        {/* ── LEFT: Image Slider ── */}
        <motion.div
          className="w-full lg:w-[580px] xl:w-[630px] shrink-0 min-w-0 flex flex-col"
          variants={fadeLeft}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {sliderImages?.length > 0 ? (
            <>
              <div className="overflow-hidden rounded-2xl">
                <Slider ref={sliderRef} {...slickSettings}>
                  {sliderImages.map((slide, i) => {
                    const imagePath = slide?.image;
                    const imgSrc = imagePath
                      ? `${process.env.NEXT_PUBLIC_DYNAMIC_IMG_BASE_PATH || process.env.DYNAMIC_IMG_BASE_PATH}${imagePath}`
                      : null;

                    return (
                      <div key={i} className="px-[5px] outline-none">
                        {/* 
                          Fix: use aspect-ratio container so image is never cropped.
                          On mobile (1 slide) the image fills full width at natural ratio.
                          On desktop (2 slides) same ratio is maintained.
                        */}
                        <div
                          className="relative w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155]"
                          style={{ aspectRatio: '4/6.02' }}
                        >
                          {imgSrc ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={imgSrc}
                              alt={slide?.alt || `Placement ${i + 1}`}
                              className="absolute inset-0 w-full h-full object-contain object-center"
                              loading={i === 0 ? 'eager' : 'lazy'}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm">
                              No image
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </Slider>
              </div>

              <SliderNav sliderRef={sliderRef} slideCount={sliderImages.length} visibleSlides={2} />
            </>
          ) : (
            <div className="flex items-center justify-center min-h-[280px] sm:min-h-[360px] w-full rounded-2xl bg-[#f1f5f9] text-[#94a3b8] text-sm text-center p-6">
              Add slider images in Admin → Pages → Home → Placements Overview Section
            </div>
          )}
        </motion.div>

        {/* ── RIGHT: Content ── */}
        <motion.div
          className="flex-1 min-w-0 flex flex-col"
          variants={fadeRight}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Label */}
          <motion.p
            className="font-[Ranade,sans-serif] text-[15px] sm:text-[16px] text-[#1E1E1E] mb-3 font-normal"
            variants={fadeUp}
            custom={0}
          >
            {label}
          </motion.p>

          {/* Headline */}
          <motion.h2
            className="excon-font text-[22px] sm:text-[26px] lg:text-[28px] xl:text-[34px] font-thin text-[#1E1E1E] leading-[1.3] mb-4 sm:mb-5"
            variants={fadeUp}
            custom={0.05}
          >
            {headlinePart1}
            <span className="excon-font font-bold ml-1">
              {headlineBold} <span className="pl-1"></span> {headlinePart2}
            </span>
          </motion.h2>

          {/* CTA Buttons */}
          <motion.div className="flex flex-wrap gap-3 mb-7 sm:mb-9" variants={fadeUp} custom={0.1}>
            <Link
              href={applyHref}
              className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-[14px] font-medium no-underline"
            >
              {applyText}
              <ArrowRight width={16} height={16} />
            </Link>
            <Link
              href={viewHref}
              className="btn-outline inline-flex items-center gap-2 px-5 py-3 text-[14px] font-medium no-underline"
            >
              {viewText}
            </Link>
          </motion.div>

          {/* Stats */}
          <div className="flex flex-col gap-0">
            {/* Top stats — 3 cards */}
            <motion.div
              className="grid grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6"
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              {statsTop.map((stat, i) => (
                <motion.div key={i} variants={statCard} className="min-w-0">
                  <div className="h-full px-3 sm:px-4 py-3 sm:py-4 rounded-xl border border-black/8 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-shadow duration-300">
                    <span className="excon-font block text-[20px] sm:text-[24px] lg:text-[26px] xl:text-[30px] font-bold leading-[1.2] text-(--color-cyan)">
                      {stat.value}
                    </span>
                    <span className="font-[Ranade,sans-serif] text-[11px] sm:text-[12px] font-normal text-[#1E1E1E] leading-[1.4] mt-1 block">
                      {stat.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom stats — 4 blocks */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-0"
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              {statsBottom.map((stat, i) => (
                <motion.div
                  key={i}
                  variants={statCard}
                  className={[
                    'min-w-0 pt-2 pr-3',
                    /* On sm+ keep the original left-border divider pattern */
                    i === 0 ? 'pl-0 sm:border-l-0' : 'pl-3 sm:border-l sm:border-l-black/12',
                    /* On mobile (2-col grid): add left border to col 2 items */
                    i % 2 !== 0 ? 'border-l border-l-black/12' : '',
                  ].join(' ')}
                >
                  <span className="excon-font block text-[26px] sm:text-[28px] lg:text-[30px] font-bold text-[#1E1E1E] leading-[1.2] mb-1">
                    {stat.value}
                    <sub className="relative top-[-8px] ml-[2px] text-[9px] sm:text-[10px] font-bold text-[#1E1E1E] align-sub">
                      LPA
                    </sub>
                  </span>
                  <span className="font-[Ranade,sans-serif] text-[10px] sm:text-[11px] font-normal text-[#1E1E1E] leading-[1.4] block">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
