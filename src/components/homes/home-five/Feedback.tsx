"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import Slider from "react-slick";

import feedbackShape_1 from "@/assets/images/shape/shape_55.svg";
import feedbackShape_2 from "@/assets/images/shape/shape_56.svg";
import useTranslation from "next-translate/useTranslation";

import quoteIcon from "@/assets/images/icon/icon_29.svg";
import moment from "moment";

const arrowDownIcon = "/assets/img/icons/arrow-down.svg";

/** Max characters shown when collapsed. Expand and "..." only if content exceeds this. */
const FEEDBACK_COLLAPSED_CHAR_LIMIT = 120;
/** Fixed height for the quote text area when collapsed — keeps all cards same height and leaves room for name + arrow. */
const FEEDBACK_QUOTE_COLLAPSED_HEIGHT = 120;
const FEEDBACK_QUOTE_EXPANDED_MAX_HEIGHT = 2000;

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

interface FeedbackProps {
  style?: boolean;
  feedbacks?: any[];
  bg?: string;
}

const Feedback = ({ style, feedbacks = [], bg = 'bg-pink-two' }: FeedbackProps) => {
  const { t } = useTranslation("translations");
  const [expandedIds, setExpandedIds] = useState<Set<number | string>>(new Set());

  const toggleExpanded = (id: number | string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      className={`center-dots ${bg} position-relative z-1 mt-20 pt-40 pb-40 ${
        style ? "" : "mt-170 xl-mt-120"
      }`}
      style={{ minHeight: feedbacks?.length > 0 ? '400px' : '200px' }}
    >
      <div className={`container ${style ? "" : "container-large"}`}>
        <div className="title-one text-center mb-60 xl-mb-50 md-mb-30">
          <h3>{t("feedbacks.feedbacks")}</h3>
        </div>
        {feedbacks?.length > 0 ? (
          <Slider {...setting}>
            {feedbacks.map((item: any, index: number) => {
              const id = item.id ?? index;
              const isExpanded = expandedIds.has(id);
              const content = String(item.content ?? "").trim();
              const hasMore = content.length > FEEDBACK_COLLAPSED_CHAR_LIMIT;
              const displayText =
                hasMore && !isExpanded
                  ? content.slice(0, FEEDBACK_COLLAPSED_CHAR_LIMIT).trim() + "..."
                  : content;

              return (
                <div
                  key={item.id ?? index}
                  className={`feedback-block-six d-flex flex-column ${style ? "rounded-4" : ""}`}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <ul className="rating style-none d-flex">
                      <li>
                        <Rating initialValue={5} size={25} readonly={true} />
                      </li>
                    </ul>
                    <Image src={quoteIcon} alt="" className="icon" />
                  </div>
                  <div
                    className="feedback-quote-wrapper feedback-content-wrapper"
                    style={{
                      height: !hasMore || !isExpanded ? FEEDBACK_QUOTE_COLLAPSED_HEIGHT : undefined,
                      maxHeight: hasMore && isExpanded ? FEEDBACK_QUOTE_EXPANDED_MAX_HEIGHT : FEEDBACK_QUOTE_COLLAPSED_HEIGHT,
                      overflow: hasMore && !isExpanded ? "hidden" : hasMore && isExpanded ? "auto" : "hidden",
                      transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <p className="feedback-content mb-0">
                      {displayText}
                    </p>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-3 feedback-name-row">
                    <h6 className="fs-20 m0">{item.name}</h6>
                    {item?.created_at && (
                      <small className="text-muted">
                        {moment(item.created_at).format("DD MMM YYYY")}
                      </small>
                    )}
                  </div>
                  <div className="d-flex justify-content-center mt-auto pt-2 min-h-expand-row">
                    {hasMore && (
                      <button
                        type="button"
                        className="feedback-expand-btn d-flex align-items-center justify-content-center border-0 rounded-circle bg-transparent p-2"
                        onClick={() => toggleExpanded(id)}
                        title={isExpanded ? t("feedbacks.shrink") : t("feedbacks.expand")}
                        aria-label={isExpanded ? t("feedbacks.shrink") : t("feedbacks.expand")}
                        style={{
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <Image
                          src={arrowDownIcon}
                          alt=""
                          width={24}
                          height={24}
                          className="d-block"
                        />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
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

export default Feedback;
