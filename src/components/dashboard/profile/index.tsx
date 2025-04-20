import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import ProfileBody from "./ProfileBody";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import DashboardFrame from "@/layouts/frames/DashboardFrame";

const DashboardProfile = () => {
  return (
    <DashboardFrame title="Profile">
      <ProfileBody />
    </DashboardFrame>
  );
};

export default DashboardProfile;
