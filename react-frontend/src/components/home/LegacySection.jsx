'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import LEGACY_STATIC from './static-data/legacy.json';

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const statItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardItem = {
  hidden: { opacity: 0, scale: 0.97 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function LegacySection({ legacy }) {
  const data = legacy || {};

  const title = data.title || LEGACY_STATIC.title;
  const titleHighlight = data.titleHighlight || LEGACY_STATIC.titleHighlight;
  const stats = Array.isArray(data.stats) && data.stats.length > 0 ? data.stats : LEGACY_STATIC.stats;
  const cards = Array.isArray(data.cards) && data.cards.length > 0 ? data.cards : LEGACY_STATIC.cards;

  return (
    <section className="bg-white py-16 px-4 sm:px-8">
      <div className="max-w-[1280px] mx-auto">
        {/* ── Title ── */}
        <motion.h2
          className="max-w-[700px] mx-auto excon-font text-[#1E1E1E] text-center text-[32px] sm:text-[48px] font-light leading-normal lg:mb-[80px] mb-[40px]"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          custom={0}
        >
          {title} <span className="font-bold">{titleHighlight}</span>
        </motion.h2>

        {/* ── Stats grid ── */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:mb-18 mb-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          role="list"
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={statItem} role="listitem" className="flex flex-col px-2">
              {/* Accent line */}

              <p className="excon-font text-[#009FFF] text-[32px] sm:text-[40px] lg:text-[42px] xl:text-[60px] font-bold leading-none mb-1">
                {stat.number}
              </p>
              <p className="excon-font text-[#1E1E1E] text-[11px] sm:text-[14px] font-bold tracking-[0.08em] uppercase mb-2">
                {stat.label}
              </p>
              <div className="w-10 h-[3px] bg-[#000] rounded-full mb-4" aria-hidden />
              <p className="ranade-font text-[#475569] text-[12px] sm:text-[13px] font-normal leading-normal">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Cards ── */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {cards.map((card, i) => (
            <motion.article
              key={i}
              variants={cardItem}
              className="relative rounded-2xl overflow-hidden min-h-[320px] sm:min-h-[380px] flex flex-col group cursor-pointer"
              whileHover={{ scale: 1.015 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
              {/* Background image — loader in next.config handles base URL */}
              {card.image && (
                <Image
                  src={process.env.NEXT_PUBLIC_IMG_PATH + card.image}
                  alt={card.title || ''}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              )}

              {/* Gradient overlay */}
              <div
                className="absolute inset-0 z-10"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.05) 100%)',
                }}
                aria-hidden
              />

              {/* Content */}
              <div className="relative z-20 md:p-6 p-4 flex flex-col justify-between gap-3 h-full">
                <div className="flex-1 max-w-[307px] ml-auto lg:mt-[60px] mt-[40px]">
                  <h3 className="excon-font text-white text-[18px] sm:text-[24px] font-bold leading-snug mb-2">
                    {card.title}
                  </h3>
                  <p className="ranade-font text-white/80 text-[10px] font-normal leading-relaxed mb-[16px]">
                    {card.description}
                  </p>
                  <Link
                    href={card.href || '#'}
                    className="excon-font bg-[#009FFF] hover:bg-[#0088e6] text-white text-[10px] font-semibold rounded-[4px] px-[14px] py-[8px] no-underline transition-colors duration-200"
                  >
                    READ MORE
                  </Link>
                </div>

                {/* Tags */}
                {card.tags && (
                  <p className="excon-font text-white/50 text-[10px] font-bold tracking-widest uppercase border-t border-white/20 pt-3 mt-1">
                    {card.tags}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
