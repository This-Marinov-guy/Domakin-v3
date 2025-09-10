import axios from "axios";
import { SERVER_ENDPOINT } from "@/utils/config";

// Server-side API functions that can be called from getServerSideProps or getStaticProps
export const fetchBlogPosts = async (lang = "en") => {
  try {
    console.log(`[API] Fetching all blog posts with language: ${lang}`);
    console.log(`[API] Server endpoint: ${SERVER_ENDPOINT}`);
    console.log(`[API] Full URL: ${SERVER_ENDPOINT}/api/blog/posts`);
    
    const response = await axios.get(`${SERVER_ENDPOINT}/api/blog/posts`, {
      headers: {
        "Accept-Language": lang
      },
      timeout: 15000 // 15 second timeout
    });
    
    if (response.data?.status) {
      console.log(`[API] Successfully fetched ${response.data.data?.length || 0} blog posts`);
      if (response.data.data?.length > 0) {
        console.log(`[API] First post ID: ${response.data.data[0].id}, Title: ${response.data.data[0].title || 'No title'}`);
      }
      return response.data.data;
    } else {
      console.log(`[API] Blog posts API returned status false or invalid format`);
      return [];
    }
  } catch (error: any) {
    console.error("[API] Error fetching blog posts:", error);
    console.log(`[API] Error details: ${error.message || 'No error message'}`);
    if (error.response) {
      console.log(`[API] Response status: ${error.response.status}`);
      console.log(`[API] Response data:`, error.response.data);
    }
    return [];
  }
};

// Fetch individual blog post by ID
export const fetchBlogPostById = async (id: string, lang = "en") => {
  console.log(`[API] Fetching blog post with ID: ${id}, language: ${lang}`);
  console.log(`[API] Server endpoint: ${SERVER_ENDPOINT}`);
  
  // Normalize the ID to handle different formats
  const normalizedId = id.toString().trim();
  console.log(`[API] Normalized ID: ${normalizedId}`);
  
  try {
    // First try to get the specific post by ID
    const directEndpoint = `${SERVER_ENDPOINT}/api/blog/post/${normalizedId}`;
    console.log(`[API] Attempting direct API call to: ${directEndpoint}`);
    
    const response = await axios.get(directEndpoint, {
      headers: {
        "Accept-Language": lang
      },
      timeout: 15000 // 15 second timeout
    });
    
    // If successful, return the post data
    if (response.data?.status && response.data.data) {
      console.log(`[API] Successfully fetched post by ID: ${normalizedId}`);
      const post = response.data.data;
      console.log(`[API] Post title: ${post.title || (post.title?.rendered) || 'No title'}`);
      return {
        post: post,
        found: true
      };
    } else {
      console.log(`[API] Direct API call returned status false or invalid data format`);
    }
    
    // If the specific endpoint fails, fallback to fetching all posts and filtering
    console.log(`[API] Direct fetch failed or empty response, falling back to all posts`);
    const allPosts = await fetchBlogPosts(lang);
    console.log(`[API] Fetched ${allPosts?.length || 0} posts for filtering`);
    
    if (!Array.isArray(allPosts) || allPosts.length === 0) {
      console.log(`[API] No posts available for fallback search`);
      return {
        post: null,
        found: false
      };
    }
    
    // Try matching by ID (as number or string)
    const post = allPosts.find((post: any) => {
      if (!post || !post.id) return false;
      
      const postId = post.id?.toString() || '';
      const targetId = normalizedId;
      
      // Try multiple matching strategies
      const exactMatch = postId === targetId;
      const slugMatch = post.slug === targetId;
      const wordpressIdMatch = post.wordpress_id?.toString() === targetId;
      
      const matches = exactMatch || slugMatch || wordpressIdMatch;
      
      if (matches) {
        console.log(`[API] Found matching post by ${exactMatch ? 'exact ID' : slugMatch ? 'slug' : 'wordpress_id'}: ${post.title || 'No title'}`);
      }
      return matches;
    });
    
    if (post) {
      console.log(`[API] Found post in all posts with ID: ${normalizedId}`);
      return {
        post: post,
        found: true
      };
    }
    
    console.log(`[API] Post with ID ${normalizedId} not found in all posts`);
    return {
      post: null,
      found: false
    };
  } catch (error: any) {
    console.error(`[API] Error fetching blog post with ID ${normalizedId}:`, error);
    console.log(`[API] Error details: ${error.message || 'No error message'}`);
    
    if (error.response) {
      console.log(`[API] Response status: ${error.response.status}`);
      console.log(`[API] Response data:`, error.response.data);
    }
    
    // Fallback to fetching all posts and filtering
    try {
      console.log(`[API] Attempting secondary fallback to all posts`);
      const allPosts = await fetchBlogPosts(lang);
      
      if (!Array.isArray(allPosts) || allPosts.length === 0) {
        console.log(`[API] No posts available for secondary fallback search`);
        return {
          post: null,
          found: false
        };
      }
      
      // Try multiple matching strategies
      const post = allPosts.find((post: any) => {
        if (!post || !post.id) return false;
        
        const postId = post.id?.toString() || '';
        const targetId = normalizedId;
        const slug = post.slug || '';
        
        return postId === targetId || 
               slug === targetId || 
               post.wordpress_id?.toString() === targetId;
      });
      
      if (post) {
        console.log(`[API] Found post in secondary fallback with ID: ${normalizedId}`);
        return {
          post: post,
          found: true
        };
      } else {
        console.log(`[API] Post not found in secondary fallback with ID: ${normalizedId}`);
        return {
          post: null,
          found: false
        };
      }
    } catch (fallbackError) {
      console.error(`[API] Fallback fetch failed for ID ${normalizedId}:`, fallbackError);
      return {
        post: null,
        found: false
      };
    }
  }
};

export const fetchProperties = async (lang = "en") => {
  try {
    const response = await axios.get(`${SERVER_ENDPOINT}/api/property/listing`, {
      headers: {
        "Accept-Language": lang
      }
    });
    
    return response.data?.status ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
};

export const fetchFeedbacks = async (lang = "en") => {
  try {
    const response = await axios.get(`${SERVER_ENDPOINT}/api/feedback/list`, {
      headers: {
        "Accept-Language": lang
      }
    });
    
    return response.data?.status ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return [];
  }
};
