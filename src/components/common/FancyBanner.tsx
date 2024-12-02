"use client"
import Image from "next/image"
import Link from "next/link"
import titleShape from "@/assets/images/shape/title_shape_06.svg"
import useTranslation from "next-translate/useTranslation"
import { underlineWordElement } from "@/utils/reactHelpers"

const FancyBanner = ({ style }: any) => {
   const {t} = useTranslation('translations');

   return (
     <div className="fancy-banner-two position-relative z-1 pt-90 lg-pt-50 pb-90 lg-pb-50">
       <div className="container">
         <div className="row align-items-center">
           <div className="col-lg-6">
             <div className="title-one text-center text-lg-start md-mb-40 pe-xl-5">
               <h4 className="text-white m0">
                 {underlineWordElement(t("subscribe_email.description"), 3)}
               </h4>
             </div>
           </div>
           <div className="col-lg-6">
             <div className="form-wrapper me-auto ms-auto me-lg-0">
               <form onSubmit={(e) => e.preventDefault()}>
                 <input
                   type="email"
                   placeholder={t("subscribe_email.email")}
                   className={style ? "rounded-0" : ""}
                 />
                 <button className={style ? "rounded-0" : ""}>
                   {t("subscribe_email.send")}
                 </button>
               </form>
               {/* <div className="fs-16 mt-10 text-white">Already a Agent? <Link href="#" data-bs-toggle="modal" data-bs-target="#loginModal">Sign in.</Link></div> */}
             </div>
           </div>
         </div>
       </div>
     </div>
   );
}

export default FancyBanner
