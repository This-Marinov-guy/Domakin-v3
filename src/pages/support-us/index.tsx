import AboutUsOne from "@/components/inner-pages/about-us/about-us-one";
import AgentArea from "@/components/homes/home-one/AgentArea";
import Wrapper from "@/layouts/Wrapper";
import HeaderOne from "@/layouts/headers/HeaderOne";
import Feedback from "@/components/homes/home-five/Feedback";
import FooterFour from "@/layouts/footers/FooterFour";
import FancyBanner from "@/components/common/FancyBanner";
import useTranslation from "next-translate/useTranslation";
import Brand from "@/components/inner-pages/about-us/about-us-one/Brand";
import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne";
import CreateFeedback from "@/components/forms/CreateFeedback";
import CreateDonation from "@/components/forms/CreateDonation";

export const metadata = {
  title: "Support",
};
const index = () => {
  const { t } = useTranslation("translations");

  return (
    <Wrapper>
      <HeaderOne style={true} />
      <BreadcrumbOne
        title={t("feedbacks.help_the_organization")}
        sub_title={t("feedbacks.feedbacks_and_donations")}
      />
      <CreateDonation />
      <Feedback style={true} />
      <CreateFeedback />
      <Brand />
      <FancyBanner style={false} />
      <FooterFour />
    </Wrapper>
  );
};

export default index;
