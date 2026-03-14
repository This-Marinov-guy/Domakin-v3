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

const stripUndefined = (value: unknown): unknown =>
  JSON.parse(JSON.stringify(value ?? null));

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lang = context.locale || "en";
  const feedbacks = await fetchFeedbacks(lang);
  const properties = await fetchProperties(lang);

  return {
    props: {
      serverFeedbacks: stripUndefined(feedbacks),
      serverProperties: stripUndefined(properties),
    },
  };
};

export default Index;
