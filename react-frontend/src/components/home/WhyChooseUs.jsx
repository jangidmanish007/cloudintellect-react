'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function WhyChooseUs({ whyChoose }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const data = whyChoose || {};
  const headingLine1 = data.headingLine1;
  const headingStrong = data.headingStrong;
  const items = Array.isArray(data.items) && data.items.length > 0 ? data.items : [];

  if (!headingLine1 && !headingStrong && items.length === 0) return null;

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <section className="bg-white py-16 px-4 sm:px-6">
      <div className="max-w-[1280px] mx-auto">
        {/* ── Section Heading ── */}
        <motion.h2
          className="excon-font text-center text-[#1E1E1E] text-[28px] sm:text-[36px] lg:text-[48px] font-light leading-tight mb-10 sm:mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          custom={0}
        >
          {headingLine1} <strong className="font-bold">{headingStrong}</strong>
        </motion.h2>

        {/* ── Accordion ── */}
        <motion.div
          className="flex flex-col"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          custom={0.1}
        >
          {items.map((item, index) => {
            const isActive = activeIndex === index;
            const imgSrc = item.image ? `${process.env.DYNAMIC_IMG_BASE_PATH || ''}${item.image}` : null;

            return (
              <div key={item.number ?? index} className="border-b border-[#000] last:border-none">
                {/* ── Header row (always visible) ── */}
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  aria-expanded={isActive}
                  className="w-full flex items-center gap-4 sm:gap-6 py-5 sm:py-6 text-left bg-transparent border-none cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009FFF] focus-visible:ring-offset-2 rounded-sm"
                >
                  {/* Faded number */}
                  <span className="text-[48px] sm:text-[60px] text-[#E9E9E9] font-segoe font-bold leading-none shrink-0">
                    0{index + 1}
                  </span>

                  {/* Title */}
                  <h3
                    className={`excon-font flex-1 min-w-0 text-[15px] sm:text-[19px] lg:text-[24px] leading-snug m-0 transition-colors duration-300 ${
                      isActive ? 'font-bold text-[#1A1A1A]' : 'font-medium text-[#1A1A1A]'
                    }`}
                  >
                    {item.title}
                  </h3>

                  {/* Arrow — rotates when active */}
                  <motion.img
                    src={`${process.env.NEXT_PUBLIC_IMG_PATH}images/home/accordion-arrow-icon.svg`}
                    alt=""
                    aria-hidden
                    animate={{ rotate: isActive ? 90 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 object-contain opacity-70"
                  />
                </button>

                {/* ── Animated expand panel ── */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        className="pb-8 sm:pb-10 cursor-pointer"
                        onClick={() => handleToggle(index)}
                        role="presentation"
                      >
                        {/*
                          Layout:
                          [large faded number area is already in header]
                          [underline + description]   [img1] [img2]
                        */}
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10 pl-[68px] sm:pl-[88px]">
                          {/* Text block */}
                          <div className="flex-1 min-w-0">
                            {/* Short horizontal rule under title */}
                            <div className="w-7 h-[2px] bg-[#1A1A1A] mb-4" />
                            <p className="ranade-font text-[#5A6475] text-[13px] sm:text-[14px] lg:text-[15px] leading-[1.8] m-0 max-w-[460px]">
                              {item.content}
                            </p>
                          </div>

                          {/* Right block: two images side by side */}
                          {imgSrc && (
                            <div className="flex gap-3 shrink-0 lg:self-start">
                              <img
                                src={imgSrc}
                                alt=""
                                aria-hidden
                                className="w-[130px] h-[110px] sm:w-[190px] sm:h-[160px] lg:w-[220px] lg:h-[185px] object-cover"
                              />
                              <img
                                src={imgSrc}
                                alt=""
                                aria-hidden
                                className="w-[130px] h-[110px] sm:w-[190px] sm:h-[160px] lg:w-[220px] lg:h-[185px] object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
