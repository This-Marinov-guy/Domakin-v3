import ProfileEditForm from "@/components/forms/account/ProfileEditForm";
import DashboardFrame from "@/layouts/frames/DashboardFrame";

const DashboardProfile = () => {
  return (
    <DashboardFrame title="Profile">
      <ProfileEditForm />
    </DashboardFrame>
  );
};

export default DashboardProfile;
