import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree";
import Brand from "@/components/homes/home-five/Brand";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import BlockFeatureThree from "../service-one/ServicesList";
import FancyBanner from "@/components/common/FancyBanner";
import CardStyleOne from "@/components/common/CardStyleOne";
import StepDescriptionOne from "@/components/common/StepDescriptionOne";
import useTranslation from "next-translate/useTranslation";
import ViewingForm from "@/components/forms/ViewingForm";

const ViewingPage = () => {
  const {t} = useTranslation('translations');

  const details = {
    title: t("viewing.let_us_make_the_viewing_for_you"),
    description: [t("viewing.description"), t("viewing.service_offer")],
    steps: [
      {
        icon: "fa-solid fa-user",
        text: t("viewing.step_1"),
      },
      {
        icon: "fa-solid fa-clock",
        text: t("viewing.step_2"),
      },
      {
        icon: "fa-solid fa-handshake",
        text: t("viewing.step_3"),
      },
    ],
  };

  return (
    <>
      <HeaderOne />
      <BreadcrumbThree
        title={t("viewing.viewing_service")}
        link_title={t("features.viewings")}
        style={false}
      />
      <StepDescriptionOne details={details} />
      <ViewingForm />
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default ViewingPage;
