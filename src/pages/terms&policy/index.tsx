import Wrapper from "@/layouts/Wrapper";
import HeaderOne from "@/layouts/headers/HeaderOne";
import useTranslation from "next-translate/useTranslation";
import Brand from "@/components/inner-pages/about-us/about-us-one/Brand";
import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne";
import FaqThree from "@/components/common/faq/FaqThree";
import Link from "next/link";
import FooterFour from "@/layouts/footers/FooterFour";

const index = () => {
  const { t } = useTranslation("translations");

  return (
    <Wrapper>
      <HeaderOne style={true} />
      <BreadcrumbOne
        title={t("privacy_policy_content.legal")}
        sub_title={t("privacy_policy_content.terms_and_policy")}
      />
      <div className="mt-40 m-a container row w-100">
        <div className="col-12">
          <h4>{t("privacy_policy_content.effective_date")}</h4>
          <p>{t("privacy_policy_content.introduction")}</p>
        </div>

        <div className="col-lg-8 mt-20">
          <div className="accordion-style-two md-mt-40">
            <div className="accordion" id="accordionTwo">
              <FaqThree />
            </div>
          </div>
        </div>

        <div className="col-lg-4 mt-20">
          <div className="widget ltn__banner-widget go-top">
            <img src="/assets/img/logo.png" alt="Banner Image" />
          </div>
          <div className="need-support text-center mt-100">
            <h5>{t("privacy_policy_content.contact_us")}</h5>
            <div className="btn-wrapper mb-30 go-top">
              <Link href="/contact" className="btn-two" target="_blank">
                {t("privacy_policy_content.contact_details")}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <FooterFour />
    </Wrapper>
  );
};

export default index;
