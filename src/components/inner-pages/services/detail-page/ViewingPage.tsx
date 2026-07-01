import FooterFour from "@/layouts/footers/FooterFour";
import FancyBanner from "@/components/common/FancyBanner";
import ViewingForm from "@/components/forms/ViewingForm";
import HeaderOne from "@/layouts/headers/HeaderOne";
import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree";
import useTranslation from "next-translate/useTranslation";

const ViewingPage = () => {
  const { t } = useTranslation("translations");

  return (
    <>
      <HeaderOne />
      <BreadcrumbThree
        title={t("viewing.let_us_make_the_viewing_for_you")}
        link_title={t("viewing.viewing_service")}
        style={false}
        background={5}
      />
      <ViewingForm />
      <FancyBanner />
      <FooterFour openLinksInNewTab />
    </>
  );
};

export default ViewingPage