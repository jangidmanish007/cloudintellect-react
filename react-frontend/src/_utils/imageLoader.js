const BASE = process.env.DYNAMIC_IMG_BASE_PATH || '';

export default function cloudIntellectLoader({ src, width, quality }) {
  // Already absolute — return as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Normalise: ensure leading slash
  const path = src.startsWith('/') ? src : `/${src}`;

  // Append width/quality as query params so Next.js optimisation still works
  // when the image is served from the same origin. For external origins we
  // just return the full URL without optimisation params.
  return `${BASE}${path}`;
}
