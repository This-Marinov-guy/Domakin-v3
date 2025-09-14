import AboutUsOne from "@/components/inner-pages/about-us/about-us-one";
import Wrapper from "@/layouts/Wrapper";
import { GetServerSideProps } from "next";
import { fetchFeedbacks } from "@/services/api";
import { useStore } from "@/stores/storeContext";
import { useEffect } from "react";

export const metadata = {
  title: "About Us",
};

interface AboutProps {
  serverFeedbacks: any[];
}

const index = ({ serverFeedbacks }: AboutProps) => {
  const { commonStore } = useStore();

  // Initialize store with server-side data
  useEffect(() => {
    if (serverFeedbacks && serverFeedbacks.length > 0) {
      commonStore.setSSRFeedbacks(serverFeedbacks as []);
    }
  }, [serverFeedbacks, commonStore]);

  return (
    <Wrapper>
      <AboutUsOne />
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lang = context.locale || "en";
  const feedbacks = await fetchFeedbacks(lang);

  return {
    props: {
      serverFeedbacks: feedbacks,
    },
  };
};

export default index;
