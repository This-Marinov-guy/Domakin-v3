import DashboardProfile from "@/components/dashboard/profile";
import AuthLayout from "@/layouts/AuthLayout";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Dashboard",
};
const index = () => {
  return (
    <AuthLayout>
      <DashboardProfile />
    </AuthLayout>
  );
};

export default index;
