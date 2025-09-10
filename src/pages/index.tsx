import React, { useEffect } from "react";
import Wrapper from "@/layouts/Wrapper";
import HomeSix from "@/components/homes/home-six";
import { GetServerSideProps } from "next";
import { fetchFeedbacks, fetchProperties } from "@/services/api";
import { useStore } from "@/stores/storeContext";

export const metadata = {
  title: "Domakin",
};

interface HomeProps {
  serverFeedbacks: any[];
  serverProperties: any[];
}

const Index = ({ serverFeedbacks, serverProperties }: HomeProps) => {
  const { commonStore, propertyStore } = useStore();

  // Initialize store with server-side data and ensure no loading state
  useEffect(() => {
    if (serverFeedbacks && serverFeedbacks.length > 0) {
      commonStore.setSSRFeedbacks(serverFeedbacks as []);
    }

    if (serverProperties && serverProperties.length > 0) {
      propertyStore.setSSRProperties(serverProperties);
    }
  }, [serverFeedbacks, serverProperties]);

  return (
    <Wrapper>
      <HomeSix />
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
