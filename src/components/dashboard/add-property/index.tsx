import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import AddPropertyBody from "./AddPropertyBody";
import AddListingForm from "@/components/forms/AddListingForm";
import DashboardFrame from "@/layouts/frames/DashboardFrame";

const DashboardAddProperty = () => {
  return (
      <DashboardFrame title="Add Listing">
        <AddListingForm />
      </DashboardFrame>
  );
};

export default DashboardAddProperty;
