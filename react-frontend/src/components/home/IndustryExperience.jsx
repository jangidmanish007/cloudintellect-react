'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';

/* ─────────────────────────────────────────────
   Animation variants
───────────────────────────────────────────── */
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
export default function IndustryExperience({ industryExperience }) {
  const industry = industryExperience || {};

  const headingPart1 = industry.headingPart1 || '';
  const headingStrong1 = industry.headingStrong1 || '';
  const headingStrong2 = industry.headingStrong2 || '';
  const tabs = Array.isArray(industry.tabs) && industry.tabs.length > 0 ? industry.tabs : [];

  const [activeIndex, setActiveIndex] = useState(0);

  const openTab = (index) => {
    if (activeIndex === index) return;
    setActiveIndex(index);
  };

  // Auto-scroll active pill to center on mobile
  const pillRefs = useRef([]);
  useEffect(() => {
    const el = pillRefs.current[activeIndex];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeIndex]);

  if (!tabs.length && !headingPart1 && !headingStrong1) return null;

  const activeTab = tabs[activeIndex];

  return (
    <section className="bg-white py-16 pb-18 rounded-b-3xl">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Heading ── */}
        {(headingPart1 || headingStrong1 || headingStrong2) && (
          <motion.h2
            className="excon-font text-center text-[#1E1E1E] text-[28px] sm:text-[36px] lg:text-[48px] font-light leading-[1.3] max-w-[900px] mx-auto mb-10"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            custom={0}
          >
            {headingPart1} <strong className="font-bold">{headingStrong1}</strong>{' '}
            <strong className="font-bold">{headingStrong2}</strong>
          </motion.h2>
        )}

        {tabs.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            custom={0.1}
          >
            {/* ════════════════════════════════════
                DESKTOP (lg+): horizontal accordion
                ════════════════════════════════════ */}
            <div className="hidden lg:flex gap-[10px] items-stretch">
              {tabs.map((tab, index) => {
                const isActive = activeIndex === index;
                return (
                  <DesktopTabPanel
                    key={index}
                    tab={tab}
                    isActive={isActive}
                    bgUrl={tab.image}
                    onOpen={() => openTab(index)}
                  />
                );
              })}
            </div>

            {/* ════════════════════════════════════
                MOBILE / TABLET (<lg):
                Horizontal pill tabs + panel below
                ════════════════════════════════════ */}
            <div className="lg:hidden flex flex-col gap-4">
              {/* Pill tab row — horizontally scrollable */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {tabs.map((tab, index) => {
                  const isActive = activeIndex === index;
                  return (
                    <button
                      key={index}
                      ref={(el) => (pillRefs.current[index] = el)}
                      type="button"
                      onClick={() => openTab(index)}
                      className={[
                        'ranade-font shrink-0 px-4 py-2.5 rounded-sm text-[12px] font-normal',
                        'transition-all duration-300 ease-in-out border-none cursor-pointer',
                        'flex items-center gap-2 whitespace-nowrap',
                        isActive ? 'bg-[#009FFF] text-white ' : 'bg-[#F9FAFB] text-[#1E1E1E] hover:bg-[#eef2f7]',
                      ].join(' ')}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Active panel — full width image card */}
              {activeTab && (
                <div
                  key={activeIndex}
                  className="relative w-full rounded-2xl overflow-hidden bg-center bg-cover"
                  style={{
                    height: '320px',
                    backgroundImage: activeTab.image
                      ? `url(${process.env.DYNAMIC_IMG_BASE_PATH}${activeTab.image})`
                      : undefined,
                  }}
                >
                  {/* Gradient overlay + content */}
                  <div
                    className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 px-5 pt-10 pb-6 rounded-b-2xl"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)',
                    }}
                  >
                    <h3 className="excon-font text-white text-[1.15rem] font-bold m-0 leading-snug text-left">
                      {activeTab.title}
                    </h3>
                    <div className="flex flex-col items-start w-full gap-6 flex-wrap mt-1">
                      <p className="ranade-font text-white/95 text-[0.8rem] font-normal leading-normal m-0 flex-1 min-w-0 text-left">
                        {activeTab.description}
                      </p>
                      <Link
                        href="#learn-more"
                        className="shrink-0 inline-block px-4 py-2 bg-[#4299E1] hover:bg-[#3182ce]
                          text-white no-underline excon-font text-[0.75rem] font-semibold
                          tracking-[0.04em] rounded-lg transition-all duration-200"
                      >
                        READ MORE
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Desktop accordion panel (lg+)
───────────────────────────────────────────── */
function DesktopTabPanel({ tab, isActive, bgUrl, onOpen }) {
  return (
    <>
      {/* Vertical pill button */}
      <button
        type="button"
        aria-expanded={isActive}
        aria-label={`Open ${tab.label}`}
        onClick={onOpen}
        className={[
          'ranade-font text-[#1E1E1E] text-[16px] font-normal cursor-pointer border-none',
          'rounded-xl bg-[#F9FAFB] transition-all duration-400 ease-in-out',
          'flex flex-col justify-center',
          'rotate-180 [writing-mode:vertical-rl]',
          isActive ? 'w-0 p-0 opacity-0 overflow-hidden min-w-0' : 'hover:bg-[#eef2f7] w-[89px] h-[600px] px-5',
        ].join(' ')}
      >
        <span className="flex justify-between items-center w-full gap-2">
          <span className="block">{tab.label}</span>
          <span className="shrink-0" aria-hidden>
            <PlusIcon width={16} height={16} />
          </span>
        </span>
      </button>

      {/* Expanded image panel */}
      <div
        role="region"
        aria-label={`${tab.label} panel`}
        className={[
          'relative rounded-2xl overflow-hidden shrink-0',
          'bg-no-repeat bg-center bg-cover',
          'transition-all duration-500 ease-in-out',
          'h-[600px]',
          isActive ? 'w-[738px]' : 'w-0',
        ].join(' ')}
        style={bgUrl ? { backgroundImage: `url(${process.env.DYNAMIC_IMG_BASE_PATH}${bgUrl})` } : undefined}
      >
        {isActive && (
          <div
            className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 px-8 pt-10 pb-9 rounded-b-2xl"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)',
            }}
            role="presentation"
          >
            <h3 className="excon-font text-white text-[1.5rem] font-bold m-0 leading-snug max-w-[85%] text-left">
              {tab.title}
            </h3>
            <div className="flex items-end justify-between w-full gap-16 mt-1">
              <p className="ranade-font text-white/95 text-[0.9rem] font-normal leading-normal m-0 flex-1 min-w-0 text-left">
                {tab.description}
              </p>
              <Link
                href="#learn-more"
                className="shrink-0 inline-block px-6 py-[0.65rem]
                  bg-[#4299E1] hover:bg-[#3182ce] text-white no-underline
                  excon-font text-[0.8rem] font-semibold tracking-[0.04em]
                  rounded-lg transition-all duration-200 hover:-translate-y-px"
              >
                READ MORE
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
