"use client";
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import ProfileEditForm from "@/components/forms/account/ProfileEditForm";

const ProfileBody = () => {
  return (
    <div className="position-relative">
      <DashboardHeaderOne title="Profile" />
      <ProfileEditForm />
    </div>
  );
};

export default ProfileBody;
