import ApplicationListBody from "@/components/dashboard/applications-list/ApplicationListBody";
import DashboardFrame from "@/layouts/frames/DashboardFrame";

export const metadata = {
  title: "Applications",
};

const ApplicationsListPage = () => {
  return (
    <DashboardFrame title="Applications">
      <ApplicationListBody />
    </DashboardFrame>
  );
};

export default ApplicationsListPage;
