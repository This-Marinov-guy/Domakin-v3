"use client";

import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useStore } from "@/stores/storeContext";
import { useServer } from "@/hooks/useServer";
import { observer } from "mobx-react-lite";
import { APPLICATION_MODAL, APPLICATION_STATUSES } from "@/utils/defines";
import { showGeneralError, showStandardNotification } from "@/utils/helpers";
import NiceSelect from "@/ui/NiceSelect";
import ApplicationsAccordionSkeleton from "@/components/ui/loading/ApplicationsAccordionSkeleton";
import { getPropertyUrl } from "@/utils/seoHelpers";
import moment from "moment";

export interface ListByPropertyEntry {
  id: number | string;
  [key: string]: unknown;
}

const DISPLAY_FIELDS = [
  'created_at',
  "name",
  "surname",
  "phone",
  "email",
  "letter",
  "note",
  "referral_code_status",
  "status",
  "internal_note",
] as const;

const FIELD_LABELS: Record<string, string> = {
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

const ApplicationsModal = () => {
  const { modalStore } = useStore();
  const { sendRequest, loading } = useServer();
  const propertyId = modalStore.modalSettings?.propertyId;
  const propertyTitle = (modalStore.modalSettings?.propertyTitle as string) ?? "";
  const propertyUrl = (modalStore.modalSettings?.propertyUrl as string) ?? "";


  const [entries, setEntries] = useState<ListByPropertyEntry[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Record<string, ListByPropertyEntry>>({});
  const [savingId, setSavingId] = useState<string | number | null>(null);

  const isOpen = modalStore.modals[APPLICATION_MODAL];

  const fetchEntries = useCallback(async () => {
    if (!propertyId) return;

    setFetchLoading(true);
    try {
      const response = await sendRequest(`/renting/list-by-property/${propertyId}`);
      setFetchLoading(false);
      if (response?.status && response?.data != null) {
        const raw = response.data;
        const list = Array.isArray(raw)
          ? raw
          : raw?.data ?? raw?.entries ?? raw?.list ?? [];
        setEntries(Array.isArray(list) ? list : []);
      } else {
        setEntries([]);
      }
    } catch {
      setFetchLoading(false);
      setEntries([]);
    }
  }, [propertyId]);

  useEffect(() => {
    if (isOpen && propertyId != null) {
      fetchEntries();
      setExpandedId(null);
      setEditing({});
    }
  }, [isOpen, propertyId, fetchEntries]);

  const handleClose = () => {
    modalStore.closeAll();
    setEntries([]);
    setExpandedId(null);
    setEditing({});
  };

  const getEntryEdit = (entry: ListByPropertyEntry): ListByPropertyEntry => {
    const id = String(entry.id);
    return editing[id] ?? { ...entry };
  };

  const setEntryEditField = (
    entry: ListByPropertyEntry,
    key: string,
    value: unknown
  ) => {
    const id = String(entry.id);
    setEditing((prev) => ({
      ...prev,
      [id]: {
        ...getEntryEdit(entry),
        [key]: value,
      },
    }));
  };

  const handleSave = async (entry: ListByPropertyEntry) => {
    const id = String(entry.id);
    const payload = editing[id] ?? entry;
    setSavingId(entry.id);
    try {
      const response = await sendRequest(
        `/renting/edit`,
        "PATCH",
        payload
      );
      if (response?.status) {
        showStandardNotification("success", "Changes saved");
        setEditing((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        fetchEntries();
      } else {
        showGeneralError("Failed to save changes");
      }
    } catch {
    } finally {
      setSavingId(null);
    }
  };

  const getSummary = (entry: any): string => {
    return `${entry.name} ${entry.surname}`;
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Renting Applications</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted">Property: <a href={propertyUrl} target="_blank" rel="noopener noreferrer"> {propertyTitle} <i className="fas fa-external-link-alt mx-2"></i></a></p>
        {propertyId == null ? (
          <p className="text-muted">No property selected.</p>
        ) : (
          <>
            {fetchLoading ? (
              <ApplicationsAccordionSkeleton />
            ) : entries.length === 0 ? (
              <p className="text-muted">No applications for this property.</p>
            ) : (
              <div
                className="accordion"
                id="applications-accordion"
              >
                {entries.map((entry) => {
                  const id = String(entry.id);
                  const collapseId = `collapse-${id}`;
                  const isExpanded = expandedId === id;
                  const editRow = getEntryEdit(entry);
                  const isSaving = savingId === entry.id;

                  const renderField = (key: string) => {
                    const val = editRow[key];
                    const isObj = typeof val === "object" && val !== null && !Array.isArray(val);
                    const displayVal = isObj ? JSON.stringify(val) : String(val ?? "");
                    const label = FIELD_LABELS[key] ?? key;

                    if (key === "created_at") {
                      return (
                        <tr key={key}>
                          <td className="text-muted small pe-2">Application date</td>
                          <td>{moment(val as string).format("DD-MM-YYYY HH:mm")}</td>
                        </tr>
                      );
                    }

                    if (key === "letter") {
                      const url = typeof val === "string" ? val : String(val ?? "");
                      const isUrl = /^https?:\/\//i.test(url);
                      return (
                        <tr key={key}>
                          <td className="text-muted small pe-2">{label}</td>
                          <td>
                            {isUrl && displayVal ? (
                              <a href={url} target="_blank" rel="noopener noreferrer" >
                                Open letter
                                <i className="fas fa-external-link-alt mx-2"></i>
                              </a>
                            ) : (
                              <span className="text-muted">{displayVal || "—"}</span>
                            )}
                          </td>
                        </tr>
                      );
                    }

                    if (key === "status") {
                      const statusValue = editRow.status;
                      return (
                        <tr key={key}>
                          <td className="text-muted small pe-2 align-middle">{label}</td>
                          <td>
                            <NiceSelect
                              className="nice-select border-one d-flex align-items-center"
                              options={APPLICATION_STATUSES}
                              value={String(statusValue ?? '')}
                              onChange={(e) =>
                                setEntryEditField(entry, key, e.target.value)
                              }
                              name=""
                              placeholder=""
                            />
                          </td>
                        </tr>
                      );
                    }

                    if (key === "internal_note") {
                      const internalUpdatedAt = entry.internal_updated_at ? moment(entry.internal_updated_at as string).format("DD-MM-YYYY HH:mm") : null;
                      const internalUpdatedBy = (entry.internal_updated_by_user as any)?.name as string;
                      const hasMeta = internalUpdatedAt != null || internalUpdatedBy != null;
                      const tooltip = (
                        <Tooltip id={`internal-note-tt-${id}`}>
                          {internalUpdatedAt != null && <div>Updated at: {String(internalUpdatedAt)}</div>}
                          {internalUpdatedBy != null && <div>Updated by: {String(internalUpdatedBy)}</div>}
                        </Tooltip>
                      );
                      return (
                        <tr key={key}>
                          <td className="text-muted small pe-2 align-top">
                            {label}
                            {hasMeta && (
                              <OverlayTrigger placement="top" overlay={tooltip}>
                                <span className="ms-1 badge bg-secondary rounded-circle cursor-pointer" style={{ cursor: "pointer" }} title="Internal note info">i</span>
                              </OverlayTrigger>
                            )}
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              as="textarea"
                              rows={2}
                              value={displayVal}
                              onChange={(e) => setEntryEditField(entry, key, e.target.value)}
                            />
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={key}>
                        <td className="text-muted small pe-2">{label}</td>
                        <td>
                          <span className="text-break">{displayVal || "—"}</span>
                        </td>
                      </tr>
                    );
                  };

                  const statusNum = Number(entry.status);
                  const isSuccessStatus = statusNum === 2 || statusNum === 3;
                  const isRejectedStatus = statusNum === 4;

                  return (
                    <div
                      key={id}
                      className="accordion-style-one accordion-item mb-3"
                    >
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button ${isExpanded ? "" : "collapsed"}`}
                          type="button"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : id)
                          }
                          aria-expanded={isExpanded}
                          aria-controls={collapseId}
                        >
                          {isSuccessStatus && <i className="fas fa-check-circle text-success" style={{ marginRight: "10px", fontSize: "24px" }}></i>}
                          {isRejectedStatus && <i className="fas fa-times-circle text-danger" style={{ marginRight: "10px", fontSize: "24px" }}></i>}
                          {getSummary(entry)}
                        </button>
                      </h2>
                      <div
                        id={collapseId}
                        className={`accordion-collapse collapse ${isExpanded ? "show" : ""}`}
                      >
                        <div className="accordion-body">
                          <Form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleSave(entry);
                            }}
                          >
                            <table className="table table-sm table-borderless">
                              <tbody>
                                {DISPLAY_FIELDS.map((key) => renderField(key))}
                              </tbody>
                            </table>
                            <div className="d-flex justify-content-end mt-2">
                              <div className="d-flex justify-content-center align-items-center gap-3">
                                <button
                                  disabled={loading || isSaving}
                                  type="submit"
                                  className="btn-nine text-uppercase rounded-3 fw-normal w-100"
                                >
                                  {isSaving ? (
                                    <Spinner
                                      as="span"
                                      animation="border"
                                      size="sm"
                                      role="status"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    "Save"
                                  )}
                                </button>
                                <button
                                  disabled={loading || isSaving}
                                  onClick={modalStore.closeAll}
                                  className="btn-danger text-uppercase rounded-3 fw-normal w-100"
                                >
                                  cancel
                                </button>
                              </div>

                            </div>
                          </Form>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default observer(ApplicationsModal);
