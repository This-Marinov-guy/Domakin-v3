import AboutUsOne from "@/components/inner-pages/about-us/about-us-one";
import Wrapper from "@/layouts/Wrapper";
import { GetServerSideProps } from "next";
import { fetchFeedbacks } from "@/services/api";

export const metadata = {
  title: "About Us",
};

interface AboutProps {
  serverFeedbacks: any[];
}

const index = ({ serverFeedbacks }: AboutProps) => {
  return (
    <Wrapper>
      <AboutUsOne serverFeedbacks={serverFeedbacks} />
    </Wrapper>
  );
};

const stripUndefined = (value: any): any => JSON.parse(JSON.stringify(value ?? null));

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lang = context.locale || "en";
  const feedbacks = await fetchFeedbacks(lang);

  return {
    props: {
      serverFeedbacks: stripUndefined(feedbacks),
    },
  };
};

export default index;
