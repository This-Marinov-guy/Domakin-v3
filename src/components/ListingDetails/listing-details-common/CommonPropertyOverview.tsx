import Image, { StaticImageData } from "next/image";

import icon_1 from "@/assets/images/icon/icon_47.svg";
import icon_2 from "@/assets/images/icon/icon_55.svg";
import icon_3 from "@/assets/images/icon/icon_45.svg";
import icon_4 from "@/assets/images/icon/icon_50.svg";
import icon_5 from "@/assets/images/icon/icon_44.svg";
import useTranslation from "next-translate/useTranslation";
import { capitalizeFirstLetter } from "@/utils/helpers";
import { FURNISHED_TYPES, getAmenityLabel, PROPERTY_TYPES } from "@/utils/defines";

interface DataType {
  id: number;
  icon: StaticImageData;
  title?: string;
  content: string;
}
[];

const propertyTypeLabel = (value: number | string | undefined) => {
  if (value == null || value === "") return "—";
  const v = Number(value);
  return PROPERTY_TYPES.find((o) => o.value === v)?.text ?? String(value);
};

const furnishedTypeLabel = (value: number | string | undefined) => {
  if (value == null || value === "") return "—";
  const v = Number(value);
  return FURNISHED_TYPES.find((o) => o.value === v)?.text ?? String(value);
};

const amenitiesLabel = (amenities: unknown): string => {
  if (amenities == null) return "—";
  const arr: number[] = Array.isArray(amenities)
    ? (amenities as number[])
    : typeof amenities === "string"
      ? amenities.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !Number.isNaN(n))
      : [];
  if (arr.length === 0) return "—";
  return arr.map((id) => getAmenityLabel(id)).filter(Boolean).join(", ");
};

const CommonPropertyOverview = ({ property, extendedData }: any) => {
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
    <>
      <div className="row">
        {property_overview_data.map((item) => (
          <div className={`mb-10 col-lg-4 col-md-6 col-12`} key={item.id}>
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
            <span className="d-flex text-center align-items-center justify-content-center fs-20 color-dark">
              {capitalizeFirstLetter(item.content)}
            </span>
          </div>
        ))}
      </div>
      {extendedData && (
        <div className="mt-20 row border-top pt-20">
          <div className="col-12">
            <ul className="style-none d-flex flex-wrap gap-3 gap-lg-4 mb-0 fs-6">
              <li className="d-flex align-items-center gap-2">
                <span className="fw-bold color-dark">{t("property.type") || "Type"}:</span>
                <span>{propertyTypeLabel(extendedData.type ?? extendedData.property_type)}</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <span className="fw-bold color-dark">{t("property.furnished_type") || "Furnished"}:</span>
                <span>{furnishedTypeLabel(extendedData.furnished_type ?? extendedData.furnishedType)}</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <span className="fw-bold color-dark">{t("property.amenities") || "Amenities"}:</span>
                <span>{amenitiesLabel(extendedData.amenities)}</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <span className="fw-bold color-dark">{t("property.toilets") || "Toilets"}:</span>
                <span>{extendedData.toilets != null && extendedData.toilets !== "" ? String(extendedData.toilets) : "—"}</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <span className="fw-bold color-dark">{t("property.bathrooms") || "Bathrooms"}:</span>
                <span>{extendedData.bathrooms != null && extendedData.bathrooms !== "" ? String(extendedData.bathrooms) : "—"}</span>
              </li>
            </ul>
          </div>
        </div>
      )}
      {property.description.property && (
        <div className="mt-20 row">
          <div className="text-center col-lg-12 col-md-12 col-12">
            {property.description.property}
          </div>
        </div>
      )}
    </>
  );
};

export default CommonPropertyOverview;
