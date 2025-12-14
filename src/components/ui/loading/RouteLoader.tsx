import React, { useState, useEffect, useRef } from "react";
import Router from "next/router";
import { useStore } from "@/stores/storeContext";

// Helper function to check if page content is ready
const isPageContentReady = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Wait for React to finish rendering
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Check if main content containers exist and have content
        const mainContent = document.querySelector('.blog-section-three, .property-listing-six, .center-dots, main, [role="main"], .container');
        const hasContent = mainContent && (mainContent.children.length > 0 || mainContent.textContent?.trim());
        
        if (!hasContent) {
          // If no content yet, wait a bit more
          setTimeout(() => resolve(true), 300);
          return;
        }
        
        // Wait for critical images to load (above the fold)
        const images = Array.from(document.querySelectorAll('img'));
        const criticalImages = images.filter((img) => {
          const rect = img.getBoundingClientRect();
          // Only wait for images in viewport or near it
          return rect.top < window.innerHeight + 500;
        });
        
        if (criticalImages.length === 0) {
          resolve(true);
          return;
        }
        
        let imagesLoaded = 0;
        const totalImages = criticalImages.length;
        
        const checkComplete = () => {
          imagesLoaded++;
          if (imagesLoaded >= totalImages) {
            // Small delay for smooth transition
            setTimeout(() => resolve(true), 100);
          }
        };
        
        criticalImages.forEach((img) => {
          if (img.complete) {
            checkComplete();
          } else {
            img.addEventListener('load', checkComplete, { once: true });
            img.addEventListener('error', checkComplete, { once: true });
          }
        });
        
        // Fallback: resolve after max wait time (2 seconds)
        setTimeout(() => resolve(true), 2000);
      });
    });
  });
};

export default function RouteLoader() {
  const [loading, setLoading] = useState(false);
  const { blogStore } = useStore();
  const pendingNavigationRef = useRef<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      // Clear any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      setLoading(true);
      pendingNavigationRef.current = url;
      
      // Reset any loading states when navigating to avoid conflicts
      if (url.includes('/blog')) {
        // If navigating to blog, don't reset the loading state as the blog page will handle it
      } else {
        // For other pages, make sure blog loading is reset
        blogStore.loading = false;
      }
    };

    const handleRouteChangeComplete = async (url: string) => {
      // Only process if this is the current navigation
      if (pendingNavigationRef.current !== url) {
        return;
      }
      
      try {
        // Wait for page content to be fully loaded before hiding loader
        await isPageContentReady();
        
        // Only hide loader if this is still the current navigation
        if (pendingNavigationRef.current === url) {
          setLoading(false);
          pendingNavigationRef.current = null;
        }
      } catch (error) {
        // Fallback: hide loader after timeout
        if (pendingNavigationRef.current === url) {
          timeoutRef.current = setTimeout(() => {
            if (pendingNavigationRef.current === url) {
              setLoading(false);
              pendingNavigationRef.current = null;
            }
          }, 2000);
        }
      }
    };

    const handleRouteChangeError = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setLoading(false);
      pendingNavigationRef.current = null;
    };

    Router.events.on("routeChangeStart", handleRouteChangeStart);
    Router.events.on("routeChangeComplete", handleRouteChangeComplete);
    Router.events.on("routeChangeError", handleRouteChangeError);
    
    return () => {
      Router.events.off("routeChangeStart", handleRouteChangeStart);
      Router.events.off("routeChangeComplete", handleRouteChangeComplete);
      Router.events.off("routeChangeError", handleRouteChangeError);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [blogStore]);

  return loading && <div className="page-loader-bar" />;
}
