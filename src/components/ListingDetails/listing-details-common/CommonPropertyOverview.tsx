import Image, { StaticImageData } from "next/image";

import icon_1 from "@/assets/images/icon/icon_47.svg";
import icon_2 from "@/assets/images/icon/icon_55.svg";
import icon_3 from "@/assets/images/icon/icon_45.svg";
import icon_4 from "@/assets/images/icon/icon_50.svg";
import icon_5 from "@/assets/images/icon/icon_44.svg";
import useTranslation from "next-translate/useTranslation";
import { capitalizeFirstLetters } from "@/utils/helpers";

interface DataType {
  id: number;
  icon: StaticImageData;
  title?: string;
  content: string;
}
[];

const CommonPropertyOverview = ({ property }: any) => {
  const { description } = property;

  const { t } = useTranslation("translations");

  const property_overview_data: DataType[] = [
    //  {
    //    id: 1,
    //    icon: icon_1,
    //    title: t("property.size"),
    //    content: description.size ?? '',
    //  },
    {
      id: 2,
      icon: icon_2,
      title: t("property.free_from_period"),
      content: description.period ?? "",
    },
    {
      id: 3,
      icon: icon_3,
      title: t("property.bills"),
      content: description.bills ?? "",
    },
    {
      id: 5,
      icon: icon_5,
      title: t("property.flatmates"),
      content: description.flatmates ?? "",
    },
  ];

  const itemCount = property_overview_data.length;

  return (
    <div className="row">
      {property_overview_data.map((item) => (
        <div
          className={`mb-10 col-lg-4 col-md-6 col-12`}
          key={item.id}
        >
          <Image
            height={30}
            src={item.icon}
            alt=""
            className="m-a lazy-img icon w-10"
          />
          <div className="d-flex align-items-center justify-content-center gap-3 mt-10">
            {item.title && (
              <span className="fs-20 color-dark fw-bold">{item.title}</span>
            )}
          </div>
          <span className="d-flex align-items-center justify-content-center fs-20 color-dark">
            {capitalizeFirstLetters(item.content)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CommonPropertyOverview;
