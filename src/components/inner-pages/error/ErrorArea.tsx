import Image from "next/image"
import Link from "next/link"

import errorImg from "@/assets/images/assets/ils_08.svg"
import useTranslation from "next-translate/useTranslation"
import { underlineWordElement } from "@/utils/reactHelpers"

const ErrorArea = () => {
   const {t} = useTranslation('translations');

   return (
     <div className="error-section position-relative z-1 bg-pink">
       <div className="container">
         <div className="row">
           <div className="col-xxl-8 col-xl-6 col-lg-7 col-md-8 m-auto">
             <div className="title-one text-center mb-75 lg-mb-20 wow fadeInUp">
               <h3>{underlineWordElement(t("error.page_not_found"), 0)}</h3>
               <p className="fs-20 pb-45">{t("error.page_not_exists")}</p>
               <Link href="/" className="btn-five sm fw-normal text-uppercase">
                 {t("error.back_to_home")}
               </Link>
             </div>
           </div>
         </div>
       </div>
       <Image
         src={errorImg}
         alt=""
         className="lazy-img w-100 position-absolute bottom-0 start-0 z-n1"
       />
     </div>
   );
}

export default ErrorArea
