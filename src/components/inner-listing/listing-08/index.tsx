import FooterFour from "@/layouts/footers/FooterFour"
import HeaderOne from "@/layouts/headers/HeaderOne"
import FancyBanner from "@/components/common/FancyBanner"
import ListingEightArea from "./ListingEightArea"

const ListingEight = () => {
   return (
      <>
         <HeaderOne />
         <ListingEightArea style={false} />
         <FancyBanner />
         <FooterFour />
      </>
   )
}

export default ListingEight;
