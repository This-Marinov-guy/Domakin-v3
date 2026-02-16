import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { capitalizeFirstLetter } from "@/utils/helpers";
import {
  getAmenityLabel,
  getAmenityLabelKey,
  getFurnishedTypeLabel,
  getFurnishedTypeLabelKey,
  getPropertyTypeLabel,
  getPropertyTypeLabelKey,
  getSharedSpaceLabel,
  getSharedSpaceLabelKey,
  getTranslatedEnum,
} from "@/utils/defines";

const ICONS_BASE = "/assets/img/icons";

interface DataType {
  id: number;
  icon: string;
  title?: string;
  content: string;
}

const translatedPropertyTypeLabel = (
  t: (k: string) => string,
  value: number | string | undefined
) => {
  if (value == null || value === "") return "—";
  const v = Number(value);
  return getTranslatedEnum(t, getPropertyTypeLabelKey(v), getPropertyTypeLabel(v));
};

const translatedFurnishedTypeLabel = (
  t: (k: string) => string,
  value: number | string | undefined
) => {
  if (value == null || value === "") return "—";
  const v = Number(value);
  return getTranslatedEnum(t, getFurnishedTypeLabelKey(v), getFurnishedTypeLabel(v));
};

const parseAmenityIds = (amenities: unknown): number[] => {
  if (amenities == null) return [];
  if (Array.isArray(amenities)) return (amenities as number[]).map(Number).filter((n) => !Number.isNaN(n));
  if (typeof amenities === "string") {
    const trimmed = amenities.replace(/^\[|\]$/g, "").trim();
    if (!trimmed) return [];
    return trimmed
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n));
  }
  return [];
};

const translatedAmenitiesLabel = (t: (k: string) => string, amenities: unknown): string => {
  const arr = parseAmenityIds(amenities);
  if (arr.length === 0) return "—";
  return arr
    .map((id) => getTranslatedEnum(t, getAmenityLabelKey(id), getAmenityLabel(id)))
    .filter(Boolean)
    .join(", ");
};

const translatedSharedSpaceLabel = (t: (k: string) => string, value: unknown): string => {
  if (value == null) return "—";
  const arr: number[] = Array.isArray(value)
    ? (value as number[])
    : typeof value === "string"
      ? value.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !Number.isNaN(n))
      : [];
  if (arr.length === 0) return "—";
  return arr
    .map((id) => getTranslatedEnum(t, getSharedSpaceLabelKey(id), getSharedSpaceLabel(id)))
    .filter(Boolean)
    .join(", ");
};

const formatYesNo = (value: unknown): string => {
  if (value === true || value === "1" || value === "true") return "Yes";
  if (value === false || value === "0" || value === "false") return "No";
  return "—";
};

const CommonPropertyOverview = ({ property, extendedData }: any) => {
  const { description } = property;

  const { t } = useTranslation("translations");

  const property_overview_data: DataType[] = [
    {
      id: 2,
      icon: `${ICONS_BASE}/calendar.svg`,
      title: t("property.free_from_period"),
      content: description.period ?? "",
    },
    {
      id: 3,
      icon: `${ICONS_BASE}/bills.svg`,
      title: t("property.bills"),
      content: description.bills ?? "",
    },
    {
      id: 5,
      icon: `${ICONS_BASE}/flatmates.svg`,
      title: t("property.flatmates"),
      content: description.flatmates ?? "",
    },
    {
      id: 6,
      icon: `${ICONS_BASE}/building.svg`,
      title: t("property.type") || "Type",
      content: translatedPropertyTypeLabel(t, extendedData?.type ?? extendedData?.property_type ?? property.type),
    },
    {
      id: 7,
      icon: `${ICONS_BASE}/furniture.svg`,
      title: t("property.furnished_type") || "Furnished type",
      content: translatedFurnishedTypeLabel(t, extendedData?.furnished_type ?? extendedData?.furnishedType ?? property.furnished_type),
    },
    {
      id: 8,
      icon: `${ICONS_BASE}/amenties.svg`,
      title: t("property.amenities") || "Amenities",
      content: translatedAmenitiesLabel(t, extendedData?.amenities ?? property.amenities ?? property.amenities),
    },
    {
      id: 9,
      icon: `${ICONS_BASE}/registration.svg`,
      title: t("property.registration") || "Registration",
      content: formatYesNo(extendedData?.registration ?? property.registration),
    },
    {
      id: 10,
      icon: `${ICONS_BASE}/shared.svg`,
      title: t("property.shared_space") || "Shared space",
      content: translatedSharedSpaceLabel(t, extendedData?.shared_space ?? extendedData?.sharedSpace ?? property.shared_space),
    },
    {
      id: 11,
      icon: `${ICONS_BASE}/pets.svg`,
      title: t("property.pets_allowed") || "Pets allowed",
      content: formatYesNo(extendedData?.pets_allowed ?? extendedData?.petsAllowed ?? property.pets_allowed),
    },
  ];

  const itemCount = property_overview_data.length;

  return (
    <>
      <div className="row">
        {property_overview_data.map((item) => {
          if (item.content === "") return null;

          return (
            <div className={`mb-30 col-lg-4 col-md-6 col-12`} key={item.id}>
              <Image
                width={30}
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
          )
        })}
      </div>
      {extendedData && (
        <div className="mt-20 row border-top pt-20">
          <div className="col-12">
            <ul className="style-none d-flex flex-wrap gap-3 gap-lg-4 mb-0 fs-6">
              <li className="d-flex align-items-center gap-2">
                <span className="fw-bold color-dark">{t("property.type") || "Type"}:</span>
                <span>{translatedPropertyTypeLabel(t, extendedData.type ?? extendedData.property_type)}</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <span className="fw-bold color-dark">{t("property.furnished_type") || "Furnished"}:</span>
                <span>{translatedFurnishedTypeLabel(t, extendedData.furnished_type ?? extendedData.furnishedType)}</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <span className="fw-bold color-dark">{t("property.amenities") || "Amenities"}:</span>
                <span>{translatedAmenitiesLabel(t, extendedData.amenities ?? description.amenities)}</span>
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
      <hr />
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
