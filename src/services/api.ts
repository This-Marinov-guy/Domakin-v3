import axios from "axios";
import { SERVER_ENDPOINT } from "@/utils/config";

// Server-side API functions that can be called from getServerSideProps or getStaticProps
export const fetchBlogPosts = async (lang = "en") => {
  try {
    const response = await axios.get(`${SERVER_ENDPOINT}/api/blog/posts`, {
      headers: {
        "Accept-Language": lang
      }
    });
    
    return response.data?.status ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
};

// Fetch individual blog post by ID
export const fetchBlogPostById = async (id: string, lang = "en") => {
  console.log(`[API] Fetching blog post with ID: ${id}, language: ${lang}`);
  try {
    // First try to get the specific post by ID
    console.log(`[API] Attempting direct API call to: ${SERVER_ENDPOINT}/api/blog/post/${id}`);
    const response = await axios.get(`${SERVER_ENDPOINT}/api/blog/post/${id}`, {
      headers: {
        "Accept-Language": lang
      }
    });
    
    // If successful, return the post data
    if (response.data?.status) {
      console.log(`[API] Successfully fetched post by ID: ${id}`);
      const post = response.data.data;
      console.log(`[API] Post title: ${post.title || (post.title?.rendered) || 'No title'}`);
      return {
        post: post,
        found: true
      };
    }
    
    // If the specific endpoint fails, fallback to fetching all posts and filtering
    console.log(`[API] Direct fetch failed or empty response, falling back to all posts`);
    const allPosts = await fetchBlogPosts(lang);
    console.log(`[API] Fetched ${allPosts.length} posts for filtering`);
    
    // Try matching by ID (as number or string)
    const post = allPosts.find((post: any) => {
      const postId = post.id?.toString() || '';
      const targetId = id.toString();
      const matches = postId === targetId;
      if (matches) console.log(`[API] Found matching post by ID: ${post.title || 'No title'}`);
      return matches;
    });
    
    if (post) {
      console.log(`[API] Found post in all posts with ID: ${id}`);
      return {
        post: post,
        found: true
      };
    }
    
    console.log(`[API] Post with ID ${id} not found in all posts`);
    return {
      post: null,
      found: false
    };
  } catch (error) {
    console.error(`[API] Error fetching blog post with ID ${id}:`, error);
    
    // Fallback to fetching all posts and filtering
    try {
      console.log(`[API] Attempting secondary fallback to all posts`);
      const allPosts = await fetchBlogPosts(lang);
      const post = allPosts.find((post: any) => {
        const postId = post.id?.toString() || '';
        const targetId = id.toString();
        return postId === targetId;
      });
      
      if (post) {
        console.log(`[API] Found post in secondary fallback with ID: ${id}`);
      } else {
        console.log(`[API] Post not found in secondary fallback with ID: ${id}`);
      }
      
      return {
        post: post || null,
        found: !!post
      };
    } catch (fallbackError) {
      console.error(`[API] Fallback fetch failed for ID ${id}:`, fallbackError);
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
