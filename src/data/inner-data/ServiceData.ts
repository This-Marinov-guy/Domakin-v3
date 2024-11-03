import { StaticImageData } from "next/image";

import serviceIcon_1 from "@/assets/images/icon/icon_69.svg";
import serviceIcon_2 from "@/assets/images/icon/icon_70.svg";
import serviceIcon_3 from "@/assets/images/icon/icon_71.svg";

interface DataType {
  id: number;
  page: string;
  icon: StaticImageData|string;
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
    icon: "/assets/img/icons/icon-img/22.png",
    title: "features.viewings",
    desc: "features.agents_service",
    link: "/services/viewing",
  },
  {
    id: 1,
    page: "service_1",
    icon: "/assets/img/icons/icon-img/22.png",
    title: "features.viewings",
    desc: "features.agents_service",
    link: "/services/viewing",
  },
  {
    id: 1,
    page: "service_1",
    icon: "/assets/img/icons/icon-img/22.png",
    title: "features.viewings",
    desc: "features.agents_service",
    link: "/services/viewing",
  },
  {
    id: 1,
    page: "service_1",
    icon: "/assets/img/icons/icon-img/22.png",
    title: "features.viewings",
    desc: "features.agents_service",
    link: "/services/viewing",
  },
];

export default service_data;
