'use client'
import { useEffect, useState } from "react";

interface StickyState {
   sticky: boolean;
}

const UseSticky = (): StickyState => {
   const [sticky, setSticky] = useState(false);

   const stickyHeader = (): void => {
      if (window.scrollY > 80) {
         setSticky(true);
      } else {
         setSticky(false);
      }
   };

   useEffect(() => {
      stickyHeader();
      
      window.addEventListener("scroll", stickyHeader);

      return (): void => {
         window.removeEventListener("scroll", stickyHeader);
      };
   }, []);
   return {
      sticky,
   };
}

export default UseSticky
