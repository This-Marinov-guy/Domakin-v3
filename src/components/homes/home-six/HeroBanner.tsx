import Image from "next/image";
import titleShape from "@/assets/images/shape/shape_58.svg";
import bannerimg from "@/assets/images/assets/screen_06.png";
import Link from "next/link";
import DropdownSix from "@/components/search-dropdown/home-dropdown/DropdownSix";
import useTranslation from "next-translate/useTranslation";

const HeroBanner = () => {
  const { t, lang } = useTranslation("translations");

  return (
    <div className="hero-banner-six z-2 pt-120">
      <div className="container">
        <div className="position-relative">
          <div className="row landing">
            <Image
              className="col-lg-3 col-md-3 col-12 position-relative wow fadeInLeft"
              src={`/assets/img/landing/1-${lang}.png`}
              height={1000}
              width={1000}
              alt="Landing One"
            />
            <div className="col-xl-6 col-lg-4 col-md-12 col-12">
              <div className="pt-35 wow fadeInRight">
                <h5
                  className="color-dark hero-heading mb-40"
                  style={{ color: "#004aad" }}
                >
                  {t("home.company_for_accommodation_searching")}
                </h5>
                {/* <p className="color-dark sub-heading mb-40 lg-mb-20">
                  <i
                    className="fa-solid fa-house"
                    style={{ color: "#004aad" }}
                  ></i>{" "}
                  {t("home.find_your_place_to_live")}
                </p> */}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div style={{ height: "30em" }} />
            </div>
          </div>
          {/* <div className="row">
            <div className="col-12">
              <DropdownSix />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
