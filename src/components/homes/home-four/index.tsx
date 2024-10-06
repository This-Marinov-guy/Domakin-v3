import PropertyTwo from './PropertyTwo'
import BLockFeatureOne from './BLockFeatureOne'
import Category from './Category'
import BLockFeatureTwo from './BLockFeatureTwo'
import Feedback from './Feedback'
import Brand from './Brand'
import Blog from './Blog'
import AddressBanner from './AddressBanner'
import FancyBanner from './FancyBanner'
import FooterFour from '@/layouts/footers/FooterFour'
import HeroBanner from './HeroBanner'
import HeaderOne from '@/layouts/headers/HeaderOne'
import PropertyOne from './PropertyOne'

const HomeFour = () => {
  return (
    <>
      <HeaderOne style_1={false} style_2={true} />
      <HeroBanner />
      <PropertyOne style_1={false} style_2={false} />
      <PropertyTwo />
      <BLockFeatureOne />
      <Category />
      <BLockFeatureTwo style={false} />
      <Feedback />
      <Brand />
      <Blog />
      <AddressBanner style={false} />
      <FancyBanner style={false} />
      <FooterFour />
    </>
  )
}

export default HomeFour
