"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Form from "react-bootstrap/Form";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import { AGENT_EDIT_MODAL, AGENT_PREVIEW_MODAL, PROMOTE_USERS_MODAL } from "@/utils/defines";
import type { AgentListItem } from "./AgentsTableBody";
import AgentsTableBody from "./AgentsTableBody";

const DEBOUNCE_MS = 400;

const AgentsListBody = () => {
  const router = useRouter();
  const { modalStore } = useStore();

  const [refreshKey, setRefreshKey] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [filterReferralCode, setFilterReferralCode] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const hasInitializedFromUrl = useRef(false);

  useEffect(() => {
    if (!router.isReady || hasInitializedFromUrl.current) return;
    hasInitializedFromUrl.current = true;
    const q = router.query;
    const search = typeof q.search === "string" ? q.search : "";
    const referralCode = typeof q.referral_code === "string" ? q.referral_code : "";
    setSearchInput(search);
    setReferralCodeInput(referralCode);
    setFilterSearch(search);
    setFilterReferralCode(referralCode);
    setIsInitialized(true);
  }, [router.isReady]);

  useEffect(() => {
    if (!isInitialized) return;
    const t = setTimeout(() => {
      setFilterSearch(searchInput.trim());
      setFilterReferralCode(referralCodeInput.trim());
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [isInitialized, searchInput, referralCodeInput]);

  useEffect(() => {
    if (!isInitialized) return;
    const q = { ...router.query } as Record<string, string>;
    if (filterSearch) q.search = filterSearch;
    else delete q.search;
    if (filterReferralCode) q.referral_code = filterReferralCode;
    else delete q.referral_code;
    const current = { ...router.query } as Record<string, string>;
    const same =
      current.search === (q.search ?? "") &&
      current.referral_code === (q.referral_code ?? "");
    if (same) return;
    router.replace({ pathname: router.pathname, query: q }, undefined, { shallow: true });
  }, [isInitialized, filterSearch, filterReferralCode]);

  const onSuccess = () => setRefreshKey((k) => k + 1);

  const openPromoteModal = () => {
    modalStore.setActiveModal(PROMOTE_USERS_MODAL, { onSuccess });
  };

  const openPreview = (agent: AgentListItem) => {
    modalStore.setActiveModal(AGENT_PREVIEW_MODAL, { agent, onSuccess });
  };

  const openEdit = (agent: AgentListItem) => {
    modalStore.setActiveModal(AGENT_EDIT_MODAL, { agent, onSuccess });
  };

  return (
    <div className="bg-white card-box p0 border-20">
      <div className="pt-25 pb-3 pe-4 ps-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
          <div className="bg-orange-three row g-3 align-items-end flex-wrap px-2 py-2 rounded-2">
            <div className="col-12 col-md-auto">
              <Form.Group>
                <Form.Label className="small text-muted mb-1">Search by name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by name..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="form-control"
                />
              </Form.Group>
            </div>
            <div className="col-12 col-md-auto">
              <Form.Group>
                <Form.Label className="small text-muted mb-1">Referral Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Filter by referral code..."
                  value={referralCodeInput}
                  onChange={(e) => setReferralCodeInput(e.target.value)}
                  className="form-control"
                />
              </Form.Group>
            </div>
          </div>
          <button
            type="button"
            className="btn-nine rounded-3 fw-normal"
            onClick={openPromoteModal}
          >
            <i className="fas fa-user-plus me-2" />
            Promote Users
          </button>
        </div>
      </div>
      <div className="table-responsive pt-0 pb-25 pe-4 ps-4">
        {!isInitialized && (
          <div className="text-center py-5 text-muted">Loading filters…</div>
        )}
        <table
          className="table property-list-table"
          style={{ visibility: isInitialized ? undefined : "hidden" }}
        >
          <thead>
            <tr>
              <th className="text-center" scope="col">Photo</th>
              <th className="text-center" scope="col">Name</th>
              <th className="text-center" scope="col">Email</th>
              <th className="text-center" scope="col">Referral Code</th>
              <th className="text-center" scope="col">IBAN</th>
              <th className="text-center" scope="col">Role</th>
              <th className="text-center" scope="col">Actions</th>
            </tr>
          </thead>
          <AgentsTableBody
            filterSearch={filterSearch}
            filterReferralCode={filterReferralCode}
            loadEnabled={isInitialized}
            refreshKey={refreshKey}
            onPreview={openPreview}
            onEdit={openEdit}
          />
        </table>
      </div>
    </div>
  );
};

export default observer(AgentsListBody);
