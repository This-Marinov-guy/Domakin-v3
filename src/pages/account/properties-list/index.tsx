import PropertyListBody from "@/components/dashboard/properties-list/PropertyListBody";
import DashboardFrame from "@/layouts/frames/DashboardFrame";

export const metadata = {
   title: "Dashboard Property List",
};
const index = () => {
   return (
     <DashboardFrame title="Property List">
       <PropertyListBody />
     </DashboardFrame>
   );
}

export default index