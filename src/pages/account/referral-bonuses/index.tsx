import ReferralBonusesListBody from "@/components/dashboard/referral-bonuses/ReferralBonusesListBody";
import DashboardFrame from "@/layouts/frames/DashboardFrame";

export const metadata = {
  title: "Referral Bonuses",
};

const ReferralBonusesPage = () => {
  return (
    <DashboardFrame title="Referral Bonuses">
      <div className="container mb-40">
        Your referral bonuses for our services will be displayed here as well as their status and details. Make sure to save your IBAN in the profile section so any bonuses can be paid.
      </div>
      <ReferralBonusesListBody />
    </DashboardFrame>
  );
};

export default ReferralBonusesPage;
