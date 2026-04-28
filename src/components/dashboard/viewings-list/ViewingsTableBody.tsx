"use client";

import { useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { useServer } from "@/hooks/useServer";
import { APPLICATION_STATUSES } from "@/utils/defines";
import { showGeneralError, showStandardNotification } from "@/utils/helpers";
import PaginatedTableWrapper, {
  PaginatedTableWrapperHandle,
} from "../properties-list/PaginatedTableWrapper";

interface ViewingItem {
  id: number;
  name?: string;
  surname?: string;
  phone?: string;
  email?: string;
  city?: string;
  address?: string;
  date?: string;
  time?: string;
  note?: string;
  status?: number | string | null;
  internal_note?: string;
  created_at?: string;
  internal_updated_at?: string;
  internal_updated_by_user?: {
    id?: string;
    name?: string | null;
  } | null;
}

interface Props {
  filterCity?: string;
  filterSearch?: string;
  filterReferenceId?: string;
  loadEnabled?: boolean;
}

const statusLabel = (status?: number) =>
  APPLICATION_STATUSES.find((entry) => entry.value === status)?.text ?? "—";

const normalizeStatus = (status?: number | string | null): number => {
  if (typeof status === "number" && Number.isFinite(status)) {
    return status;
  }

  if (typeof status === "string") {
    const trimmed = status.trim();
    if (trimmed !== "") {
      const parsed = Number(trimmed);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return 1;
};

const statusBadgeClass = (status?: number) => {
  switch (status) {
    case 1:
      return "bg-warning text-dark";
    case 2:
      return "bg-primary";
    case 3:
      return "bg-success";
    case 4:
      return "bg-danger";
    default:
      return "bg-secondary";
  }
};

const truncateText = (value?: string | null, maxLength: number = 60) => {
  if (!value) return "—";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}...`;
};

const getInternalUpdateMeta = (viewing: ViewingItem) => {
  const updatedAt = viewing.internal_updated_at
    ? moment(viewing.internal_updated_at).format("DD-MM-YYYY HH:mm")
    : null;
  const updatedBy = viewing.internal_updated_by_user?.name ?? null;

  if (!updatedAt && !updatedBy) {
    return null;
  }

  return [updatedAt, updatedBy].filter(Boolean).join(" by ");
};

const ViewingsTableBody = ({
  filterCity = "",
  filterSearch = "",
  filterReferenceId = "",
  loadEnabled = true,
}: Props) => {
  const { sendRequest } = useServer();
  const paginationRef = useRef<PaginatedTableWrapperHandle>(null);

  const [editingViewing, setEditingViewing] = useState<ViewingItem | null>(null);
  const [form, setForm] = useState({ status: "1", internal_note: "" });
  const [saving, setSaving] = useState(false);

  const fetchData = async (page: number, perPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("per_page", String(perPage));
    if (filterCity) params.set("city", filterCity);
    if (filterSearch) params.set("search", filterSearch);
    if (filterReferenceId) params.set("reference_id", filterReferenceId);

    const response = await sendRequest(`/viewing/list?${params.toString()}`);
    if (response?.status && response?.data != null) {
      const raw = response.data;
      const list = raw?.viewings ?? raw?.data ?? [];

      return {
        data: Array.isArray(list) ? list : [],
        pagination: {
          current_page: raw.current_page ?? page,
          last_page: raw.last_page ?? 1,
          per_page: raw.per_page ?? perPage,
          total: raw.total ?? 0,
        },
      };
    }

    return {
      data: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: perPage,
        total: 0,
      },
    };
  };

  const openEditModal = (viewing: ViewingItem) => {
    const normalizedStatus = normalizeStatus(viewing.status);

    setEditingViewing(viewing);
    setForm({
      status: String(normalizedStatus),
      internal_note: viewing.internal_note ?? "",
    });
  };

  const closeEditModal = () => {
    if (saving) return;
    setEditingViewing(null);
  };

  const handleSave = async () => {
    if (!editingViewing) return;

    setSaving(true);
    try {
      const response = await sendRequest("/viewing/edit", "PATCH", {
        id: editingViewing.id,
        status: Number(form.status),
        internal_note: form.internal_note,
      });

      if (response?.status) {
        showStandardNotification("success", "Viewing updated");
        setEditingViewing(null);
        paginationRef.current?.reload();
      } else {
        showGeneralError(response?.message ?? "Failed to update viewing");
      }
    } catch {
      showGeneralError("Failed to update viewing");
    } finally {
      setSaving(false);
    }
  };

  const renderRows = (viewings: ViewingItem[]) => (
    <>
      <Modal show={!!editingViewing} onHide={closeEditModal} centered>
        <Modal.Header closeButton={!saving}>
          <Modal.Title>Update Viewing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingViewing && (
            <div className="d-flex flex-column gap-3">
              <div>
                <div className="small text-muted mb-1">Applicant</div>
                <div>{[editingViewing.name, editingViewing.surname].filter(Boolean).join(" ") || "—"}</div>
              </div>
              <div>
                <div className="small text-muted mb-1">Appointment</div>
                <div>{editingViewing.date ?? "—"} {editingViewing.time ?? ""}</div>
              </div>
              <div>
                <div className="small text-muted mb-1">Customer note</div>
                <div>{editingViewing.note || "—"}</div>
              </div>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                >
                  {APPLICATION_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.text}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Internal note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={form.internal_note}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, internal_note: e.target.value }))
                  }
                  placeholder="Add an internal note..."
                />
              </Form.Group>
              {getInternalUpdateMeta(editingViewing) && (
                <div className="small text-muted">
                  Last internal update: {getInternalUpdateMeta(editingViewing)}
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal} disabled={saving}>
            Cancel
          </Button>
          <Button className="btn-nine" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Spinner as="span" animation="border" size="sm" role="status" />
            ) : (
              "Save"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {viewings.map((viewing) => {
        const normalizedStatus = normalizeStatus(viewing.status);
        const applicant = [viewing.name, viewing.surname].filter(Boolean).join(" ") || "—";
        const location = [viewing.city, viewing.address].filter(Boolean).join(" | ") || "—";
        const appointment = [viewing.date, viewing.time].filter(Boolean).join(" ") || "—";
        const createdAt = viewing.created_at
          ? moment(viewing.created_at).format("DD-MM-YY HH:mm")
          : "—";
        const internalUpdateMeta = getInternalUpdateMeta(viewing);

        return (
          <tr className="listing-table" key={viewing.id}>
            <td className="center">#{viewing.id}</td>
            <td className="center">{applicant}</td>
            <td className="center">{viewing.email ?? "—"}</td>
            <td className="center">{location}</td>
            <td className="center">{appointment}</td>
            <td className="center">
              <button
                type="button"
                className={`badge px-2 py-1 border-0 ${statusBadgeClass(normalizedStatus)}`}
                style={{ cursor: "pointer" }}
                onClick={() => openEditModal(viewing)}
                title="Edit status and internal note"
              >
                {statusLabel(normalizedStatus)}
              </button>
            </td>
            <td className="center" style={{ maxWidth: 240 }}>
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none text-body"
                style={{ maxWidth: 240 }}
                onClick={() => openEditModal(viewing)}
                title="Edit internal note"
              >
                <span className="d-block">{truncateText(viewing.internal_note)}</span>
                {internalUpdateMeta && (
                  <span className="d-block small text-muted mt-1">{internalUpdateMeta}</span>
                )}
              </button>
            </td>
            <td className="center">{createdAt}</td>
            <td className="center">
              <div className="action-dots float-end">
                <button
                  className="action-btn dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span></span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => openEditModal(viewing)}
                    >
                      <i className="fas fa-pencil me-2" />
                      Edit status and note
                    </button>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        );
      })}
    </>
  );

  const filterKey = [
    filterCity,
    filterSearch,
    filterReferenceId,
  ].join("-");

  return (
    <tbody className="border-0">
      <PaginatedTableWrapper
        ref={paginationRef}
        fetchData={fetchData}
        renderRows={(data) => renderRows(data as ViewingItem[])}
        initialPerPage={15}
        filterKey={filterKey}
        loadEnabled={loadEnabled}
      />
    </tbody>
  );
};

export default observer(ViewingsTableBody);
