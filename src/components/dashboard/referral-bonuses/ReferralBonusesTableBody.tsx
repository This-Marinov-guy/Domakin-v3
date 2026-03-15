"use client";

import { useRef } from "react";
import { observer } from "mobx-react-lite";
import moment from "moment";
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
  onPreview: (bonus: ReferralBonusItem) => void;
  onEdit: (bonus: ReferralBonusItem) => void;
  onDeleteSuccess: () => void;
}

const statusLabel = (status: number) => {
  return REFERRAL_BONUS_STATUSES.find((s) => s.value === status)?.text ?? `#${status}`;
};

const typeLabel = (type: number) => {
  return REFERRAL_BONUS_TYPES.find((t) => t.value === type)?.text ?? `#${type}`;
};

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
  onPreview,
  onEdit,
  onDeleteSuccess,
}: Props) => {
  const { sendRequest } = useServer();
  const paginationRef = useRef<PaginatedTableWrapperHandle>(null);

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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this referral bonus?")) return;
    const response = await sendRequest(`/referral-bonus/delete?id=${id}`, "DELETE");
    if (response?.status) {
      showStandardNotification("success", "Referral bonus deleted");
      onDeleteSuccess();
    } else {
      showGeneralError(response?.message ?? "Failed to delete");
    }
  };

  const renderRows = (bonuses: ReferralBonusItem[]) => (
    <>
      {bonuses.map((bonus) => (
        <tr className="listing-table" key={bonus.id}>
          <td className="center">{bonus.id}</td>
          {isAdmin && (
            <td className="center" style={{ fontSize: 12, maxWidth: 160, wordBreak: "break-all" }}>
              {bonus.user_name ?? "—"}
            </td>
          )}
          <td className="center">{bonus.referral_code ?? "—"}</td>
          <td className="center">{typeLabel(bonus.type)}</td>
          <td className="center">€{bonus.amount ?? 0}</td>
          <td className="center">
            <span className={`badge px-2 py-1 ${statusBadgeClass(bonus.status)}`}>
              {statusLabel(bonus.status)}
            </span>
          </td>
          <td className="center">{formatDate(bonus.created_at)}</td>
          {isAdmin && (
            <td className="center">
              <div className="d-flex gap-2 justify-content-center">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  title="Preview"
                  onClick={() => onPreview(bonus)}
                >
                  <i className="fas fa-eye" />
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  title="Edit"
                  onClick={() => onEdit(bonus)}
                >
                  <i className="fas fa-pencil" />
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  title="Delete"
                  onClick={() => handleDelete(bonus.id)}
                >
                  <i className="fas fa-trash" />
                </button>
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
