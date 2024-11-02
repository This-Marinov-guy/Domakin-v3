import BreadcrumbTwo from "@/components/common/breadcrumb/BreadcrumbTwo";
import HeaderOne from "@/layouts/headers/HeaderOne";
import VideoBanner from "@/components/homes/home-seven/VideoBanner";
import Feedback from "@/components/homes/home-five/Feedback";
import AgentArea from "@/components/homes/home-one/AgentArea";
import Brand from "./Brand";
import FooterFour from "@/layouts/footers/FooterFour";
import FancyBanner from "@/components/common/FancyBanner";
import BlockFeatureTwo from "../../services/service-one/BlockFeatureTwo";
import BLockFeatureOne from "./BLockFeatureOne";
import useTranslation from "next-translate/useTranslation";

const AboutUsOne = () => {
  const {t} = useTranslation('translations');

  return (
    <>
      <HeaderOne style={true} />
      <BreadcrumbTwo
        title={t("about.about_the_company")}
        sub_title={t("about.about_us")}
      />
      <BLockFeatureOne />
      <VideoBanner />
      <BlockFeatureTwo />
      <Feedback style={true} />
      <Brand />
      <FancyBanner style={false} />
      <FooterFour />
    </>
  );
};

export default AboutUsOne;
