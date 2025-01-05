"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";

import { underlineWordElement } from "@/utils/reactHelpers";
import useTranslation from "next-translate/useTranslation";
import AgencyDetails from "@/components/inner-pages/agency/agency-details";
import AgencyDetailsArea from "@/components/inner-pages/agency/agency-details/AgencyDetailsArea";

const AgentArea = ({ style, withDetails = false }: any) => {
  const { t } = useTranslation("translations");

  const [agentDetailsId, setAgentDetailsId] = useState<number | null>(null);

  const settings = {
    dots: true,
    arrows: false,
    centerPadding: "0px",
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div
      className={`center-dots position-relative z-1 xl-mt-120 ${
        style ? "mt-170" : "mt-150"
      }`}
    >
      <div className={`container ${style ? "container-large" : ""}`}>
        <div className="position-relative">
          <div className="title-one mb-85 lg-mb-50 wow fadeInLeft">
            <h3>{underlineWordElement(t("team.property_agents"), 0)}</h3>
          </div>

          <div className="wrapper position-relative z-1 row">
            {Array.from({ length: 5 }, (v, i) => i).map((item, index) => (
              <div
                key={index}
                style={{ height: "20em", width: "10em" }}
                className="col-lg-4 col-md-6 col-12 m-a mb-20"
              >
                <div className="agent-card-one position-relative">
                  <div className="img border-20">
                    <Image
                      src={`/assets/img/team/${item + 1}.jpg`}
                      height={1000}
                      width={1000}
                      alt=""
                      style={{height: '12em', objectFit: 'cover'}}
                      className="tran5s"
                    />
                  </div>
                  <div className="text-center">
                    <h6>{t(`team.members.${item}.name`)}</h6>
                    {withDetails && (
                      <button
                        id={`${item}`}
                        onClick={(e: any) => {
                          const id = +e.target.id;
                          if (id === agentDetailsId) {
                            setAgentDetailsId(null);
                          } else {
                            setAgentDetailsId(+id);
                          }
                        }}
                        className={` ${
                          style ? "btn-eight" : "btn-eight fw-normal"
                        }`}
                      >
                        {t("renting.select")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!withDetails && (
            <div className="section-btn text-center md-mt-60">
              <Link
                href="/agents"
                className={` ${style ? "btn-eight" : "btn-one fw-normal"}`}
              >
                Meet Entire Team
              </Link>
            </div>
          )}
        </div>

        <AgencyDetailsArea style={false} id={agentDetailsId} />
      </div>
    </div>
  );
};

export default AgentArea;
