import axios from "axios";
import { SERVER_ENDPOINT } from "@/utils/config";

// Server-side API functions that can be called from getServerSideProps or getStaticProps
export const fetchBlogPosts = async (lang = "en") => {
  try {
    const response = await axios.get(`${SERVER_ENDPOINT}/api/blog/posts`, {
      headers: {
        "Accept-Language": lang
      },
      timeout: 15000 // 15 second timeout
    });
    const data = response.data?.status ? response.data.data : [];
    // If localized fetch returns empty, retry with English as a safe default
    if ((!Array.isArray(data) || data.length === 0) && lang !== "en") {
      const fallback = await axios.get(`${SERVER_ENDPOINT}/api/blog/posts`, {
        headers: { "Accept-Language": "en" },
        timeout: 15000,
      });
      return fallback.data?.status ? fallback.data.data : [];
    }
    return data;
  } catch (error: any) {
    return [];
  }
};

// Fetch individual blog post by ID
export const fetchBlogPostById = async (id: string, lang = "en") => {
  // Normalize the ID to handle different formats
  const normalizedId = id.toString().trim();
  
  try {
    // First try to get the specific post by ID
    const directEndpoint = `${SERVER_ENDPOINT}/api/blog/post/${normalizedId}`;
    
    const response = await axios.get(directEndpoint, {
      headers: {
        "Accept-Language": lang
      },
      timeout: 15000 // 15 second timeout
    });
    
    // If successful, return the post data
    if (response.data?.status && response.data.data) {
      return { post: response.data.data, found: true };
    }
    // Retry direct fetch in English if localized fetch failed
    if (lang !== "en") {
      const enResponse = await axios.get(directEndpoint, {
        headers: { "Accept-Language": "en" },
        timeout: 15000,
      });
      if (enResponse.data?.status && enResponse.data.data) {
        return { post: enResponse.data.data, found: true };
      }
    }
    
    // If the specific endpoint fails, fallback to fetching all posts and filtering
    let allPosts = await fetchBlogPosts(lang);
    if ((!Array.isArray(allPosts) || allPosts.length === 0) && lang !== "en") {
      allPosts = await fetchBlogPosts("en");
    }
    
    if (!Array.isArray(allPosts) || allPosts.length === 0) {
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
      
      return exactMatch || slugMatch || wordpressIdMatch;
    });
    
    if (post) {
      return { post: post, found: true };
    }
    
    return {
      post: null,
      found: false
    };
  } catch (error: any) {
    // Fallback to fetching all posts and filtering
    try {
      let allPosts = await fetchBlogPosts(lang);
      if ((!Array.isArray(allPosts) || allPosts.length === 0) && lang !== "en") {
        allPosts = await fetchBlogPosts("en");
      }
      
      if (!Array.isArray(allPosts) || allPosts.length === 0) {
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
        return { post: post, found: true };
      } else {
        return {
          post: null,
          found: false
        };
      }
    } catch (fallbackError) {
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
