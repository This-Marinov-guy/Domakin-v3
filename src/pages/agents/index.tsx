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
import { GetServerSideProps } from "next";
import { fetchFeedbacks } from "@/services/api";
import { useStore } from "@/stores/storeContext";
import { useEffect } from "react";

export const metadata = {
  title: "Agents",
};

interface AgentsProps {
  serverFeedbacks: any[];
}

const index = ({ serverFeedbacks }: AgentsProps) => {
  const { t } = useTranslation("translations");
  const { commonStore } = useStore();

  // Initialize store with server-side data
  useEffect(() => {
    if (serverFeedbacks && serverFeedbacks.length > 0) {
      commonStore.setSSRFeedbacks(serverFeedbacks as []);
    }
  }, [serverFeedbacks, commonStore]);

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lang = context.locale || "en";
  const feedbacks = await fetchFeedbacks(lang);

  return {
    props: {
      serverFeedbacks: feedbacks,
    },
  };
};

export default index;
