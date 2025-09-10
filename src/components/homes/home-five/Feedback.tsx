"use client";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import Slider from "react-slick";

import feedbackShape_1 from "@/assets/images/shape/shape_55.svg";
import feedbackShape_2 from "@/assets/images/shape/shape_56.svg";
import useTranslation from "next-translate/useTranslation";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/storeContext";

import quoteIcon from "@/assets/images/icon/icon_29.svg";
import ListingLoadingOne from "@/components/ui/loading/ListingLoadingOne";
import moment from "moment";

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
  arrows: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: false,
  // autoplaySpeed: 3000,
  prevArrow: <CustomPrevArrow />,
  nextArrow: <CustomNextArrow />,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      arrows: false,
      breakpoint: 575,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const Feedback = ({ style }: any) => {
  const { t } = useTranslation("translations");

  const {
    commonStore: { feedbackLoading, feedbacks },
  } = useStore();

  // Only show loading if we're actually loading AND don't have any data
  // This ensures SSR data displays immediately without a loading state
  if (feedbackLoading && (!feedbacks || feedbacks.length === 0))
    return <ListingLoadingOne title={t("feedbacks.feedbacks")} />;

  return (
    <div
      className={`center-dots bg-pink-two position-relative z-1 mt-20 pt-40 pb-40 ${
        style ? "" : "mt-170 xl-mt-120"
      }`}
    >
      <div className={`container ${style ? "" : "container-large"}`}>
        <div className="title-one text-center mb-60 xl-mb-50 md-mb-30">
          <h3>{t("feedbacks.feedbacks")}</h3>
        </div>
        {feedbacks?.length > 0 ? (
          <Slider {...setting}>
            {feedbacks.map((item: any) => (
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
                  <Image src={quoteIcon} alt="" className="icon" />
                </div>
                <p className="feedback-content">
                 {item.content}
                </p>
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="fs-20 m0">{item.name}</h6>
                  {item?.created_at && (
                    <small className="text-muted">
                      {moment(item.created_at).format("DD MMM YYYY")}
                    </small>
                  )}
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <h6 className="text-center d-flex flex-column">
            {t("feedbacks.no_feedbacks")}
          </h6>
        )}
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
};

export default observer(Feedback);
