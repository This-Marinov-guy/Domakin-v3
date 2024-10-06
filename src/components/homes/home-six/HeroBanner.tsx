import Image from "next/image";
import titleShape from "@/assets/images/shape/shape_58.svg";
import bannerimg from "@/assets/images/assets/screen_06.png";
import Link from "next/link";
import DropdownSix from "@/components/search-dropdown/home-dropdown/DropdownSix";
import useTranslation from "next-translate/useTranslation";

const HeroBanner = () => {
  const { t, lang } = useTranslation("translations");

  return (
    <div className="hero-banner-six z-2 pt-140 lg-pt-150">
      <div className="container container-large">
        <div className="position-relative">
          <div className="row landing">
            <div className="col-lg-6 col-12">
              <div className="position-relative pe-xxl-5 wow fadeInLeft">
                <img src={`/assets/img/landing/1-${lang}.png`} alt="Landing One" />
              </div>
            </div>
            <div className="col-lg-6 col-12">
              <div className="ps-xxl-5 pt-35 wow fadeInRight">
                <h1
                  className="color-dark hero-heading mb-40 lg-mb-20"
                  style={{ color: "#004aad" }}
                >
                  {t("home.company_for_accommodation_searching")}
                </h1>
                <p className="color-dark sub-heading mb-40 lg-mb-20">
                  <i
                    className="fa-solid fa-house"
                    style={{ color: "#004aad" }}
                  ></i>{" "}
                  {t("home.find_your_place_to_live")} {t("home.with_our_help")}
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <DropdownSix />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
