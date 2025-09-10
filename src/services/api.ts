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
