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

const formatYesNo = (value: unknown): string => {
  if (value === true || value === "1" || value === "true") return "Yes";
  if (value === false || value === "0" || value === "false") return "No";
  return "—";
};

const CommonPropertyOverview = ({ property, extendedData }: any) => {
  const { description } = property;
  const { t } = useTranslation("translations");

  const amenityIds = parseAmenityIds(extendedData?.amenities ?? property.amenities);
  const amenityLabels = amenityIds
    .map((id) => getTranslatedEnum(t, getAmenityLabelKey(id), getAmenityLabel(id)))
    .filter(Boolean);

  const sharedSpaceRaw = extendedData?.shared_space ?? extendedData?.sharedSpace ?? property.shared_space;
  const sharedSpaceIds: number[] = Array.isArray(sharedSpaceRaw)
    ? (sharedSpaceRaw as number[])
    : typeof sharedSpaceRaw === "string"
      ? sharedSpaceRaw.split(",").map((s: string) => parseInt(s.trim(), 10)).filter((n: number) => !Number.isNaN(n))
      : [];
  const sharedSpaceLabels = sharedSpaceIds
    .map((id) => getTranslatedEnum(t, getSharedSpaceLabelKey(id), getSharedSpaceLabel(id)))
    .filter(Boolean);

  const infoItems = [
    {
      id: "type",
      icon: `${ICONS_BASE}/building.svg`,
      title: t("property.type") || "Type",
      content: translatedPropertyTypeLabel(t, extendedData?.type ?? extendedData?.property_type ?? property.type),
    },
    {
      id: "furnished",
      icon: `${ICONS_BASE}/furniture.svg`,
      title: t("property.furnished_type") || "Furnished",
      content: translatedFurnishedTypeLabel(t, extendedData?.furnished_type ?? extendedData?.furnishedType ?? property.furnished_type),
    },
    {
      id: "period",
      icon: `${ICONS_BASE}/calendar.svg`,
      title: t("property.free_from_period") || "Available From",
      content: description.period ?? "",
    },
    {
      id: "bills",
      icon: `${ICONS_BASE}/bills.svg`,
      title: t("property.bills") || "Bills",
      content: description.bills ?? "",
    },
    {
      id: "registration",
      icon: `${ICONS_BASE}/registration.svg`,
      title: t("property.registration") || "Registration",
      content: formatYesNo(extendedData?.registration ?? property.registration),
    },
    {
      id: "pets",
      icon: `${ICONS_BASE}/pets.svg`,
      title: t("property.pets_allowed") || "Pets Allowed",
      content: formatYesNo(extendedData?.pets_allowed ?? extendedData?.petsAllowed ?? property.pets_allowed),
    },
    {
      id: "flatmates",
      icon: `${ICONS_BASE}/flatmates.svg`,
      title: t("property.flatmates") || "Flatmates",
      content: description.flatmates ?? "",
    },
    {
      id: "bathrooms",
      icon: `${ICONS_BASE}/bath.svg`,
      title: t("property.bathrooms") || "Bathrooms",
      content: property.bathrooms != null ? String(property.bathrooms) : "",
    },
    {
      id: "toilets",
      icon: `${ICONS_BASE}/toilet.svg`,
      title: t("property.toilets") || "Toilets",
      content: property.toilets != null ? String(property.toilets) : "",
    },
  ].filter((item) => item.content && item.content !== "" && item.content !== "—");

  const hasBadges = amenityLabels.length > 0 || sharedSpaceLabels.length > 0;

  return (
    <>
      {infoItems.length > 0 && (
        <div className="row g-3 mb-30">
          {infoItems.map((item) => (
            <div className="col-md-6 col-12" key={item.id}>
              <div className="bg-light d-flex align-items-center gap-3 p-15 shadow4 border-10">
                <Image
                  width={30}
                  height={30}
                  src={item.icon}
                  alt=""
                  className="lazy-img flex-shrink-0"
                />
                <div>
                  <div className="fs-14 color-dark" style={{ opacity: 0.55 }}>
                    {item.title}
                  </div>
                  <div className="fs-16 fw-500 color-dark">
                    {capitalizeFirstLetter(item.content)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="row">
        {amenityLabels.length > 0 && (
          <div className="mb-30 col-md-6 col-12">
            <div className="fs-16 fw-500 color-dark mb-15">
              {t("property.amenities") || "Amenities"}
            </div>
            <div className="d-flex flex-wrap gap-2">
              {amenityLabels.map((label, i) => (
                <span
                  key={i}
                  className="d-inline-flex align-items-center bg-light border-10 p-15 fs-14 fw-500 color-dark"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {sharedSpaceLabels.length > 0 && (
          <div className="mb-30 col-md-6 col-12">
            <div className="fs-16 fw-500 color-dark mb-15">
              {t("property.shared_space") || "Shared Spaces"}
            </div>
            <div className="d-flex flex-wrap gap-2">
              {sharedSpaceLabels.map((label, i) => (
                <span
                  key={i}
                  className="d-inline-flex align-items-center bg-light border-10 p-15 fs-14 fw-500 color-dark"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {property.description.property && (
        <>
          {(infoItems.length > 0 || hasBadges) && <hr />}
          <div className="mt-20">
            <p className="fs-20 lh-lg color-dark m0">
              {property.description.property}
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default CommonPropertyOverview;
