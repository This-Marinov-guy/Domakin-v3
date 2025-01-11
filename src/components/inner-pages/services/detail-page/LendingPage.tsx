import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FancyBanner from "@/components/common/FancyBanner";
import StepDescriptionTwo from "@/components/common/StepDescriptionTwo";
import useTranslation from "next-translate/useTranslation";
import AddListingForm from "@/components/forms/AddListingForm";

const LendingPage = () => {
  // English only
  //   const { t } = useTranslation("translations");

  const details = {
    title: "You are moving out or looking for a new flatmate?",
    description: [
      "List your room on our platform and receive a commission once the new tenant arranges a contract with the landlord or with you in case of subletting.",
    ],
    steps: [
      {
        icon: "fa-solid fa-building",
        text: "1. Fill your contacts and register your room",
      },
      {
        icon: "fa-solid fa-handshake",
        text: "2. Once we have a prospective tenant we will contact you to arrange details and viewing",
      },
      {
        icon: "fa-regular fa-credit-card",
        text: "3. Once the tenant settles a contract you will receive a one time commission of 200 euro",
      },
    ],
  };

  return (
    <>
      <HeaderOne />
      <BreadcrumbThree
        title="Give out your room"
        link_title="Lending"
        style={false}
      />
      <StepDescriptionTwo details={details} />
      <AddListingForm/>
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default LendingPage;
