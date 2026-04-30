'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

/* ── Scroll-entry variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/* ── Hover variants for glass cards ── */
const hoverGlass = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  hover: {
    scale: 1.01,
    y: -2,
    boxShadow: '0 16px 40px rgba(0,0,0,0.11)',
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ── Hover variant for dark card ── */
const hoverDark = {
  rest: {
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  hover: {
    scale: 1.01,
    y: -2,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

/* Shared glass card inline style */
const glassStyle = {
  background: 'rgba(255, 255, 255, 0.70)',
  border: '1px solid rgba(255, 255, 255, 0.50)',
  backdropFilter: 'blur(6px)',
};

export default function EcosystemSection({ ecosystem }) {
  const eco = ecosystem || {};
  const c1 = eco.card1 || {};
  const c2 = eco.card2 || {};
  const c3 = eco.card3 || {};
  const c4 = eco.card4 || {};
  const c5 = eco.card5 || {};

  return (
    <section className="relative bg-[#F8FAFC] py-16 px-6 overflow-hidden">
      {/* ── Inner container with map background ── */}
      <div
        className="relative z-10 max-w-[1280px] mx-auto bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('${process.env.NEXT_PUBLIC_IMG_PATH}images/Map.webp')` }}
      >
        {/* ── Header ── */}
        <div className="flex flex-wrap justify-between items-start gap-6 mb-12">
          <motion.div
            className="max-w-[520px]"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
          >
            <h2 className="excon-font text-[#0f172a] text-[2.5rem] font-bold leading-[1.2] mb-4">{eco.title}</h2>
            <p className="segoe-font text-[#475569] text-base font-normal leading-[1.6] m-0">{eco.description}</p>
          </motion.div>

          {eco.trustedImage && (
            <motion.div
              className="shrink-0"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              custom={0.12}
            >
              <Image
                src={`${process.env.DYNAMIC_IMG_BASE_PATH}${eco.trustedImage}`}
                alt="Trusted by thousands"
                width={147}
                height={80}
                className="block max-w-[147px] h-auto object-contain"
              />
            </motion.div>
          )}
        </div>

        {/* ── Cards ── */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* ── Row 1: Yellow card + two white stat cards ── */}
          <div className="flex flex-wrap gap-4 sm:gap-6">
            {/* Card 1 — Yellow "World's No.1 CRM" */}
            {/* Entry wrapper */}
            <motion.div
              className="w-full md:flex-1 md:min-w-0"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              custom={0.05}
            >
              {/* Hover wrapper */}
              <motion.div
                className="h-full"
                initial="rest"
                whileHover="hover"
                animate="rest"
                variants={{
                  rest: { scale: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
                  hover: { scale: 1.018, y: -5, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                <div
                  className="relative rounded-3xl p-4 sm:p-6 min-h-[160px] overflow-hidden h-full cursor-default"
                  style={{
                    background: 'linear-gradient(135deg, #FEFCE8 0%, #FFF 100%)',
                    border: '1px solid rgba(250, 204, 21, 0.3)',
                  }}
                >
                  {/* Trophy watermark */}
                  <div
                    className="absolute right-4 top-[34%] -translate-y-1/2 w-[127px] h-[127px] pointer-events-none"
                    aria-hidden
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMG_PATH}images/home/eco-trophy.svg`}
                      alt=""
                      className="w-full h-full"
                    />
                  </div>

                  <span className="inline-block px-2 py-1 rounded bg-[#FEF9C3] text-[#A16207] text-[10px] excon-font font-bold tracking-[0.06em] uppercase">
                    {c1.tag}
                  </span>

                  <p className="excon-font relative z-10 mt-2 mb-0.5 text-[#0B1C33] font-bold leading-tight text-[36px] sm:text-[48px]">
                    {c1.bigText}
                  </p>

                  <p className="excon-font pb-4 sm:pb-11 text-amber-muted font-bold text-[18px] sm:text-[24px] leading-8 m-0">
                    {c1.subText}
                  </p>

                  <p
                    className="ranade-font text-[12px] text-black leading-[22.75px] m-0 pt-[27px] w-[85%]"
                    style={{ borderTop: '1.25px solid rgba(254, 240, 138, 0.50)' }}
                  >
                    {c1.note}
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Cards 2 & 3 — side-by-side on mobile, flex-1 on md+ */}
            <div className="flex gap-4 sm:gap-6 w-full md:contents">
              {/* Card 2 — Market Share */}
              <motion.div
                className="flex-1 min-w-0"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                custom={0.15}
              >
                <motion.div
                  className="relative rounded-3xl p-4 sm:p-6 min-h-[160px] h-full cursor-default"
                  style={glassStyle}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  variants={hoverGlass}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className="w-[35px] h-[35px] flex items-center justify-center rounded-[6px]"
                      style={{ background: 'rgba(34, 197, 94, 0.15)' }}
                      aria-hidden
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMG_PATH}images/home/eco-trend-up.svg`}
                        alt=""
                        className="w-[27px] h-[27px]"
                      />
                    </span>
                    <span className="flex items-center justify-center" aria-hidden>
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMG_PATH}images/home/eco-expand-arrow.svg`}
                        alt=""
                        className="w-5 h-5"
                      />
                    </span>
                  </div>

                  <p className="excon-font font-bold text-[#0f172a] text-[32px] sm:text-[40px] lg:text-[48px] leading-none tracking-[-1.2px] mt-[18%] sm:mt-[23%] sm:mb-0 mb-4">
                    {c2.stat}
                  </p>
                  <p className="ranade-font text-black text-[13px] sm:text-[16px] font-medium m-0">{c2.label}</p>
                  <p className="segoe-font text-black text-[11px] sm:text-[12px] font-normal leading-4 m-0 pt-[7px]">
                    {c2.source}
                  </p>
                </motion.div>
              </motion.div>

              {/* Card 3 — Customers */}
              <motion.div
                className="flex-1 min-w-0"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                custom={0.25}
              >
                <motion.div
                  className="relative rounded-3xl p-4 sm:p-6 min-h-[160px] h-full cursor-default"
                  style={glassStyle}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  variants={hoverGlass}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className="w-[35px] h-[35px] flex items-center justify-center rounded-[6px] bg-[#EEF2FF]"
                      aria-hidden
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMG_PATH}images/home/eco-users.svg`}
                        alt=""
                        className="w-[27px] h-[27px]"
                      />
                    </span>
                    <span className="flex items-center justify-center" aria-hidden>
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMG_PATH}images/home/eco-expand-arrow.svg`}
                        alt=""
                        className="w-5 h-5"
                      />
                    </span>
                  </div>

                  <p className="excon-font font-bold text-[#0f172a] text-[32px] sm:text-[40px] lg:text-[48px] leading-none tracking-[-1.2px] mt-[18%] sm:mt-[23%] sm:mb-0 mb-4">
                    {c3.stat}
                  </p>
                  <p className="ranade-font text-black text-[13px] sm:text-[16px] font-medium m-0">{c3.label}</p>
                  <p className="segoe-font text-black text-[11px] sm:text-[12px] font-normal leading-4 m-0 pt-[7px]">
                    {c3.source}
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* ── Row 2: Financials (flex-1) + Economic Impact (flex-2) ── */}
          <div className="flex flex-wrap md:flex-nowrap gap-4 sm:gap-6 items-stretch">
            {/* Card 4 — Financials */}
            <motion.div
              className="w-full md:flex-1"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              custom={0.1}
            >
              <motion.div
                className="relative rounded-3xl p-4 sm:p-6 min-h-[160px] flex flex-col justify-center h-full cursor-default"
                style={glassStyle}
                initial="rest"
                whileHover="hover"
                animate="rest"
                variants={hoverGlass}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <span
                    className="inline-flex items-center justify-center w-[47px] h-[47px] rounded-full shrink-0 bg-[#FAF5FF]"
                    aria-hidden
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMG_PATH}images/home/eco-dollar.svg`}
                      alt=""
                      className="w-6 h-6"
                    />
                  </span>
                  <span className="ranade-font text-[#9333EA] text-[14px] font-bold tracking-[0.7px] uppercase leading-5">
                    {c4.tag}
                  </span>
                </div>

                <p className="excon-font font-bold text-[#0f172a] text-[32px] sm:text-[40px] lg:text-[48px] leading-none tracking-[-1.2px] mt-2 lg:mb-0 mb-4">
                  {c4.stat}
                </p>
                <p className="ranade-font text-black text-[13px] sm:text-[16px] font-medium m-0">{c4.label}</p>
              </motion.div>
            </motion.div>

            {/* Card 5 — Economic Impact (dark) */}
            <motion.div
              className="w-full md:flex-2"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              custom={0.2}
            >
              <motion.div
                className="relative rounded-3xl px-6 sm:px-8 pt-6 sm:pt-8 pb-8 sm:pb-9 flex flex-col justify-start overflow-hidden h-full cursor-default"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
                initial="rest"
                whileHover="hover"
                animate="rest"
                variants={hoverDark}
              >
                {/* Tag row */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009FFF] shrink-0" />
                  <span className="excon-font text-white/90 text-[10px] font-bold tracking-[0.08em] uppercase">
                    {c5.tag}
                  </span>
                </div>

                {/* Main content */}
                <div className="mt-auto pt-6 sm:pr-0 pr-[80px]">
                  <p className="excon-font font-bold text-white text-[32px] sm:text-[40px] lg:text-[48px] leading-none tracking-[-1.2px] lg:mb-0 mb-4">
                    {c5.stat}
                  </p>
                  <p className="ranade-font text-white/90 text-[13px] sm:text-[16px] font-medium m-0">{c5.label}</p>
                  <p className="segoe-font text-white/50 text-[11px] mt-2">{c5.source}</p>
                </div>

                {/* Briefcase circle — decorative */}
                <div className="absolute right-8 bottom-10 opacity-95" aria-hidden>
                  <div
                    className="md:w-[115px] md:h-[115px] w-[60px] h-[60px] rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(0, 159, 255, 0.20)',
                      backdropFilter: 'blur(2px)',
                    }}
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMG_PATH}images/home/eco-briefcase.svg`}
                      alt=""
                      className="md:w-14 w-[40px] md:h-[52px] h-[40px]"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
