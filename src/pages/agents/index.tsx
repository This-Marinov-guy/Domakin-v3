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

export const metadata = {
  title: "Agents",
};
const index = () => {
  const { t } = useTranslation("translations");

  return (
    <Wrapper>
      <HeaderOne style={true} /> 
       <BreadcrumbOne
        title={t("team.team")}
        sub_title={t("team.property_agents")}
      />
      <AgentArea withDetails/>
      <Feedback style={true} />
      <Brand />
      <FancyBanner style={false} />
      <FooterFour />
    </Wrapper>
  );
};

export default index;
