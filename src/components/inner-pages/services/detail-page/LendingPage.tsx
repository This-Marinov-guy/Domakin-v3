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
        image: "/assets/img/icons/1.png",
        title: "Upload a property",
        text: "Add a description and photos to of the room and common areas",
      },
      {
        image: "/assets/img/icons/2.png",
        title: "Choose a tenant",
        text: "Receive a list of candidates and choose the new tenant",
      },
      {
        image: "/assets/img/icons/3.png",
        title: "Receive your commission",
        text: "Once the new tenant signs the contract you will receive 200 euro",
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
