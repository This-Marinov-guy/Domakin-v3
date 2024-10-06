import FooterFour from "@/layouts/footers/FooterFour"
import HeaderOne from "@/layouts/headers/HeaderOne"
import FancyBanner from "@/components/common/FancyBanner"
import ListingSevenArea from "./ListingSevenArea"

const ListingSix = () => {
   return (
      <>
         <HeaderOne />
         <ListingSevenArea style={false} />
         <FancyBanner />
         <FooterFour />
      </>
   )
}

export default ListingSix;
