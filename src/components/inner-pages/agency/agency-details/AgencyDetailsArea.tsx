"use client";
import Image from "next/image";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useRef } from "react";
import { TEAM_SOCIALS } from "@/utils/defines";

const icon = ["instagram", "linkedin"];

const AgencyDetailsArea = ({ style, id }: any) => {
  const { t } = useTranslation("translations");

  const panelRef = useRef<any>(null);

  useEffect(() => {
    if (id && panelRef?.current) {
      panelRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [id]);

  if (id === undefined || id === null) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className="agency-details theme-details-one mt-40 xl-mt-40 pb-40 xl-pb-40"
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div
              className={`info-pack-one mb-80 xl-mb-50 ${style ? "" : "p-20"}`}
            >
              <div className="row">
                <div className="col-xl-6 d-flex">
                  <div
                    className={`z-1 w-100 me-xl-4 position-relative ${
                      style
                        ? "media agent-details-thumb"
                        : " p-20 d-flex align-items-center justify-content-center bg-white"
                    }`}
                  >
                    {style ? (
                      ""
                    ) : (
                      <Image
                        src={`/assets/img/team/${id + 1}.webp`}
                        height={400}
                        width={400}
                        alt=""
                        className="lazy-img"
                      />
                    )}
                  </div>
                </div>

                <div className="col-xl-6">
                  <div className="ps-xxl-3 pe-xxl-3 pt-40 lg-pt-30 pb-45 lg-pb-10">
                    <h4>{t(`team.members.${id}.name`)}</h4>
                    <div className="designation fs-16"></div>
                    <div className="table-responsive">
                      <p className="fs-20 lh-lg pb-15">
                        {t(`team.members.${id}.position`)}
                      </p>
                      <p className="fs-20 lh-lg">
                        {t(`team.members.${id}.about_extra`)}
                      </p>
                    </div>
                    <ul className="style-none d-flex align-items-center social-icon">
                      {Object.entries(TEAM_SOCIALS[id]).map(
                        ([icon, href], i) => (
                          <li key={i}>
                            <a href={href} target="_blank">
                              <i className={`fa-brands fa-${icon}`}></i>
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyDetailsArea;
