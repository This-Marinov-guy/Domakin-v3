"use client";

import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import { useStore } from "@/stores/storeContext";
import { useServer } from "@/hooks/useServer";
import { observer } from "mobx-react-lite";
import {
  REFERRAL_BONUS_EDIT_MODAL,
  REFERRAL_BONUS_PREVIEW_MODAL,
  REFERRAL_BONUS_STATUSES,
  REFERRAL_BONUS_TYPES,
} from "@/utils/defines";
import { showGeneralError, showStandardNotification } from "@/utils/helpers";
import type { ReferralBonusItem } from "@/components/dashboard/referral-bonuses/ReferralBonusesTableBody";

const emptyForm = {
  referral_code: "",
  user_id: "",
  amount: "",
  status: "1",
  type: "1",
  reference_id: "",
  public_note: "",
  internal_note: "",
};

const ReferralBonusEditModal = ({ previewOnly }: { previewOnly?: boolean }) => {
  const { modalStore } = useStore();
  const { sendRequest } = useServer();

  const modalKey = previewOnly ? REFERRAL_BONUS_PREVIEW_MODAL : REFERRAL_BONUS_EDIT_MODAL;
  const isOpen = modalStore.modals[modalKey];

  const bonus: ReferralBonusItem | undefined = modalStore.modalSettings?.bonus as ReferralBonusItem | undefined;

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (bonus) {
      setForm({
        referral_code: bonus.referral_code ?? "",
        user_id: bonus.user_id ?? "",
        amount: bonus.amount != null ? String(bonus.amount) : "",
        status: bonus.status != null ? String(bonus.status) : "1",
        type: bonus.type != null ? String(bonus.type) : "1",
        reference_id: bonus.reference_id ?? "",
        public_note: bonus.public_note ?? "",
        internal_note: bonus.internal_note ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [isOpen, bonus?.id]);

  const handleClose = () => modalStore.closeAll();

  const handleChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, any> = {
        id: bonus!.id,
        referral_code: form.referral_code || undefined,
        amount: form.amount !== "" ? Number(form.amount) : undefined,
        status: form.status ? Number(form.status) : undefined,
        type: form.type ? Number(form.type) : undefined,
        public_note: form.public_note || undefined,
        internal_note: form.internal_note || undefined,
      };
      const response = await sendRequest("/referral-bonus/edit", "PATCH", payload);
      if (response?.status) {
        showStandardNotification("success", "Referral bonus updated");
        (modalStore.modalSettings?.onSuccess as (() => void) | undefined)?.();
        handleClose();
      } else {
        showGeneralError(response?.message ?? "Failed to update");
      }
    } catch {
      showGeneralError("Failed to update");
    }
    setSaving(false);
  };

  if (!isOpen) return null;

  const isReadOnly = previewOnly;

  const fieldRow = (label: string, content: React.ReactNode) => (
    <Form.Group as={Row} className="mb-3">
      <Form.Label column sm={3} className="text-muted fw-normal">
        {label}
      </Form.Label>
      <Col sm={9}>{content}</Col>
    </Form.Group>
  );

  return (
    <Modal show={isOpen} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {previewOnly ? "Referral Bonus Preview" : "Edit Referral Bonus"}
          {bonus && <span className="text-muted ms-2 fs-6">#{bonus.id}</span>}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {fieldRow(
          "Referral Code",
          isReadOnly ? (
            <div className="py-2 px-1">{form.referral_code || "—"}</div>
          ) : (
            <Form.Control
              type="text"
              value={form.referral_code}
              onChange={(e) => handleChange("referral_code", e.target.value)}
            />
          )
        )}
        {isReadOnly && fieldRow(
          "User ID",
          <div className="py-2 px-1" style={{ wordBreak: "break-all", fontSize: 13 }}>
            {form.user_id || "—"}
          </div>
        )}
        {fieldRow(
          "Amount (€)",
          isReadOnly ? (
            <div className="py-2 px-1">€{form.amount || "—"}</div>
          ) : (
            <Form.Control
              type="number"
              min={0}
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
            />
          )
        )}
        {fieldRow(
          "Status",
          isReadOnly ? (
            <div className="py-2 px-1">
              {REFERRAL_BONUS_STATUSES.find((s) => String(s.value) === form.status)?.text ?? "—"}
            </div>
          ) : (
            <Form.Select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              {REFERRAL_BONUS_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.text}</option>
              ))}
            </Form.Select>
          )
        )}
        {fieldRow(
          "Type",
          isReadOnly ? (
            <div className="py-2 px-1">
              {REFERRAL_BONUS_TYPES.find((t) => String(t.value) === form.type)?.text ?? "—"}
            </div>
          ) : (
            <Form.Select
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              {REFERRAL_BONUS_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.text}</option>
              ))}
            </Form.Select>
          )
        )}
        {isReadOnly && fieldRow(
          "Reference ID",
          <div className="py-2 px-1">{form.reference_id || "—"}</div>
        )}
        {fieldRow(
          "Public Note",
          isReadOnly ? (
            <div className="py-2 px-1">{form.public_note || "—"}</div>
          ) : (
            <Form.Control
              as="textarea"
              rows={3}
              value={form.public_note}
              onChange={(e) => handleChange("public_note", e.target.value)}
            />
          )
        )}
        {fieldRow(
          "Internal Note",
          isReadOnly ? (
            <div className="py-2 px-1">{form.internal_note || "—"}</div>
          ) : (
            <Form.Control
              as="textarea"
              rows={3}
              value={form.internal_note}
              onChange={(e) => handleChange("internal_note", e.target.value)}
            />
          )
        )}
        {bonus?.created_at &&
          fieldRow(
            "Created",
            <div className="py-2 px-1">
              {new Date(bonus.created_at).toLocaleString("en-GB")}
            </div>
          )}
      </Modal.Body>
      {!previewOnly && (
        <Modal.Footer>
          <button type="button" className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-nine rounded-3 fw-normal"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Spinner as="span" animation="border" size="sm" role="status" />
            ) : (
              "Save Changes"
            )}
          </button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export const ReferralBonusPreviewModal = observer(() => (
  <ReferralBonusEditModal previewOnly />
));

export default observer(ReferralBonusEditModal);
