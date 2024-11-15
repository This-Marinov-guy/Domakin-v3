import { useState } from "react";
import properties from "@/data/inner-data/ListingData";

const PROPERTIES_DATA = properties;

const UseProperty = () => {
  const [properties, setProperties] = useState(PROPERTIES_DATA);
  return {
    properties,
    setProperties,
  };
};
export default UseProperty;
