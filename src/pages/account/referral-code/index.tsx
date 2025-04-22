import DashboardProfile from "@/components/dashboard/profile";
import ReferralCode from "@/components/dashboard/profile/ReferralCode";
import AuthLayout from "@/layouts/AuthLayout";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Dashboard",
};
const index = () => {
  return (
    <AuthLayout>
      <ReferralCode />
    </AuthLayout>
  );
};

export default index;
