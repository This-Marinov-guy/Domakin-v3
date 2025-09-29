import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import useTranslation from 'next-translate/useTranslation';

interface RelatedPostsProps {
  currentPostId: string;
  allPosts: any[];
  currentPostCategory?: string;
  limit?: number;
}

const RelatedPosts = ({ 
  currentPostId, 
  allPosts, 
  currentPostCategory, 
  limit = 3 
}: RelatedPostsProps) => {
  const { t } = useTranslation('translations');

  // Filter out current post and find related posts
  const relatedPosts = allPosts
    .filter(post => post.id?.toString() !== currentPostId?.toString())
    .sort((a, b) => {
      // Prioritize posts with same category
      const aMatchesCategory = a.category === currentPostCategory;
      const bMatchesCategory = b.category === currentPostCategory;
      
      if (aMatchesCategory && !bMatchesCategory) return -1;
      if (!aMatchesCategory && bMatchesCategory) return 1;
      
      // Then sort by date (newest first)
      const aDate = new Date(a.date || 0);
      const bDate = new Date(b.date || 0);
      return bDate.getTime() - aDate.getTime();
    })
    .slice(0, limit);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="related-posts mt-80 mb-40">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h3 className="mb-40">{t('blog.related_posts')}</h3>
          </div>
        </div>
        <div className="row">
          {relatedPosts.map((post) => {
            // Create SEO-friendly URL
            const seoSlug = post.slug || 
              (post.title?.toLowerCase()
                ?.replace(/[^\w\s-]/g, '')
                ?.replace(/\s+/g, '-')
                ?.trim()) || 
              post.id;
            
            const link = `/blog/${seoSlug}`;
            const postTitle = post.title?.rendered || post.title || 'Untitled';
            const postExcerpt = post.excerpt?.rendered || post.excerpt || 
              (post.content?.rendered || post.content || '').replace(/<[^>]*>/g, '').substring(0, 120);

            return (
              <div key={post.id} className="col-lg-4 col-md-6 mb-40">
                <article className="blog-card-small">
                  {post.image && (
                    <div className="blog-card-image mb-20">
                      <Link href={link}>
                        <Image 
                          src={post.image} 
                          alt={postTitle}
                          width={400}
                          height={250}
                          className="img-fluid rounded"
                          style={{ objectFit: 'cover' }}
                        />
                      </Link>
                    </div>
                  )}
                  <div className="blog-card-content">
                    {post.category && (
                      <span className="blog-category text-uppercase small text-muted mb-10 d-block">
                        {post.category}
                      </span>
                    )}
                    <h5 className="blog-card-title mb-15">
                      <Link href={link} className="text-decoration-none">
                        {postTitle}
                      </Link>
                    </h5>
                    {postExcerpt && (
                      <p className="blog-card-excerpt text-muted small mb-15">
                        {postExcerpt}...
                      </p>
                    )}
                    <Link href={link} className="btn-link small">
                      {t('blog.read_more')} <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RelatedPosts;
