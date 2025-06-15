import React from 'react'
import Link from "next/link";
import Image from "next/image";
import { STATUS_COLORS } from '@/utils/defines';

const PropertyCardGrid = (props: {property: PropertyCard, style?: boolean}) => {
  const {property, style} = props;
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
            <div id={`carousel${property.id}`} className="carousel slide">
              <div className="carousel-indicators">
                <button
                  type="button"
                  data-bs-target={`#carousel${property.id}`}
                  data-bs-slide-to="0"
                  className="active"
                  aria-current="true"
                  aria-label="Slide 1"
                ></button>
                <button
                  type="button"
                  data-bs-target={`#carousel${property.id}`}
                  data-bs-slide-to="1"
                  aria-label="Slide 2"
                ></button>
                <button
                  type="button"
                  data-bs-target={`#carousel${property.id}`}
                  data-bs-slide-to="2"
                  aria-label="Slide 3"
                ></button>
              </div>
              <div className="carousel-inner">
                {property.images.slice(0, 3).map((image: any, i: any) => (
                  <div
                    key={i}
                    className={`carousel-item ${i === 0 && "active"}`}
                    data-bs-interval="1000000"
                  >
                    <a
                      target="_blank"
                      href={`/services/renting/property/${property.id}`}
                      className="d-block"
                    >
                      <Image
                        src={
                          Number(property.id) > 1000
                            ? image
                            : `/assets/img/properties/${
                                property.folder ?? "property_" + property.id
                              }/${image}`
                        }
                        height={500}
                        width={500}
                        style={{ height: "20em", objectFit: "cover" }}
                        alt="Preview"
                      />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="property-info p-25">
          <a
            target="_blank"
            href={`/services/renting/property/${property.id}`}
            className="title tran3s"
          >
            {property.title}
          </a>
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
            <a
              target="_blank"
              href={`/services/renting/property/${property.id}`}
              className="btn-four rounded-circle"
            >
              <i className="bi bi-arrow-up-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyCardGrid