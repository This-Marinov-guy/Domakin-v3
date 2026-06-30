import FooterFour from "@/layouts/footers/FooterFour";
import FancyBanner from "@/components/common/FancyBanner";
import ViewingForm from "@/components/forms/ViewingForm";
import ServiceAnswerBlock, { getServiceAnswerData } from "../ServiceAnswerBlock";
import Image from "next/image";
import { logoByTheme } from "@/utils/config";

const VIEWING_LOGO_HEADER_HEIGHT = 82;

const ViewingLogoHeader = () => (
  <header
    className="bg-white"
    data-viewing-logo-only-header
    aria-label="Domakin viewing signup"
    style={{
      position: "fixed",
      top: 0,
      right: 0,
      left: 0,
      zIndex: 1000,
      height: VIEWING_LOGO_HEADER_HEIGHT,
      borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
    }}
  >
    <div className="container">
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: VIEWING_LOGO_HEADER_HEIGHT }}
      >
        <Image
          src={logoByTheme()}
          alt="Domakin"
          priority
          style={{
            width: 58,
            height: 58,
            objectFit: "contain",
            borderRadius: 8,
          }}
        />
      </div>
    </div>
  </header>
);

const ViewingPage = () => {
  const serviceAnswerData = getServiceAnswerData("viewing");

  return (
    <>
      <ViewingLogoHeader />
      <div aria-hidden="true" style={{ height: VIEWING_LOGO_HEADER_HEIGHT }} />
      <ViewingForm />
      <ServiceAnswerBlock data={serviceAnswerData} />
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default ViewingPage;
