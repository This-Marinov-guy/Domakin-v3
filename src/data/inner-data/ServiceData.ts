import { StaticImageData } from "next/image";

import serviceIcon_1 from "@/assets/images/icon/icon_69.svg";
import serviceIcon_2 from "@/assets/images/icon/icon_70.svg";
import serviceIcon_3 from "@/assets/images/icon/icon_71.svg";

interface DataType {
  id: number;
  page: string;
  icon: StaticImageData | string;
  iconWidth?: number;
  iconHeight?: number;
  title: string;
  desc: string;
  data_delay_time?: string;
  btn?: string;
  link: string;
}
[];

const service_data: DataType[] = [
  {
    id: 1,
    page: "service_1",
    icon: "/assets/img/icons/10.png",
    title: "features.viewings",
    desc: "features.agents_service",
    link: "/services/viewing",
  },
  {
    id: 2,
    page: "service_1",
    icon: "/assets/img/icons/11.png",
    title: "features.rent_an_apartment",
    desc: "features.property_inquiry",
    link: "/services/renting",
  },
  {
    id: 3,
    page: "service_1",
    icon: "/assets/img/icons/12.png",
    title: "features.list_a_room",
    desc: "features.search_for_new_flatmate_or_transfer_contract",
    link: "/services/add-listing",
  },
  // {
  //   id: 4,
  //   iconHeight: 100,
  //   iconWidth: 100,
  //   page: "service_1",
  //   icon: "/assets/img/icons/icon-img/8.png",
  //   title: "features.emergency_housing",
  //   desc: "features.emergency_housing_description",
  //   link: "/services/emergency-housing",
  // },
];

export default service_data;
