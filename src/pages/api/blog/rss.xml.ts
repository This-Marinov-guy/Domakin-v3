import { GetServerSideProps } from 'next';
import { fetchBlogPosts } from '@/services/api';

function generateRssXml(blogPosts: any[]) {
  const baseUrl = 'https://www.domakin.nl';
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>Domakin Blog - Student Housing Tips & News</title>
        <description>The latest tips, news, and insights about student housing from Domakin</description>
        <link>${baseUrl}/blog</link>
        <language>en</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${baseUrl}/api/blog/rss.xml" rel="self" type="application/rss+xml"/>
        <image>
          <url>${baseUrl}/assets/img/logo.png</url>
          <title>Domakin Blog</title>
          <link>${baseUrl}/blog</link>
        </image>
        ${blogPosts
          .filter(post => post.slug) // Only include posts with slugs
          .slice(0, 20) // Limit to 20 most recent posts
          .map((post) => {
            // Use the slug from the API response
            const seoSlug = post.slug;

            const postTitle = post.title?.rendered || post.title || 'Untitled';
            const postContent = post.content?.rendered || post.content || post.excerpt?.rendered || post.excerpt || '';
            const postExcerpt = post.excerpt?.rendered || post.excerpt || 
              (typeof postContent === "string" ? postContent.replace(/<[^>]*>/g, '').substring(0, 160) : "");

            return `
              <item>
                <title><![CDATA[${postTitle}]]></title>
                <description><![CDATA[${postExcerpt}]]></description>
                <content:encoded><![CDATA[${postContent}]]></content:encoded>
                <link>${baseUrl}/blog/${seoSlug}</link>
                <guid isPermaLink="true">${baseUrl}/blog/${seoSlug}</guid>
                <pubDate>${new Date(post.date || new Date()).toUTCString()}</pubDate>
                ${post.author?.name ? `<author>noreply@domakin.nl (${post.author.name})</author>` : '<author>noreply@domakin.nl (Domakin Team)</author>'}
                ${post.category ? `<category><![CDATA[${post.category}]]></category>` : '<category><![CDATA[Student Housing]]></category>'}
                ${post.image ? `<enclosure url="${post.image}" type="image/jpeg"/>` : ''}
              </item>
            `;
          })
          .join('')}
      </channel>
    </rss>
  `;

  return rssXml;
}

function RSSFeed() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    // Fetch all blog posts for RSS feed
    const blogPosts = await fetchBlogPosts('en');
    
    // Generate the RSS XML
    const rss = generateRssXml(Array.isArray(blogPosts) ? blogPosts : []);

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    // Cache for 1 hour
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.write(rss);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    
    // Generate basic RSS feed without blog posts if there's an error
    const basicRss = generateRssXml([]);
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.write(basicRss);
    res.end();

    return {
      props: {},
    };
  }
};

export default RSSFeed;
