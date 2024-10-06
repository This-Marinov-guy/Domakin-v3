import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import FavouriteArea from "./FavouriteArea";

const FavouriteBody = () => {

   return (
      <div className="dashboard-body">
         <div className="position-relative">
            <DashboardHeaderOne title="Favourites" />
            <FavouriteArea/>
         </div>
      </div>
   )
}

export default FavouriteBody;
