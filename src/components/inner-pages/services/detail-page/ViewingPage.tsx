import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree";
import Brand from "@/components/homes/home-five/Brand";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import BlockFeatureThree from "../service-one/ServicesList";
import FancyBanner from "@/components/common/FancyBanner";
import CardStyleOne from "@/components/common/CardStyleOne";
import CardStyleTwo from "@/components/common/CardStyleTwo";

const ViewingPage = () => {
  return (
    <>
      <HeaderOne />
      <BreadcrumbThree
        title="Our Services"
        link="#"
        link_title="Pages"
        sub_title="Services"
        style={false}
      />
      <CardStyleTwo/>
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default ViewingPage;
