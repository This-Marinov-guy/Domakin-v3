"use client";
import Image from "next/image";
import Link from "next/link";
import AgencyNavTabs from "./AgencyNavTabs";
import NiceSelect from "@/ui/NiceSelect";
import Review from "./Review";
import ReviewForm from "./ReviewForm";
import AgencyDetailsSidebar from "./AgencyDetailsSidebar";

import agencyDetailsLogo from "@/assets/images/logo/p_logo_22.png";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useRef } from "react";

interface ContentType {
  title_1: string;
  title_2: string;
  desc_1: string;
  desc_2: JSX.Element;
  desc_3: JSX.Element;
  desc_4: string;
  table_data: {
    table_td_1: string;
    table_td_2: string;
  }[];
  table_data_2: {
    table_td_1: string;
    table_td_2: string;
  }[];
  icon: string[];
}

const agency_details_content: ContentType = {
  title_1: "Rainbow Housing",
  title_2: "Mathews Firlo.",
  desc_1: "8210 Preston Rd. Inglewood",
  desc_4: "Sales & Broker",
  table_data: [
    { table_td_1: "Location", table_td_2: "Maine, USA" },
    { table_td_1: "Phone:", table_td_2: "+21 456 987 330" },
    { table_td_1: "Email", table_td_2: "rainbowhousing@demo.com" },
    { table_td_1: "Website:", table_td_2: "www.rainbowinc.com" },
  ],
  table_data_2: [
    { table_td_1: "Location", table_td_2: "Spain, Barcelona" },
    { table_td_1: "Phone:", table_td_2: "+21 456 987 330" },
    { table_td_1: "Email", table_td_2: "mathfir@support.com" },
    { table_td_1: "Qualification:", table_td_2: "Master Degree" },
  ],
  icon: ["whatsapp", "x-twitter", "instagram", "viber"],
  desc_2: (
    <>
      Before establishing Beratung in 2001, Mathew founded Silicon Valley
      internet companies and later held management roles at Salomon in New York.
    </>
  ),
  desc_3: (
    <>
      Risk management and compliance, when approached strategically, have the
      potential to go beyond mitigating threats and protecting a company’s
      operations & reputation.They can actually generate value and create
      opportunities.
    </>
  ),
};

const {
  title_1,
  desc_1,
  table_data,
  icon,
  desc_2,
  desc_3,
  table_data_2,
  title_2,
  desc_4,
} = agency_details_content;

const AgencyDetailsArea = ({ style, id }: any) => {
  const { t } = useTranslation("translations");

  const panelRef = useRef<any>(null);

  useEffect(() => {
    if (id && panelRef?.current) {
      panelRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [id]);

  if (!id) {
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
                        src={`/assets/img/team/${id + 1}.jpg`}
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
                      {icon.map((icon, i) => (
                        <li key={i}>
                          <Link href="#">
                            <i className={`fa-brands fa-${icon}`}></i>
                          </Link>
                        </li>
                      ))}
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
