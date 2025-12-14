import BreadcrumbTwo from "@/components/common/breadcrumb/BreadcrumbTwo";
import HeaderOne from "@/layouts/headers/HeaderOne";
import VideoBanner from "@/components/homes/home-seven/VideoBanner";
import Feedback from "@/components/homes/home-five/Feedback";
import Brand from "./Brand";
import FooterFour from "@/layouts/footers/FooterFour";
import FancyBanner from "@/components/common/FancyBanner";
import ServicesList from "../../services/service-one/ServicesList";
import BLockFeatureOne from "./BLockFeatureOne";
import useTranslation from "next-translate/useTranslation";
import CreateFeedback from "@/components/forms/CreateFeedback";

interface AboutUsOneProps {
  serverFeedbacks?: any[];
}

const AboutUsOne = ({ serverFeedbacks = [] }: AboutUsOneProps) => {
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
      <ServicesList />
      <Feedback style={true} feedbacks={serverFeedbacks} />
      <CreateFeedback />
      <Brand />
      <FancyBanner style={false} />
      <FooterFour />
    </>
  );
};

export default AboutUsOne;
