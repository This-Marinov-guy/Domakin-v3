import Link from "next/link";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";

const serviceGroups = [
  {
    key: "viewings",
    links: [{ labelKey: "services_hub.groups.viewings.link", href: "/services/viewing" }],
    icon: "/assets/img/icons/10.png",
  },
  {
    key: "renting",
    links: [
      { labelKey: "services_hub.groups.renting.link_catalogue", href: "/services/renting" },
      { labelKey: "services_hub.groups.renting.link_search", href: "/services/room-searching" },
    ],
    icon: "/assets/img/icons/12.png",
  },
  {
    key: "lending",
    links: [{ labelKey: "services_hub.groups.lending.link", href: "/services/add-listing" }],
    icon: "/assets/img/icons/11.png",
  },
];

const priorityCheckKeys = [
  "services_hub.proof_checks.viewing",
  "services_hub.proof_checks.room_search",
  "services_hub.proof_checks.listing",
];

export default function ServicesHub() {
  const { t } = useTranslation("translations");

  return (
    <>
      <HeaderOne style={true} />
      <main className="services-hub">
        <section
          className="services-hub-hero"
          style={{ backgroundImage: "url(/assets/img/bg/8.webp)" }}
          data-geo-services-hub-hero-image="/assets/img/bg/8.webp"
        >
          <div className="container">
            <div className="row align-items-center gy-4 gx-lg-5 services-hub-hero-row">
              <div className="col-lg-8 order-lg-2">
                <h1>{t("services_hub.h1")}</h1>
                <p className="services-hub-lead">{t("services_hub.lead")}</p>
              </div>
              <div className="col-lg-4 order-lg-1 services-hub-answer-col">
                <div
                  className="services-hub-answer-card"
                  data-geo-services-hub-answer-block
                >
                  {/* <p className="fw-semibold text-uppercase small mb-2">
                    {t("services_hub.quick_answer_label")}
                  </p> */}
                  <h2>{t("services_hub.quick_answer_question")}</h2>
                  <p>{t("services_hub.quick_answer_text")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="services-hub-section">
          <div className="container">
            <div className="row gx-xxl-5 gy-4">
              {serviceGroups.map((group) => (
                <div className="col-lg-4 d-flex" key={group.key}>
                  <article className="services-hub-card">
                    <div className="services-hub-card-icon">
                      <Image src={group.icon} alt="" width={64} height={64} />
                    </div>
                    <p className="services-hub-card-label">
                      {t(`services_hub.groups.${group.key}.label`)}
                    </p>
                    <h2>{t(`services_hub.groups.${group.key}.title`)}</h2>
                    <p>{t(`services_hub.groups.${group.key}.text`)}</p>
                    <div className="services-hub-card-links">
                      {group.links.map((link) => (
                        <Link href={link.href} key={link.href}>
                          {t(link.labelKey)}
                          <i
                            className="fa-thin fa-arrow-up-right"
                            aria-hidden="true"
                          ></i>
                        </Link>
                      ))}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="services-hub-section pt-0">
          <div className="container">
            <div className="services-hub-proof">
              <div>
                <p className="services-hub-eyebrow">
                  {t("services_hub.proof_eyebrow")}
                </p>
                <h2>{t("services_hub.proof_title")}</h2>
              </div>
              <ul>
                {priorityCheckKeys.map((checkKey) => (
                  <li key={checkKey}>
                    <i className="fa-solid fa-check" aria-hidden="true"></i>
                    <span>{t(checkKey)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <FooterFour />
    </>
  );
}
