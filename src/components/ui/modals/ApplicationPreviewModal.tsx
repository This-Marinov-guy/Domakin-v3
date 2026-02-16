"use client";

import React from "react";
import Modal from "react-bootstrap/Modal";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import { APPLICATION_PREVIEW_MODAL } from "@/utils/defines";
import { APPLICATION_STATUSES } from "@/utils/defines";
import moment from "moment";

const FIELD_LABELS: Record<string, string> = {
  created_at: "Application date",
  name: "Name",
  surname: "Surname",
  phone: "Phone",
  email: "Email",
  letter: "Letter",
  note: "Note",
  referral_code_status: "Referral code status",
  status: "Status",
  internal_note: "Internal note",
};

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
    if (val == null) return "—";
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
    if (typeof val === "object" && val !== null && !Array.isArray(val))
      return JSON.stringify(val);
    return String(val);
  };

  const keys = [
    "created_at",
    "name",
    "surname",
    "phone",
    "email",
    "letter",
    "note",
    "referral_code_status",
    "status",
    "internal_note",
  ];

  return (
    <Modal show={isOpen} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Application preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!entry ? (
          <p className="text-muted">No application data.</p>
        ) : (
          <table className="table table-sm table-borderless">
            <tbody>
              {keys.map((key) => (
                <tr key={key}>
                  <td className="text-muted small pe-2" style={{ width: "40%" }}>
                    {FIELD_LABELS[key] ?? key}
                  </td>
                  <td>{displayValue(key, entry[key])}</td>
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
