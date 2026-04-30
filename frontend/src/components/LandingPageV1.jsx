import React from 'react'
import { Link } from 'react-router-dom'
import { usePageContentContext } from '../contexts/PageContentContext'
import { getImageUrl } from '../services/api'

function NavLink({ href, children, className, ...props }) {
  if (!href || href === '#') return <span className={className} {...props}>{children}</span>
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return <a href={href} className={className} {...props}>{children}</a>
  }
  const path = href.startsWith('/') ? href : `/${href}`
  return <Link to={path} className={className} {...props}>{children}</Link>
}

/** LP-V1 full landing page – hero is dynamic from CMS (Admin → Pages → Edit "landing"); rest is static. */
export default function LandingPageV1() {
  const { content } = usePageContentContext()
  const hero = content?.hero || {}
  const topBar = hero.topBar || {}
  const eventBar = hero.eventBar || {}
  const video = hero.video || {}
  const cta = hero.cta || {}
  const stats = Array.isArray(hero.stats) ? hero.stats : [
    { value: '2000+', label: 'Students Placed' },
    { value: '200+', label: 'Hiring Partners' },
    { value: '₹8 LPA', label: 'Avg Salary' },
  ]

  const logoPath = topBar.logoUrl || '/images/Logo (1).webp'
  const logoUrl = logoPath.startsWith('/') ? getImageUrl(logoPath) : logoPath
  const phone = topBar.phone || '8766996944'
  const contactBtnText = topBar.contactButtonText || 'Contact Us'
  const contactBtnHref = topBar.contactButtonHref || '/contact'
  const eventDate = eventBar.date || '8th November'
  const eventTime = eventBar.time || '08:30 AM'
  const headline = hero.headline || "Become a Salesforce Developer in 90 Days & Land a ₹5–22 LPA IT Job"
  const subHeadline = hero.subHeadline || "Even if You're from Non-IT"
  const supportingText = hero.supportingText || "Join 1200+ students who transformed their career with Salesforce. Live Masterclass + Guaranteed Placement Assistance."
  const videoThumbUrl = video.thumbnailUrl ? (video.thumbnailUrl.startsWith('/') ? getImageUrl(video.thumbnailUrl) : video.thumbnailUrl) : 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/CR0ciZ2LTi/5ngbi7vw_expires_30_days.png'
  const videoHref = video.videoUrl || '#'
  const ctaText = cta.buttonText || 'Register for a free 3-day Masterclass'
  const ctaHref = cta.buttonHref || '#register'

  return (
    <div className="flex flex-col bg-white">
      <div className="self-stretch bg-white">
        <div className="flex flex-col items-center self-stretch bg-[#0B121E]">
          <div
            className="self-stretch pt-[100px]"
            style={{ background: 'linear-gradient(180deg, #0B121ECC, #0B121EE3, #0B121E)' }}
          >
            {/* Top bar – dynamic */}
            <div className="flex justify-between items-center self-stretch max-w-[1440px] mb-[74px] mx-auto px-4 sm:px-6">
              <NavLink href="/" className="flex flex-col shrink-0 items-start bg-[#00FFE61A] text-left py-[22px] px-[29px] rounded-[10px] border border-solid border-[#00FFE64D]">
                {logoUrl && <img src={logoUrl} alt="Cloud Intellect" className="w-40 h-16 object-fill" />}
              </NavLink>
              <div className="flex shrink-0 items-center gap-5">
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex shrink-0 items-center py-3.5 px-6 gap-2.5 rounded-lg text-white no-underline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                    <path d="M13.9996 10.4817V12.5893C14.0004 12.7849 13.9602 12.9786 13.8817 13.1578C13.8031 13.3371 13.6879 13.498 13.5435 13.6303C13.399 13.7626 13.2285 13.8633 13.0428 13.9259C12.8571 13.9886 12.6603 14.0119 12.465 13.9943C10.299 13.7594 8.2183 13.0207 6.39023 11.8376C4.68945 10.7589 3.24748 9.31984 2.16674 7.62243C0.977102 5.78969 0.236769 3.70306 0.00571348 1.53156C-0.011877 1.33729 0.0112568 1.1415 0.0736417 0.956639C0.136027 0.77178 0.236296 0.601911 0.368066 0.457846C0.499835 0.313781 0.660218 0.198678 0.839003 0.119863C1.01779 0.0410494 1.21106 0.000251806 1.40651 6.81111e-05H3.51826C3.85987 -0.00328744 4.19105 0.117444 4.45007 0.33976C4.70909 0.562076 4.87828 0.870806 4.92609 1.20841C5.01522 1.88287 5.18052 2.54511 5.41883 3.18249C5.51354 3.43394 5.53403 3.70721 5.47789 3.96993C5.42175 4.23265 5.29132 4.4738 5.10207 4.66481L4.20809 5.55701C5.21016 7.31581 6.6693 8.77206 8.43159 9.77214L9.32556 8.87994C9.51695 8.69106 9.75858 8.56089 10.0218 8.50486C10.2851 8.44883 10.5589 8.46929 10.8108 8.56381C11.4495 8.80164 12.113 8.96662 12.7888 9.05557C13.1308 9.10371 13.4431 9.2756 13.6663 9.53855C13.8895 9.8015 14.0081 10.1372 13.9996 10.4817Z" fill="#00FFE6" />
                  </svg>
                  <span className="text-white text-lg font-bold">{phone}</span>
                </a>
                <NavLink href={contactBtnHref} className="flex flex-col shrink-0 items-start bg-[#00FFE6] text-left py-3.5 px-6 rounded-lg border-0 no-underline">
                  <span className="text-black text-lg font-bold">{contactBtnText}</span>
                </NavLink>
              </div>
            </div>

            {/* Hero content – dynamic */}
            <div className="flex items-center self-stretch max-w-[1440px] mb-[108px] mx-auto gap-[35px] px-4 sm:px-6 flex-wrap">
              <div className="flex flex-1 flex-col items-start min-w-[280px]">
                <div className="flex flex-col items-start self-stretch mb-[39px] gap-6">
                  <div className="flex items-center bg-[#00FFE61A] text-left py-[9px] px-[18px] gap-2 rounded-[9999px] border border-solid border-[#00FFE64D]">
                    <span className="text-white text-sm">Date: {eventDate} | Time: {eventTime}</span>
                  </div>
                  <div className="flex flex-col items-start self-stretch">
                    <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold max-w-[773px] mb-[19px] whitespace-pre-line">
                      {headline}
                    </h1>
                    <span className="text-[#B3B3B3] text-xl mb-[21px] ml-[1px]">{subHeadline}</span>
                    <span className="text-white text-lg max-w-[605px] whitespace-pre-line">{supportingText}</span>
                  </div>
                </div>
                <div className="flex items-center mb-10 gap-10 flex-wrap">
                  {stats.map((stat, i) => (
                    <div key={i} className="flex shrink-0 items-center gap-2">
                      <div className="flex flex-col shrink-0 items-start py-[5px] gap-2.5">
                        <span className="text-white text-base font-bold">{stat.value}</span>
                        <span className="text-[#B3B3B3] text-sm">{stat.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <NavLink
                  href={ctaHref}
                  className="flex flex-col items-start bg-[#00FFE6] text-left py-[13px] px-3.5 rounded border-0 no-underline"
                >
                  <span className="text-[#0B121E] text-lg">{ctaText}</span>
                </NavLink>
              </div>
              <NavLink href={videoHref} className="flex-1 min-w-[280px] max-w-[600px] block">
                <img src={videoThumbUrl} alt="" className="w-full h-[353px] object-cover rounded-xl" />
              </NavLink>
            </div>

            {/* Webinar bar – static for now */}
            <div className="flex justify-between items-center self-stretch bg-[#131B29] py-5 px-6 sm:px-12 lg:px-60 mb-[15px] rounded-tl-[20px] rounded-tr-[20px] flex-wrap gap-4">
              <div className="flex flex-col shrink-0 items-start">
                <span className="text-white text-xl sm:text-2xl font-bold">Register for the Free 3-Day Salesforce Webinar</span>
                <span className="text-white text-base">Live from 8:30 PM – 10:00 PM · Limited Seats — Don’t Miss Out!</span>
              </div>
              <NavLink href={ctaHref} className="flex flex-col shrink-0 items-start bg-[#00FFE6] text-left p-3.5 rounded border-0 no-underline">
                <span className="text-[#0B121E] text-lg font-bold">Register Now</span>
              </NavLink>
            </div>
          </div>

          {/* Rest of LP-V1: static sections (same design as LP-V1 zip) */}
          <LPV1StaticSections ctaHref={ctaHref} />
        </div>
      </div>
    </div>
  )
}

/** Static middle/bottom sections from LP-V1 – all CTAs use ctaHref. */
function LPV1StaticSections({ ctaHref }) {
  return (
    <>
      <div className="flex flex-col items-center self-stretch bg-[#242F424D] py-[82px] mb-20 gap-12">
        <div className="flex flex-col items-center max-w-[1368px] mx-auto px-4">
          <span className="text-white text-3xl sm:text-4xl font-bold mb-[45px] text-center">Why You're Still Not in an IT Job</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {[
              'No clarity on where to start in IT',
              "You've done certifications… but nothing changed",
              'No coding knowledge or technical background',
              'Fear of switching — What if I fail?',
            ].map((text, i) => (
              <div key={i} className="flex shrink-0 items-center bg-[#121B2B] py-[25px] rounded-xl border border-solid border-[#242F42] px-4">
                <span className="text-white text-lg">{text}</span>
              </div>
            ))}
          </div>
          <NavLink href={ctaHref} className="inline-flex flex-col items-start bg-[#00FFE6] text-left p-3.5 rounded border-0 no-underline mt-8">
            <span className="text-[#0B121E] text-lg">Register for a free 3-day Masterclass</span>
          </NavLink>
        </div>
      </div>

      <div className="flex flex-col items-center self-stretch max-w-[1368px] mb-20 mx-auto px-4">
        <span className="text-white text-3xl sm:text-4xl font-bold mb-[21px] text-center">Your Career After 120 Days</span>
        <span className="text-[#B3B3B3] text-xl mb-[55px] text-center">From Zero to Salesforce Professional</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {[
            { title: 'Become Job-Ready in\nSalesforce', desc: 'Master in-demand skills in just 120\ndays' },
            { title: 'Build Real Industry\nProjects', desc: 'Hands-on experience with actual\nbusiness scenarios' },
            { title: 'Crack 3–5 Interviews', desc: 'Interview prep & placement\nassistance included' },
            { title: 'Earn ₹5–22 LPA Salary', desc: 'Start your IT career with\ncompetitive packages' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-1 flex-col items-start py-[25px] rounded-xl border border-solid border-[#00FFE633] px-6"
              style={{ background: 'linear-gradient(180deg, #121B2B, #0E1625)' }}
            >
              <span className="text-white text-xl font-bold mb-[15px] whitespace-pre-line">{item.title}</span>
              <span className="text-[#B3B3B3] text-base whitespace-pre-line">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center self-stretch bg-[#242F424D] py-[81px]">
        <span className="text-white text-3xl sm:text-4xl font-bold mb-7 text-center">Success Stories from Our Students</span>
        <span className="text-[#B3B3B3] text-xl mb-[52px] text-center">Real people, real transformations</span>
        <NavLink href={ctaHref} className="inline-flex flex-col items-start bg-[#00FFE6] text-left p-3.5 rounded border-0 no-underline">
          <span className="text-[#0B121E] text-lg">Register for a free 3-day Masterclass</span>
        </NavLink>
      </div>

      <div className="flex flex-col items-center self-stretch py-20" style={{ background: 'linear-gradient(180deg, #00FF770D, #00FF7700)' }}>
        <span className="text-white text-3xl sm:text-4xl font-bold mb-[19px] text-center">Why Salesforce? The Market Says It All</span>
        <span className="text-[#B3B3B3] text-xl mb-[51px] text-center">Join the fastest-growing tech ecosystem</span>
        <NavLink href={ctaHref} className="inline-flex flex-col items-start bg-[#00FFE6] text-left p-3.5 rounded border-0 no-underline">
          <span className="text-[#0B121E] text-lg">Register for a free 3-day Masterclass</span>
        </NavLink>
      </div>

      <div className="flex flex-col items-center self-stretch bg-[#242F424D] py-[82px] mb-20">
        <span className="text-white text-3xl sm:text-4xl font-bold mb-7 text-center">What You'll Learn in the Masterclass</span>
        <span className="text-[#B3B3B3] text-xl mb-[67px] text-center max-w-[600px]">Everything you need to kickstart your Salesforce career</span>
        <NavLink href={ctaHref} className="inline-flex flex-col items-start bg-[#00FFE6] text-left p-3.5 rounded border-0 no-underline">
          <span className="text-[#0B121E] text-lg">Register for a free 3-day Masterclass</span>
        </NavLink>
      </div>

      <div className="flex flex-col items-center self-stretch bg-[#242F424D] py-[81px]">
        <span className="text-slate-50 text-4xl font-bold text-center mb-9">Start Your Salesforce Career Today</span>
        <span className="text-[#9096A2] text-xl text-center max-w-[600px] mb-7">Join 10,000+ students who transformed their careers. Reserve your free seat in the next masterclass.</span>
        <NavLink href={ctaHref} className="inline-flex flex-col items-start bg-[#00FFE6] text-left p-3.5 mb-[41px] rounded border-0 no-underline">
          <span className="text-[#0B121E] text-lg">Register for a free 3-day Masterclass</span>
        </NavLink>
        <div className="flex items-center gap-8 flex-wrap justify-center text-[#9096A2] text-sm">
          <span>No hidden costs</span>
          <span>Lifetime access</span>
          <span>Job placement support</span>
        </div>
      </div>
    </>
  )
}
