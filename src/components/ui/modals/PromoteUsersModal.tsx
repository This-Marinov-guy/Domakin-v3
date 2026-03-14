"use client";

import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { useStore } from "@/stores/storeContext";
import { useServer } from "@/hooks/useServer";
import { observer } from "mobx-react-lite";
import { PROMOTE_USERS_MODAL } from "@/utils/defines";
import { showGeneralError, showStandardNotification } from "@/utils/helpers";
import ReactPaginate from "react-paginate";

interface UserItem {
  id: string;
  name: string;
  email: string;
  referral_code?: string;
  roles?: string;
}

interface PaginationInfo {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const DEBOUNCE_MS = 400;

const PromoteUsersModal = () => {
  const { modalStore } = useStore();
  const { sendRequest } = useServer();

  const isOpen = modalStore.modals[PROMOTE_USERS_MODAL];

  const [users, setUsers] = useState<UserItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async (pageNum: number, searchStr: string) => {
    setFetchLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(pageNum));
      params.set("per_page", "15");
      if (searchStr) params.set("search", searchStr);
      const response = await sendRequest(`/user/list-all?${params.toString()}`);
      if (response?.status && response?.data != null) {
        const raw = response.data;
        setUsers(Array.isArray(raw.users) ? raw.users : []);
        setPagination(
          raw.pagination ?? { current_page: pageNum, last_page: 1, per_page: 15, total: 0 }
        );
      } else {
        setUsers([]);
      }
    } catch {
      setUsers([]);
    }
    setFetchLoading(false);
  }, [sendRequest]);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedIds(new Set());
    setPage(1);
    setSearchInput("");
    setSearch("");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    fetchUsers(page, search);
  }, [isOpen, page, search]);

  // Debounce search input → search state
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleClose = () => {
    modalStore.closeAll();
  };

  const toggleUser = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    const allIds = users.map((u) => u.id);
    const allSelected = allIds.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) allIds.forEach((id) => next.delete(id));
      else allIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const handleRoleAction = async (action: "add" | "remove") => {
    if (selectedIds.size === 0) {
      showGeneralError("Select at least one user");
      return;
    }
    setActionLoading(true);
    try {
      const response = await sendRequest("/user/roles", "PATCH", {
        user_ids: Array.from(selectedIds),
        role: "agent",
        action,
      });
      if (response?.status) {
        showStandardNotification(
          "success",
          action === "add"
            ? "Agent role granted successfully"
            : "Agent role removed successfully"
        );
        setSelectedIds(new Set());
        fetchUsers(page, search);
        (modalStore.modalSettings?.onSuccess as (() => void) | undefined)?.();
      } else {
        showGeneralError(response?.message ?? "Failed to update roles");
      }
    } catch {
      showGeneralError("Failed to update roles");
    }
    setActionLoading(false);
  };

  const allOnPageSelected =
    users.length > 0 && users.every((u) => selectedIds.has(u.id));

  const hasAgentRole = (user: UserItem) =>
    user.roles?.includes("agent") ?? false;

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Promote Users</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
          <Form.Control
            type="text"
            placeholder="Search by name or referral code..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ maxWidth: 320 }}
          />
          {selectedIds.size > 0 && (
            <span className="text-muted small">{selectedIds.size} selected</span>
          )}
          <div className="ms-auto d-flex gap-2">
            <button
              type="button"
              className="btn-nine rounded-3 fw-normal"
              disabled={actionLoading || selectedIds.size === 0}
              onClick={() => handleRoleAction("add")}
            >
              {actionLoading ? (
                <Spinner as="span" animation="border" size="sm" role="status" />
              ) : (
                <>
                  <i className="fas fa-user-plus me-2" />
                  Grant Agent
                </>
              )}
            </button>
            <button
              type="button"
              className="btn-danger rounded-3 fw-normal"
              disabled={actionLoading || selectedIds.size === 0}
              onClick={() => handleRoleAction("remove")}
            >
              {actionLoading ? (
                <Spinner as="span" animation="border" size="sm" role="status" />
              ) : (
                <>
                  <i className="fas fa-user-minus me-2" />
                  Remove Agent
                </>
              )}
            </button>
          </div>
        </div>

        {fetchLoading ? (
          <div className="text-center py-4">
            <Spinner animation="border" role="status" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-muted text-center py-4">No users found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <Form.Check
                      type="checkbox"
                      checked={allOnPageSelected}
                      onChange={toggleAll}
                      aria-label="Select all on page"
                    />
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Referral Code</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedIds.has(user.id)}
                        onChange={() => toggleUser(user.id)}
                        aria-label={`Select ${user.name}`}
                      />
                    </td>
                    <td>{user.name ?? "—"}</td>
                    <td>{user.email ?? "—"}</td>
                    <td>{user.referral_code ?? "—"}</td>
                    <td>
                      {hasAgentRole(user) ? (
                        <span className="badge bg-success">Agent</span>
                      ) : (
                        <span className="badge bg-secondary">User</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!fetchLoading && pagination.last_page > 1 && (
          <div className="d-flex justify-content-center mt-3">
            <ReactPaginate
              breakLabel="..."
              onPageChange={({ selected }) => setPage(selected + 1)}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={pagination.last_page}
              renderOnZeroPageCount={null}
              className="pagination-two d-inline-flex align-items-center justify-content-center style-none"
              previousLabel={<i className="fa-regular fa-chevron-left" />}
              nextLabel={<i className="fa-regular fa-chevron-right" />}
              forcePage={pagination.current_page - 1}
            />
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default observer(PromoteUsersModal);
