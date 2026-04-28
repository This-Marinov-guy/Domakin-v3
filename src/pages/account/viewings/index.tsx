import ViewingsListBody from "@/components/dashboard/viewings-list/ViewingsListBody";
import DashboardFrame from "@/layouts/frames/DashboardFrame";

export const metadata = {
  title: "Viewings",
};

const ViewingsPage = () => {
  return (
    <DashboardFrame title="Viewings">
      <ViewingsListBody />
    </DashboardFrame>
  );
};

export default ViewingsPage;
