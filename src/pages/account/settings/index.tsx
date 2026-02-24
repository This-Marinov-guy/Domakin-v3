import AuthLayout from "@/layouts/AuthLayout";
import SettingsBody from "@/components/dashboard/settings/SettingsBody";

export const metadata = {
  title: "Settings",
};

const index = () => {
  return (
    <AuthLayout>
      <SettingsBody />
    </AuthLayout>
  );
};

export default index;
