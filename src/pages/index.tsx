import React from "react";
import Wrapper from "@/layouts/Wrapper";
import HomeSix from "@/components/homes/home-six";
import { GetServerSideProps } from "next";
import { fetchFeedbacks, fetchProperties } from "@/services/api";
import SnowBackground from "@/components/common/backgrounds/SnowBackground";

export const metadata = {
  title: "Domakin",
};

interface HomeProps {
  serverFeedbacks: any[];
  serverProperties: any[];
}

const Index = ({ serverFeedbacks, serverProperties }: HomeProps) => {

  return (
    <Wrapper>
      <SnowBackground/>
      <HomeSix serverFeedbacks={serverFeedbacks} serverProperties={serverProperties} />
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lang = context.locale || "en";
  const feedbacks = await fetchFeedbacks(lang);
  const properties = await fetchProperties(lang);

  return {
    props: {
      serverFeedbacks: feedbacks,
      serverProperties: properties,
    },
  };
};

export default Index;
