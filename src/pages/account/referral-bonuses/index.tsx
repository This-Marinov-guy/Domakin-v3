import ReferralBonusesListBody from "@/components/dashboard/referral-bonuses/ReferralBonusesListBody";
import DashboardFrame from "@/layouts/frames/DashboardFrame";

export const metadata = {
  title: "Referral Bonuses",
};

const ReferralBonusesPage = () => {
  return (
    <DashboardFrame title="Referral Bonuses">
      <ReferralBonusesListBody />
    </DashboardFrame>
  );
};

export default ReferralBonusesPage;
