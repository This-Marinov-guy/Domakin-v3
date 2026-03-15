"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Form from "react-bootstrap/Form";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import {
  REFERRAL_BONUS_EDIT_MODAL,
  REFERRAL_BONUS_PREVIEW_MODAL,
  REFERRAL_BONUS_STATUSES,
  REFERRAL_BONUS_TYPES,
} from "@/utils/defines";
import ReferralBonusesTableBody from "./ReferralBonusesTableBody";

const DEBOUNCE_MS = 400;

const ReferralBonusesListBody = () => {
  const router = useRouter();
  const { modalStore, userStore: { isAdmin } } = useStore();

  const [refreshKey, setRefreshKey] = useState(0);

  // Filter inputs (admin only)
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [userIdInput, setUserIdInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [typeInput, setTypeInput] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Applied filter values (debounced)
  const [filterReferralCode, setFilterReferralCode] = useState("");
  const [filterUserId, setFilterUserId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");

  const [isInitialized, setIsInitialized] = useState(false);
  const hasInitializedFromUrl = useRef(false);

  useEffect(() => {
    if (!router.isReady || hasInitializedFromUrl.current) return;
    hasInitializedFromUrl.current = true;
    if (isAdmin) {
      const q = router.query;
      const rc = typeof q.referral_code === "string" ? q.referral_code : "";
      const uid = typeof q.user_id === "string" ? q.user_id : "";
      const st = typeof q.status === "string" ? q.status : "";
      const tp = typeof q.type === "string" ? q.type : "";
      const sb = typeof q.sort_by === "string" ? q.sort_by : "created_at";
      const sd = typeof q.sort_dir === "string" ? q.sort_dir : "desc";
      setReferralCodeInput(rc);
      setUserIdInput(uid);
      setStatusInput(st);
      setTypeInput(tp);
      setSortBy(sb);
      setSortDir(sd === "asc" ? "asc" : "desc");
      setFilterReferralCode(rc);
      setFilterUserId(uid);
      setFilterStatus(st);
      setFilterType(tp);
    }
    setIsInitialized(true);
  }, [router.isReady, isAdmin]);

  // Debounce text inputs
  useEffect(() => {
    if (!isInitialized || !isAdmin) return;
    const t = setTimeout(() => {
      setFilterReferralCode(referralCodeInput.trim());
      setFilterUserId(userIdInput.trim());
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [isInitialized, isAdmin, referralCodeInput, userIdInput]);

  // Immediate apply for dropdowns
  useEffect(() => {
    if (!isInitialized || !isAdmin) return;
    setFilterStatus(statusInput);
    setFilterType(typeInput);
  }, [isInitialized, isAdmin, statusInput, typeInput]);

  // Sync URL (admin only)
  useEffect(() => {
    if (!isInitialized || !isAdmin) return;
    const q = { ...router.query } as Record<string, string>;
    const set = (key: string, val: string) => {
      if (val) q[key] = val;
      else delete q[key];
    };
    set("referral_code", filterReferralCode);
    set("user_id", filterUserId);
    set("status", filterStatus);
    set("type", filterType);
    set("sort_by", sortBy !== "created_at" ? sortBy : "");
    set("sort_dir", sortDir !== "desc" ? sortDir : "");
    router.replace({ pathname: router.pathname, query: q }, undefined, { shallow: true });
  }, [isInitialized, isAdmin, filterReferralCode, filterUserId, filterStatus, filterType, sortBy, sortDir]);

  const onSuccess = () => setRefreshKey((k) => k + 1);

  const openPreview = (bonus: any) => {
    modalStore.setActiveModal(REFERRAL_BONUS_PREVIEW_MODAL, { bonus, onSuccess });
  };

  const openEdit = (bonus: any) => {
    modalStore.setActiveModal(REFERRAL_BONUS_EDIT_MODAL, { bonus, onSuccess });
  };

  if (!isInitialized) {
    return (
      <div className="bg-white card-box p0 border-20">
        <div className="text-center py-5 text-muted">Loading…</div>
      </div>
    );
  }

  return (
    <div className="bg-white card-box p0 border-20">
      {isAdmin && (
        <div className="pt-25 pb-3 pe-4 ps-4">
          <div className="bg-orange-three row g-3 align-items-end flex-wrap px-2 py-2 rounded-2">
            <div className="col-12 col-md-auto">
              <Form.Group>
                <Form.Label className="small text-muted mb-1">Referral Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Filter by referral code..."
                  value={referralCodeInput}
                  onChange={(e) => setReferralCodeInput(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="col-12 col-md-auto">
              <Form.Group>
                <Form.Label className="small text-muted mb-1">User name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Filter by user name..."
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="col-12 col-md-auto">
              <Form.Group>
                <Form.Label className="small text-muted mb-1">Status</Form.Label>
                <Form.Select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  style={{ minWidth: 160 }}
                >
                  <option value="">All statuses</option>
                  {REFERRAL_BONUS_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.text}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-12 col-md-auto">
              <Form.Group>
                <Form.Label className="small text-muted mb-1">Type</Form.Label>
                <Form.Select
                  value={typeInput}
                  onChange={(e) => setTypeInput(e.target.value)}
                  style={{ minWidth: 140 }}
                >
                  <option value="">All types</option>
                  {REFERRAL_BONUS_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.text}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-12 col-md-auto">
              <Form.Group>
                <Form.Label className="small text-muted mb-1">Sort By</Form.Label>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ minWidth: 140 }}
                >
                  <option value="created_at">Date</option>
                  <option value="amount">Amount</option>
                  <option value="status">Status</option>
                  <option value="type">Type</option>
                  <option value="id">ID</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-12 col-md-auto">
              <Form.Group>
                <Form.Label className="small text-muted mb-1">Direction</Form.Label>
                <Form.Select
                  value={sortDir}
                  onChange={(e) => setSortDir(e.target.value as "asc" | "desc")}
                  style={{ minWidth: 110 }}
                >
                  <option value="desc">Newest first</option>
                  <option value="asc">Oldest first</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>
        </div>
      )}

      <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
        <table className="table property-list-table">
          <thead>
            <tr>
              <th className="text-center" scope="col">ID</th>
              {isAdmin && <th className="text-center" scope="col">User name</th>}
              <th className="text-center" scope="col">Referral Code</th>
              <th className="text-center" scope="col">Type</th>
              <th className="text-center" scope="col">Amount</th>
              <th className="text-center" scope="col">Status</th>
              <th className="text-center" scope="col">Date</th>
              {isAdmin && <th className="text-center" scope="col">Actions</th>}
            </tr>
          </thead>
          <ReferralBonusesTableBody
            isAdmin={isAdmin}
            filterReferralCode={filterReferralCode}
            filterUserId={filterUserId}
            filterStatus={filterStatus}
            filterType={filterType}
            sortBy={sortBy}
            sortDir={sortDir}
            refreshKey={refreshKey}
            loadEnabled={isInitialized}
            onPreview={openPreview}
            onEdit={openEdit}
            onDeleteSuccess={onSuccess}
          />
        </table>
      </div>
    </div>
  );
};

export default observer(ReferralBonusesListBody);
