"use client";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import CareersForm from "@/components/forms/CareersForm";
import { useRef } from "react";
import useOnScreen from "@/hooks/useOnScreen";

const CareersArea = () => {
  const { t } = useTranslation("translations");
  const formRef = useRef<HTMLDivElement>(null);
  const isFormVisible = useOnScreen(formRef);

  const benefits = [
    {
      icon: "fa-solid fa-clock",
      title: t("careers.flexible_working_time"),
      description: t("careers.flexible_working_time_desc"),
    },
    {
      icon: "fa-solid fa-euro-sign",
      title: t("careers.commission_based"),
      description: t("careers.commission_based_desc"),
    },
    {
      icon: "fa-solid fa-map-location-dot",
      title: t("careers.all_around_netherlands"),
      description: t("careers.all_around_netherlands_desc"),
    },
    {
      icon: "fa-solid fa-chart-line",
      title: t("careers.growth_opportunities"),
      description: t("careers.growth_opportunities_desc"),
    },
  ];

  const positions = [
    {
      title: t("careers.viewing_agent_title"),
      description: t("careers.viewing_agent_description"),
      commission: t("careers.commission_per_viewing"),
    },
    {
      title: t("careers.property_seeker_title"),
      description: t("careers.property_seeker_description"),
      commission: t("careers.commission_per_room"),
    },
  ];

  return (
    <div className="careers-page mt-40">
      {/* Hero Section */}
      <div className="careers-hero mb-10 xl-mb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 m-auto text-center">
              <div className="title-one mb-40">
                <div className="upper-title">{t("careers.join_our_team")}</div>
                <h2>{t("careers.hero_title")}</h2>
                <p className="fs-20 mt-20">{t("careers.hero_description")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Positions Section */}
      <div className="careers-positions mb-100 xl-mb-100">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-20">
              <div className="title-one">
                <h3>{t("careers.we_are_looking_for")}</h3>
                {/* <p className="fs-18 mt-20">{t("careers.positions_intro")}</p> */}
              </div>
            </div>
          </div>
          <div className="row gx-xxl-5">
            {positions.map((position, index) => (
              <div key={index} className="col-lg-6 mb-40">
                <div className={`card-style-four h-100`}>
                  <div className={`bg-wrapper text-center bubble-border-alt`}>
                    <div className="icon-no-border d-flex align-items-center justify-content-center mb-30"></div>
                    <h4 className="mb-20">{position.title}</h4>
                    <p className="mb-20">{position.description}</p>
                    <div className="commission-badge">
                      <span className="badge bg-primary text-white p-2 rounded">
                        {position.commission}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="careers-benefits mb-150 xl-mb-100 bg-pink pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-40">
              <div className="title-one">
                <h3>{t("careers.why_join_us")}</h3>
                <p className="fs-18 mt-20">{t("careers.benefits_intro")}</p>
              </div>
            </div>
          </div>
          <div className="row gx-xxl-5">
            {benefits.map((benefit, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-30">
                <div className="feature-card-one text-center h-100">
                  <div className="icon d-flex align-items-center justify-content-center mb-25">
                    <i
                      className={benefit.icon}
                      style={{
                        fontSize: "2.5rem",
                        color: "var(--primary-color)",
                      }}
                    />
                  </div>
                  <h5 className="mb-15">{benefit.title}</h5>
                  <p>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="careers-image-section mb-100 xl-mb-100">
        <div className="container">
          <div className="row gx-xxl-5 align-items-center">
            <div className="col-lg-6 mb-40 lg-mb-30">
              <div className="image-wrapper position-relative">
                <Image
                  src="/assets/images/media/img_43.jpg"
                  alt={t("careers.team_work")}
                  width={600}
                  height={400}
                  className="lazy-img w-100 rounded"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="title-one mb-30">
                <div className="upper-title">{t("careers.work_with_us")}</div>
                <h3>{t("careers.make_difference")}</h3>
              </div>
              {/* <p className="fs-18 mb-20">{t("careers.work_description_1")}</p>
              <p className="fs-18 mb-20">{t("careers.work_description_2")}</p>
              <ul className="style-none list-style-two">
                <li>
                  <i className="fa-solid fa-check"></i>{" "}
                  {t("careers.work_benefit_1")}
                </li>
                <li>
                  <i className="fa-solid fa-check"></i>{" "}
                  {t("careers.work_benefit_2")}
                </li>
                <li>
                  <i className="fa-solid fa-check"></i>{" "}
                  {t("careers.work_benefit_3")}
                </li>
              </ul> */}
            </div>
          </div>
        </div>
      </div>

      {/* Application Form Section */}
      <div ref={formRef} className="careers-form-section mb-150 xl-mb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 m-auto">
              <div className="form-style-one">
                <CareersForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Apply Now Button */}
      {!isFormVisible && (
        <button
          onClick={() => {
            formRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
          className="btn-nine floating-apply-btn"
          style={{
            position: "fixed",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999,
            padding: "15px",
            fontSize: "18px",
            fontWeight: "500",
            borderRadius: "50px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            animation: "fadeInUp 0.3s ease-in-out",
            transition: "all 0.3s ease-in-out",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateX(-50%) scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 25px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateX(-50%) scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)";
          }}
        >
          {t("careers.apply_now")}
        </button>
      )}
    </div>
  );
};

export default CareersArea;
