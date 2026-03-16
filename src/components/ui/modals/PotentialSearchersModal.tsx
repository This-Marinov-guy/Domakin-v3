"use client";

import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { useStore } from "@/stores/storeContext";
import { useServer } from "@/hooks/useServer";
import { observer } from "mobx-react-lite";
import { POTENTIAL_SEARCHERS_MODAL } from "@/utils/defines";
import { showGeneralError, showStandardNotification } from "@/utils/helpers";
import ApplicationsAccordionSkeleton from "@/components/ui/loading/ApplicationsAccordionSkeleton";
import moment from "moment";

const DISPLAY_FIELDS = [
  "created_at",
  "name",
  "surname",
  "phone",
  "email",
  "city",
  "budget",
  "move_in",
  "period",
  "type",
  "people",
  "registration",
  "note",
] as const;

const FIELD_LABELS: Record<string, string> = {
  created_at: "Date",
  name: "Name",
  surname: "Surname",
  phone: "Phone",
  email: "Email",
  city: "City",
  budget: "Budget (€)",
  move_in: "Move-in",
  period: "Period",
  type: "Type",
  people: "People",
  registration: "Registration",
  note: "Note",
};

const PotentialSearchersModal = () => {
  const { modalStore } = useStore();
  const { sendRequest } = useServer();

  const propertyId = modalStore.modalSettings?.propertyId as number | undefined;
  const propertyCity = (modalStore.modalSettings?.propertyCity as string) ?? "";
  const propertyTitle = (modalStore.modalSettings?.propertyTitle as string) ?? "";

  const [entries, setEntries] = useState<any[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [promotingId, setPromotingId] = useState<number | null>(null);
  const [promotedIds, setPromotedIds] = useState<Set<number>>(new Set());

  const isOpen = modalStore.modals[POTENTIAL_SEARCHERS_MODAL];

  const fetchEntries = useCallback(async () => {
    if (!propertyCity) return;
    setFetchLoading(true);
    try {
      const response = await sendRequest(
        `/renting/searching/list-by-city?city=${encodeURIComponent(propertyCity)}`
      );
      if (response?.status && response?.data != null) {
        const raw = response.data;
        setEntries(Array.isArray(raw) ? raw : []);
      } else {
        setEntries([]);
      }
    } catch {
      setEntries([]);
    } finally {
      setFetchLoading(false);
    }
  }, [propertyCity]);

  useEffect(() => {
    if (isOpen && propertyCity) {
      fetchEntries();
      setExpandedId(null);
      setPromotedIds(new Set());
    }
  }, [isOpen, propertyCity, fetchEntries]);

  const handleClose = () => {
    modalStore.closeAll();
    setEntries([]);
    setExpandedId(null);
    setPromotedIds(new Set());
  };

  const handlePromote = async (entry: any) => {
    if (!propertyId) return;
    setPromotingId(entry.id);
    try {
      const response = await sendRequest(
        "/renting/searching/promote",
        "POST",
        { search_renting_id: entry.id, property_id: propertyId }
      );
      if (response?.status) {
        showStandardNotification("success", `${entry.name} ${entry.surname} promoted to applicants`);
        setPromotedIds((prev) => new Set(prev).add(entry.id));
      }
    } finally {
      setPromotingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Potential Searchers</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted">
          Property: <strong>{propertyTitle}</strong> &mdash; City: <strong>{propertyCity}</strong>
        </p>
        {fetchLoading ? (
          <ApplicationsAccordionSkeleton />
        ) : entries.length === 0 ? (
          <p className="text-muted">No searchers found for {propertyCity}.</p>
        ) : (
          <div className="accordion" id="searchers-accordion">
            {entries.map((entry) => {
              const id = String(entry.id);
              const collapseId = `searcher-collapse-${id}`;
              const isExpanded = expandedId === id;
              const isPromoting = promotingId === entry.id;
              const isPromoted = promotedIds.has(entry.id);

              return (
                <div key={id} className="accordion-style-one accordion-item mb-3">
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${isExpanded ? "" : "collapsed"}`}
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : id)}
                      aria-expanded={isExpanded}
                      aria-controls={collapseId}
                    >
                      {isPromoted && (
                        <i className="fas fa-check-circle text-success" style={{ marginRight: "10px", fontSize: "20px" }} />
                      )}
                      {entry.name} {entry.surname}
                      <span className="text-muted ms-2 small">— €{entry.budget}/mo</span>
                    </button>
                  </h2>
                  <div
                    id={collapseId}
                    className={`accordion-collapse collapse ${isExpanded ? "show" : ""}`}
                  >
                    <div className="accordion-body">
                      <table className="table table-sm table-borderless">
                        <tbody>
                          {DISPLAY_FIELDS.map((key) => {
                            const val = entry[key];
                            let display: string;
                            if (key === "created_at" || key === "move_in") {
                              display = val ? moment(val as string).format("DD-MM-YYYY") : "—";
                            } else if (typeof val === "boolean") {
                              display = val ? "Yes" : "No";
                            } else {
                              display = val != null && val !== "" ? String(val) : "—";
                            }
                            return (
                              <tr key={key}>
                                <td className="text-muted small pe-2">{FIELD_LABELS[key] ?? key}</td>
                                <td className="text-break">{display}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <div className="d-flex justify-content-end mt-2">
                        <button
                          className="btn-nine text-uppercase rounded-3 fw-normal"
                          disabled={isPromoting || isPromoted}
                          onClick={() => handlePromote(entry)}
                        >
                          {isPromoting ? (
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                          ) : isPromoted ? (
                            "Promoted"
                          ) : (
                            "Promote to Applicants"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default observer(PotentialSearchersModal);
