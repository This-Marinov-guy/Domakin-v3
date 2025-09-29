import { GetServerSideProps } from 'next';
import { fetchBlogPosts, fetchProperties } from '@/services/api';

function generateSiteMap(blogPosts: any[], properties: any[]) {
  const baseUrl = 'https://www.domakin.nl';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Static pages -->
     <url>
       <loc>${baseUrl}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     
     <url>
       <loc>${baseUrl}/blog</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>0.9</priority>
     </url>
     
     <url>
       <loc>${baseUrl}/about</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>
     
     <url>
       <loc>${baseUrl}/services</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>
     
     <url>
       <loc>${baseUrl}/contact</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.7</priority>
     </url>
     
     <url>
       <loc>${baseUrl}/pricing</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.7</priority>
     </url>
     
     <url>
       <loc>${baseUrl}/services/renting</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>0.8</priority>
     </url>
     
     <!-- Dynamic property listings -->
     ${properties
       .filter(property => property.id && !property.hidden)
       .map((property) => {
         // Generate SEO-friendly slug for sitemap
         const seoSlug = property.city && property.title 
           ? `${property.city.toLowerCase()}-${property.title.toLowerCase()?.replace(/[^\w\s-]/g, '')?.replace(/\s+/g, '-')?.trim()}`.replace(/--+/g, '-')
           : property.id.toString();
         
         return `
       <url>
           <loc>${baseUrl}/services/renting/property/${seoSlug}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.7</priority>
       </url>
     `;
       })
       .join('')}
     
     <!-- Dynamic blog posts -->
     ${blogPosts
       .filter(post => post.slug) // Only include posts with slugs
       .map((post) => {
         // Use the slug from the API response
         const seoSlug = post.slug;
         
         return `
       <url>
           <loc>${baseUrl}/blog/${seoSlug}</loc>
           <lastmod>${post.modified || post.date || new Date().toISOString()}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.6</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    // Fetch all blog posts and properties for sitemap
    const [blogPosts, properties] = await Promise.all([
      fetchBlogPosts('en'),
      fetchProperties('en')
    ]);
    
    // Generate the XML sitemap
    const sitemap = generateSiteMap(
      Array.isArray(blogPosts) ? blogPosts : [],
      Array.isArray(properties) ? properties : []
    );

    res.setHeader('Content-Type', 'text/xml');
    // Cache for 1 hour
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Generate basic sitemap without blog posts and properties if there's an error
    const basicSitemap = generateSiteMap([], []);
    res.setHeader('Content-Type', 'text/xml');
    res.write(basicSitemap);
    res.end();

    return {
      props: {},
    };
  }
};

export default SiteMap;
