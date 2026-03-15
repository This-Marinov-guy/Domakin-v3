"use client";

import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Image from "next/image";
import { useStore } from "@/stores/storeContext";
import { useServer } from "@/hooks/useServer";
import { observer } from "mobx-react-lite";
import { AGENT_EDIT_MODAL, AGENT_PREVIEW_MODAL } from "@/utils/defines";
import { showGeneralError, showStandardNotification } from "@/utils/helpers";
import type { AgentListItem } from "@/components/dashboard/agents/AgentsTableBody";

const AgentEditModal = ({ previewOnly }: { previewOnly?: boolean }) => {
  const { modalStore } = useStore();
  const { sendRequest } = useServer();

  const modalKey = previewOnly ? AGENT_PREVIEW_MODAL : AGENT_EDIT_MODAL;
  const isOpen = modalStore.modals[modalKey];

  const agent: AgentListItem | undefined = modalStore.modalSettings?.agent as AgentListItem | undefined;

  const [iban, setIban] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIban(agent?.iban ?? "");
  }, [isOpen, agent?.id]);

  const handleClose = () => modalStore.closeAll();

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await sendRequest(`/user/${agent!.id}/iban`, "PATCH", { iban: iban || null });
      if (response?.status) {
        showStandardNotification("success", "Agent IBAN updated");
        (modalStore.modalSettings?.onSuccess as (() => void) | undefined)?.();
        handleClose();
      } else {
        showGeneralError(response?.message ?? "Failed to update IBAN");
      }
    } catch {
      showGeneralError("Failed to update IBAN");
    }
    setSaving(false);
  };

  if (!isOpen) return null;

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
          {previewOnly ? "Agent Preview" : "Edit Agent"}
          {agent && <span className="text-muted ms-2 fs-6">{agent.name}</span>}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {agent?.profile_image && fieldRow(
          "Photo",
          <Image
            src={agent.profile_image}
            alt={agent.name ?? ""}
            width={56}
            height={56}
            className="rounded-circle"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        )}
        {fieldRow("Name", <div className="py-2 px-1">{agent?.name || "—"}</div>)}
        {fieldRow("Email", <div className="py-2 px-1">{agent?.email || "—"}</div>)}
        {fieldRow("Referral Code", <div className="py-2 px-1">{agent?.referral_code || "—"}</div>)}
        {fieldRow(
          "IBAN",
          previewOnly ? (
            <div className="py-2 px-1">{iban || "—"}</div>
          ) : (
            <Form.Control
              type="text"
              value={iban}
              placeholder="e.g. NL91ABNA0417164300"
              onChange={(e) => setIban(e.target.value)}
            />
          )
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

export const AgentPreviewModal = observer(() => <AgentEditModal previewOnly />);

export default observer(AgentEditModal);
