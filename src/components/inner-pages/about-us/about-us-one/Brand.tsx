import BrandTwo from '@/components/common/brand/BrandTwo'
import useTranslation from 'next-translate/useTranslation'

const Brand = () => {
   const {t} = useTranslation('translations');

   return (
     <div className="partner-section-one mt-80 xl-mt-60 lg-mt-60 mb-60 xl-mb-60 lg-mb-60">
       <div className="container">
         <h4 className="text-center mb-50 lg-mb-20">
           {t("partners.official_partners")}
         </h4>
       </div>
       <div className="bg-wrapper bg-white">
         <div className="container">
           <BrandTwo />
         </div>
       </div>
     </div>
   );
}

export default Brand
