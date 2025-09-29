/**
 * Configuration file for sitemap generation
 * Update these values with your actual API endpoints
 */

module.exports = {
  // Your API base URL - update this with your actual server URL
  apiBaseUrl: process.env.NEXT_PUBLIC_SERVER_URL || "https://orange.domakin.nl",

  // API endpoints - these should match your actual API routes
  endpoints: {
    blogPosts: "/api/blog/posts",
    properties: "/api/property/listing",
  },

  // Request configuration
  timeout: 15000,

  // Language for API requests
  defaultLanguage: "en",

  // Sitemap configuration
  sitemap: {
    baseUrl: "https://www.domakin.nl",
    outputFile: "sitemap.xml",
    maxUrls: 50000, // Google's limit
    maxFileSize: "50MB", // Google's limit
  },

  // URL priorities and change frequencies
  priorities: {
    homepage: "1.0",
    mainPages: "0.8",
    blogListing: "0.9",
    blogPosts: "0.6",
    propertyListing: "0.9",
    properties: "0.7",
    otherPages: "0.5",
  },

  changeFrequencies: {
    homepage: "daily",
    mainPages: "monthly",
    blogListing: "daily",
    blogPosts: "monthly",
    propertyListing: "daily",
    properties: "weekly",
    otherPages: "monthly",
  },
};
