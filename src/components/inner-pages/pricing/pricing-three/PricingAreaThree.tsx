import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import React from "react";
import Link from "next/link";
import { RENTING_PRICE, VIEWING_EXPRESS_PRICE, VIEWING_PREMIUM_PRICE, VIEWING_STANDARD_PRICE } from "@/utils/defines";

const PricingAreaThree = () => {
  const { t } = useTranslation("translations");

  return (
    <div className="blog-details mt-40 mb-40">
      <div className="container">
        <div className="row gx-xl-5">
          <div className="col-lg-12">
            <div className="blog-post-meta mb-20">
              <h4 className="blog-title">{t("pricing.page_title")}</h4>
            </div>
          </div>
        </div>
        <div className="row gx-xl-5">
          <div className="col-lg-12">
            <article className="blog-post-meta">
              <p>
                {t("pricing.introduction.part_1")}{" "}
                {t("pricing.introduction.part_2")}{" "}
                {t("pricing.introduction.part_3")}
              </p>

              {/* Viewing standard */}
              <h4 className="mt-40">
                <Trans i18nKey="translations:pricing.viewing_assistance.section_title" />
              </h4>

              <p>{t("pricing.viewing_assistance.intro")} </p>

              <h6>
                <Trans
                  i18nKey="translations:pricing.viewing_assistance.types.standard.title"
                  values={{ price: VIEWING_STANDARD_PRICE }}
                  components={{ b: <b /> }}
                />
              </h6>
              <p>
                {t("pricing.viewing_assistance.types.standard.description")}
              </p>

              <h6>
                <Trans
                  i18nKey="translations:pricing.viewing_assistance.types.same_day.title"
                  values={{ price: VIEWING_EXPRESS_PRICE }}
                  components={{ b: <b /> }}
                />
              </h6>
              <p>
                {t("pricing.viewing_assistance.types.same_day.description")}
              </p>

              <p>{t("pricing.viewing_assistance.included.title")}</p>

              <ul>
                <li>{t("pricing.viewing_assistance.included.items.1")}</li>
                <li>{t("pricing.viewing_assistance.included.items.2")}</li>
                <li>{t("pricing.viewing_assistance.included.items.3")}</li>
              </ul>

              <p>{t("pricing.viewing_assistance.audience.title")}</p>
              <p>{t("pricing.viewing_assistance.audience.description")}</p>

              {/* Viewing by us */}
              <h4 className="mt-40">
                <Trans
                  i18nKey="translations:pricing.viewing_by_agent.section_title"
                  values={{ price: VIEWING_EXPRESS_PRICE }}
                  components={{ b: <b /> }}
                />
              </h4>

              <p>
                {t("pricing.viewing_by_agent.intro")}{" "}
                {t("pricing.viewing_by_agent.how_it_works.title")}
              </p>

              <ul>
                <li>{t("pricing.viewing_by_agent.how_it_works.steps.1")}</li>
                <li>{t("pricing.viewing_by_agent.how_it_works.steps.2")}</li>
                <li>{t("pricing.viewing_by_agent.how_it_works.steps.3")}</li>
              </ul>

              <p>{t("pricing.viewing_by_agent.included.title")}</p>

              <ul>
                <li>{t("pricing.viewing_by_agent.included.items.1")}</li>
                <li>{t("pricing.viewing_by_agent.included.items.2")}</li>
                <li>{t("pricing.viewing_by_agent.included.items.3")}</li>
              </ul>

              <p>{t("pricing.viewing_by_agent.audience.title")}</p>
              <p>{t("pricing.viewing_by_agent.audience.description")}</p>

              {/* Renting */}
              <h4 className="mt-40">
                <Trans
                  i18nKey="translations:pricing.renting_room.section_title"
                  values={{ price: RENTING_PRICE }}
                  components={{ b: <b /> }}
                />
              </h4>

              <p>
                {t("pricing.renting_room.intro")}{" "}
                {t("pricing.renting_room.how_it_works.title")}
              </p>

              <ul>
                <li>{t("pricing.renting_room.how_it_works.steps.1")}</li>
                <li>{t("pricing.renting_room.how_it_works.steps.2")}</li>

                <li>
                  <Trans
                    i18nKey="translations:pricing.renting_room.how_it_works.steps.3"
                    values={{ price: RENTING_PRICE }}
                    components={{ b: <b /> }}
                  />
                </li>
              </ul>

              <p>{t("pricing.renting_room.why_choose_us.title")}</p>

              <ul>
                <li>{t("pricing.renting_room.why_choose_us.points.1")}</li>
                <li>{t("pricing.renting_room.why_choose_us.points.2")}</li>
                <li>{t("pricing.renting_room.why_choose_us.points.3")}</li>
              </ul>

              <p>{t("pricing.renting_room.audience.title")}</p>
              <p>{t("pricing.renting_room.audience.description")}</p>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingAreaThree;
