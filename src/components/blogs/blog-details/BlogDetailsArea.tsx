"use client"
import Image from "next/image";
import Link from "next/link";
import BlogComment from "../common-blog/BlogComment";
import BlogForm from "@/components/forms/BlogForm";
import BlogSidebar from "../common-blog/BlogSidebar";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/storeContext";
import useTranslation from "next-translate/useTranslation";
import moment from "moment";

import blogDetailsIcon from "@/assets/images/icon/icon_67.svg";
import blogDetailsThumb_1 from "@/assets/images/blog/blog_img_16.jpg";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface BlogDetailsAreaProps {
   post?: any;
}

// Fallback content in case post data is incomplete
const fallbackContent = {
   blog_details_list: ["Find the problem first", "Make research and find out the solution", "Finalize the solution & apply."],
   icon: ["fa-brands fa-whatsapp", "fa-brands fa-x-twitter", "fa-brands fa-instagram", "fa-brands fa-viber"]
};

const BlogDetailsArea = ({ post: serverPost }: BlogDetailsAreaProps) => {
   const { t } = useTranslation("translations");
   const router = useRouter();
   const { blogStore } = useStore();
   const { currentPost, postLoading } = blogStore;
   
   // Use either the server-side post (from props) or the one in the store
   const post = serverPost || currentPost;
   
   useEffect(() => {
      // If no post data is available and not currently loading, redirect to blog index
      if (!post && !postLoading) {
         router.push('/blog');
      }
   }, [post, postLoading]);
   
   // Show loading state or post not found
   if (!post) {
      return (
         <div className="blog-details border-top mt-130 xl-mt-100 pt-100 xl-pt-80 mb-150 xl-mb-100">
            <div className="container">
               <div className="row">
                  <div className="col-12 text-center">
                     {postLoading ? (
                        <h3>{t("blog.loading")}</h3>
                     ) : (
                        <h3>{t("blog.post_not_found")}</h3>
                     )}
                  </div>
               </div>
            </div>
         </div>
      );
   }
   
   // Format publication date
   const publicationDate = post.created_at ? moment(post.created_at).format("DD MMM") : "N/A";
   const publicationYear = post.created_at ? moment(post.created_at).format("YYYY") : "";
   
   // Extract tags
   const tags = post.tags || [];
   
   // Content sections
   // Handle both string content and possible content.rendered from WordPress API
   const mainContent = post.content?.rendered || post.content || "";
   // Remove HTML tags for simple text display if content has HTML
   const contentText = mainContent.replace(/<[^>]*>/g, ' ').trim();
   const contentSections = contentText.split('\n\n').filter(Boolean);
   
   return (
      <div className="blog-details border-top mt-130 xl-mt-100 pt-100 xl-pt-80 mb-150 xl-mb-100">
         <div className="container">
            <div className="row gx-xl-5">
               <div className="col-lg-8">
                  <div className="blog-post-meta mb-60 lg-mb-40">
                     <div className="post-info">
                        <Link href="#">{post.author || "Domakin Team"}</Link> {post.reading_time || "5"} min
                     </div>
                     <h3 className="blog-title">{post.title}</h3>
                  </div>
               </div>
            </div>
            <div className="row gx-xl-5">
               <div className="col-lg-8">
                  <article className="blog-post-meta">
                     <figure className="post-img position-relative m0"
                        style={{ backgroundImage: `url(${post.image || "/assets/images/blog/blog_img_11.jpg"})` }}>
                        <div className="fw-500 date d-inline-block">{publicationDate} {publicationYear}</div>
                     </figure>
                     <div className="post-data pt-50 md-pt-30">
                        {contentSections.length > 0 ? (
                           <>
                              {contentSections.map((section: string, index: number) => (
                                 <div key={index} className="mb-4">
                                    {index === 1 && post.quote ? (
                                       <div className="quote-wrapper mb-4">
                                          <div className="icon rounded-circle d-flex align-items-center justify-content-center m-auto">
                                             <Image src={blogDetailsIcon} alt="" className="lazy-img" />
                                          </div>
                                          <div className="row">
                                             <div className="col-xxl-10 col-xl-11 col-lg-12 col-md-9 m-auto">
                                                <h4>{post.quote}</h4>
                                             </div>
                                          </div>
                                          {post.quote_author && (
                                             <h6>{post.quote_author} {post.quote_location && <span>{post.quote_location}</span>}</h6>
                                          )}
                                       </div>
                                    ) : null}
                                    
                                    {index === Math.floor(contentSections.length / 2) && post.image_middle ? (
                                       <>
                                          <div className="img-meta mb-4">
                                             <img 
                                                src={post.image_middle} 
                                                alt={post.title} 
                                                className="lazy-img w-100" 
                                             />
                                          </div>
                                          {post.image_caption && (
                                             <div className="img-caption mb-4">{post.image_caption}</div>
                                          )}
                                       </>
                                    ) : null}
                                    
                                    <p>{section}</p>
                                 </div>
                              ))}
                           </>
                        ) : (
                           <p>{t("blog.no_content")}</p>
                        )}

                        {post.list_items && post.list_items.length > 0 && (
                           <ul className="style-none list-item">
                              {post.list_items.map((item: string, i: number) => (
                                 <li key={i}>{item}</li>
                              ))}
                           </ul>
                        )}
                     </div>
                     <div className="bottom-widget d-sm-flex align-items-center justify-content-between">
                        <ul className="d-flex align-items-center tags style-none pt-20">
                           <li>Tag:</li>
                           {tags.length > 0 ? (
                              tags.map((tag: string, i: number) => (
                                 <li key={i}><Link href={`/blog?tag=${tag}`}>{tag}{i < tags.length - 1 ? ',' : ''}</Link></li>
                              ))
                           ) : (
                              <>
                                 <li><Link href="#">Housing</Link></li>
                                 <li><Link href="#">Students</Link></li>
                              </>
                           )}
                        </ul>
                        <ul className="d-flex share-icon align-items-center style-none pt-20">
                           <li>Share:</li>
                           {fallbackContent.icon.map((icon, index) => (
                              <li key={index}><Link href="#"><i className={icon}></i></Link></li>
                           ))}
                        </ul>
                     </div>
                  </article>

                  <BlogComment />
                  <BlogForm />
               </div>
               <BlogSidebar style={true} />
            </div>
         </div>
      </div>
   )
}

export default observer(BlogDetailsArea);
