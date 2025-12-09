import { useEffect, useMemo, useState } from "react";

export default function useOnScreen(ref: any) {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = useMemo(() => {
    if (typeof window !== "undefined") {
      return new IntersectionObserver(
        ([entry]) => setIntersecting(entry.isIntersecting),
        {
          threshold: 0.1, // Trigger when at least 10% of the element is visible
          rootMargin: "0px",
        }
      );
    }
    return null;
  }, [ref]);

  useEffect(() => {
    if (!observer || !ref.current) return;

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [observer]);

  return ref?.current && isIntersecting;
}
