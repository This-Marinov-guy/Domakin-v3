import React from "react";
import Link from "next/link";
import Fancybox from "@/components/common/Fancybox";
import Image from "next/image";
import { STATUS_COLORS } from "@/utils/defines";

const PropertyCardList = (props: {
  property: PropertyCard;
  style?: boolean;
}) => {
  const { property, style } = props;
    
  return (
    <div
      key={property.id}
      className="listing-card-seven border-20 p-20 mb-50 wow fadeInUp"
    >
      <div className="d-flex flex-wrap layout-one">
        <div
          style={{
            backgroundImage: `url(/assets/img/properties/${
              property.folder ?? "property_" + property.id
            }/${property.main_image})`,
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
            {property.images.length} <i className="fa-regular fa-image"></i>
            <Fancybox
              options={{
                Carousel: {
                  infinite: true,
                },
              }}
            >
              {property.images.slice(0, 3).map((thumb: any, index: any) => (
                <a
                  key={index}
                  className="d-block"
                  data-fancybox="gallery2"
                  href={`/assets/img/properties/${
                    property.folder ?? "property_" + property.id
                  }/${thumb}`}
                ></a>
              ))}
            </Fancybox>
          </div>
        </div>
        <div className="property-info">
          <Link
            href={`/services/renting/property/${property.id}`}
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
            <Link
              href={`/services/renting/property/${property.id}`}
              className="btn-four rounded-circle"
            >
              <i className="bi bi-arrow-up-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardList;
