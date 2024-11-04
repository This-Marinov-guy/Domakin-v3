"use client"
import feedback_data from "@/data/home-data/FeedbackData"
import Image from "next/image";
import { Rating } from 'react-simple-star-rating';
import Slider from "react-slick";

import feedbackShape_1 from "@/assets/images/shape/shape_55.svg"
import feedbackShape_2 from "@/assets/images/shape/shape_56.svg"
import useTranslation from "next-translate/useTranslation";

export const CustomPrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      className="custom-arrow custom-prev-arrow"
      onClick={onClick}
      aria-label="Previous Slide"
    >
      &#10094; {/* Unicode character for left arrow */}
    </button>
  );
};

export const CustomNextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      className="custom-arrow custom-next-arrow"
      onClick={onClick}
      aria-label="Next Slide"
    >
      &#10095; {/* Unicode character for right arrow */}
    </button>
  );
};

const setting = {
  arrows: false,
  dots: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  // prevArrow: <CustomPrevArrow />,
  // nextArrow: <CustomNextArrow />,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const Feedback = ({ style }: any) => {
   const {t} = useTranslation('translations');

   return (
     <div
       className={`center-dots bg-pink-two position-relative z-1 pt-60 xl-pt-40 pb-60 xl-pb-40 ${
         style ? "" : "mt-170 xl-mt-120"
       }`}
     >
       <div className={`container ${style ? "" : "container-large"}`}>
         <div className="title-one text-center mb-80 xl-mb-50 md-mb-30">
           <h3>{t("feedbacks.feedbacks")}</h3>
         </div>
         <Slider {...setting}>
           {feedback_data
             .filter((items) => items.page === "home_5")
             .map((item) => (
               <div
                 key={item.id}
                 className={`feedback-block-six ${style ? "rounded-4" : ""}`}
               >
                 <div className="d-flex justify-content-between align-items-center">
                   <ul className="rating style-none d-flex">
                     <li>
                       <Rating initialValue={5} size={25} readonly={true} />
                     </li>
                   </ul>
                   <Image src={item.quote_icon} alt="" className="icon" />
                 </div>
                 <blockquote>{item.desc}</blockquote>
                 <div className="d-flex align-items-center justify-content-between">
                   <h6 className="fs-20 m0">{item.title}</h6>
                 </div>
               </div>
             ))}
         </Slider>
         {!style && (
           <>
             <Image
               src={feedbackShape_1}
               alt=""
               className="lazy-img shapes shape_01"
             />
             <Image
               src={feedbackShape_2}
               alt=""
               className="lazy-img shapes shape_02"
             />
           </>
         )}
       </div>
     </div>
   );
}

export default Feedback
