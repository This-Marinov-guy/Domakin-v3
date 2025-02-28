import DashboardProfile from "@/components/dashboard/profile";
import AuthLayout from "@/layouts/AuthLayout";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Dashboard Profile Homy - Real Estate React Next js Template",
};
const index = () => {
  return (
    <AuthLayout>
      <DashboardProfile />
    </AuthLayout>
  );
};

export default index;
