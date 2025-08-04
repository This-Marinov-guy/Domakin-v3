import PaymentFailure from "@/components/inner-pages/payment/failure";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Payment Failed || Domakin - Real Estate Platform",
};

const index = () => {
   return (
      <Wrapper>
         <PaymentFailure />
      </Wrapper>
   )
}

export default index