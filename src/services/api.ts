import axios from "axios";
import { SERVER_ENDPOINT } from "@/utils/config";

// Server-side API functions that can be called from getServerSideProps or getStaticProps
export const fetchBlogPosts = async (lang = "en") => {
  console.log(`[API] fetchBlogPosts called with lang: ${lang}`);
  console.log(`[API] SERVER_ENDPOINT: ${SERVER_ENDPOINT}`);
  console.log(`[API] NODE_ENV: ${process.env.NODE_ENV}`);
  
  try {
    const url = `${SERVER_ENDPOINT}/api/v1/blog/posts`;
    console.log(`[API] Making request to: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        "Accept-Language": lang
      },
      timeout: 15000 // 15 second timeout
    });
    
    console.log(`[API] Response status: ${response.status}`);
    console.log(`[API] Response data status: ${response.data?.status}`);
    console.log(`[API] Response data length: ${response.data?.data?.length || 0}`);
    
    const data = response.data?.status ? response.data.data : [];
    
    // If localized fetch returns empty, retry with English as a safe default
    if ((!Array.isArray(data) || data.length === 0) && lang !== "en") {
      console.log(`[API] Localized fetch returned empty, trying English fallback`);
      const fallback = await axios.get(url, {
        headers: { "Accept-Language": "en" },
        timeout: 15000,
      });
      console.log(`[API] Fallback response status: ${fallback.status}`);
      console.log(`[API] Fallback data length: ${fallback.data?.data?.length || 0}`);
      return fallback.data?.status ? fallback.data.data : [];
    }
    
    console.log(`[API] Returning ${data.length} posts`);
    return data;
  } catch (error: any) {
    console.error(`[API] Error in fetchBlogPosts:`, error.message);
    console.error(`[API] Error response:`, error.response?.data);
    console.error(`[API] Error status:`, error.response?.status);
    return [];
  }
};

// Fetch individual blog post by ID
// Fetch individual blog post by slug
export const fetchBlogPostBySlug = async (slug: string, lang = "en") => {
  console.log(`[API] fetchBlogPostBySlug called with slug: ${slug}, lang: ${lang}`);
  
  // Normalize the slug
  const normalizedSlug = slug.toString().trim();
  console.log(`[API] Normalized slug: ${normalizedSlug}`);
  
  try {
    const endpoint = `${SERVER_ENDPOINT}/api/v1/blog/post-by-slug/${normalizedSlug}`;
    console.log(`[API] Making request to: ${endpoint}`);
    
    const response = await axios.get(endpoint, {
      headers: {
        "Accept-Language": lang
      },
      timeout: 15000 // 15 second timeout
    });
    
    console.log(`[API] Response status: ${response.status}`);
    console.log(`[API] Response data status: ${response.data?.status}`);
    console.log(`[API] Response has data: ${!!response.data?.data}`);
    
    // If successful, return the post data
    if (response.data?.status && response.data.data) {
      console.log(`[API] Found post by slug: ${response.data.data.title || 'No title'}`);
      return { post: response.data.data, found: true };
    }
    
    // Retry in English if localized fetch failed
    if (lang !== "en") {
      console.log(`[API] Trying slug fetch in English`);
      const enResponse = await axios.get(endpoint, {
        headers: { "Accept-Language": "en" },
        timeout: 15000,
      });
      console.log(`[API] English response status: ${enResponse.status}`);
      console.log(`[API] English response data status: ${enResponse.data?.status}`);
      
      if (enResponse.data?.status && enResponse.data.data) {
        console.log(`[API] Found post in English: ${enResponse.data.data.title || 'No title'}`);
        return { post: enResponse.data.data, found: true };
      }
    }
    
    console.log(`[API] No post found for slug: ${normalizedSlug}`);
    return {
      post: null,
      found: false
    };
  } catch (error: any) {
    console.error(`[API] Error in fetchBlogPostBySlug:`, error.message);
    console.error(`[API] Error response:`, error.response?.data);
    console.error(`[API] Error status:`, error.response?.status);
    
    return {
      post: null,
      found: false
    };
  }
};

export const fetchBlogPostById = async (id: string, lang = "en") => {
  console.log(`[API] fetchBlogPostById called with id: ${id}, lang: ${lang}`);
  
  // Normalize the ID to handle different formats
  const normalizedId = id.toString().trim();
  console.log(`[API] Normalized ID: ${normalizedId}`);
  
  try {
    // First try to get the specific post by ID
    const directEndpoint = `${SERVER_ENDPOINT}/api/v1/blog/post/${normalizedId}`;
    console.log(`[API] Making direct request to: ${directEndpoint}`);
    
    const response = await axios.get(directEndpoint, {
      headers: {
        "Accept-Language": lang
      },
      timeout: 15000 // 15 second timeout
    });
    
    console.log(`[API] Direct response status: ${response.status}`);
    console.log(`[API] Direct response data status: ${response.data?.status}`);
    console.log(`[API] Direct response has data: ${!!response.data?.data}`);
    
    // If successful, return the post data
    if (response.data?.status && response.data.data) {
      console.log(`[API] Found post directly: ${response.data.data.title || 'No title'}`);
      return { post: response.data.data, found: true };
    }
    
    // Retry direct fetch in English if localized fetch failed
    if (lang !== "en") {
      console.log(`[API] Trying direct fetch in English`);
      const enResponse = await axios.get(directEndpoint, {
        headers: { "Accept-Language": "en" },
        timeout: 15000,
      });
      console.log(`[API] English direct response status: ${enResponse.status}`);
      console.log(`[API] English direct response data status: ${enResponse.data?.status}`);
      
      if (enResponse.data?.status && enResponse.data.data) {
        console.log(`[API] Found post in English: ${enResponse.data.data.title || 'No title'}`);
        return { post: enResponse.data.data, found: true };
      }
    }
    
    // If the specific endpoint fails, fallback to fetching all posts and filtering
    console.log(`[API] Direct fetch failed, falling back to all posts`);
    let allPosts = await fetchBlogPosts(lang);
    console.log(`[API] Fetched ${allPosts?.length || 0} posts for filtering`);
    
    if ((!Array.isArray(allPosts) || allPosts.length === 0) && lang !== "en") {
      console.log(`[API] No posts in ${lang}, trying English`);
      allPosts = await fetchBlogPosts("en");
      console.log(`[API] Fetched ${allPosts?.length || 0} English posts for filtering`);
    }
    
    if (!Array.isArray(allPosts) || allPosts.length === 0) {
      console.log(`[API] No posts available for filtering`);
      return {
        post: null,
        found: false
      };
    }
    
    // Try matching by ID (as number or string)
    console.log(`[API] Searching for post with ID ${normalizedId} in ${allPosts.length} posts`);
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
        console.log(`[API] Found matching post: ${post.title || 'No title'} (matched by ${exactMatch ? 'ID' : slugMatch ? 'slug' : 'wordpress_id'})`);
      }
      
      return matches;
    });
    
    if (post) {
      return { post: post, found: true };
    }
    
    console.log(`[API] No matching post found`);
    return {
      post: null,
      found: false
    };
  } catch (error: any) {
    console.error(`[API] Error in fetchBlogPostById:`, error.message);
    console.error(`[API] Error response:`, error.response?.data);
    console.error(`[API] Error status:`, error.response?.status);
    
    // Fallback to fetching all posts and filtering
    try {
      console.log(`[API] Attempting fallback to all posts`);
      let allPosts = await fetchBlogPosts(lang);
      if ((!Array.isArray(allPosts) || allPosts.length === 0) && lang !== "en") {
        allPosts = await fetchBlogPosts("en");
      }
      
      if (!Array.isArray(allPosts) || allPosts.length === 0) {
        console.log(`[API] No posts available for fallback`);
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
        console.log(`[API] Found post in fallback: ${post.title || 'No title'}`);
        return { post: post, found: true };
      } else {
        console.log(`[API] No post found in fallback`);
        return {
          post: null,
          found: false
        };
      }
    } catch (fallbackError) {
      console.error(`[API] Fallback error:`, fallbackError);
      return {
        post: null,
        found: false
      };
    }
  }
};

export const fetchProperties = async (lang = "en") => {
  try {
    const response = await axios.get(`${SERVER_ENDPOINT}/api/v1/property/listing`, {
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
    const response = await axios.get(`${SERVER_ENDPOINT}/api/v1/feedback/list`, {
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
