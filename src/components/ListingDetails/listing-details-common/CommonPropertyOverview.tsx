import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { capitalizeFirstLetter } from "@/utils/helpers";
import {
  AMENITY_OPTIONS,
  getAmenityLabel,
  getAmenityLabelKey,
  getFurnishedTypeLabel,
  getFurnishedTypeLabelKey,
  getPropertyTypeLabel,
  getPropertyTypeLabelKey,
  SHARED_SPACE_OPTIONS,
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

const parseSharedSpaceIds = (value: unknown): number[] => {
  if (value == null) return [];
  if (Array.isArray(value)) return (value as number[]).map(Number).filter((n) => !Number.isNaN(n));
  if (typeof value === "string") {
    const trimmed = value.replace(/^\[|\]$/g, "").trim();
    if (!trimmed) return [];
    return trimmed
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n));
  }
  return [];
};

const formatYesNo = (t: (k: string) => string, value: unknown): string => {
  if (value === true || value === "1" || value === "true") return t("common.yes");
  if (value === false || value === "0" || value === "false") return t("common.no");
  return "—";
};

const CommonPropertyOverview = ({ property, extendedData }: any) => {
  const { description } = property;
  const { t } = useTranslation("translations");

  const amenityIds = parseAmenityIds(extendedData?.amenities ?? property.amenities ?? description.amenities);
  const amenityIdsSet = new Set(amenityIds);

  const sharedSpaceIds = parseSharedSpaceIds(
    extendedData?.shared_space ?? extendedData?.sharedSpace ?? property.shared_space ?? description.shared_space
  );
  const sharedSpaceIdsSet = new Set(sharedSpaceIds);

  const infoItems = [
    {
      id: "type",
      icon: `${ICONS_BASE}/building.svg`,
      title: t("property.type") || "Type",
      content: translatedPropertyTypeLabel(t, extendedData?.type ?? extendedData?.property_type ?? property.type),
    },
    {
      id: "size",
      icon: `${ICONS_BASE}/size.svg`,
      title: t("emergency_housing.size") || "Size",
      content: property.size ? property.size + ' m²' : '',
    },
    {
      id: "furnished",
      icon: `${ICONS_BASE}/furniture.svg`,
      title: t("property.furnished_type") || "Furnished",
      content: translatedFurnishedTypeLabel(t, extendedData?.furnished_type ?? extendedData?.furnishedType ?? property.furnished_type),
    },
    // {
    //   id: "rent",
    //   icon: `${ICONS_BASE}/rent.svg`,
    //   title: t("property.rent") || "Rent",
    //   content: property.rent != null && property.rent !== "" ? `${property.rent} €/m` : "",
    // },
    {
      id: "bills",
      icon: `${ICONS_BASE}/bills.svg`,
      title: t("property.bills") || "Bills",
      content: (() => {
        const hasBills = !!description.bills;
        const hasDeposit = !!property.deposit;
        const parts: string[] = [];

        if (hasBills) parts.push((t("property.bills_label") || "Bills") + ": " + description.bills + "€");
        if (hasDeposit) parts.push((t("property.deposit_label") || "Deposit") + ": " + property.deposit + "€");
        return parts.length > 0 ? parts.join(" | ") : "—";
      })(),
    },
    {
      id: "period",
      icon: `${ICONS_BASE}/calendar.svg`,
      title: t("property.free_from_period") || "Available From",
      content: description.period ?? "",
    },

    {
      id: "registration",
      icon: `${ICONS_BASE}/registration.svg`,
      title: t("property.registration") || "Registration",
      content: formatYesNo(t, extendedData?.registration ?? property.registration),
    },
    {
      id: "pets",
      icon: `${ICONS_BASE}/pets.svg`,
      title: t("property.pets_allowed") || "Pets Allowed",
      content: formatYesNo(t, extendedData?.pets_allowed ?? extendedData?.petsAllowed ?? property.pets_allowed),
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

  const showAmenitiesCol = AMENITY_OPTIONS.length > 0 && amenityIdsSet.size > 0;
  const showSharedSpaceCol = SHARED_SPACE_OPTIONS.length > 0 && sharedSpaceIdsSet.size > 0;
  const hasAmenitiesOrSharedSpace = showAmenitiesCol || showSharedSpaceCol;

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
        {showAmenitiesCol && (
          <div className="mb-30 col-md-6 col-12">
            <div className="fs-16 fw-500 color-dark mb-15">
              {t("property.amenities") || "Amenities"}
            </div>
            <div className="d-flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map(({ id }) => {
                const label = getTranslatedEnum(t, getAmenityLabelKey(id), getAmenityLabel(id));
                const available = amenityIdsSet.has(id);
                return (
                  <span
                    key={id}
                    className={`d-inline-flex align-items-center border-10 p-15 fs-14 fw-500 ${available
                      ? "bg-blue text-white"
                      : "bg-light opacity-50 text-muted"
                      }`}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {showSharedSpaceCol && (
          <div className="mb-30 col-md-6 col-12">
            <div className="fs-16 fw-500 color-dark mb-15">
              {t("property.shared_space") || "Shared space"}
            </div>
            <div className="d-flex flex-wrap gap-2">
              {SHARED_SPACE_OPTIONS.map(({ id }) => {
                const label = getTranslatedEnum(t, getSharedSpaceLabelKey(id), getSharedSpaceLabel(id));
                const available = sharedSpaceIdsSet.has(id);
                return (
                  <span
                    key={id}
                    className={`d-inline-flex align-items-center border-10 p-15 fs-14 fw-500 ${available
                      ? "bg-blue text-white"
                      : "bg-light opacity-50 text-muted"
                      }`}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {property.description.property && (
        <>
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
