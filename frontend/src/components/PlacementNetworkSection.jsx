import { usePageContentContext } from '../contexts/PageContentContext';

const LOGOS_BASE = '/images/Company Logos';
const BASE_IMAGE_PATH = import.meta.env.VITE_BASE_IMAGE_PATH || '';

const DEFAULT_LOGO_FILES = [
  'Logo | Png.webp',
  'Logo | Png-1.webp',
  'Logo | Png-2.webp',
  'Logo | Png-3.webp',
  'Logo | Png-4.webp',
  'Logo | Png-5.webp',
  'Logo | Png-6.webp',
  'Logo | Png-7.webp',
  'Logo | Png-8.webp',
  'Logo | Png-9.webp',
  'Logo | Png-10.webp',
  'Logo | Png-11.webp',
  'Logo | Png-12.webp',
  'Logo | Png-13.webp',
];

const resolveImageUrl = (path) => {
  if (!path) return `${BASE_IMAGE_PATH}${LOGOS_BASE}/Logo | Png.webp`;
  if (path.startsWith('http')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_IMAGE_PATH}${normalized}`;
};

function PlacementNetworkSection() {
  const { content } = usePageContentContext();
  const placementNetwork = content?.placementNetwork || {};

  const heading = placementNetwork.heading ?? 'Our Placement Network are';
  const logosFromContent =
    Array.isArray(placementNetwork.logos) && placementNetwork.logos.length > 0
      ? placementNetwork.logos.filter((item) => item && (item.image || item.url))
      : [];
  const logoPaths =
    logosFromContent.length > 0
      ? logosFromContent.map((item) => item.image || item.url || '')
      : DEFAULT_LOGO_FILES.map((f) => `${LOGOS_BASE}/${f}`);

  const logoUrls = logoPaths.map(resolveImageUrl);
  const logosDoubled = [...logoUrls, ...logoUrls];

  return (
    <section className="placement-network-section">
      <h2 className="placement-network-heading">{heading}</h2>
      <div className="placement-network-wrap">
        <div className="placement-network-track">
          {logosDoubled.map((src, i) => (
            <div key={i} className="placement-network-card">
              <img src={src} alt="" className="placement-network-logo" loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PlacementNetworkSection;
