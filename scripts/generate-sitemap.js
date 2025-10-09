#!/usr/bin/env node

/**
 * Script to generate a comprehensive sitemap.xml file
 * Run with: node scripts/generate-sitemap.js
 */

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const config = require("./sitemap-config");

// Configuration
const BASE_URL = config.sitemap.baseUrl;
const OUTPUT_FILE = path.join(
  __dirname,
  "../public",
  config.sitemap.outputFile
);

// API Configuration from config file
const API_CONFIG = {
  baseUrl: config.apiBaseUrl,
  endpoints: config.endpoints,
  timeout: config.timeout,
  language: config.defaultLanguage,
};

// Load static properties from translations
function loadStaticProperties() {
  try {
    const translationsPath = path.join(
      __dirname,
      "../locales/en/translations.json"
    );
    const translations = JSON.parse(fs.readFileSync(translationsPath, "utf8"));

    if (translations.FOR_RENT && Array.isArray(translations.FOR_RENT)) {
      console.log(
        `📋 Found ${translations.FOR_RENT.length} static properties in translations`
      );
      return translations.FOR_RENT.filter(
        (property) => property.id && !property.hidden
      );
    }

    console.log("⚠️ No FOR_RENT properties found in translations");
    return [];
  } catch (error) {
    console.error(
      "❌ Error loading static properties from translations:",
      error.message
    );
    return [];
  }
}

// Static pages configuration
const staticPages = [
  {
    url: "",
    priority: "1.0",
    changefreq: "daily",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/about",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  //   {
  //     url: "/services",
  //     priority: "0.8",
  //     changefreq: "monthly",
  //     lastmod: new Date().toISOString().split("T")[0],
  //   },
  {
    url: "/services/renting",
    priority: "0.9",
    changefreq: "daily",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/services/room-searching",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/services/viewing",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/services/add-listing",
    priority: "0.7",
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/contact",
    priority: "0.7",
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/pricing",
    priority: "0.7",
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/blog",
    priority: "0.9",
    changefreq: "daily",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/agents",
    priority: "0.6",
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/our-recommendations",
    priority: "0.6",
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/support-us",
    priority: "0.5",
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/terms&amp;policy",
    priority: "0.3",
    changefreq: "yearly",
    lastmod: new Date().toISOString().split("T")[0],
  },
];

// API Functions
async function fetchBlogPosts() {
  try {
    console.log("📝 Fetching blog posts from API...");
    console.log(
      `🔗 Endpoint: ${API_CONFIG.baseUrl}${API_CONFIG.endpoints.blogPosts}`
    );

    const response = await axios.get(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.blogPosts}`,
      {
        headers: {
          "Accept-Language": API_CONFIG.language,
        },
        timeout: API_CONFIG.timeout,
      }
    );

    if (response.data?.status && Array.isArray(response.data.data)) {
      const postsWithSlugs = response.data.data.filter((post) => post.slug);
      console.log(
        `✅ Found ${response.data.data.length} blog posts (${postsWithSlugs.length} with slugs)`
      );
      return postsWithSlugs;
    }

    console.log("⚠️ No blog posts found in API response");
    return [];
  } catch (error) {
    console.error("❌ Error fetching blog posts:", error.message);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data)}`);
    }
    return [];
  }
}

async function fetchProperties() {
  try {
    console.log("🏠 Fetching properties from API...");
    console.log(
      `🔗 Endpoint: ${API_CONFIG.baseUrl}${API_CONFIG.endpoints.properties}`
    );

    const response = await axios.get(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.properties}`,
      {
        headers: {
          "Accept-Language": API_CONFIG.language,
        },
        timeout: API_CONFIG.timeout,
      }
    );

    if (response.data?.status && Array.isArray(response.data.data)) {
      const visibleProperties = response.data.data.filter(
        (property) => property.id
      );
      console.log(
        `✅ Found ${response.data.data.length} properties (${visibleProperties.length} visible)`
      );
      return visibleProperties;
    }

    console.log("⚠️ No properties found in API response");
    return [];
  } catch (error) {
    console.error("❌ Error fetching properties:", error.message);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data)}`);
    }
    return [];
  }
}

function generateSitemap(
  blogPosts = [],
  properties = [],
  staticProperties = []
) {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  // Language codes mapping for hreflang
  const languages = [
    { locale: "", code: "en" }, // English (default, no prefix)
    { locale: "/bg", code: "bg" }, // Bulgarian
    { locale: "/gr", code: "el" }, // Greek
  ];

  // Add static pages (English version only with hreflang alternates)
  staticPages.forEach((page) => {
    sitemap += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`;

    // Add xhtml:link for each language alternate
    languages.forEach((lang) => {
      sitemap += `
    <xhtml:link rel="alternate" hreflang="${lang.code}" href="${BASE_URL}${lang.locale}${page.url}"/>`;
    });

    // Add x-default
    sitemap += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${page.url}"/>`;

    sitemap += `
  </url>
`;
  });

  // Add blog posts (English version only with hreflang alternates)
  blogPosts.forEach((post) => {
    const slug = post.slug;
    const lastmod =
      post.modified || post.date || new Date().toISOString().split("T")[0];
    const priority = config.priorities.blogPosts;
    const changefreq = config.changeFrequencies.blogPosts;

    sitemap += `  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>`;

    // Add xhtml:link for each language alternate
    languages.forEach((lang) => {
      sitemap += `
    <xhtml:link rel="alternate" hreflang="${lang.code}" href="${BASE_URL}${lang.locale}/blog/${slug}"/>`;
    });

    // Add x-default
    sitemap += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/blog/${slug}"/>`;

    sitemap += `
  </url>
`;
  });

  // Add dynamic properties (English version only with hreflang alternates)
  properties.forEach((property) => {
    // Generate SEO-friendly URL: id-location-title
    const propertyId = property.id.toString();
    const location = property.city || property.location || "";
    const title = property.title || "";

    // Create URL parts, omitting missing parts
    const urlParts = [propertyId];
    if (location)
      urlParts.push(
        location
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .trim()
      );
    if (title)
      urlParts.push(
        title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .trim()
      );

    const propertySlug = urlParts.join("-").replace(/--+/g, "-");

    const lastmod =
      property.updated_at ||
      property.created_at ||
      new Date().toISOString().split("T")[0];
    const priority = config.priorities.properties;
    const changefreq = config.changeFrequencies.properties;

    sitemap += `  <url>
    <loc>${BASE_URL}/services/renting/property/${propertySlug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>`;

    // Add xhtml:link for each language alternate
    languages.forEach((lang) => {
      sitemap += `
    <xhtml:link rel="alternate" hreflang="${lang.code}" href="${BASE_URL}${lang.locale}/services/renting/property/${propertySlug}"/>`;
    });

    // Add x-default
    sitemap += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/services/renting/property/${propertySlug}"/>`;

    sitemap += `
  </url>
`;
  });

  // Add static properties from translations (English version only with hreflang alternates)
  staticProperties.forEach((property) => {
    // Generate SEO-friendly URL: id-location-title
    const propertyId = property.id.toString();
    const location = property.city || property.location || "";
    const title = property.title || "";

    // Create URL parts, omitting missing parts
    const urlParts = [propertyId];
    if (location)
      urlParts.push(
        location
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .trim()
      );
    if (title)
      urlParts.push(
        title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .trim()
      );

    const propertySlug = urlParts.join("-").replace(/--+/g, "-");

    const lastmod = new Date().toISOString().split("T")[0]; // Use current date for static properties
    const priority = config.priorities.properties;
    const changefreq = config.changeFrequencies.properties;

    sitemap += `  <url>
    <loc>${BASE_URL}/services/renting/property/${propertySlug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>`;

    // Add xhtml:link for each language alternate
    languages.forEach((lang) => {
      sitemap += `
    <xhtml:link rel="alternate" hreflang="${lang.code}" href="${BASE_URL}${lang.locale}/services/renting/property/${propertySlug}"/>`;
    });

    // Add x-default
    sitemap += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/services/renting/property/${propertySlug}"/>`;

    sitemap += `
  </url>
`;
  });

  sitemap += "</urlset>";

  return sitemap;
}

async function main() {
  try {
    console.log("🚀 Starting sitemap generation...");
    console.log(`🔗 API Base URL: ${API_CONFIG.baseUrl}`);

    // Load static properties from translations
    const staticProperties = loadStaticProperties();

    // Fetch data from APIs
    const [blogPosts, properties] = await Promise.all([
      fetchBlogPosts(),
      fetchProperties(),
    ]);

    // Generate sitemap with real data and static properties
    const sitemap = generateSitemap(blogPosts, properties, staticProperties);

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, sitemap, "utf8");

    // Calculate total URLs (English version only, with hreflang tags for alternates)
    const totalUrls =
      staticPages.length +
      blogPosts.length +
      properties.length +
      staticProperties.length;

    console.log("✅ Sitemap generated successfully!");
    console.log(`📁 Location: ${OUTPUT_FILE}`);
    console.log(`🌐 URL: ${BASE_URL}/sitemap.xml`);
    console.log(
      `📊 Total URLs: ${totalUrls} (English version with hreflang tags)`
    );
    console.log(`   - Static pages: ${staticPages.length}`);
    console.log(`   - Blog posts: ${blogPosts.length}`);
    console.log(`   - Dynamic properties: ${properties.length}`);
    console.log(`   - Static properties: ${staticProperties.length}`);
    console.log(
      `\n💡 Each URL includes hreflang tags for EN, BG, and EL language versions`
    );

    // Also create a robots.txt reference
    const robotsPath = path.join(__dirname, "../public/robots.txt");
    let robotsContent = "";

    if (fs.existsSync(robotsPath)) {
      robotsContent = fs.readFileSync(robotsPath, "utf8");
    }

    if (!robotsContent.includes("sitemap.xml")) {
      robotsContent += "\nSitemap: https://www.domakin.nl/sitemap.xml\n";
      fs.writeFileSync(robotsPath, robotsContent, "utf8");
      console.log("✅ Updated robots.txt with sitemap reference");
    }

    console.log("\n🎉 Ready to submit to Google Search Console!");
    console.log(`📋 Submit this URL: ${BASE_URL}/sitemap.xml`);
  } catch (error) {
    console.error("❌ Error generating sitemap:", error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { generateSitemap, staticPages };
