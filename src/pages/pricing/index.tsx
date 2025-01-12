import Pricing from "@/components/inner-pages/pricing/Pricing";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Pricing",
};

const index = () => {
  return (
    <Wrapper>
      <Pricing />
    </Wrapper>
  );
};

export default index;
