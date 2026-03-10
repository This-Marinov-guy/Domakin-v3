"use client";

import React from "react";
import Modal from "react-bootstrap/Modal";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import { APPLICATION_PREVIEW_MODAL } from "@/utils/defines";
import { APPLICATION_STATUSES } from "@/utils/defines";
import moment from "moment";
import useTranslation from "next-translate/useTranslation";
import { formatJsonKeyValuePairs } from "@/utils/helpers";
import {
  getAmenityLabel,
  getAmenityLabelKey,
  getSharedSpaceLabel,
  getSharedSpaceLabelKey,
  getTranslatedEnum,
} from "@/utils/defines";

const FIELD_LABELS: Record<string, string> = {
  id: "ID",
  created_at: "Application date",
  updated_at: "Updated at",
  name: "Name",
  surname: "Surname",
  phone: "Phone",
  email: "Email",
  letter: "Letter",
  note: "Note",
  referral_code: "Referral code",
  referral_code_status: "Referral code status",
  status: "Status",
  internal_note: "Internal note",
  step: "Step",
  current_step: "Current step",
  property_id: "Property ID",
  property_title: "Property title",
  property_url: "Property URL",
  property_data: "Property data",
  reference_id: "Reference ID",
  location: "Location",
  deposit: "Deposit in euro (€)",
};

const PREFERRED_ORDER = [
  "id",
  "created_at",
  "name",
  "surname",
  "phone",
  "email",
  "letter",
  "note",
  "referral_code",
  "referral_code_status",
  "status",
  "internal_note",
  "step",
  "current_step",
  "reference_id",
  "property_id",
  "property_title",
  "property_url",
  "location",
  "deposit",
  "property_data",
];

const formatKeyLabel = (key: string) =>
  FIELD_LABELS[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const ApplicationPreviewModal = () => {
  const { t } = useTranslation("translations");
  const { modalStore } = useStore();
  const isOpen = modalStore.modals[APPLICATION_PREVIEW_MODAL];
  const entry = modalStore.modalSettings?.entry as Record<string, unknown> | undefined;

  const handleClose = () => modalStore.closeAll();

  if (!isOpen) return null;

  const statusValue = entry?.status != null ? Number(entry.status) : null;
  const statusText =
    statusValue != null
      ? APPLICATION_STATUSES.find((s) => s.value === statusValue)?.text ?? String(statusValue)
      : "—";

  const renderImages = (images: string[]): React.ReactNode => (
    <div className="d-flex flex-wrap gap-2 mt-1">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Image ${i + 1}`}
          style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 4, border: "1px solid #dee2e6" }}
        />
      ))}
    </div>
  );

  const toDisplayText = (key: string, val: unknown): React.ReactNode => {
    if (val == null || val === "") return null;
    if (key === "created_at" || key === "updated_at") return moment(String(val)).format("DD-MM-YYYY HH:mm");
    if (key === "property_id") {
      const n = Number(val);
      if (Number.isFinite(n)) return String(n + 1000);
      return String(val);
    }
    if (key === "letter") {
      const url = String(val);
      if (/^https?:\/\//i.test(url))
        return (
          <a href={url} target="_blank" rel="noopener noreferrer">
            Open letter <i className="fas fa-external-link-alt ms-1 small" />
          </a>
        );
      return url;
    }
    if (key === "status") return statusText;
    if (key === "amenities" || key === "property_data.amenities") {
      const raw = val;
      let ids: number[] = [];
      if (Array.isArray(raw)) {
        ids = (raw as unknown[]).map((x) => Number(x)).filter((n) => !Number.isNaN(n));
      } else if (typeof raw === "string") {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            ids = (parsed as unknown[]).map((x) => Number(x)).filter((n) => !Number.isNaN(n));
          } else {
            ids = raw
              .split(",")
              .map((s) => parseInt(s.trim(), 10))
              .filter((n) => !Number.isNaN(n));
          }
        } catch {
          ids = raw
            .split(",")
            .map((s) => parseInt(s.trim(), 10))
            .filter((n) => !Number.isNaN(n));
        }
      }
      const labels = ids
        .map((id) => getTranslatedEnum(t, getAmenityLabelKey(id), getAmenityLabel(id)))
        .filter(Boolean);
      return labels.length ? labels.join(", ") : null;
    }
    if (key === "shared_space" || key === "property_data.shared_space") {
      const raw = val;
      let ids: number[] = [];
      if (Array.isArray(raw)) {
        ids = (raw as unknown[]).map((x) => Number(x)).filter((n) => !Number.isNaN(n));
      } else if (typeof raw === "string") {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            ids = (parsed as unknown[]).map((x) => Number(x)).filter((n) => !Number.isNaN(n));
          } else {
            ids = raw
              .split(",")
              .map((s) => parseInt(s.trim(), 10))
              .filter((n) => !Number.isNaN(n));
          }
        } catch {
          ids = raw
            .split(",")
            .map((s) => parseInt(s.trim(), 10))
            .filter((n) => !Number.isNaN(n));
        }
      }
      const labels = ids
        .map((id) => getTranslatedEnum(t, getSharedSpaceLabelKey(id), getSharedSpaceLabel(id)))
        .filter(Boolean);
      return labels.length ? labels.join(", ") : null;
    }
    if (key === "property_title") {
      if (typeof val === "object" && val !== null) {
        try {
          const str = typeof val === "string" ? val : JSON.stringify(val);
          return formatJsonKeyValuePairs(str, ["en"]) || null;
        } catch {
          return String(val);
        }
      }
      return String(val);
    }
    if (key === "images" || key === "property_data.images") {
      const arr = Array.isArray(val)
        ? (val as string[])
        : typeof val === "string"
        ? (() => { try { return JSON.parse(val) as string[]; } catch { return []; } })()
        : [];
      if (arr.length > 0) return renderImages(arr);
      return null;
    }
    if (key === "property_data") return null;
    if (key === "property_data.flatmates") {
      const raw = val;
      let male: number | null = null;
      let female: number | null = null;
      try {
        if (Array.isArray(raw)) {
          const arr = raw as unknown[];
          if (arr.length > 0) male = Number(arr[0]);
          if (arr.length > 1) female = Number(arr[1]);
        } else if (typeof raw === "string") {
          const trimmed = raw.trim();
          if (trimmed.startsWith("[")) {
            const arr = JSON.parse(trimmed) as unknown[];
            if (arr.length > 0) male = Number(arr[0]);
            if (arr.length > 1) female = Number(arr[1]);
          } else if (trimmed.startsWith("{")) {
            const obj = JSON.parse(trimmed) as { male?: unknown; female?: unknown };
            if (obj.male != null) male = Number(obj.male);
            if (obj.female != null) female = Number(obj.female);
          } else {
            const parts = trimmed.split(",").map((s) => s.trim());
            if (parts.length > 0) male = Number(parts[0]);
            if (parts.length > 1) female = Number(parts[1]);
          }
        } else if (typeof raw === "object" && raw !== null) {
          const obj = raw as { male?: unknown; female?: unknown };
          if (obj.male != null) male = Number(obj.male);
          if (obj.female != null) female = Number(obj.female);
        }
      } catch {
        // ignore parse errors
      }
      if (male == null && female == null) return null;
      const maleText = Number.isFinite(male as number) ? `${male} male` : "";
      const femaleText = Number.isFinite(female as number) ? `${female} female` : "";
      const parts = [maleText, femaleText].filter(Boolean);
      return parts.length ? parts.join(" / ") : null;
    }
    if (typeof val === "object" && val !== null) {
      if (Array.isArray(val)) return JSON.stringify(val);
      return JSON.stringify(val);
    }
    return String(val);
  };

  const allKeys = entry ? Object.keys(entry) : [];
  const orderedKeys = [
    ...PREFERRED_ORDER.filter((k) => allKeys.includes(k)),
    ...allKeys.filter((k) => !PREFERRED_ORDER.includes(k)).sort(),
  ];

  const rows: { key: string; label: string; value: React.ReactNode }[] = [];
  if (entry) {
    for (const key of orderedKeys) {
      const val = entry[key];
      if (key === "property_data") {
        const pd = val as Record<string, unknown> | null | undefined;
        if (pd && typeof pd === "object") {
          for (const [k, v] of Object.entries(pd)) {
            if (v === undefined || v === null) continue;
            const compositeKey = `property_data.${k}`;
            const display = toDisplayText(compositeKey, v) ?? (typeof v === "object" ? JSON.stringify(v) : String(v));
            rows.push({
              key: compositeKey,
              label: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
              value: display,
            });
          }
        }
        continue;
      }
      if (key === "amenities") {
        const arr = Array.isArray(val) ? (val as number[]) : [];
        const amenityLabels = arr
          .map((id) => getTranslatedEnum(t, getAmenityLabelKey(Number(id)), getAmenityLabel(Number(id))))
          .filter(Boolean);
        if (amenityLabels.length > 0) {
          rows.push({
            key: "amenities",
            label: "Amenities",
            value: amenityLabels.join(", "),
          });
        }
        continue;
      }
      const value = toDisplayText(key, val);
      if (value == null) continue;
      rows.push({
        key,
        label: formatKeyLabel(key),
        value,
      });
    }
  }

  // Grouped sections
  const metaKeys = new Set(["reference_id", "created_at", "updated_at", "step"]);
  const personalKeys = new Set(["name", "surname", "email", "phone", "referral_code"]);

  const metaOrder = ["reference_id", "created_at", "updated_at", "step"];
  const metaRows = metaOrder
    .map((k) => rows.find((r) => r.key === k))
    .filter((r): r is { key: string; label: string; value: React.ReactNode } => Boolean(r));
  const propertyRows = rows.filter((r) => !metaKeys.has(r.key) && !personalKeys.has(r.key));

  const fullName = `${(entry?.name as string | undefined) ?? ""} ${(entry?.surname as string | undefined) ?? ""}`.trim();
  const personalInfo = {
    name: fullName || null,
    email: (entry?.email as string | undefined) ?? null,
    phone: (entry?.phone as string | undefined) ?? null,
    referralCode: (entry?.referral_code as string | undefined) ?? null,
  };

  return (
    <Modal show={isOpen} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <h6>Application preview</h6>
      </Modal.Header>
      <Modal.Body>
        {!entry ? (
          <p className="text-muted">No application data.</p>
        ) : (
          <>
            {/* Reference & timestamps */}
            <h6 className="mb-2">Application info</h6>
            <table className="table table-sm table-borderless mb-3">
              <tbody>
                {metaRows.map(({ key, label, value }) => (
                  <tr key={key}>
                    <td className="text-muted small pe-2">{label}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Personal info */}
            <h6 className="mb-2">Personal info</h6>
            <table className="table table-sm table-borderless mb-3">
              <tbody>
                {personalInfo.name && (
                  <tr>
                    <td className="text-muted small pe-2">Name</td>
                    <td>{personalInfo.name}</td>
                  </tr>
                )}
                {personalInfo.email && (
                  <tr>
                    <td className="text-muted small pe-2">Email</td>
                    <td>{personalInfo.email}</td>
                  </tr>
                )}
                {personalInfo.phone && (
                  <tr>
                    <td className="text-muted small pe-2">Phone</td>
                    <td>{personalInfo.phone}</td>
                  </tr>
                )}
                  <tr>
                    <td className="text-muted small pe-2">Referral code</td>
                    <td>{personalInfo?.referralCode ?? "-"}</td>
                  </tr>
              </tbody>
            </table>

            {/* Property data and other fields */}
            <h6 className="mb-2">Property data</h6>
            <table className="table table-sm table-borderless mb-0">
              <tbody>
                {propertyRows.map(({ key, label, value }) => (
                  <tr key={key}>
                    <td className="text-muted small pe-2">{label}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default observer(ApplicationPreviewModal);
