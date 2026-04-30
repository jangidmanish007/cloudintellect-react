'use client';

import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import { motion, AnimatePresence } from 'framer-motion';
import HeroApplicationForm from './HeroApplicationForm';
import { ArrowBigRight, ArrowBigRightDashIcon, ArrowRight } from 'lucide-react';

const SLIDES = [
  {
    name: 'Shubham',
    lastName: 'Khanorkar',
    designation: 'Sr. Product Manager',
    package: '18.5',
    image: 'images/home/shubhum-img.png',
    logo: 'metacube',
    logoColor: '#009FFF',
  },
  {
    name: 'Shivam',
    lastName: 'Armakar',
    designation: 'Sr. Project Manager',
    package: '15.5',
    image: 'images/home/shivam-img.webp',
    logo: 'cognizant',
    logoColor: '#1A73E8',
  },
  {
    name: 'Vaibhav',
    lastName: 'Kawale',
    designation: 'Sr. Product Manager',
    package: '14',
    image: 'images/home/vaibhav-img.webp',
    logo: 'Deloitte.',
    logoColor: '#86BC25',
  },
  {
    name: 'Vinay',
    lastName: 'Jaiswal',
    designation: 'Sr. Salesforce Developer',
    package: '11.5',
    image: 'images/home/vinay.webp',
    logo: 'mindsay',
    logoColor: '#ffffff',
  },
];

const HERO_TITLE_BOLD = "India's Leading";
const HERO_TITLE_NORMAL = 'Salesforce Training & Career Institute';
const HERO_SUBTITLE =
  'Empowering learners across India with industry-ready skills, certifications, and real project experience.';
const HERO_DESCRIPTION =
  'Cloud Intellect delivers structured Salesforce learning powered by expert mentors and real consulting exposure, shaping professionals who thrive in global technology careers.';

export default function HomeBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    beforeChange: (_, next) => setCurrentSlide(next),
  };

  const current = SLIDES[currentSlide];

  return (
    <section
      className="relative w-full min-h-[600px] lg:min-h-[956px] overflow-hidden flex items-end lg:pt-0 pt-[120px]"
      style={{
        backgroundImage: "url('images/home/home-banner-img-1.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-0">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-stretch gap-6 lg:gap-0 min-h-[580px] lg:min-h-[640px]">
          {/* ── LEFT: Text + Slider ── */}
          <div className="flex flex-col justify-center flex-1 lg:max-w-[38%] xl:max-w-[36%] pb-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mb-6 lg:mb-10"
            >
              <h1 className="text-white text-[28px] sm:text-[32px] lg:text-[38px] xl:text-[48px] lg:leading-[54px] leading-[36px] font-bold mb-4">
                <span className="font-bold">{HERO_TITLE_BOLD}</span>
                <br />
                <span className="font-light">{HERO_TITLE_NORMAL}</span>
              </h1>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-3">{HERO_SUBTITLE}</p>
              <p className="text-white/75 text-xs sm:text-sm leading-relaxed mb-6">{HERO_DESCRIPTION}</p>
              <button className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wide">
                APPLY TODAY
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Slider info bar */}
            <div className="">
              <Slider ref={sliderRef} {...settings}>
                {SLIDES.map((slide, i) => (
                  <div key={i}>
                    <AnimatePresence mode="wait">
                      {currentSlide === i && (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.4 }}
                          className="flex items-center lg:gap-12 gap-6 rounded pb-4"
                        >
                          {/* Name + designation */}
                          <div className="min-w-0">
                            <p className="text-white font-bold md:text-[24px] text-[16px] leading-tight">
                              {slide.name} <span className="font-light block">{slide.lastName}</span>
                            </p>
                            <p className="text-white/60 text-[10px] uppercase tracking-wider mt-0.5">
                              {slide.designation}
                            </p>
                          </div>

                          <div className="w-px h-8 bg-white/30 shrink-0" />

                          {/* Package */}
                          <div className="shrink-0">
                            <p className="text-white font-bold md:text-[24px] text-[16px] leading-tight text-center">
                              {slide.package} <span className="font-light text-xs block">LPA</span>
                            </p>
                            <p className="text-white/60 text-[10px] uppercase tracking-wider mt-0.5">Package</p>
                          </div>

                          <div className="w-px h-8 bg-white/30 shrink-0" />

                          {/* Logo */}
                          <div className="shrink-0">
                            <span
                              className="font-bold text-base tracking-tight max-w-[100px]"
                              style={{ color: slide.logoColor }}
                            >
                              <img
                                src={`${process.env.NEXT_PUBLIC_IMG_PATH}images/home/meta-cube-logo.svg`}
                                className="img-fluid max-w-[100px]"
                              />
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </Slider>

              {/* Nav buttons */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => sliderRef.current?.slickPrev()}
                  aria-label="Previous"
                  className="w-8 h-8 cursor-pointer rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M10 12L6 8l4-4"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => sliderRef.current?.slickNext()}
                  aria-label="Next"
                  className="w-8 h-8 cursor-pointer rounded-full bg-[#009FFF] hover:bg-[#007acc] transition flex items-center justify-center"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 4l4 4-4 4"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── CENTER: Person image ── */}
          <div className="hidden lg:flex flex-1 items-end justify-center relative self-end">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide}
                src={current.image}
                alt={`${current.name} ${current.lastName}`}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="max-h-[580px] w-auto object-contain object-bottom drop-shadow-2xl"
              />
            </AnimatePresence>
          </div>

          {/* ── RIGHT: Application form ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="w-full lg:w-[340px] xl:w-[400px] shrink-0 flex items-start pt-6 lg:py-6"
          >
            <HeroApplicationForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
