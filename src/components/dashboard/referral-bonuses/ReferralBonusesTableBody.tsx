"use client";

import { useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useServer } from "@/hooks/useServer";
import { showGeneralError, showStandardNotification } from "@/utils/helpers";
import { REFERRAL_BONUS_STATUSES, REFERRAL_BONUS_TYPES } from "@/utils/defines";
import PaginatedTableWrapper, {
  PaginatedTableWrapperHandle,
} from "../properties-list/PaginatedTableWrapper";

export interface ReferralBonusItem {
  id: number;
  user_id?: string;
  user_name?: string;
  referral_code: string;
  type: number;
  amount: number;
  status: number;
  reference_id?: string;
  public_note?: string;
  internal_note?: string;
  metadata?: any;
  created_at: string;
  updated_at?: string;
}

interface Props {
  isAdmin: boolean;
  filterReferralCode?: string;
  filterUserId?: string;
  filterStatus?: string;
  filterType?: string;
  sortBy?: string;
  sortDir?: string;
  refreshKey?: number;
  loadEnabled?: boolean;
  onEdit: (bonus: ReferralBonusItem) => void;
  onDeleteSuccess: () => void;
}

const typeLabel = (type: number) =>
  REFERRAL_BONUS_TYPES.find((t) => t.value === type)?.text ?? `#${type}`;

const statusLabel = (status: number) =>
  REFERRAL_BONUS_STATUSES.find((s) => s.value === status)?.text ?? `#${status}`;

const statusBadgeClass = (status: number) => {
  switch (status) {
    case 1: return "bg-warning text-dark";
    case 2: return "bg-primary";
    case 3: return "bg-success";
    case 4: return "bg-danger";
    default: return "bg-secondary";
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return moment(dateStr).format("DD-MM-YY HH:mm");
};

const ReferralBonusesTableBody = ({
  isAdmin,
  filterReferralCode = "",
  filterUserId = "",
  filterStatus = "",
  filterType = "",
  sortBy = "created_at",
  sortDir = "desc",
  refreshKey = 0,
  loadEnabled = true,
  onEdit,
  onDeleteSuccess,
}: Props) => {
  const { sendRequest } = useServer();
  const paginationRef = useRef<PaginatedTableWrapperHandle>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [savingStatusId, setSavingStatusId] = useState<number | null>(null);

  const fetchData = async (page: number, perPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("per_page", String(perPage));

    if (isAdmin) {
      if (filterReferralCode) params.set("referral_code", filterReferralCode);
      if (filterUserId) params.set("user_id", filterUserId);
      if (filterStatus) params.set("status", filterStatus);
      if (filterType) params.set("type", filterType);
      if (sortBy) params.set("sort_by", sortBy);
      if (sortDir) params.set("sort_dir", sortDir);
    }

    const endpoint = isAdmin
      ? `/referral-bonus/list?${params.toString()}`
      : `/referral-bonus/my-list?${params.toString()}`;

    const response = await sendRequest(endpoint);
    if (response?.status && response?.data != null) {
      const raw = response.data;
      const list = raw?.data ?? [];
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
      pagination: { current_page: 1, last_page: 1, per_page: perPage, total: 0 },
    };
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      const response = await sendRequest(`/referral-bonus/delete?id=${deleteConfirm.id}`, "DELETE");
      if (response?.status) {
        showStandardNotification("success", "Referral bonus deleted");
        setDeleteConfirm(null);
        onDeleteSuccess();
      } else {
        showGeneralError(response?.message ?? "Failed to delete");
      }
    } catch {
      showGeneralError("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (bonus: ReferralBonusItem, newStatus: string) => {
    setSavingStatusId(bonus.id);
    try {
      const response = await sendRequest("/referral-bonus/edit", "PATCH", {
        id: bonus.id,
        status: Number(newStatus),
      });
      if (response?.status) {
        showStandardNotification("success", "Status updated");
        paginationRef.current?.reload();
      } else {
        showGeneralError(response?.message ?? "Failed to update status");
      }
    } catch {
      showGeneralError("Failed to update status");
    } finally {
      setSavingStatusId(null);
    }
  };

  const renderRows = (bonuses: ReferralBonusItem[]) => (
    <>
      <Modal show={!!deleteConfirm} onHide={() => !deleting && setDeleteConfirm(null)} centered>
        <Modal.Body>
          Are you sure you want to delete referral bonus <strong>#{deleteConfirm?.id}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-danger" onClick={() => setDeleteConfirm(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button className="btn-danger-solid" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      {bonuses.map((bonus) => (
        <tr className="listing-table" key={bonus.id}>
          <td className="center">{bonus.id}</td>
          {isAdmin && (
            <td className="center" style={{ maxWidth: 160, wordBreak: "break-all" }}>
              {bonus.user_name ?? "—"}
            </td>
          )}
          <td className="center">{bonus.referral_code ?? "—"}</td>
          <td className="center">{typeLabel(bonus.type)}</td>
          <td className="center">€{bonus.amount ?? 0}</td>
          <td className="center">
            {isAdmin ? (
              <div className="dropdown d-inline-block">
                <span
                  className={`badge px-2 py-1 ${statusBadgeClass(bonus.status)} dropdown-toggle`}
                  style={{ cursor: savingStatusId === bonus.id ? "wait" : "pointer" }}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  role="button"
                >
                  {statusLabel(bonus.status)}
                </span>
                <ul className="dropdown-menu">
                  {REFERRAL_BONUS_STATUSES.filter((s) => s.value !== bonus.status).map((s) => (
                    <li key={s.value}>
                      <button
                        className="dropdown-item d-flex align-items-center gap-2"
                        disabled={savingStatusId === bonus.id}
                        onClick={() => handleStatusChange(bonus, String(s.value))}
                      >
                        <span className={`badge px-2 py-1 ${statusBadgeClass(s.value)}`}>{s.text}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <span className={`badge px-2 py-1 ${statusBadgeClass(bonus.status)}`}>
                {statusLabel(bonus.status)}
              </span>
            )}
          </td>
          <td className="center">{formatDate(bonus.created_at)}</td>
          {isAdmin && (
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
                    <button className="dropdown-item" onClick={() => onEdit(bonus)}>
                      <i className="fas fa-pencil me-2" /> Edit
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={() => setDeleteConfirm({ id: bonus.id })}>
                      <i className="fas fa-trash me-2" /> Delete
                    </button>
                  </li>
                </ul>
              </div>
            </td>
          )}
        </tr>
      ))}
    </>
  );

  const filterKey = [
    filterReferralCode,
    filterUserId,
    filterStatus,
    filterType,
    sortBy,
    sortDir,
    refreshKey,
  ].join("-");

  return (
    <tbody className="border-0">
      <PaginatedTableWrapper
        ref={paginationRef}
        fetchData={fetchData}
        renderRows={(data) => renderRows(data as ReferralBonusItem[])}
        initialPerPage={15}
        filterKey={filterKey}
        loadEnabled={loadEnabled}
      />
    </tbody>
  );
};

export default observer(ReferralBonusesTableBody);
