'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, DownloadIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── ICON_MAP: key → local SVG path ── */
const ICON_MAP = {
  code: 'images/home/code-icon.svg',
  trophy: 'images/home/trophy.svg',
  roles: 'images/home/role-icon.svg',
  chart: 'images/home/trending_up.svg',
  marketing: 'images/home/marketing-icon.svg',
  audience: 'images/home/home_work.svg',
  automation: 'images/home/left_click.svg',
  analytics: 'images/home/trending_up.svg',
};

function resolveIcon(icon) {
  if (!icon) return null;
  if (ICON_MAP[icon]) return ICON_MAP[icon];
  if (icon.startsWith('http')) return icon;
  return `${icon}`;
}

export default function CoursesSection({ courses }) {
  const tabs =
    Array.isArray(courses?.tabs) && courses?.tabs.length >= 2
      ? courses?.tabs
      : [
          { id: 'developer', label: 'Salesforce Developer' },
          { id: 'marketing', label: 'Salesforce Marketing Cloud' },
        ];

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'developer');

  // Scroll active tab into center on mobile
  const tabsScrollRef = useRef(null);
  useEffect(() => {
    const container = tabsScrollRef.current;
    if (!container) return;
    const activeEl = container.querySelector('[aria-selected="true"]');
    if (!activeEl) return;
    const containerCenter = container.offsetWidth / 2;
    const elCenter = activeEl.offsetLeft + activeEl.offsetWidth / 2;
    container.scrollTo({ left: elCenter - containerCenter, behavior: 'smooth' });
  }, [activeTab]);

  const tabContent = {
    [tabs[0]?.id]: {
      main: {
        iconType: 'code',
        title: courses?.developer?.mainTitle || '',
        description: courses?.developer?.mainDescription || '',
        linkText: courses?.developer?.mainLinkText || '',
        linkHref: courses?.developer?.mainLinkHref || '#',
      },
      cards: Array.isArray(courses?.developer?.cards) ? courses?.developer?.cards : [],
    },
    [tabs[1]?.id]: {
      main: {
        iconType: 'marketing',
        title: courses?.marketing?.mainTitle || '',
        description: courses?.marketing?.mainDescription || '',
        linkText: courses?.marketing?.mainLinkText || '',
        linkHref: courses?.marketing?.mainLinkHref || '#',
      },
      cards: Array.isArray(courses?.marketing?.cards) ? courses?.marketing?.cards : [],
    },
  };

  const active = tabContent[activeTab] || tabContent[tabs[0]?.id] || { main: {}, cards: [] };

  const sectionTitle = courses?.sectionTitle || 'Our';
  const sectionTitleHighlight = courses?.sectionTitleHighlight || 'Courses';
  const applyText = courses?.applyText || 'Apply Today';
  const applyHref = courses?.applyHref || '#';
  const brochureText = courses?.brochureText || 'Download Brochure';
  const brochureHref = courses?.brochureHref || '#';

  /* ── Animation variants ── */
  const sectionVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.07,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.22, ease: 'easeIn' },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const ctaVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
    },
  };

  return (
    <section className="bg-[#FFFBF2] py-16 px-4 sm:px-8">
      <div className="max-w-[1280px] mx-auto">
        {/* ── Title ── */}
        <motion.h2
          className="excon-font text-[#1E1E1E] text-center text-[32px] sm:text-[48px] font-light leading-normal lg:mb-8 mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={sectionVariants}
        >
          {sectionTitle} <span className="font-bold">{sectionTitleHighlight}</span>
        </motion.h2>

        {/* ── Tabs ── */}
        <motion.div
          className="flex justify-center lg:mb-[52px] mb-[30px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={sectionVariants}
        >
          {/* Scroll container — hidden scrollbar, snaps active tab to center on mobile */}
          <div
            ref={tabsScrollRef}
            className="flex overflow-x-auto scroll-smooth
                       [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                       bg-white rounded-[8px] border border-[#0000001A] p-[5px] gap-[4px]
                       max-w-full"
            role="tablist"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'excon-font relative text-[14px] sm:text-[18px] font-bold rounded-[10px]',
                  'px-[20px] lg:px-[70px] py-[10px] lg:py-[14px]',
                  'whitespace-nowrap cursor-pointer transition-colors duration shrink-0',
                  activeTab === tab.id ? 'text-white' : 'bg-white text-[#0f172a] hover:text-[#009FFF]',
                ].join(' ')}
              >
                {/* Animated active background pill */}
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-[#009FFF] rounded-[10px] z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Cards row — animated on tab change ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="flex flex-wrap lg:flex-nowrap gap-6 mb-8"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Main card */}
            <motion.div
              variants={cardVariants}
              className="w-full lg:flex-3 bg-white rounded-[8px] lg:p-6 p-4 border border-[#0000001A] flex flex-col gap-6"
            >
              <div className="md:w-[64px] w-[48px] md:h-[64px] h-[48px] flex items-center justify-center shrink-0">
                <Image
                  src={process.env.NEXT_PUBLIC_IMG_PATH + resolveIcon(active.main.iconType) || ICON_MAP.code}
                  alt=""
                  width={64}
                  height={64}
                  aria-hidden
                />
              </div>

              <h3 className="excon-font text-black md:text-[26px] text-[18px] font-bold leading-normal m-0">
                {active.main.title}
              </h3>

              <p className="ranade-font text-black md:text-[20px] text-[16px] font-normal leading-normal m-0 flex-1">
                {active.main.description}
              </p>

              {active.main.linkText && (
                <Link
                  href={active.main.linkHref || '#'}
                  className="excon-font text-[#009FFF] text-[14px] font-medium no-underline inline-flex items-center gap-1 hover:underline"
                >
                  {active.main.linkText} →
                </Link>
              )}
            </motion.div>

            {/* Stat cards */}
            {active.cards.map((card, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                className="flex-1 min-w-[140px] bg-white rounded-[8px] border border-[#0000001A] md:p-6 p-4 flex flex-col gap-6 group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="lg:w-[64px] w-[48px] lg:h-[64px] h-[48px] rounded-[8px] bg-[#009FFF1A] flex items-center justify-center shrink-0">
                  {resolveIcon(card.icon) ? (
                    <motion.div
                      whileHover={{ scale: 1.01, rotate: 10 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    >
                      <Image
                        src={process.env.NEXT_PUBLIC_IMG_PATH + resolveIcon(card.icon)}
                        alt=""
                        width={40}
                        height={40}
                        aria-hidden
                      />
                    </motion.div>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#009FFF] block" />
                  )}
                </div>
                <p className="excon-font text-black lg:text-[18px] text-[14px] font-semibold leading-normal m-0">
                  {card.stat}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── CTA ── */}
        <motion.div
          className="flex  gap-[14px] items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={ctaVariants}
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            <Link
              href={applyHref}
              className="excon-font inline-flex items-center gap-2 bg-[#009FFF] hover:bg-[#0088e6] text-white text-[14px] font-semibold rounded-[4px] md:px-6 px-4 py-[13px] no-underline transition-colors duration-200"
            >
              {applyText}
              <ArrowRight width={16} height={16} />
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            <Link
              href={brochureHref}
              className="excon-font inline-flex items-center gap-2 bg-white text-black text-[14px] font-normal rounded-[4px] px-4 py-[13px] border border-[#e2e8f0] no-underline hover:bg-[#f8fafc] transition-colors duration-200"
            >
              {brochureText}
              <DownloadIcon width={16} height={16} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
