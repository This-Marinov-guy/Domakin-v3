import React from "react";
import HomeOne from "@/components/homes/home-one";
import Wrapper from "@/layouts/Wrapper";
import HomeSix from "@/components/homes/home-six";

export const metadata = {
  title: "Domakin",
};
const index = () => {
  return (
    <Wrapper>
      <HomeSix />
    </Wrapper>
  );
};

export default index;
