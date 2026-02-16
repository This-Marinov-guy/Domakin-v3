import { formatJsonKeyValuePairs } from "@/utils/helpers";
import React from "react";
import Modal from "react-bootstrap/Modal";
import { FURNISHED_TYPES, getAmenityLabel, PROPERTY_TYPES } from "@/utils/defines";

const propertyTypeLabel = (value: number | string | undefined) => {
  if (value == null || value === "") return "-";
  const v = Number(value);
  return PROPERTY_TYPES.find((o) => o.value === v)?.text ?? String(value);
};

const furnishedTypeLabel = (value: number | string | undefined) => {
  if (value == null || value === "") return "-";
  const v = Number(value);
  return FURNISHED_TYPES.find((o) => o.value === v)?.text ?? String(value);
};

const formatDateDDMMYYYY = (value: string | number | undefined): string => {
  if (value == null || value === "") return "-";
  const d = typeof value === "number" ? new Date(value) : new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatYesNo = (value: unknown): string => {
  if (value === true || value === "1" || value === "true") return "Yes";
  if (value === false || value === "0" || value === "false") return "No";
  return "-";
};

const formatFlatmatesWithGender = (flatmates: unknown): string => {
  if (flatmates == null) return "-";
  let entries: string[] = [];
  if (Array.isArray(flatmates)) {
    entries = flatmates.map((e) => (typeof e === "string" ? e : String(e ?? "")));
  } else if (typeof flatmates === "string") {
    try {
      const parsed = JSON.parse(flatmates);
      if (typeof parsed === "object" && parsed !== null) {
        entries = Object.values(parsed).map((v) => String(v ?? ""));
      } else {
        entries = [String(parsed)];
      }
    } catch {
      entries = [flatmates];
    }
  } else {
    entries = [String(flatmates)];
  }
  const labels = ["Male", "Female"];
  return entries
    .filter(Boolean)
    .map((text, i) => `${i + 1}. ${labels[i] ?? i + 1}: ${text}`)
    .join(" | ") || "-";
};

const amenitiesLabel = (amenities: unknown): string => {
  if (amenities == null) return "-";
  const arr: number[] = Array.isArray(amenities)
    ? (amenities as number[])
    : typeof amenities === "string"
      ? amenities.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !Number.isNaN(n))
      : [];
  if (arr.length === 0) return "-";
  return arr.map((id) => getAmenityLabel(id)).filter(Boolean).join(", ");
};

const PropertyDataPreview = ({ onHide, data }: any) => {
  const typeVal = data?.type ?? data?.property_type;
  const furnishedVal = data?.furnishedType ?? data?.furnished_type;
  const availableFrom = data?.availableFrom ?? data?.available_from;
  const availableTo = data?.availableTo ?? data?.available_to;
  const petsAllowed = data?.petsAllowed ?? data?.pets_allowed;
  const smokingAllowed = data?.smokingAllowed ?? data?.smoking_allowed;

  return (
    <Modal show={!!data} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <h6>Details</h6>
      </Modal.Header>

      <Modal.Body>
        <h6>Personal Details</h6>
        <ul>
          <li>Name: {(data?.name ?? "-") + " " + (data?.surname ?? "-")}</li>
          <li>Phone: {data?.phone ?? "-"}</li>
          <li>Email: {data?.email ?? "-"}</li>
        </ul>

        <h6>Property Details</h6>
        <ul>
          <li>Title: {formatJsonKeyValuePairs(data?.title, ["en"])}</li>
          <li>Property type: {propertyTypeLabel(typeVal)}</li>
          <li>City: {data?.city ?? "-"}</li>
          <li>Address: {data?.address ?? "-"}</li>
          <li>Postcode: {data?.postcode ?? "-"}</li>
          <li>Size: {data?.size ?? "-"}</li>
          <li>Rent: {data?.rent ?? "-"}</li>
          <li>Registration: {formatYesNo(data?.registration)}</li>
          <li>Bathrooms: {data?.bathrooms ?? "-"}</li>
          <li>Toilets: {data?.toilets ?? "-"}</li>
          <li>Furnished: {furnishedTypeLabel(furnishedVal)}</li>
          <li>Amenities: {amenitiesLabel(data?.amenities)}</li>
          <li>Available from: {formatDateDDMMYYYY(availableFrom)}</li>
          <li>Available to: {formatDateDDMMYYYY(availableTo)}</li>
          <li>Pets allowed: {formatYesNo(petsAllowed)}</li>
          <li>Smoking allowed: {formatYesNo(smokingAllowed)}</li>
          <li>Bills: {formatJsonKeyValuePairs(data?.bills, ["en"])}</li>
          <li>Flatmates: {formatFlatmatesWithGender(data?.flatmates)}</li>
          <li>Period: {formatJsonKeyValuePairs(data?.period, ["en"])}</li>
          <li>Description: {formatJsonKeyValuePairs(data?.description, ["en"])}</li>
        </ul>

        <div className="row">
          {data?.images?.length > 0 &&
            data.images.map((image: string, index: number) => (
              <div
                key={index}
                className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4"
              >
                <img
                  src={image}
                  alt={`Property Image ${index + 1}`}
                  width={200}
                  height={200}
                  className="img-fluid rounded border"
                />
              </div>
            ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PropertyDataPreview;
