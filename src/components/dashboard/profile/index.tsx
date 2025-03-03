import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne"
import ProfileBody from "./ProfileBody"
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";

const DashboardProfile = () => {
   return (
     <div className="dashboard-body">
       <DashboardHeaderTwo title="Dashboard" />
       <ProfileBody />
     </div>
   );
}

export default DashboardProfile
