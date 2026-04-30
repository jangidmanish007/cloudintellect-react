'use client';
import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';
import Image from 'next/image';

// ─── Footer data ────────────────────────────────────────────────────────────
const FOOTER_DATA = {
  brand: {
    name: 'Cloud Intellect',
    tagline: "India's #1 Salesforce training institute, empowering careers since 2012.",
    contact: [
      { icon: MapPin, label: 'Nagpur & Pune Centers' },
      { icon: Mail, label: 'info@cloudintellect.in', href: 'mailto:info@cloudintellect.in' },
      { icon: Phone, label: '+91 98765 43210', href: 'tel:+919876543210' },
    ],
  },
  courses: {
    heading: 'Courses',
    links: [
      { label: 'Salesforce Administrator', href: '/courses/salesforce-administrator' },
      { label: 'Salesforce Developer', href: '/courses/salesforce-developer' },
      { label: 'Salesforce + AI', href: '/courses/salesforce-ai' },
      { label: 'Marketing Cloud', href: '/courses/marketing-cloud' },
    ],
  },
  quickLinks: {
    heading: 'Quick Links',
    links: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Success Stories', href: '/success-stories' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact-us' },
    ],
  },
  cta: {
    heading: 'Get Started',
    body: 'Ready to transform your career? Join thousands of successful graduates.',
    btnLabel: 'Enroll Now',
    btnHref: '/enroll',
  },
  bottom: {
    copyright: `© ${new Date().getFullYear()} Cloud Intellect. All rights reserved.`,
    credit: { label: 'Design & Developed by Mediagarh', href: 'https://mediagarh.com' },
    legal: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
    ],
  },
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function Footer() {
  const { brand, courses, quickLinks, cta, bottom } = FOOTER_DATA;

  return (
    <footer className="bg-[var(--color-dark)] text-white">
      {/* ── Main grid ── */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.4fr] gap-10 lg:gap-8">
          {/* Col 1 – Brand */}
          <div className="flex flex-col gap-5">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src={`${process.env.NEXT_PUBLIC_IMG_PATH}images/cloud-logo-white.svg`}
                width={161}
                height={60}
                alt="logo"
              />
            </div>

            {/* Tagline */}
            <p className="text-base text-[var(--color-gray)] leading-relaxed max-w-[267px]">{brand.tagline}</p>

            {/* Contact info */}
            <ul className="flex flex-col gap-2.5">
              {brand.contact.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      className="flex items-center gap-2.5 text-base text-[var(--color-gray)] hover:text-white transition-colors"
                    >
                      <Icon size={14} className="shrink-0 text-gray-500" />
                      {label}
                    </a>
                  ) : (
                    <span className="flex items-center gap-2.5 text-base text-[var(--color-gray)]">
                      <Icon size={14} className="shrink-0 text-gray-500" />
                      {label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2 – Courses */}
          <FooterLinkColumn heading={courses.heading} links={courses.links} />

          {/* Col 3 – Quick Links */}
          <FooterLinkColumn heading={quickLinks.heading} links={quickLinks.links} />

          {/* Col 4 – Get Started */}
          <div className="flex flex-col gap-4">
            <h4 className="text-base font-medium text-white">{cta.heading}</h4>
            <p className="text-base text-[var(--color-gray)] leading-relaxed">{cta.body}</p>
            <Link
              href={cta.btnHref}
              className="inline-flex items-center justify-center rounded-md bg-blue hover:bg-[#0057d4] active:bg-[#0047b3] transition-colors text-white text-base font-medium px-6 py-2.5 w-full sm:w-auto"
            >
              {cta.btnLabel}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            {/* Copyright */}
            <span>{bottom.copyright}</span>

            {/* Credit */}
            <a
              href={bottom.credit.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              {bottom.credit.label}
            </a>

            {/* Legal links */}
            <div className="flex items-center gap-4">
              {bottom.legal.map(({ label, href }) => (
                <Link key={label} href={href} className="hover:text-gray-300 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Reusable link column ─────────────────────────────────────────────────────
function FooterLinkColumn({ heading, links }) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-base font-medium text-white">{heading}</h4>
      <ul className="flex flex-col gap-2.5">
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link href={href} className="text-base text-[var(--color-gray)] hover:text-white transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
