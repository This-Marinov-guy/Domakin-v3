/**
 * List of routes that have their own custom SEO implementation.
 * Pages listed here will skip the default SEO component from seo.tsx
 * 
 * Format: Paths should be normalized (without leading slash, language prefix, or query params)
 * Examples:
 * - 'services/viewing' (matches /services/viewing, /bg/services/viewing, etc.)
 * - 'blog' (matches /blog, /bg/blog, etc.)
 * - 'blog/' (matches all blog posts like /blog/my-post)
 */

export const PAGES_WITH_CUSTOM_SEO = [
  // Service pages with custom SEO
  'services/viewing',
  'services/add-listing',
  'services/room-searching',
  'services/renting',
  // Blog pages with custom SEO
  'blog',
  // Careers page with custom SEO
  'careers',
] as const;

/**
 * Routes that should be matched with startsWith (for dynamic routes)
 * These are checked after exact matches
 */
export const PAGES_WITH_CUSTOM_SEO_PREFIX = [
  'services/renting/property/', // Matches /services/renting/property/[slug]
  'blog/', // Matches /blog/[slug]
] as const;

/**
 * Check if a normalized path has custom SEO
 * @param normalizedPath - Path without language prefix or query params (e.g., 'services/viewing')
 * @returns true if the page has custom SEO
 */
export const hasCustomSEO = (normalizedPath: string): boolean => {
  // Check exact matches
  if (PAGES_WITH_CUSTOM_SEO.includes(normalizedPath as any)) {
    return true;
  }

  // Check prefix matches (for dynamic routes)
  return PAGES_WITH_CUSTOM_SEO_PREFIX.some(prefix => 
    normalizedPath.startsWith(prefix)
  );
};
