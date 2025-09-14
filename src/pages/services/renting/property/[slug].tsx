import PropertyDetailsOne from "@/components/inner-pages/services/detail-page/PropertyDetailsOne";
import Wrapper from "@/layouts/Wrapper";
import { GetServerSideProps } from "next";
import { fetchProperties } from "@/services/api";
import { useStore } from "@/stores/storeContext";
import { useEffect } from "react";

interface PropertyDetailsProps {
  serverProperties: any[];
}

const index = ({ serverProperties }: PropertyDetailsProps) => {
  const { propertyStore } = useStore();

  // Initialize store with server-side data
  useEffect(() => {
    if (serverProperties && serverProperties.length > 0) {
      propertyStore.setSSRProperties(serverProperties);
    }
  }, [serverProperties, propertyStore]);

  return (
    <Wrapper>
      <PropertyDetailsOne />
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lang = context.locale || "en";
  const properties = await fetchProperties(lang);

  return {
    props: {
      serverProperties: properties,
    },
  };
};

export default index;
