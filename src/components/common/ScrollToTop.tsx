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
   scrollButton = (
      <div onClick={scrollTop} className={`scroll-top ${sticky ? "active" : ""}`}>
         <i className="bi bi-arrow-up-short"></i>
      </div>
   );

   return (
      <>
         {scrollButton && scrollButton}
      </>
   )
}

export default ScrollToTop
