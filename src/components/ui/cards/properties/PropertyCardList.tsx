import React from "react";
import Link from "next/link";
import Fancybox from "@/components/common/Fancybox";
import Image from "next/image";
import { STATUS_COLORS } from "@/utils/defines";
import { getPropertyUrl } from "@/utils/seoHelpers";

const PropertyCardList = (props: {
  property: PropertyCard;
  style?: boolean;
}) => {
  const { property, style } = props;

  const allImages = [property.main_image, ...property.images];
  const propertyUrl = getPropertyUrl(property);

  return (
    <div
      key={property.id}
      className="listing-card-seven border-20 p-20 mb-50 wow fadeInUp"
    >
      <div className="d-flex flex-wrap layout-one">
        <Link
          href={propertyUrl}
          style={{
            backgroundImage:
              Number(property.id) > 1000
                ? `url(${property.main_image})`
                : `url(/assets/img/properties/${
                    property.folder ?? "property_" + property.id
                  }/${property.main_image})`,
            aspectRatio: '4 / 3',
            minHeight: '250px',
            minWidth: '300px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          className={`img-gallery position-relative z-1 border-20 overflow-hidden`}
        >
          <div
            className={`tag border-20 ${
              // @ts-expect-error
              STATUS_COLORS[property.statusCode]
            }`}
          >
            {property.status}
          </div>
          <div className="img-slider-btn">
            {allImages.length} <i className="fa-regular fa-image"></i>
            <Fancybox
              options={{
                Carousel: {
                  infinite: true,
                },
              }}
            >
              {allImages.map((thumb: any, index: any) => (
                <a
                  key={index}
                  className="d-block"
                  data-fancybox="gallery2"
                  href={
                    Number(property.id) > 1000
                      ? thumb
                      : `/assets/img/properties/${
                          property.folder ?? "property_" + property.id
                        }/${thumb}`
                  }
                ></a>
              ))}
            </Fancybox>
          </div>
        </Link>
        <div className="property-info">
          <Link
            href={propertyUrl}
            className="title tran3s mb-15"
          >
            {property.title}
          </Link>
          <div className="address">{property.location}</div>

          <div className="pl-footer d-flex flex-wrap align-items-center justify-content-between">
            <strong className="price fw-500 color-dark me-auto">
              {property.price} <sub>euro / m</sub>
            </strong>
            {/* <ul className="style-none d-flex action-icons on-top">
                    <li>
                      <Link href="#">
                        <i className="fa-light fa-heart"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <i className="fa-light fa-bookmark"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <i className="fa-light fa-circle-plus"></i>
                      </Link>
                    </li>
                  </ul> */}
            <a
              target="_blank"
              href={propertyUrl}
              className="btn-four rounded-circle"
            >
              <i className="bi bi-arrow-up-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardList;
