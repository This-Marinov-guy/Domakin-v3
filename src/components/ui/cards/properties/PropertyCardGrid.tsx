import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { STATUS_COLORS } from "@/utils/defines";
import { getPropertyUrl } from "@/utils/seoHelpers";

declare global {
  interface Window {
    bootstrap?: { Carousel: { getOrCreateInstance: (el: HTMLElement, opts?: { touch?: boolean }) => unknown } };
  }
}

const PropertyCardGrid = (props: {
  property: PropertyCard;
  style?: boolean;
  disableLinks?: boolean;
}) => {
  const { property, style, disableLinks } = props;
  const { lang } = useTranslation("translations");
  const carouselRef = useRef<HTMLDivElement>(null);

  const allImages = [property.main_image, ...(property.images ?? [])].filter(Boolean);
  const slides = allImages.length > 0 ? allImages : [property.main_image];
  const propertyUrl = getPropertyUrl(property, true, lang);

  useEffect(() => {
    if (typeof window === "undefined" || slides.length <= 1 || !carouselRef.current) return;
    const bootstrap = window.bootstrap;
    if (bootstrap?.Carousel) {
      bootstrap.Carousel.getOrCreateInstance(carouselRef.current, { touch: true });
    }
  }, [slides.length]);

  return (
    <div
      key={property.id}
      className="col-lg-4 col-md-6 d-flex mb-50 wow fadeInUp"
      //   data-wow-delay={item.data_delay_time}
    >
      <div
        className={`listing-card-one border-25 h-100 w-100 ${
          style ? "border-layout" : ""
        }`}
      >
        <div className="img-gallery p-15">
          <div className="position-relative border-25 overflow-hidden">
            <div
              className={`tag border-25 ${
                // @ts-expect-error
                STATUS_COLORS[property.statusCode]
              }`}
            >
              {property.status}
            </div>
            {/* <Link href="#" className="fav-btn tran3s"><i className="fa-light fa-heart"></i></Link> */}
            <div
              ref={carouselRef}
              id={`carousel${property.id}`}
              className="carousel slide"
              data-bs-ride="carousel"
              data-bs-touch="true"
            >
              {slides.length > 1 && (
                <>
                  <div className="carousel-indicators">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        data-bs-target={`#carousel${property.id}`}
                        data-bs-slide-to={i}
                        className={i === 0 ? "active" : ""}
                        aria-current={i === 0 ? "true" : undefined}
                        aria-label={`Slide ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target={`#carousel${property.id}`}
                    data-bs-slide="prev"
                    aria-label="Previous"
                  >
                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target={`#carousel${property.id}`}
                    data-bs-slide="next"
                    aria-label="Next"
                  >
                    <span className="carousel-control-next-icon" aria-hidden="true" />
                  </button>
                </>
              )}
              <div className="carousel-inner">
                {slides.map((image: any, i: number) => (
                  <div
                    key={i}
                    className={`carousel-item ${i === 0 && "active"}`}
                    data-bs-interval="1000000"
                  >
                    {(() => {
                      const imgSrc =
                        Number(property.id) > 1000
                          ? image
                          : `/assets/img/properties/${
                              property.folder ?? "property_" + property.id
                            }/${image}`;
                      const isBlob = typeof imgSrc === "string" && imgSrc.startsWith("blob:");
                      return disableLinks ? (
                        <div className="d-block">
                          <Image
                            src={imgSrc}
                            height={500}
                            width={500}
                            style={{ height: "20em", objectFit: "cover" }}
                            alt="Preview"
                            unoptimized={isBlob}
                          />
                        </div>
                      ) : (
                        <a
                          target="_blank"
                          href={propertyUrl}
                          className="d-block"
                        >
                          <Image
                            src={imgSrc}
                            height={500}
                            width={500}
                            style={{ height: "20em", objectFit: "cover" }}
                            alt="Preview"
                            unoptimized={isBlob}
                          />
                        </a>
                      );
                    })()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="property-info p-25">
          {disableLinks ? (
            <span className="title tran3s d-block">{property.title}</span>
          ) : (
            <a
              target="_blank"
              href={propertyUrl}
              className="title tran3s"
            >
              {property.title}
            </a>
          )}
          <div className="address">{property.location}</div>
          {/* <ul className="style-none feature d-flex flex-wrap align-items-center justify-content-between">
                              <li className="d-flex align-items-center">
                                 <Image src={featureIcon_1} alt=""
                                    className="lazy-img icon me-2" />
                                 <span className="fs-16">{item.property_info.sqft} sqft</span>
                              </li>
                              <li className="d-flex align-items-center">
                                 <Image src={featureIcon_2} alt=""
                                    className="lazy-img icon me-2" />
                                 <span className="fs-16">{item.property_info.bed} bed</span>
                              </li>
                              <li className="d-flex align-items-center">
                                 <Image src={featureIcon_3} alt=""
                                    className="lazy-img icon me-2" />
                                 <span className="fs-16">{item.property_info.bath} bath</span>
                              </li>
                           </ul> */}
          <div className="pl-footer top-border d-flex align-items-center justify-content-between">
            <strong className="price fw-500 color-dark">
              {property.price} <sub>euro / m</sub>
            </strong>
            {disableLinks ? (
              <span className="btn-four rounded-circle opacity-50">
                <i className="bi bi-arrow-up-right"></i>
              </span>
            ) : (
              <a
                target="_blank"
                href={propertyUrl}
                className="btn-four rounded-circle"
              >
                <i className="bi bi-arrow-up-right"></i>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardGrid;
