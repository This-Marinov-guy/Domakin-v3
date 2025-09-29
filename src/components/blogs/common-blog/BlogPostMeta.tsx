import React from 'react';
import useTranslation from 'next-translate/useTranslation';

interface BlogPostMetaProps {
  post: any;
  readingTime?: number;
}

const BlogPostMeta = ({ post, readingTime }: BlogPostMetaProps) => {
  const { t } = useTranslation('translations');

  // Calculate reading time if not provided
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const postContent = post?.content?.rendered || post?.content || '';
  const estimatedReadingTime = readingTime || calculateReadingTime(postContent);
  
  const publishDate = post?.date ? new Date(post.date).toLocaleDateString() : '';
  const author = post?.author?.name || 'Domakin Team';

  return (
    <div className="blog-post-meta d-flex flex-wrap align-items-center mt-20 mb-30">
      <div className="meta-item me-4 mb-2">
        <i className="bi bi-person-circle me-2"></i>
        <span className="text-muted">By {author}</span>
      </div>
      
      {publishDate && (
        <div className="meta-item me-4 mb-2">
          <i className="bi bi-calendar3 me-2"></i>
          <span className="text-muted">{publishDate}</span>
        </div>
      )}
      
      <div className="meta-item me-4 mb-2">
        <i className="bi bi-clock me-2"></i>
        <span className="text-muted">{estimatedReadingTime} min read</span>
      </div>
      
      {post?.category && (
        <div className="meta-item mb-2">
          <i className="bi bi-tag me-2"></i>
          <span className="badge bg-light text-dark">{post.category}</span>
        </div>
      )}
    </div>
  );
};

export default BlogPostMeta;
