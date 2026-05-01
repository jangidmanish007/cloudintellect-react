'use client';

import { motion } from 'framer-motion';
import staticContent from './static-data/recognition.json';

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
    transition: { staggerChildren: 0.1 },
  },
};

const blockItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function RecognitionSection() {
  const { title, titleHighlight, blocks } = staticContent;

  return (
    <section className="bg-[#FFFBF2] py-[80px] px-4 sm:px-6">
      <div className="max-w-[1280px] mx-auto">
        {/* ── Title ── */}
        <motion.h2
          className="excon-font text-center text-[#1a1a1a] text-[28px] lg:text-[48px] font-light leading-snug mb-10 lg:mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          custom={0}
        >
          {title} <span className="font-bold">{titleHighlight}</span>
        </motion.h2>

        {/* ── Blocks ── */}
        <motion.div
          className="flex flex-col"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {blocks.map((block, i) => (
            <motion.div
              key={i}
              variants={blockItem}
              className={[
                'flex flex-col sm:flex-row gap-4 py-6',
                i === 0 ? 'pt-0' : '',
                i < blocks.length - 1 ? 'border-b border-[#e5e2da]' : 'pb-0',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {/* ── Left ── */}
              <div className="flex flex-row items-center gap-0 sm:w-[30%] shrink-0">
                {/* Badge / Logo */}
                <div className="lg:w-[114px] w-[90px] lg:min-h-[88px] min-h-[64px] rounded-[12px] p-3 flex items-center justify-start shrink-0">
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMG_PATH}${block.image}`}
                    alt=""
                    loading="lazy"
                    className="max-w-full lg:max-h-[72px] max-h-[54px] w-auto h-auto object-contain block"
                  />
                </div>

                {/* Category + Title */}
                <div className="flex flex-col gap-1">
                  <span className="excon-font text-[#1a1a1a] text-[12px] font-bold tracking-[1.2px] uppercase leading-[16px]">
                    {block.category}
                  </span>
                  <h3 className="excon-font text-[#1a1a1a] text-[24px] sm:text-[36px] font-bold leading-[1.25] tracking-[-0.9px] m-0 w-[74%]">
                    {block.title}
                  </h3>
                </div>
              </div>

              {/* ── Right ── */}
              <div className="flex-1 min-w-0 text-left">
                <h4 className="excon-font text-[#1a1a1a] md:text-[18px] text-[12px] font-bold leading-[28px] m-0 mb-2">
                  {block.subheading}
                </h4>
                <p className="ranade-font text-[#1a1a1a] md:text-[16px] text-[14px] font-normal leading-[1.55] m-0 mb-3">
                  {block.description}
                </p>
                <ul className="ranade-font md:flex flex-wra md:gap-10 gap-3 text-[#1a1a1a] text-[14px] font-medium leading-[20px] m-0 pl-5 list-disc">
                  {block.bullets.map((bullet, j) => (
                    <li key={j} className={j < block.bullets.length - 1 ? 'mb-1' : ''}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
