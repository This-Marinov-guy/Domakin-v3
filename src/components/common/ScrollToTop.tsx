"use client"
import UseSticky from "@/hooks/UseSticky";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';

const ScrollToTop = () => {
   const router = useRouter();
   const { sticky }: { sticky: boolean } = UseSticky();

   const [showScroll, setShowScroll] = useState(false);

   const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400) {
         setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
         setShowScroll(false);
      }
   };

   const scrollTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   };

   // useEffect(() => {
   //    window.addEventListener("scroll", checkScrollTop);
   //    return () => window.removeEventListener("scroll", checkScrollTop);
   // }, []);
   useEffect(() => {
      const checkScrollTop = () => {
         if (!showScroll && window.pageYOffset > 400) {
            setShowScroll(true);
         } else if (showScroll && window.pageYOffset <= 400) {
            setShowScroll(false);
         }
      };

      window.addEventListener("scroll", checkScrollTop);
      return () => window.removeEventListener("scroll", checkScrollTop);
   }, [checkScrollTop]);

   let scrollButton = null;
   if (router.asPath.includes('add-listing-v2')) {
      scrollButton = (
          <button type="button" onClick={scrollTop} className={`scroll-top-v2 ${sticky ? "active" : ""}`}>
             To the Top <i className="bi bi-arrow-up-circle"></i>
          </button>
      );
   } else if (router.asPath.includes('add-listing-v3')) {
      scrollButton = (
          <button type="button" onClick={scrollTop} className={`scroll-top-v2 scroll-top-v3 ${sticky ? "active" : ""}`}>
             To the Top <i className="bi bi-arrow-up-circle"></i>
          </button>
      );
   } else {
      scrollButton = (
          <div onClick={scrollTop} className={`scroll-top ${sticky ? "active" : ""}`}>
             <i className="bi bi-arrow-up-short"></i>
          </div>
      );
   }

   return (
      <>
         {scrollButton && scrollButton}
      </>
   )
}

export default ScrollToTop
