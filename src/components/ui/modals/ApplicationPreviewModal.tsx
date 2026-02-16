"use client";

import React from "react";
import Modal from "react-bootstrap/Modal";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import { APPLICATION_PREVIEW_MODAL } from "@/utils/defines";
import { APPLICATION_STATUSES } from "@/utils/defines";
import moment from "moment";
import { formatJsonKeyValuePairs } from "@/utils/helpers";

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

const formatLabel = (key: string) =>
  key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

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

  const displayValue = (key: string, val: unknown): React.ReactNode => {
    if (val == null || val === "") return "—";
    if (key === "created_at")
      return moment(String(val)).format("DD/MM/YYYY HH:mm");
    if (key === "letter") {
      const url = String(val);
      if (/^https?:\/\//i.test(url))
        return (
          <a href={url} target="_blank" rel="noopener noreferrer">
            Open letter <i className="fas fa-external-link-alt ms-1 small" />
          </a>
        );
      return url || "—";
    }
    if (key === "status") return statusText;
    if (key === "property_title") {
      if (typeof val === "object" && val !== null) {
        try {
          const str = typeof val === "string" ? val : JSON.stringify(val);
          return formatJsonKeyValuePairs(str, ["en"]) || "—";
        } catch {
          return String(val);
        }
      }
      return String(val);
    }
    if (key === "property_data") {
      const pd = val as Record<string, unknown> | null | undefined;
      if (!pd || typeof pd !== "object") return "—";
      return (
        <div className="small mt-1">
          <table className="table table-sm table-borderless mb-0">
            <tbody>
              {Object.entries(pd).map(([k, v]) => {
                if (v === undefined || v === null) return null;
                const display =
                  typeof v === "object"
                    ? (Array.isArray(v) ? JSON.stringify(v) : JSON.stringify(v))
                    : String(v);
                return (
                  <tr key={k}>
                    <td className="text-muted pe-2" style={{ width: "35%" }}>
                      {formatLabel(k)}
                    </td>
                    <td className="text-break">{display}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }
    if (typeof val === "object" && val !== null) {
      if (Array.isArray(val)) return JSON.stringify(val);
      return (
        <pre className="small mb-0 text-break" style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(val, null, 2)}
        </pre>
      );
    }
    return String(val);
  };

  const allKeys = entry ? Object.keys(entry) : [];
  const orderedKeys = [
    ...PREFERRED_ORDER.filter((k) => allKeys.includes(k)),
    ...allKeys.filter((k) => !PREFERRED_ORDER.includes(k)).sort(),
  ];

  return (
    <Modal show={isOpen} onHide={handleClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Application preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!entry ? (
          <p className="text-muted">No application data.</p>
        ) : (
          <table className="table table-sm table-borderless">
            <tbody>
              {orderedKeys.map((key) => (
                <tr key={key}>
                  <td className="text-muted small pe-2 align-top" style={{ width: "40%" }}>
                    {FIELD_LABELS[key] ?? formatLabel(key)}
                  </td>
                  <td className="align-top">{displayValue(key, entry[key])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default observer(ApplicationPreviewModal);
