import Wrapper from "@/layouts/Wrapper";
import HeaderOne from "@/layouts/headers/HeaderOne";
import Feedback from "@/components/homes/home-five/Feedback";
import FooterFour from "@/layouts/footers/FooterFour";
import FancyBanner from "@/components/common/FancyBanner";
import useTranslation from "next-translate/useTranslation";
import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne";
import TrustpilotBadge from "@/components/common/TrustpilotBadge";
import { GetServerSideProps } from "next";
import { fetchFeedbacks } from "@/services/api";

export const metadata = {
  title: "Support",
};

interface SupportProps {
  serverFeedbacks: any[];
}

const index = ({ serverFeedbacks }: SupportProps) => {
  const { t } = useTranslation("translations");

  return (
    <Wrapper>
      <HeaderOne style={true} />
      <BreadcrumbOne
        title={t("feedbacks.help_the_organization")}
        sub_title={t("feedbacks.feedbacks")}
      />
      <div className="container">
        <div className="support-trustpilot text-center pt-60 pb-30">
          <h2 className="mb-30">{t("feedbacks.trustpilot_heading")}</h2>
          <TrustpilotBadge align="center" buttonClassName="btn-two mt-10" />
        </div>
      </div>
      <Feedback style={true} feedbacks={serverFeedbacks} />
      <FancyBanner style={false} />
      <FooterFour />
    </Wrapper>
  );
};

const stripUndefined = (value: any): any => JSON.parse(JSON.stringify(value ?? null));

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lang = context.locale || "en";
  const feedbacks = await fetchFeedbacks(lang);

  return {
    props: {
      serverFeedbacks: stripUndefined(feedbacks),
    },
  };
};

export default index;
