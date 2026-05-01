'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Slider from 'react-slick';
import { ChevronDown, Phone, User, Menu, X } from 'lucide-react';
import { topBar, mainNav, loginButton, helpline, secondaryNav } from './navData';
import { getHeaderCarousel } from '@/_services/homeService';

// ─── Custom Social Media Icons (no lucide equivalent) ─────────────────────────
// lucide-react has no Facebook, LinkedIn, YouTube, or Instagram icons.
// WhatsApp is also not in lucide-react — using brand SVGs for all social icons.
const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M8 0C3.58 0 0 3.58 0 8c0 1.4.37 2.72 1.01 3.86L0 16l4.25-1.11A7.96 7.96 0 0 0 8 16c4.42 0 8-3.58 8-8s-3.58-8-8-8zm3.93 11.07c-.17.47-1 .9-1.38.96-.35.05-.8.07-1.28-.08a11.7 11.7 0 0 1-1.16-.43C6.5 10.8 5.3 9.3 5.2 9.17c-.1-.13-.8-1.07-.8-2.04 0-.97.5-1.44.68-1.64.18-.2.39-.25.52-.25h.37c.12 0 .28-.05.44.33l.56 1.4c.05.12.08.26.02.4l-.2.4-.3.3c-.1.1-.2.2-.09.4.12.2.52.86 1.12 1.4.77.68 1.42.9 1.62 1 .2.1.32.08.44-.05l.6-.7c.13-.17.26-.13.44-.08l1.38.65c.2.1.33.14.38.22.05.08.05.47-.12.94z"
      fill="#25D366"
    />
  </svg>
);

const SOCIAL_ICONS = {
  facebook: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
    </svg>
  ),
  linkedin: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
    </svg>
  ),
  youtube: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
    </svg>
  ),
  instagram: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.29-.044zM8 3.862a4.138 4.138 0 1 0 0 8.276 4.138 4.138 0 0 0 0-8.276zm0 1.442a2.696 2.696 0 1 1 0 5.392 2.696 2.696 0 0 1 0-5.392zm4.406-2.594a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92z" />
    </svg>
  ),
};

// ─── Header Component ─────────────────────────────────────────────────────────
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileAccordion, setOpenMobileAccordion] = useState(null);
  const [carouselSlides, setCarouselSlides] = useState(topBar.carousel);

  // Sync scroll state on mount — browser scroll restoration is async so we
  // poll a few frames to catch the restored scroll position after refresh.
  useEffect(() => {
    const syncScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 50);
      setShowTopBar(y <= 50);
      setLastScrollY(y);
    };

    // Check immediately, then on next two frames, then after 100ms
    // to reliably catch browser's async scroll restoration on refresh.
    syncScroll();
    const r1 = requestAnimationFrame(() => {
      syncScroll();
      const r2 = requestAnimationFrame(syncScroll);
      return () => cancelAnimationFrame(r2);
    });
    const t1 = setTimeout(syncScroll, 100);
    const t2 = setTimeout(syncScroll, 300);
    const t3 = setTimeout(syncScroll, 600);

    // pageshow fires on refresh and bfcache restore — most reliable for scroll sync
    window.addEventListener('pageshow', syncScroll);

    return () => {
      cancelAnimationFrame(r1);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('pageshow', syncScroll);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch top-bar carousel slides from API on mount
  useEffect(() => {
    async function fetchCarouselData() {
      const response = await getHeaderCarousel();
      if (response?.status) {
        setCarouselSlides(response.result);
      } else {
        setCarouselSlides(topBar.carousel);
      }
    }
    fetchCarouselData();
  }, []);

  // Scroll detection with debounce to prevent flickering
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // Set scrolled state (for transparent -> white transition)
          setIsScrolled(scrollY > 50);

          // Show/hide top bar based on scroll direction
          if (scrollY < 50) {
            // Always show top bar at the very top
            setShowTopBar(true);
          } else if (scrollY < lastScrollY) {
            // Scrolling up - show top bar
            setShowTopBar(true);
          } else if (scrollY > lastScrollY && scrollY > 100) {
            // Scrolling down - hide top bar
            setShowTopBar(false);
          }

          setLastScrollY(scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('drawer-open');
    } else {
      document.body.classList.remove('drawer-open');
    }
    return () => document.body.classList.remove('drawer-open');
  }, [isMobileMenuOpen]);

  const toggleMobileAccordion = (label) => {
    setOpenMobileAccordion((prev) => (prev === label ? null : label));
  };

  // react-slick settings for top-bar carousel
  const slickSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    pauseOnHover: true,
  }; 
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}
    >
      {/* ── Top Bar ── */}
      <div
        className={`transition-all duration-300 overflow-hidden ${showTopBar ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className={`h-12 ${isScrolled ? 'text-dark' : 'text-white'}`}>
          <div className="mx-auto max-w-[1522px] px-4 flex items-center justify-between h-full">
            {/* Slick Carousel */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-1 min-w-0 overflow-hidden">
                <Slider {...slickSettings}>
                  {carouselSlides?.map((slide, idx) => (
                    <div key={idx} className="outline-none text-center">
                      <div className="flex justify-center items-center gap-4">
                        {slide.link ? (
                          <Link href={slide.link} className="block truncate text-xs text-normal">
                            {slide.text}
                          </Link>
                        ) : (
                          <span className="block truncate text-center md:text-left md:text-base text-[8px]">
                            {slide.text}
                          </span>
                        )}
                        <Link
                          href={topBar.registerButton.link}
                          className="hidden md:inline-block shrink-0 px-4 py-1.5 btn-primary rounded text-xs font-medium transition"
                        >
                          {topBar.registerButton.text}
                        </Link>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>

            {/* Top links */}
            <div
              className={`hidden lg:flex items-center gap-4 text-xs ml-6 shrink-0 transition-colors duration-300 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
            >
              <a href={topBar.whatsapp.link} className="flex items-center gap-1.5 hover:text-[#25D366] transition">
                <WhatsAppIcon />
                {topBar.whatsapp.text}
              </a>
              <span className={`w-px h-4 ${isScrolled ? 'bg-gray-300' : 'bg-white/20'}`} />
              <a href={topBar.callUs.link} className="flex items-center gap-1.5 hover:text-cyan transition">
                <Phone size={14} />
                {topBar.callUs.text}
              </a>
              <span className={`w-px h-4 ${isScrolled ? 'bg-gray-300' : 'bg-white/20'}`} />
              <div className="flex items-center gap-2">
                {topBar.socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`transition hover:text-white ${isScrolled ? 'text-gray-500' : 'text-white/70'}`}
                    aria-label={social.platform}
                  >
                    {SOCIAL_ICONS[social.platform]}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`h-px w-full max-w-[1522px] mx-auto transition-colors duration-300 ${isScrolled ? 'bg-transparent' : 'bg-[#FFFFFF80]'}`}
      ></div>

      {/* ── Main Nav ── */}
      <nav className={`transition-colors duration-300 ${isScrolled ? 'bg-white' : 'bg-transparent'}`}>
        <div className="mx-auto max-w-[1522px] px-4 flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src={
                isScrolled
                  ? `${process.env.NEXT_PUBLIC_IMG_PATH}images/cloud-logo-2.png`
                  : `${process.env.NEXT_PUBLIC_IMG_PATH}images/cloud-logo-white.svg`
              }
              alt="Cloud Intellect"
              width={isScrolled ? 140 : 160}
              height={isScrolled ? 40 : 50}
              className="transition-all"
            />
          </Link>

          {/* Desktop Nav */}
          <ul
            className={`hidden lg:flex items-center gap-10 text-sm font-medium transition-colors duration-300 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
          >
            {mainNav.map((item) => (
              <li key={item.label} className="main-nav-item relative">
                <Link
                  href={item.href}
                  className={`transition hover:opacity-80 text-xs font-normal ${isScrolled ? 'hover:text-blue' : 'hover:text-white/80'}`}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="main-nav-dropdown">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link href={child.href}>{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Login */}
            <div className="hidden lg:block login-wrapper relative">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded btn-primary border-0  transition text-sm font-medium`}
              >
                <User size={16} />
                {loginButton.text}
                <ChevronDown size={14} />
              </button>
              {loginButton.dropdownItems && (
                <ul className="login-dropdown">
                  {loginButton.dropdownItems.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Helpline */}
            <a
              href={helpline.link}
              className="hidden lg:flex items-center gap-2 px-4 py-2 btn-primary  border-0 rounded transition text-sm font-medium"
            >
              <Phone size={16} />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-xs opacity-90">{helpline.label}</span>
                <span className="font-semibold">{helpline.phoneNumber}</span>
              </div>
            </a>

            {/* Mobile: Phone + Menu */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href={helpline.link}
                className={`p-2 transition ${isScrolled ? 'text-blue' : 'text-white'}`}
                aria-label="Call"
              >
                <Phone size={20} />
              </a>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 transition ${isScrolled ? 'text-gray-700' : 'text-white'}`}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Secondary Nav ── */}
      <nav
        className={`hidden lg:block transition-colors duration-300 px-4 ${isScrolled ? 'bg-white' : 'bg-transparent border-white/20'}`}
      >
        <div
          className={`mx-auto max-w-[1522px] px-4 flex items-center justify-evenly gap-1 h-11 text-xs font-medium transition-colors duration-300 ${isScrolled ? 'text-gray-700' : 'text-white bg-[#0000003D] rounded-sm'}`}
        >
          {secondaryNav.map((item, idx) => (
            <div key={item.label} className="flex items-center justify-center relative text-center min-w-[100px]">
              <div className="secondary-nav-item relative px-3 py-2">
                {item.children ? (
                  <>
                    <button className={`flex items-center gap-1 transition hover:opacity-70`}>
                      {item.label}
                      <ChevronDown size={12} />
                    </button>
                    <ul className="secondary-dropdown">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link href={child.href}>{child.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link href={item.href} className="transition hover:opacity-70">
                    {item.label}
                  </Link>
                )}
              </div>
              {idx < secondaryNav.length - 1 && (
                <span
                  className={`w-px h-5 absolute top-[15%] right-[-20%] ${isScrolled ? 'bg-gray-300' : 'bg-white/30'}`}
                />
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)} />
        <div className="mobile-drawer-panel">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMG_PATH}images/cloud-logo-2.png`}
              alt="Cloud Intellect"
              width={120}
              height={40}
            />
            <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close">
              <X size={24} />
            </button>
          </div>

          {/* Social */}
          <div className="flex items-center justify-center gap-3 p-4 border-b">
            {topBar.socialLinks.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue"
                aria-label={social.platform}
              >
                {SOCIAL_ICONS[social.platform]}
              </a>
            ))}
          </div>

          {/* Nav */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Main */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Main Menu</h3>
              <ul className="space-y-1">
                {mainNav.map((item) => (
                  <li key={item.label}>
                    {item.children ? (
                      <>
                        <button
                          onClick={() => toggleMobileAccordion(`main-${item.label}`)}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                        >
                          {item.label}
                          <ChevronDown size={16} />
                        </button>
                        <div
                          className={`mobile-accordion-content ${openMobileAccordion === `main-${item.label}` ? 'open' : ''}`}
                        >
                          <ul className="ml-4 mt-1 space-y-1">
                            {item.children.map((child) => (
                              <li key={child.label}>
                                <Link
                                  href={child.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Secondary */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">More</h3>
              <ul className="space-y-1">
                {secondaryNav.map((item) => (
                  <li key={item.label}>
                    {item.children ? (
                      <>
                        <button
                          onClick={() => toggleMobileAccordion(`sec-${item.label}`)}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                        >
                          {item.label}
                          <ChevronDown size={16} />
                        </button>
                        <div
                          className={`mobile-accordion-content ${openMobileAccordion === `sec-${item.label}` ? 'open' : ''}`}
                        >
                          <ul className="ml-4 mt-1 space-y-1">
                            {item.children.map((child) => (
                              <li key={child.label}>
                                <Link
                                  href={child.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer actions */}
          <div className="p-4 border-t space-y-2">
            {loginButton.dropdownItems && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{loginButton.text}</p>
                {loginButton.dropdownItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
            <Link
              href={topBar.registerButton.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full px-4 py-2.5 bg-cyan hover:bg-[#007acc] text-white text-center rounded font-medium transition"
            >
              {topBar.registerButton.text}
            </Link>
            <a
              href={helpline.link}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-gray-300 rounded hover:border-blue hover:text-blue transition"
            >
              <Phone size={18} />
              <div className="flex flex-col items-start leading-tight text-sm">
                <span className="text-xs text-gray-500">{helpline.label}</span>
                <span className="font-semibold">{helpline.phoneNumber}</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
