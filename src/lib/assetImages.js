/**
 * Static image paths under `public/assets/images/`.
 *
 * Drop files there and reference them by URL, e.g.
 * `public/assets/images/blackfang/campaign-hero.webp` → `/assets/images/blackfang/campaign-hero.webp`
 *
 * For images imported in components (hashed filenames in production), use `src/assets/images/` instead.
 */
export const ASSETS_IMAGE_ROOT = '/assets/images'

/** @param {...string} parts Path segments after `/assets/images` */
export function assetImageUrl(...parts) {
  return [ASSETS_IMAGE_ROOT, ...parts.filter(Boolean)].join('/')
}

export function blackfangImageUrl(filename) {
  return assetImageUrl('blackfang', filename)
}

export function portfolioImageUrl(filename) {
  return assetImageUrl('portfolio', filename)
}

export const BLACKFANG_GALAXY_MAP_URL = blackfangImageUrl(
  'warhammer-40k-galaxy-map-v2-v0-348ggrl5rrzg1.jpg',
)
