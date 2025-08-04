import PaymentSuccess from "@/components/inner-pages/payment/success";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Payment Success || Domakin - Real Estate Platform",
};

const index = () => {
   return (
      <Wrapper>
         <PaymentSuccess />
      </Wrapper>
   )
}

export default index