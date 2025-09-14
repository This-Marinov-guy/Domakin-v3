import PropertiesPage from "@/components/inner-pages/services/detail-page/PropertiesPage";
import Wrapper from "@/layouts/Wrapper";
import { GetServerSideProps } from "next";
import { fetchProperties } from "@/services/api";
import { useStore } from "@/stores/storeContext";
import { useEffect } from "react";

interface PropertiesIndexProps {
  serverProperties: any[];
}

const index = ({ serverProperties }: PropertiesIndexProps) => {
  const { propertyStore } = useStore();

  // Initialize store with server-side data
  useEffect(() => {
    if (serverProperties && serverProperties.length > 0) {
      propertyStore.setSSRProperties(serverProperties);
    }
  }, [serverProperties, propertyStore]);

  return (
    <Wrapper>
      <PropertiesPage />
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
