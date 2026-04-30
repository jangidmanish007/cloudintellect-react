'use client';

import { ArrowRight } from 'lucide-react';
import { useState, useRef } from 'react';
import Slider from 'react-slick';

const sliderData = [
  {
    id: 1,
    badge: 'ANNOUNCED',
    eyebrow: 'SALESFORCE WORKFORCE PARTNER RECOGNITION 2025',
    accentLine: 'ONE SKILL CAN START YOUR CAREER.',
    headline: 'THE RIGHT TRAINING CAN TRANSFORM YOUR FUTURE.',
    stats: [{ value: '360°', fs: '120px', fsMobile: '80px', label: 'TRAINING + REAL PROJECTS', highlight: true }],
    tag: "INDIA'S LEADING",
    rightTitle: 'Salesforce Workforce\nDevelopment Institute',
    rightSub: 'Powered by a Salesforce Ridge Consulting Partner',
    rightNote: 'RECOGNIZED FOR REAL-TIME PROJECT EXPOSURE & INDUSTRY-ALIGNED TRAINING',
    cta: { label: 'READ MORE', href: '#' },
  },
  {
    id: 2,
    badge: 'REAL-TIME',
    eyebrow: 'WITH INDIA AT HEART, SHAPING FUTURE TECH PROFESSIONALS',
    accentLine: "RECOGNIZED AMONG ONE OF INDIA'S LEADING",
    headline: 'SALESFORCE TRAINING INSTITUTES',
    stats: [
      { value: '5000+', fs: '96px', fsMobile: '64px', label: 'LEARNERS TRAINED', highlight: true },
      { value: '1400+', fs: '72px', fsMobile: '52px', label: 'CANDIDATES PLACED', highlight: false },
    ],
    tag: 'REAL-TIME',
    rightTitle: 'Industry-Aligned Learning',
    rightSub: 'Powered by Salesforce Workforce Development Partnership',
    rightNote: 'BACKED BY CLOUD INTELLECT SYSTEMS · SALESFORCE RIDGE PARTNER',
    cta: { label: 'READ MORE', href: '#' },
  },
];

function SlideCard({ slide }) {
  return (
    <div className="flex flex-col md:grid md:grid-cols-3 gap-5 md:gap-6 items-center px-5 sm:px-8 md:px-12 pt-8 pb-6 md:py-10">
      {/* ── TOP / LEFT — eyebrow, badge, accent, headline ── */}
      <div className="flex flex-col gap-2 md:gap-3 relative pl-4 w-full">
        <div
          className="absolute top-0 left-0 w-[3px] h-full"
          style={{
            background: 'linear-gradient(180deg, rgba(0,157,227,0) 0%, #009DE3 50%, rgba(0,157,227,0) 100%)',
          }}
        />
        {/* eyebrow + badge row */}
        <div className="flex items-start gap-2 flex-wrap">
          <p className="text-white/50 text-[10px] sm:text-[11px] md:text-[12px] uppercase tracking-widest leading-tight segoe-font">
            {slide.eyebrow}
          </p>
          <span className="segoe-font shrink-0 px-2 py-0.5 rounded-full bg-[#F59E0B] text-[#0B1C33] text-[8px] sm:text-[9px] font-bold uppercase tracking-wider">
            {slide.badge}
          </span>
        </div>

        <p className="text-[#009DE3] text-[15px] sm:text-[17px] md:text-[20px] font-semibold uppercase tracking-wider segoe-font leading-snug">
          {slide.accentLine}
        </p>
        <h2 className="text-white text-[18px] sm:text-[20px] md:text-[24px] font-bold leading-tight segoe-font">
          {slide.headline}
        </h2>
      </div>

      {/* ── MIDDLE — stats ── */}
      <div className="flex flex-row md:flex-col items-center justify-center gap-6 md:gap-4 w-full py-2 md:py-0">
        {slide.stats.map((stat, i) => (
          <div key={i} className="text-center">
            <p
              className="font-black leading-none tracking-tight"
              style={
                stat.highlight
                  ? {
                      fontSize: `clamp(56px, 12vw, ${stat.fs})`,
                      fontWeight: 900,
                      background: 'linear-gradient(180deg, #FFF7CC 0%, #FFD700 50%, #B8860B 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }
                  : {
                      fontSize: `clamp(40px, 9vw, ${stat.fs || '72px'})`,
                      color: '#fff',
                    }
              }
            >
              {stat.value}
            </p>

            {slide.stats.length === 1 ? (
              <span className="segoe-font inline-block mt-2 px-4 py-1 rounded-full bg-[#009DE3] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
                {stat.label}
              </span>
            ) : (
              <p className="segoe-font text-white/50 text-[9px] sm:text-[10px] uppercase tracking-widest mt-1">
                {stat.label}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ── BOTTOM / RIGHT — tag, title, sub, note, CTA ── */}
      <div className="flex flex-col items-start md:items-end text-left md:text-right gap-2 md:gap-3 w-full">
        <span className="segoe-font px-3 py-1 rounded-full border border-[#009DE3]/60 text-[#009DE3] text-[8px] sm:text-[9px] uppercase tracking-widest">
          {slide.tag}
        </span>
        <h3 className="segoe-font text-white text-[16px] sm:text-[18px] md:text-xl font-bold leading-snug whitespace-pre-line">
          {slide.rightTitle}
        </h3>
        <p
          className="segoe-font text-white text-[11px] sm:text-xs py-2 leading-relaxed border-l-2 md:border-l-0 md:border-r-2 border-[#009DE3] px-3"
          style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(2px)' }}
        >
          {slide.rightSub}
        </p>
        <p className="segoe-font text-white/30 text-[8px] sm:text-[9px] uppercase tracking-widest leading-relaxed">
          ★ {slide.rightNote}
        </p>
        <button className="btn-primary inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold tracking-wide mt-1">
          READ MORE
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}

export default function PromoCarousel() {
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    beforeChange: (_, next) => setCurrent(next),
  };

  return (
    <section className="w-full py-8 sm:py-10 md:py-14 px-4 sm:px-6 lg:px-8">
      <div
        className="max-w-[1280px] mx-auto rounded-[16px] overflow-hidden border border-white/5 relative"
        style={{
          backgroundImage: `url('${process.env.NEXT_PUBLIC_IMG_PATH}images/home/permo-section-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Slider ref={sliderRef} {...settings}>
          {sliderData.map((slide) => (
            <div key={slide.id} className="outline-none">
              <SlideCard slide={slide} />
            </div>
          ))}
        </Slider>

        {/* Dots */}
        <div className="flex justify-center items-center gap-2 pb-5">
          {sliderData.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => sliderRef.current?.slickGoTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={[
                'transition-all duration-300 rounded-full border-0 outline-none cursor-pointer p-0',
                current === i ? 'w-6 h-2.5 bg-[#009DE3]' : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60',
              ].join(' ')}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
