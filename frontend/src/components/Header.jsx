import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { headerCarouselAPI, headerSettingsAPI } from '../services/api';
import AppLink from './AppLink';
import './Header.css';

function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [headerSettings, setHeaderSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState(new Set());
  const [openSecondaryDropdown, setOpenSecondaryDropdown] = useState(null);
  const [secondaryDropdownPosition, setSecondaryDropdownPosition] = useState(null);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const secondaryDropdownTriggerRef = useRef(null);
  const secondaryDropdownCloseTimeoutRef = useRef(null);

  // Sync scroll state on mount — browser scroll restoration is async, so we
  // check immediately AND after a short delay to catch the restored position.
  useLayoutEffect(() => {
    const syncScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 0);
      setLastScrollY(y);
    };

    syncScroll(); // immediate check

    // Browser restores scroll position asynchronously after mount,
    // so we re-check after the next few frames to catch the restored value.
    const raf1 = requestAnimationFrame(() => {
      syncScroll();
      const raf2 = requestAnimationFrame(syncScroll);
      return () => cancelAnimationFrame(raf2);
    });

    return () => cancelAnimationFrame(raf1);
  }, []);

  const closeSecondaryDropdownWithDelay = () => {
    secondaryDropdownCloseTimeoutRef.current = setTimeout(() => {
      setOpenSecondaryDropdown(null);
      setSecondaryDropdownPosition(null);
      secondaryDropdownCloseTimeoutRef.current = null;
    }, 150);
  };

  const cancelCloseSecondaryDropdown = () => {
    if (secondaryDropdownCloseTimeoutRef.current) {
      clearTimeout(secondaryDropdownCloseTimeoutRef.current);
      secondaryDropdownCloseTimeoutRef.current = null;
    }
  };

  const toggleDropdown = (itemLabel) => {
    setOpenDropdowns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemLabel)) {
        newSet.delete(itemLabel);
      } else {
        newSet.add(itemLabel);
      }
      return newSet;
    });
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
      setOpenSecondaryDropdown(null);
      setSecondaryDropdownPosition(null);

      // Detect scroll direction for top bar visibility
      if (scrollPosition > lastScrollY && scrollPosition > 100) {
        // Scrolling down
        setIsScrollingDown(true);
      } else if (scrollPosition < lastScrollY) {
        // Scrolling up
        setIsScrollingDown(false);
      }

      setLastScrollY(scrollPosition);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Measure trigger and set dropdown position for portal (secondary nav)
  const updateSecondaryDropdownPosition = () => {
    if (!openSecondaryDropdown || !secondaryDropdownTriggerRef.current) {
      setSecondaryDropdownPosition(null);
      return;
    }
    const rect = secondaryDropdownTriggerRef.current.getBoundingClientRect();
    setSecondaryDropdownPosition({
      top: rect.bottom + 8,
      left: rect.left,
      minWidth: rect.width,
    });
  };

  useLayoutEffect(() => {
    if (!openSecondaryDropdown) {
      setSecondaryDropdownPosition(null);
      return;
    }
    updateSecondaryDropdownPosition();
    window.addEventListener('scroll', updateSecondaryDropdownPosition);
    window.addEventListener('resize', updateSecondaryDropdownPosition);
    return () => {
      window.removeEventListener('scroll', updateSecondaryDropdownPosition);
      window.removeEventListener('resize', updateSecondaryDropdownPosition);
    };
  }, [openSecondaryDropdown]);

  // Fetch header settings and carousel slides
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        // Fetch header settings
        const settingsResponse = await headerSettingsAPI.get();
        if (settingsResponse.success) {
          setHeaderSettings(settingsResponse.data);
        }

        // Fetch carousel slides
        const carouselResponse = await headerCarouselAPI.getAll();
        if (carouselResponse.success && carouselResponse.data.length > 0) {
          setCarouselSlides(carouselResponse.data);
        } else {
          // Default slide if no slides found
          setCarouselSlides([{ text: 'Salesforce Institute Your Pathway to a Thriving Career', link: '' }]);
        }
      } catch (error) {
        console.error('Error fetching header data:', error);
        // Default slide on error
        setCarouselSlides([{ text: 'Salesforce Institute Your Pathway to a Thriving Career', link: '' }]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeaderData();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay || carouselSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex === carouselSlides.length - 1 ? 0 : prevIndex + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay, carouselSlides.length]);

  const handlePreviousSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlideIndex((prevIndex) => (prevIndex === 0 ? carouselSlides.length - 1 : prevIndex - 1));
  };

  const handleNextSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlideIndex((prevIndex) => (prevIndex === carouselSlides.length - 1 ? 0 : prevIndex + 1));
  };

  const currentSlide = carouselSlides[currentSlideIndex] || { text: '', link: '' };

  // Default settings fallback
  const settings = headerSettings || {
    registerButton: { text: 'REGISTER NOW', link: '#', isActive: true },
    whatsapp: { text: 'WhatsApp', link: '#', isActive: true },
    callUs: { text: 'Call Us', link: '#', isActive: true },
    socialLinks: [],
    mainNavItems: [
      {
        label: 'ECOSYSTEM',
        href: '#ecosystem',
        hasDropdown: false,
        showOnHomePageOnly: false,
        order: 0,
        isActive: true,
      },
      { label: 'COURSE', href: '#course', hasDropdown: false, showOnHomePageOnly: false, order: 1, isActive: true },
      {
        label: 'PLACEMENT',
        href: '#placement',
        hasDropdown: false,
        showOnHomePageOnly: false,
        order: 2,
        isActive: true,
      },
      {
        label: 'SUCCESS STORIES',
        href: '#success-stories',
        hasDropdown: false,
        showOnHomePageOnly: false,
        order: 3,
        isActive: true,
      },
      { label: 'REVIEWS', href: '#reviews', hasDropdown: false, showOnHomePageOnly: false, order: 4, isActive: true },
      {
        label: 'NEWS AND EVENTS',
        href: '#news',
        hasDropdown: false,
        showOnHomePageOnly: false,
        order: 5,
        isActive: true,
      },
    ],
    loginButton: { text: 'Login Portals', link: '#', hasDropdown: false, dropdownItems: [], isActive: true },
    helpline: { label: 'Admission Helpline', phoneNumber: '+91 8766 9969 44', link: '#', isActive: true },
    secondaryNavItems: [
      { label: 'ABOUT US', href: '#about', hasDropdown: true, showOnHomePageOnly: false, order: 0, isActive: true },
      { label: 'COURSES', href: '#courses', hasDropdown: true, showOnHomePageOnly: false, order: 1, isActive: true },
      { label: 'BLOG', href: '/blog', hasDropdown: false, showOnHomePageOnly: false, order: 2, isActive: true },
      {
        label: 'TESTIMONIALS',
        href: '#testimonials',
        hasDropdown: false,
        showOnHomePageOnly: false,
        order: 3,
        isActive: true,
      },
      {
        label: 'PLACEMENT',
        href: '#placement',
        hasDropdown: true,
        showOnHomePageOnly: false,
        order: 4,
        isActive: true,
      },
      { label: 'WEBINAR', href: '#webinar', hasDropdown: false, showOnHomePageOnly: false, order: 5, isActive: true },
      { label: 'GALLERY', href: '#gallery', hasDropdown: false, showOnHomePageOnly: false, order: 6, isActive: true },
      {
        label: 'CONTACT US',
        href: '#contact',
        hasDropdown: false,
        showOnHomePageOnly: false,
        order: 7,
        isActive: true,
      },
    ],
  };

  // Filter and sort active items
  const activeMainNavItems = (settings.mainNavItems || [])
    .filter((item) => {
      if (!item.isActive) return false;
      // If showOnHomePageOnly is true, only show on homepage
      if (item.showOnHomePageOnly && !isHomePage) return false;
      return true;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const activeSecondaryNavItems = (settings.secondaryNavItems || [])
    .filter((item) => {
      if (!item.isActive) return false;
      // If showOnHomePageOnly is true, only show on homepage
      if (item.showOnHomePageOnly && !isHomePage) return false;
      return true;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const activeSocialLinks = (settings.socialLinks || []).filter((link) => link.isActive);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Top Bar */}
      <div className="top-bar">
        <div className={`top-bar-content ${isScrollingDown ? 'hidden' : ''}`}>
          <div className="promo-banner">
            {carouselSlides.length > 1 && (
              <button className="chevron-btn chevron-left" aria-label="Previous" onClick={handlePreviousSlide}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 12L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            {currentSlide.link ? (
              <AppLink href={currentSlide.link} className="carousel-text-link">
                <span>{currentSlide.text}</span>
              </AppLink>
            ) : (
              <span>{currentSlide.text}</span>
            )}
            {settings.registerButton?.isActive && (
              <AppLink href={settings.registerButton?.link || '#'} className="register-btn">
                {settings.registerButton?.text || 'REGISTER NOW'}
              </AppLink>
            )}
            {carouselSlides.length > 1 && (
              <button className="chevron-btn chevron-right" aria-label="Next" onClick={handleNextSlide}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="top-bar-links">
            {settings.whatsapp?.isActive && (
              <>
                <a href={settings.whatsapp?.link || '#'} className="top-link">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8 0C3.58 0 0 3.58 0 8c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.42-3.58-8-8-8zm0 14.5c-3.59 0-6.5-2.91-6.5-6.5S4.41 1.5 8 1.5s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5z"
                      fill="#25D366"
                    />
                    <path d="M6.5 4.5h3v7h-3v-7z" fill="#25D366" />
                    <path
                      d="M8 2.5c-3.03 0-5.5 2.47-5.5 5.5s2.47 5.5 5.5 5.5 5.5-2.47 5.5-5.5S11.03 2.5 8 2.5z"
                      fill="#25D366"
                    />
                  </svg>
                  {settings.whatsapp?.text || 'WhatsApp'}
                </a>
                {(settings.callUs?.isActive || activeSocialLinks.length > 0) && <span className="separator"></span>}
              </>
            )}
            {settings.callUs?.isActive && (
              <>
                <a href={settings.callUs?.link || '#'} className="top-link">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122L9.78 11.37a.678.678 0 0 1-.58-.122L6.75 8.75a.678.678 0 0 1-.122-.58l.47-2.307a.678.678 0 0 0-.122-.58L4.654 1.328z"
                      fill="currentColor"
                    />
                  </svg>
                  {settings.callUs?.text || 'Call Us'}
                </a>
                {activeSocialLinks.length > 0 && <span className="separator"></span>}
              </>
            )}
            {activeSocialLinks.length > 0 && (
              <div className="social-icons">
                {activeSocialLinks.map((social) => {
                  const icons = {
                    facebook: (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                      </svg>
                    ),
                    linkedin: (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                      </svg>
                    ),
                    youtube: (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
                      </svg>
                    ),
                    instagram: (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.29-.044z" />
                        <path d="M8 4.419a3.581 3.581 0 1 0 0 7.162 3.581 3.581 0 0 0 0-7.162zm0 5.9a2.319 2.319 0 1 1 0-4.638 2.319 2.319 0 0 1 0 4.638zm4.025-5.85a.837.837 0 1 0 0-1.675.837.837 0 0 0 0 1.675z" />
                      </svg>
                    ),
                    twitter: (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                      </svg>
                    ),
                  };
                  return (
                    <a key={social.platform} href={social.url} className="social-icon" aria-label={social.platform}>
                      {icons[social.platform] || icons.facebook}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="main-nav">
        <div className="nav-content">
          <div className="logo-section">
            <img
              src={isScrolled ? '/images/cropped-cloudintellect-new-sitelogo-1.png' : '/images/Logo (1).webp'}
              alt="Cloud Intellect Logo"
              className="logo-image"
            />
          </div>

          <ul className="nav-menu">
            {activeMainNavItems.map((item) => {
              const activeDropdownItems = (item.dropdownItems || [])
                .filter((dItem) => dItem.isActive)
                .sort((a, b) => (a.order || 0) - (b.order || 0));

              return (
                <li
                  key={item.label}
                  className={item.hasDropdown && activeDropdownItems.length > 0 ? 'nav-item-with-dropdown' : ''}
                >
                  <AppLink href={item.href}>
                    {item.label}
                    {item.hasDropdown && activeDropdownItems.length > 0 && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        style={{ marginLeft: '4px', display: 'inline-block', verticalAlign: 'middle' }}
                      >
                        <path
                          d="M3 4.5L6 7.5L9 4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </AppLink>
                  {item.hasDropdown && activeDropdownItems.length > 0 && (
                    <ul className="nav-dropdown">
                      {activeDropdownItems.map((dropdownItem) => (
                        <li key={dropdownItem.label}>
                          <AppLink href={dropdownItem.href}>{dropdownItem.label}</AppLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="nav-actions">
            {settings.loginButton?.isActive && (
              <div
                className={`login-btn-wrapper ${settings.loginButton?.hasDropdown && (settings.loginButton?.dropdownItems || []).filter((item) => item.isActive).length > 0 ? 'has-dropdown' : ''}`}
              >
                {settings.loginButton?.hasDropdown &&
                (settings.loginButton?.dropdownItems || []).filter((item) => item.isActive).length > 0 ? (
                  <>
                    <button className="login-btn">
                      {settings.loginButton?.text || 'Login Portals'}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"
                          fill="currentColor"
                        />
                      </svg>
                      <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M3 4.5L6 7.5L9 4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <ul className="login-dropdown">
                      {(settings.loginButton?.dropdownItems || [])
                        .filter((item) => item.isActive)
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((dropdownItem) => (
                          <li key={dropdownItem.label}>
                            <AppLink href={dropdownItem.href}>{dropdownItem.label}</AppLink>
                          </li>
                        ))}
                    </ul>
                  </>
                ) : (
                  <AppLink href={settings.loginButton?.link || '#'} className="login-btn">
                    {settings.loginButton?.text || 'Login Portals'}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"
                        fill="currentColor"
                      />
                    </svg>
                  </AppLink>
                )}
              </div>
            )}
            {settings.helpline?.isActive && (
              <AppLink href={settings.helpline?.link || '#'} className="helpline-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122L9.78 11.37a.678.678 0 0 1-.58-.122L6.75 8.75a.678.678 0 0 1-.122-.58l.47-2.307a.678.678 0 0 0-.122-.58L4.654 1.328z"
                    fill="currentColor"
                  />
                </svg>
                <div className="helpline-content">
                  <span className="helpline-label">{settings.helpline?.label || 'Admission Helpline'}</span>
                  <span className="helpline-number">{settings.helpline?.phoneNumber || '+91 8766 9969 44'}</span>
                </div>
              </AppLink>
            )}
            <div className="mobile-nav-icons">
              {settings.helpline?.isActive && (
                <a
                  href={`tel:${settings.helpline?.phoneNumber?.replace(/\s/g, '') || '918766996944'}`}
                  className="mobile-phone-icon"
                  aria-label="Call"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                    <path
                      d="M6.5 4.5c.5-.5 1.2-.5 1.7 0l1.8 1.8c.5.5.5 1.2 0 1.7l-1.3 1.3c-.2.2-.2.5 0 .7l2.6 2.6c.2.2.5.2.7 0l1.3-1.3c.5-.5 1.2-.5 1.7 0l1.8 1.8c.5.5.5 1.2 0 1.7l-1.5 1.5c-1.2 1.2-3.1 1.2-4.3 0l-4.2-4.2c-1.2-1.2-1.2-3.1 0-4.3l1.5-1.5z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              )}
              {/* <button className="mobile-search-icon" aria-label="Search" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="m14 14 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button> */}
              <button
                className="menu-toggle"
                aria-label="Menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="mobile-search-bar">
          <input type="text" placeholder="Search..." className="mobile-search-input" autoFocus />
          <button className="mobile-search-close" onClick={() => setIsSearchOpen(false)} aria-label="Close search">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="mobile-nav-content">
          <div className="mobile-nav-header">
            <img
              src={isScrolled ? '/images/cropped-cloudintellect-new-sitelogo-1.png' : '/images/Logo (1).webp'}
              alt="Cloud Intellect Logo"
              className="mobile-nav-logo"
            />
            <button className="mobile-nav-close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Mobile Social Media Icons */}
          {activeSocialLinks.length > 0 && (
            <div className="mobile-top-social-bar">
              <div className="mobile-social-icons">
                {activeSocialLinks.map((social) => {
                  const icons = {
                    facebook: (
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                      </svg>
                    ),
                    linkedin: (
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                      </svg>
                    ),
                    youtube: (
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
                      </svg>
                    ),
                    instagram: (
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.29-.044z" />
                        <path d="M8 4.419a3.581 3.581 0 1 0 0 7.162 3.581 3.581 0 0 0 0-7.162zm0 5.9a2.319 2.319 0 1 1 0-4.638 2.319 2.319 0 0 1 0 4.638zm4.025-5.85a.837.837 0 1 0 0-1.675.837.837 0 0 0 0 1.675z" />
                      </svg>
                    ),
                    twitter: (
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                      </svg>
                    ),
                  };
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      className="mobile-social-icon"
                      aria-label={social.platform}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {icons[social.platform] || icons.facebook}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          <nav className="mobile-nav-menu">
            {/* Main Navigation Items */}
            {activeMainNavItems.length > 0 && (
              <div className="mobile-nav-section">
                <h3 className="mobile-nav-section-title">Main Menu</h3>
                <ul>
                  {activeMainNavItems.map((item) => {
                    const activeDropdownItems = (item.dropdownItems || [])
                      .filter((dItem) => dItem.isActive)
                      .sort((a, b) => (a.order || 0) - (b.order || 0));
                    const isDropdownOpen = openDropdowns.has(`main-${item.label}`);

                    return (
                      <li
                        key={item.label}
                        className={`${item.hasDropdown && activeDropdownItems.length > 0 ? 'has-dropdown' : ''} ${isDropdownOpen ? 'open' : ''}`}
                      >
                        {item.hasDropdown && activeDropdownItems.length > 0 ? (
                          <button
                            className="mobile-nav-item-button"
                            onClick={() => toggleDropdown(`main-${item.label}`)}
                          >
                            {item.label}
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path
                                d="M4 6l4 4 4-4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        ) : (
                          <AppLink href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                            {item.label}
                          </AppLink>
                        )}
                        {item.hasDropdown && activeDropdownItems.length > 0 && (
                          <ul className="mobile-dropdown">
                            {activeDropdownItems.map((dropdownItem) => (
                              <li key={dropdownItem.label}>
                                <AppLink href={dropdownItem.href} onClick={() => setIsMobileMenuOpen(false)}>
                                  {dropdownItem.label}
                                </AppLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Secondary Navigation Items */}
            {activeSecondaryNavItems.length > 0 && (
              <div className="mobile-nav-section">
                <h3 className="mobile-nav-section-title">More</h3>
                <ul>
                  {activeSecondaryNavItems.map((item) => {
                    const activeDropdownItems = (item.dropdownItems || [])
                      .filter((dItem) => dItem.isActive)
                      .sort((a, b) => (a.order || 0) - (b.order || 0));
                    const isDropdownOpen = openDropdowns.has(`secondary-${item.label}`);

                    return (
                      <li
                        key={item.label}
                        className={`${item.hasDropdown && activeDropdownItems.length > 0 ? 'has-dropdown' : ''} ${isDropdownOpen ? 'open' : ''}`}
                      >
                        {item.hasDropdown && activeDropdownItems.length > 0 ? (
                          <button
                            className="mobile-nav-item-button"
                            onClick={() => toggleDropdown(`secondary-${item.label}`)}
                          >
                            {item.label}
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path
                                d="M4 6l4 4 4-4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        ) : (
                          <AppLink href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                            {item.label}
                          </AppLink>
                        )}
                        {item.hasDropdown && activeDropdownItems.length > 0 && (
                          <ul className="mobile-dropdown">
                            {activeDropdownItems.map((dropdownItem) => (
                              <li key={dropdownItem.label}>
                                <AppLink href={dropdownItem.href} onClick={() => setIsMobileMenuOpen(false)}>
                                  {dropdownItem.label}
                                </AppLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Show message if no navigation items */}
            {activeMainNavItems.length === 0 && activeSecondaryNavItems.length === 0 && (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#666' }}>
                <p>No navigation items available</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mobile-nav-actions">
              {settings.loginButton?.isActive && (
                <>
                  {settings.loginButton?.hasDropdown &&
                  (settings.loginButton?.dropdownItems || []).filter((item) => item.isActive).length > 0 ? (
                    <div className="mobile-nav-section">
                      <h3 className="mobile-nav-section-title">{settings.loginButton?.text || 'Login Portals'}</h3>
                      <ul>
                        {(settings.loginButton?.dropdownItems || [])
                          .filter((item) => item.isActive)
                          .sort((a, b) => (a.order || 0) - (b.order || 0))
                          .map((dropdownItem) => (
                            <li key={dropdownItem.label}>
                              <AppLink href={dropdownItem.href} onClick={() => setIsMobileMenuOpen(false)}>
                                {dropdownItem.label}
                              </AppLink>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ) : (
                    <AppLink
                      href={settings.loginButton?.link || '#'}
                      className="mobile-login-btn"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {settings.loginButton?.text || 'Login Portals'}
                    </AppLink>
                  )}
                </>
              )}
              {settings.registerButton?.isActive && (
                <AppLink
                  href={settings.registerButton?.link || '#'}
                  className="mobile-register-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {settings.registerButton?.text || 'REGISTER NOW'}
                </AppLink>
              )}
            </div>

            {/* Contact Info */}
            {settings.helpline?.isActive && (
              <div className="mobile-nav-contact">
                <a
                  href={`tel:${settings.helpline?.phoneNumber?.replace(/\s/g, '') || '918766996944'}`}
                  className="mobile-contact-link"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122L9.78 11.37a.678.678 0 0 1-.58-.122L6.75 8.75a.678.678 0 0 1-.122-.58l.47-2.307a.678.678 0 0 0-.122-.58L4.654 1.328z"
                      fill="currentColor"
                    />
                  </svg>
                  <div>
                    <div className="mobile-contact-label">{settings.helpline?.label || 'Admission Helpline'}</div>
                    <div className="mobile-contact-number">{settings.helpline?.phoneNumber || '+91 8766 9969 44'}</div>
                  </div>
                </a>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Secondary Navigation */}
      <nav className="secondary-nav">
        <div className="secondary-nav-content">
          {activeSecondaryNavItems.map((item, index) => {
            const activeDropdownItems = (item.dropdownItems || [])
              .filter((dItem) => dItem.isActive)
              .sort((a, b) => (a.order || 0) - (b.order || 0));
            const hasDropdown = item.hasDropdown && activeDropdownItems.length > 0;
            const isOpen = openSecondaryDropdown === item.label;

            const handleMouseEnter = () => {
              cancelCloseSecondaryDropdown();
              if (hasDropdown) setOpenSecondaryDropdown(item.label);
            };

            const handleMouseLeave = closeSecondaryDropdownWithDelay;

            return (
              <div
                key={item.label}
                ref={isOpen && hasDropdown ? secondaryDropdownTriggerRef : null}
                className={`secondary-nav-item-wrapper ${hasDropdown ? 'secondary-nav-item-with-dropdown' : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {hasDropdown ? (
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    {item.label}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M3 4.5L6 7.5L9 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                ) : (
                  <AppLink href={item.href}>{item.label}</AppLink>
                )}
                {hasDropdown && !secondaryDropdownPosition && (
                  <ul
                    className={`secondary-nav-dropdown ${isOpen ? 'secondary-nav-dropdown-open' : ''}`}
                    aria-hidden="true"
                  >
                    {activeDropdownItems.map((dropdownItem) => (
                      <li key={dropdownItem.label}>
                        <AppLink href={dropdownItem.href}>{dropdownItem.label}</AppLink>
                      </li>
                    ))}
                  </ul>
                )}
                {index < activeSecondaryNavItems.length - 1 && <span className="secondary-nav-separator"></span>}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Secondary nav dropdown rendered in portal so it's always on top */}
      {openSecondaryDropdown &&
        secondaryDropdownPosition &&
        (() => {
          const item = activeSecondaryNavItems.find((i) => i.label === openSecondaryDropdown);
          if (!item) return null;
          const activeDropdownItems = (item.dropdownItems || [])
            .filter((dItem) => dItem.isActive)
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          return createPortal(
            <div
              className="secondary-nav-dropdown-portal-wrapper"
              style={{
                position: 'fixed',
                top: secondaryDropdownPosition.top,
                left: secondaryDropdownPosition.left,
                zIndex: 99999,
                minWidth: secondaryDropdownPosition.minWidth,
              }}
              onMouseEnter={cancelCloseSecondaryDropdown}
              onMouseLeave={closeSecondaryDropdownWithDelay}
            >
              <ul className="secondary-nav-dropdown secondary-nav-dropdown-portal">
                {activeDropdownItems.map((dropdownItem) => (
                  <li key={dropdownItem.label}>
                    <AppLink href={dropdownItem.href}>{dropdownItem.label}</AppLink>
                  </li>
                ))}
              </ul>
            </div>,
            document.body,
          );
        })()}
    </header>
  );
}

export default Header;
