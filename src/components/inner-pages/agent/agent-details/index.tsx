import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree"
import HeaderOne from "@/layouts/headers/HeaderOne"
import FooterFour from "@/layouts/footers/FooterFour"
import AgencyDetailsArea from "../../agency/agency-details/AgencyDetailsArea"
import FancyBanner from "@/components/common/FancyBanner"

const AgentDetails = () => {
   return (
      <>
         <HeaderOne />
         <BreadcrumbThree title="Agent Details" link="agent" link_title="Agent" sub_title="Mathews Firlo" style={false} />
         <AgencyDetailsArea style={true} />
         <FancyBanner />
         <FooterFour />
      </>
   )
}

export default AgentDetails
