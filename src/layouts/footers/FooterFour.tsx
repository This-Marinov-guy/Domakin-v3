import Image from "next/image"

import footerLogo from "@/assets/img/logo.png"
import footerShape from "@/assets/images/assets/ils_06.svg"
import Link from "next/link"
import footer_data from "@/data/home-data/FooterData"
import { EMAIL, FACEBOOK, INSTAGRAM, KVK, LINKEDIN } from "@/utils/defines"
import useTranslation from "next-translate/useTranslation"

const FooterFour = () => {
   const {t} = useTranslation('translations');

   return (
     <div className="footer-four position-relative z-1">
       <div className="container container-large">
         <div className="bg-wrapper position-relative z-1">
           <div className="row">
             <div className="col-xxl-3 col-lg-4 mb-60">
               <div className="footer-intro">
                 <div className="logo mb-20">
                   <Link href="/">
                     <Image className="logo" src={footerLogo} alt="" />
                   </Link>
                 </div>
                 {/* <p className="mb-30 xs-mb-20">11910 Clyde Rapid Suite 210, Willyand, Virginia, United States</p> */}
                 <a
                   href={`mailto:${EMAIL}`}
                   target="_blank"
                   className="email tran3s mb-60 md-mb-30"
                 >
                   {EMAIL}
                 </a>
                 <ul className="style-none d-flex align-items-center social-icon">
                   <li>
                     <a href={FACEBOOK} target="_blank">
                       <i className="fa-brands fa-facebook-f"></i>
                     </a>
                   </li>
                   <li>
                     <a href={INSTAGRAM} target="_blank">
                       <i className="fa-brands fa-instagram"></i>
                     </a>
                   </li>
                   <li>
                     <a href={LINKEDIN} target="_blank">
                       <i className="fa-brands fa-linkedin"></i>
                     </a>
                   </li>
                 </ul>
               </div>
             </div>

             {footer_data
               .filter((items) => items.page === "home_4")
               .map((item) => (
                 <div
                   key={item.id}
                   className={`col-lg-2 col-md-4 col-6 mb-30 ${item.widget_class}`}
                 >
                   <div className={`footer-nav ${item.widget_class2}`}>
                     <h5 className="footer-title">{t(item.widget_title)}</h5>
                     <ul className="footer-nav-link style-none">
                       {item.footer_link.map((li, i) => (
                         <li key={i}>
                           <Link href={li.link}>{t(li.link_title)}</Link>
                         </li>
                       ))}
                     </ul>
                   </div>
                 </div>
               ))}
           </div>
         </div>
         <div className="bottom-footer">
           <p className="m0 text-center fs-16">KVK: {KVK}</p>
           <p className="m0 text-center fs-16">
             {t("footer.all_rights_reserved")} 2022
           </p>
         </div>
       </div>
       <Image src={footerShape} alt="" className="lazy-img shapes shape_01" />
     </div>
   );
}

export default FooterFour
