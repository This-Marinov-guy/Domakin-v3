"use client";

import React from "react";
import Modal from "react-bootstrap/Modal";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import { APPLICATION_PREVIEW_MODAL } from "@/utils/defines";
import { APPLICATION_STATUSES } from "@/utils/defines";
import moment from "moment";
import { formatJsonKeyValuePairs } from "@/utils/helpers";
import { getAmenityLabel } from "@/utils/defines";

const FIELD_LABELS: Record<string, string> = {
  id: "ID",
  created_at: "Application date",
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
  "property_data",
];

const formatKeyLabel = (key: string) =>
  FIELD_LABELS[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const ApplicationPreviewModal = () => {
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

  const toDisplayText = (key: string, val: unknown): React.ReactNode => {
    if (val == null || val === "") return null;
    if (key === "created_at") return moment(String(val)).format("DD-MM-YYYY HH:mm");
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
    if (key === "property_data") return null;
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
            const display =
              typeof v === "object" ? JSON.stringify(v) : String(v);
            rows.push({
              key: `property_data.${k}`,
              label: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
              value: display,
            });
          }
        }
        continue;
      }
      if (key === "amenities") {
        const arr = Array.isArray(val) ? (val as number[]) : [];
        const amenityLabels = arr.map((id) => getAmenityLabel(Number(id))).filter(Boolean);
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
            <h6>Application details</h6>
            <ul>
              {rows.map(({ key, label, value }) => (
                <li key={key}>
                  {label}: {value}
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default observer(ApplicationPreviewModal);
