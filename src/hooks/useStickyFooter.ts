import { useEffect, useState, RefObject } from "react";

interface UseStickyFooterOptions {
  /**
   * Whether the modal/container is currently visible/open
   */
  isActive?: boolean;
  /**
   * Threshold in pixels for visibility detection (default: 10)
   */
  threshold?: number;
  /**
   * Delay in milliseconds before initial check (default: 100)
   */
  initialDelay?: number;
}

/**
 * Hook to detect if an element (typically a footer) is visible in the viewport.
 * Returns true if the element is visible, false if it's scrolled out of view.
 * Useful for showing/hiding sticky action buttons.
 * 
 * @example
 * ```tsx
 * const footerRef = useRef<HTMLDivElement>(null);
 * const isFooterVisible = useStickyFooter(footerRef, {
 *   isActive: isModalOpen,
 *   threshold: 10,
 * });
 * 
 * return (
 *   <>
 *     <div ref={footerRef}>Original Footer</div>
 *     {!isFooterVisible && <div className="sticky-footer">Sticky Footer</div>}
 *   </>
 * );
 * ```
 * 
 * @param ref - React ref to the element to track
 * @param options - Configuration options
 * @returns boolean indicating if the element is visible
 */
export default function useStickyFooter(
  ref: RefObject<HTMLElement>,
  options: UseStickyFooterOptions = {}
): boolean {
  const {
    isActive = true,
    threshold = 20, // Increased threshold for more reliable detection
    initialDelay = 50, // Reduced delay for faster initial check
  } = options;

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // If not active, assume visible (don't show sticky)
    if (!isActive) {
      setIsVisible(true);
      return;
    }

    // Wait for ref to be available
    if (!ref.current) {
      // Try again after a short delay
      const checkRefTimeout = setTimeout(() => {
        if (!ref.current) {
          setIsVisible(true);
          return;
        }
      }, 100);
      return () => clearTimeout(checkRefTimeout);
    }

    // Manual visibility check function
    let rafId: number | null = null;
    let isMounted = true;
    
    const checkVisibility = () => {
      if (!isMounted || !ref.current) {
        setIsVisible(true);
        return;
      }
      
      try {
        const rect = ref.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Element is visible if a meaningful portion of it is within the viewport
        // rect.top: distance from top of viewport to top of element
        //   - negative if element is above viewport
        //   - positive if element is below top of viewport
        // rect.bottom: distance from top of viewport to bottom of element
        // 
        // Footer is visible if:
        // - Top of footer is above bottom of viewport (with threshold): rect.top < viewportHeight - threshold
        // - Bottom of footer is below top of viewport (with threshold): rect.bottom > threshold
        // 
        // This ensures at least part of the footer is visible, not just a tiny edge
        const isTopAboveViewportBottom = rect.top < viewportHeight - threshold;
        const isBottomBelowViewportTop = rect.bottom > threshold;
        const isElementVisible = isTopAboveViewportBottom && isBottomBelowViewportTop;
        
        if (isMounted) {
          setIsVisible(isElementVisible);
        }
      } catch (error) {
        // Fallback to visible if there's an error
        if (isMounted) {
          setIsVisible(true);
        }
      }
    };

    // Immediate check if ref is already available
    if (ref.current) {
      checkVisibility();
    }
    
    // Also check after delays to ensure DOM is fully ready (production can be slower)
    const timeoutId1 = setTimeout(() => {
      checkVisibility();
    }, initialDelay);
    
    const timeoutId2 = setTimeout(() => {
      checkVisibility();
    }, initialDelay * 2);

    // Use IntersectionObserver as a backup for additional reliability
    let observer: IntersectionObserver | null = null;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      try {
        observer = new IntersectionObserver(
          (entries) => {
            if (!isMounted) return;
            entries.forEach((entry) => {
              // Use manual check as primary, IntersectionObserver as confirmation
              checkVisibility();
            });
          },
          {
            threshold: 0.01, // Trigger when at least 1% is visible
            root: null, // Use viewport
            rootMargin: '0px',
          }
        );
      } catch (error) {
        // IntersectionObserver not supported or error creating it
        console.warn('IntersectionObserver not available:', error);
      }
    }

    // Observe the element
    if (observer && ref.current) {
      try {
        observer.observe(ref.current);
      } catch (error) {
        console.warn('Error observing element:', error);
      }
    }

    const handleScroll = () => {
      if (!isMounted) return;
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(checkVisibility);
    };

    const handleResize = () => {
      if (!isMounted) return;
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(checkVisibility);
    };

    // Find all possible scrollable containers
    let scrollContainers: (HTMLElement | Window)[] = [window];
    try {
      const modal = ref.current?.closest('.modal');
      const modalContent = modal?.querySelector('.modal-content') as HTMLElement;
      const modalBody = modal?.querySelector('.modal-body') as HTMLElement;
      
      if (modalContent) scrollContainers.push(modalContent);
      if (modalBody) scrollContainers.push(modalBody);
      if (modal) scrollContainers.push(modal as HTMLElement);
    } catch (error) {
      // If DOM queries fail, just use window
      console.warn('Error finding scroll containers:', error);
    }
    
    // Listen to scroll on multiple containers to catch all scroll events
    scrollContainers.forEach((container) => {
      try {
        if (container instanceof Window) {
          window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
        } else {
          container.addEventListener('scroll', handleScroll, { passive: true, capture: true });
        }
      } catch (error) {
        console.warn('Error adding scroll listener:', error);
      }
    });
    
    try {
      window.addEventListener('resize', handleResize, { passive: true });
    } catch (error) {
      console.warn('Error adding resize listener:', error);
    }

    return () => {
      isMounted = false;
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (observer) {
        try {
          observer.disconnect();
        } catch (error) {
          // Ignore cleanup errors
        }
      }
      scrollContainers.forEach((container) => {
        try {
          if (container instanceof Window) {
            window.removeEventListener('scroll', handleScroll, true);
          } else {
            container.removeEventListener('scroll', handleScroll, true);
          }
        } catch (error) {
          // Ignore cleanup errors
        }
      });
      try {
        window.removeEventListener('resize', handleResize);
      } catch (error) {
        // Ignore cleanup errors
      }
    };
  }, [ref, isActive, threshold, initialDelay]);

  return isVisible;
}

