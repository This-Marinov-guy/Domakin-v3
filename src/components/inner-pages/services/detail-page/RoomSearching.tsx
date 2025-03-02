import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree";
import Brand from "@/components/homes/home-five/Brand";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FancyBanner from "@/components/common/FancyBanner";
import CardStyleOne from "@/components/common/CardStyleOne";
import StepDescriptionOne from "@/components/common/StepDescriptionOne";
import useTranslation from "next-translate/useTranslation";
import ViewingForm from "@/components/forms/ViewingForm";
import RoomSearchingForm from "@/components/forms/RoomSearchingForm";

const RoomSearching = () => {
  const { t } = useTranslation("translations");

  const details = {
    title: t("room_searching.tell_us_what_are_you_looking_for"),
    steps: [
      {
        icon: "fa-solid fa-user",
        text: t("room_searching.step_1"),
      },
      {
        icon: "fa-solid fa-clock",
        text: t("room_searching.step_2"),
      },
      {
        icon: "fa-solid fa-key",
        text: t("room_searching.step_3"),
      },
    ],
  };

  return (
    <>
      <HeaderOne />
      <BreadcrumbThree
        title={t("features.room_searching")}
        link_title={t("renting.renting")}
        style={false}
      />
      <StepDescriptionOne details={details} />
      <RoomSearchingForm />
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default RoomSearching;
