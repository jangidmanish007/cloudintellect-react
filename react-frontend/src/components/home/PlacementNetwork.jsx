'use client';

import { useRef } from 'react';
import Marquee from 'react-fast-marquee';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

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

/* ─────────────────────────────────────────────
   Logo Card
───────────────────────────────────────────── */
function LogoCard({ src, alt }) {
  return (
    <div className="mx-2 pt-3 flex items-center justify-center rounded-xs shrink-0 cursor-pointer hover:translate-y-[-3px] transition-all duration-400">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <Image
        src={process.env.DYNAMIC_IMG_BASE_PATH + src}
        alt={alt || ''}
        width={243}
        height={100}
        loading="lazy"
        decoding="async"
        className="max-h-[100px] w-auto object-cover object-center"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function PlacementNetwork({ placementData }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  console.log('placementData', placementData);

  const heading = placementData?.heading ?? '';
  const headingBold = placementData?.headingBold ?? '';

  return (
    <section ref={sectionRef} className="bg-[#F8FAFC] py-12 lg:py-[80px] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Heading ── */}
        {(heading || headingBold) && (
          <motion.h2
            className="excon-font text-center text-[#1E1E1E] text-[22px] sm:text-[26px] font-thin leading-snug mb-10 sm:mb-[20px]"
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={0}
          >
            {heading} {headingBold && <span className="excon-font font-bold">{headingBold}</span>}
          </motion.h2>
        )}
      </div>

      {/* ── Marquee rows ── */}
      {placementData?.logos?.length > 0 ? (
        <motion.div
          className="flex flex-col gap-4"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0.1}
        >
          {/* Row 1 — left to right */}
          <Marquee speed={40} gradient gradientColor="white" gradientWidth={80} pauseOnHover>
            {placementData?.logos?.map((logo, i) => (
              <LogoCard key={`row1-${i}`} src={logo.image} alt={logo.alt} />
            ))}
          </Marquee>
        </motion.div>
      ) : (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[120px] rounded-2xl bg-[#f1f5f9] text-[#94a3b8] text-sm text-center p-6">
            Add company logos in Admin → Pages → Home → Placement Network Section
          </div>
        </div>
      )}
    </section>
  );
}
