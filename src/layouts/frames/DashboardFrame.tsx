import React from "react";
import DashboardHeaderOne from "../headers/dashboard/DashboardHeaderOne";
import DashboardHeaderTwo from "../headers/dashboard/DashboardHeaderTwo";
import AuthLayout from "../AuthLayout";

const DashboardFrame = ({ title, children }: any) => {
  return (
    <AuthLayout>
      <div className="dashboard-body">
        <div className="position-relative">
          <DashboardHeaderTwo title={title} />
          {children}
        </div>
      </div>
    </AuthLayout>
  );
};

export default DashboardFrame;
