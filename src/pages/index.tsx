import React from "react";
import HomeOne from "@/components/homes/home-one";
import Wrapper from "@/layouts/Wrapper";
import HomeSix from "@/components/homes/home-six";

export const metadata = {
  title: "Homy - Real Estate React Next js Template",
};
const index = () => {
  return (
    <Wrapper>
      <HomeSix />
    </Wrapper>
  );
};

export default index;
