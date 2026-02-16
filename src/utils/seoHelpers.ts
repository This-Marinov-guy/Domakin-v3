// SEO utility functions for URL generation and optimization

export function createPropertySlug(property: any): string {
  const propertyId = property.id.toString();
  const location = property.city || property.location || '';
  const title = property.title || '';
  
  // Create URL parts, omitting missing parts
  const urlParts = [propertyId];
  if (location) urlParts.push(location.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim());
  if (title) urlParts.push(title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim());
  
  return urlParts.join('-').replace(/--+/g, '-');
}

export function getPropertyUrl(
  property: any,
  useNewFormat: boolean = true,
  lang?: string
): string {
  let slug = property.slug;

  if (!slug && useNewFormat) {
    slug = createPropertySlug(property);
  }

  // Determine language prefix (only for non-English languages)
  const languagePrefix = lang && lang !== "en" ? `/${lang}` : "";

  if (useNewFormat) {
    return `${languagePrefix}/services/renting/property/${slug}`;
  }
  
  // Fallback to old format for backward compatibility
  return `${languagePrefix}/services/renting/property/${property.id}`;
}

export const getApplicationUrl = (application: any): string => {
  return `${process.env.NEXT_PUBLIC_URL}/services/add-listing?reference_id=${application.reference_id}`;
}

export function createBlogSlug(post: any): string {
  // Always use the slug from the API response
  return post.slug || 'post';
}

export function getBlogUrl(post: any): string {
  // Use the slug directly from the API response
  return `/blog/${post.slug}`;
}

export function generateMetaDescription(content: string, maxLength: number = 160): string {
  if (!content) return '';
  
  // Remove HTML tags
  const cleanContent = content.replace(/<[^>]*>/g, '');
  
  // Truncate to max length
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  // Find the last complete word within the limit
  const truncated = cleanContent.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
}

export function generateKeywords(
  primaryKeywords: string[],
  location?: string,
  category?: string
): string {
  const keywords = [...primaryKeywords];
  
  if (location) {
    keywords.push(`${location} ${primaryKeywords[0]}`);
    keywords.push(`${primaryKeywords[0]} ${location}`);
  }
  
  if (category) {
    keywords.push(category);
  }
  
  // Remove duplicates and join
  return Array.from(new Set(keywords)).join(', ');
}

export function createCanonicalUrl(path: string): string {
  const baseUrl = 'https://www.domakin.nl';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

export function generateImageUrl(imagePath: string, fallback?: string): string {
  if (!imagePath) {
    return fallback || 'https://www.domakin.nl/assets/img/logo.png';
  }
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  return `https://www.domakin.nl${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}
