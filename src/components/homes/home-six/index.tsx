import HeroBanner from "./HeroBanner"
import Feedback from "@/components/homes/home-five/Feedback";
import Brand from "./Brand"
import FancyBanner from "@/components/common/FancyBanner";
import FooterFour from "@/layouts/footers/FooterFour"
import HeaderOne from "@/layouts/headers/HeaderOne"
import ServicesList from "@/components/inner-pages/services/service-one/ServicesList"
import CreateFeedback from "@/components/forms/CreateFeedback"
import BLockFeatureOne from "@/components/inner-pages/about-us/about-us-one/BLockFeatureOne"

interface HomeSixProps {
  serverFeedbacks?: any[];
  serverProperties?: any[];
}

const HomeSix = ({ serverFeedbacks = [] }: HomeSixProps) => {
   return (
     <>
       <HeaderOne />
       <HeroBanner />
       <ServicesList />
       <BLockFeatureOne />
       <Feedback style={true} feedbacks={serverFeedbacks} />
       <Brand />
       <FancyBanner style={false} />
       <FooterFour />
     </>
   );
}

export default HomeSix
