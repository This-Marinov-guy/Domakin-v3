import Link from "next/link"
import useTranslation from "next-translate/useTranslation"

const PaymentSuccessArea = () => {
   const {t} = useTranslation('translations');

   return (
     <div className="payment-status-section position-relative z-1 bg-light-green py-100">
       <div className="container">
         <div className="row">
           <div className="col-xxl-8 col-xl-6 col-lg-7 col-md-8 m-auto">
             <div className="title-one text-center mb-75 lg-mb-20 wow fadeInUp">
               <div className="d-flex justify-content-center mb-30">
                 <img src="/assets/images/icon/payment-success.svg" alt="" width={72} height={71} />
               </div>
               <h3 className="text-success">{t("payment.success.title")}</h3>
               <p className="fs-20 pb-30">{t("payment.success.message")}</p>
               <p className="fs-16 pb-45 text-muted">
                 {t("payment.success.description")}
               </p>
               <div className="d-flex gap-3 justify-content-center flex-wrap">
                 {/* <Link href="/account/membership" className="btn-five sm fw-normal text-uppercase">
                   {t("payment.success.view_membership")}
                 </Link> */}
                 <Link href="/" className="btn-two sm fw-normal text-uppercase">
                   {t("react_error.go_home")}
                 </Link>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
}

export default PaymentSuccessArea