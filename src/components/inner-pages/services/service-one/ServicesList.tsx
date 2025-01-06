import Image from "next/image";
import service_data from "@/data/inner-data/ServiceData";
import Link from "next/link";
import serviceShape_1 from "@/assets/images/shape/title_shape_07.svg";
import serviceShape_2 from "@/assets/images/shape/shape_73.svg";
import serviceShape_3 from "@/assets/images/shape/shape_74.svg";
import serviceShape_4 from "@/assets/images/shape/shape_75.svg";
import serviceShape_5 from "@/assets/images/shape/shape_76.svg";
import { underlineWordElement } from "@/utils/reactHelpers";
import useTranslation from "next-translate/useTranslation";

const ServicesList = ({ style, withPricing = false }: any) => {
  const { t, lang } = useTranslation("translations");

  const serviceItems = service_data.filter(
    (items) => items.page === "service_1"
  );

  const servicesList = serviceItems.map((item) => (
    <Link
      href={item.link}
      key={item.id}
      className="col-lg-4 col-md-6 d-flex mt-40 wow fadeInUp pop-hover"
      data-wow-delay="0.1s"
    >
      <div className="card-style-ten d-flex align-items-center flex-column w-100 h-100">
        <Image
          src={item.icon}
          width={item.iconWidth ?? 150}
          height={item.iconHeight ?? 150}
          alt=""
          className="lazy-img"
        />
        <h6>{t(item.title)}</h6>
        <p>{t(item.desc)}</p>
      </div>
    </Link>
  ));

  // Add pricing image as a grid item if withPricing is true
  if (withPricing) {
    servicesList.push(
      <div
        key="pricing-image"
        className="col-lg-4 col-md-6 d-flex mt-40 wow m-a fadeInUp"
        data-wow-delay="0.1s"
      >
        <div className="card-style-ten d-flex align-items-center justify-content-center w-100 h-100">
          <Image
            src={`/assets/img/pricing/pricing-${lang}.png`}
            width={400}
            height={400}
            alt="pricing"
            className="lazy-img"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`block-feature-seventeen ${
        style ? "dark-bg" : "bg-pink-three"
      } position-relative z-1 pt-120 xl-pt-80 pb-140 xl-pb-80`}
    >
      <div className="container">
        <div className="row">
          <div className="col-xl-8 m-auto">
            <div className="title-one text-center wow fadeInUp mb-40 lg-mb-20">
              <h3 className={`${style ? "text-white" : ""}`}>
                {underlineWordElement(t("features.our_services"), 1)}
              </h3>
              {withPricing && (
                <p className={`fs-22 color-dark ${style ? "text-white" : ""}`}>
                  {t("features.pricing_information")}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="row gx-xxl-5">{servicesList}</div>
      </div>
      {style ? (
        <>
          <Image
            src={serviceShape_4}
            alt=""
            className="lazy-img shapes shape_01"
          />
          <Image
            src={serviceShape_5}
            alt=""
            className="lazy-img shapes shape_02"
          />
        </>
      ) : (
        <>
          <Image
            src={serviceShape_2}
            alt=""
            className="lazy-img shapes shape_01"
          />
          <Image
            src={serviceShape_3}
            alt=""
            className="lazy-img shapes shape_02"
          />
        </>
      )}
    </div>
  );
};

export default ServicesList;
