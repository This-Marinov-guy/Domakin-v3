import Image from "next/image";
import Link from "next/link";

import titleShape from "@/assets/images/shape/title_shape_06.svg";
import Count from "@/components/common/Count";
import useTranslation from "next-translate/useTranslation";

const BLockFeatureOne = () => {
  const { t } = useTranslation("translations");

  const feature_content = {
    sub_title: t("about.about_us"),
    desc_1: t("about.helping_you_find_a_place"),
    desc_2: t("about.at_the_end_of_2022"),
    desc_3: (
      <a
        style={{ color: "#ff914d" }}
        href="https://bulgariansociety.nl"
        target="_blank"
      >
        Bulgarian Society Netherlands (BGSNL){" "}
      </a>
    ),
    desc_4: t("about.with_the_aim_to_help"),
    desc_5: t("about.it_is_hard_for"),
  };

  const { sub_title, desc_1, desc_2, desc_3, desc_4, desc_5 } = feature_content;

  return (
    <div className="block-feature-two mt-150 xl-mt-100">
      <div className="container">
        <div className="row gx-xl-5">
          <div className="col-lg-6 wow fadeInLeft">
            <div className="me-xxl-4">
              <div className="title-one lg-mb-40">
                <div className="upper-title">{sub_title}</div>
                <h4>{desc_1}</h4>
              </div>
              <img src={"/assets/img/gallery/map.png"} alt="About Us" />
            </div>
          </div>

          <div className="col-lg-6 wow fadeInRight">
            <div className="block-two md-mt-40">
              <div className="bg-wrapper">
                <p>
                  {desc_2} {desc_3} {desc_4}
                </p>
                <p className="mt-20">{desc_5}</p>
                <ul style={{padding: '0'}} className="no-dots">
                  <li className="d-flex align-items-center gap-3">
                    <i className="icon-blue fa-solid fa-users-viewfinder" />
                    {t("about.if_you_are_located")}
                  </li>
                  <br />
                  <li className="d-flex align-items-center gap-3">
                    <i className="icon-blue fa-solid fa-magnifying-glass-location" />
                    {t("about.if_you_want")}
                  </li>
                  <br />
                  <li className="d-flex align-items-center gap-3">
                    <i className="icon-blue fa-solid fa-people-arrows" />
                    {t("about.if_you_are_searching")}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BLockFeatureOne;
