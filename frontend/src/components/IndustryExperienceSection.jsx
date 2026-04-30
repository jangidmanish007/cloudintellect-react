import React, { useState, useRef, useEffect } from 'react';
import AppLink from './AppLink';
import { usePageContentContext } from '../contexts/PageContentContext';
import { getImageUrl } from '../services/api';

const PLUS_ICON = 'https://cloudintellect.in/wp-content/uploads/2026/01/Plus.svg';
const DEFAULT_BACKGROUND = '/images/Accordian Images/Background image.webp';

const DEFAULT_TABS = [
  {
    label: 'Real Project-Based Training',
    title: 'Real Project-Based Training',
    description: 'Work on real-world projects and build a portfolio that demonstrates your skills to employers.',
    image: DEFAULT_BACKGROUND,
  },
  {
    label: 'Global Salesforce Ecosystem Exposure',
    title: 'Global Salesforce Ecosystem Exposure',
    description:
      'Connect with industry leaders and gain exposure to the global Salesforce ecosystem through real projects and partnerships.',
    image: DEFAULT_BACKGROUND,
  },
  {
    label: 'Certified Mentor Guidance',
    title: 'Certified Mentor Guidance',
    description:
      'Learn from certified Salesforce experts who bring years of industry experience and guide you through every step.',
    image: DEFAULT_BACKGROUND,
  },
  {
    label: 'Job-Oriented Curriculum',
    title: 'Job-Oriented Curriculum',
    description:
      'Our curriculum is designed with input from hiring partners to ensure you develop the exact skills employers are looking for.',
    image: DEFAULT_BACKGROUND,
  },
  {
    label: 'Live Q&A Sessions',
    title: 'Live Q&A Sessions',
    description: 'Get your questions answered in real time by instructors and peers during live interactive sessions.',
    image: DEFAULT_BACKGROUND,
  },
];

function IndustryExperienceSection() {
  const { content } = usePageContentContext();
  const industry = content?.industryExperience || {};

  const headingPart1 = industry.headingPart1 ?? 'Immerse yourself in a';
  const headingStrong1 = industry.headingStrong1 ?? 'Real Industry Experience with';
  const headingStrong2 = industry.headingStrong2 ?? 'Global Salesforce Ecosystem Exposure';
  const tabs = Array.isArray(industry.tabs) && industry.tabs.length >= 5 ? industry.tabs : DEFAULT_TABS;

  const getPanelBackgroundUrl = (tab) => {
    const path = (tab?.image || industry.backgroundImage || '').trim() || DEFAULT_BACKGROUND;
    return path.startsWith('http') ? path : getImageUrl(path.startsWith('/') ? path : `/${path}`);
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const justOpenedRef = useRef(false);

  const openTab = (index) => {
    justOpenedRef.current = true;
    setActiveIndex(index);
  };

  useEffect(() => {
    if (activeIndex === null) return;
    const t = setTimeout(() => {
      justOpenedRef.current = false;
    }, 400);
    return () => clearTimeout(t);
  }, [activeIndex]);

  const resetAll = () => {
    if (justOpenedRef.current) return;
    setActiveIndex(null);
  };

  const onContentClick = (e) => {
    e.stopPropagation();
    justOpenedRef.current = false;
  };

  return (
    <section className="industry-experience-section">
      <h2 className="industry-experience-heading">
        {headingPart1} <strong>{headingStrong1}</strong>
        <strong>{headingStrong2}</strong>
      </h2>

      <div className="industry-experience-wrapper">
        {tabs.map((tab, index) => (
          <React.Fragment key={index}>
            <button
              type="button"
              className={`industry-tab ${activeIndex === index ? 'hide' : ''}`}
              onClick={() => openTab(index)}
            >
              <div className="industry-tab-content">
                <span>{tab.label}</span>
                <img src={'/images/plus-icon.svg'} alt="" width={18} height={18} decoding="async" />
              </div>
            </button>
            <div
              role="button"
              tabIndex={0}
              className={`industry-image-box ${activeIndex === index ? 'active' : ''}`}
              style={
                activeIndex === index ? { backgroundImage: `url(${encodeURI(getPanelBackgroundUrl(tab))})` } : undefined
              }
              onClick={resetAll}
              onKeyDown={(e) => e.key === 'Enter' && resetAll()}
            >
              {activeIndex === index && (
                <div
                  className="industry-image-box-overlay"
                  onClick={onContentClick}
                  onPointerDown={() => {
                    justOpenedRef.current = false;
                  }}
                  role="presentation"
                >
                  <h3 className="industry-image-box-title">{tab.title}</h3>
                  <div className="industry-image-box-row">
                    <p className="industry-image-box-desc">{tab.description}</p>
                    <AppLink href="#learn-more" className="industry-image-box-cta">
                      READ MORE
                    </AppLink>
                  </div>
                </div>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

export default IndustryExperienceSection;
