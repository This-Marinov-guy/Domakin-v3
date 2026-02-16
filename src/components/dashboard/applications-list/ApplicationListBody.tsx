"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import ApplicationTableBody from "./ApplicationTableBody";
import Form from "react-bootstrap/Form";

const DEBOUNCE_MS = 400;

const ApplicationListBody = () => {
  const router = useRouter();
  const [cityInput, setCityInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [referenceIdInput, setReferenceIdInput] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [filterReferenceId, setFilterReferenceId] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const hasInitializedFromUrl = useRef(false);

  // Initialize filter inputs from URL query once when router is ready (avoids load with empty then with URL params)
  useEffect(() => {
    if (!router.isReady || hasInitializedFromUrl.current) return;
    hasInitializedFromUrl.current = true;
    const q = router.query;
    const city = typeof q.city === "string" ? q.city : "";
    const search = typeof q.search === "string" ? q.search : "";
    const referenceId =
      typeof q.reference_id === "string" ? q.reference_id : "";
    setCityInput(city);
    setSearchInput(search);
    setReferenceIdInput(referenceId);
    setFilterCity(city);
    setFilterSearch(search);
    setFilterReferenceId(referenceId);
    setIsInitialized(true);
  }, [router.isReady]);

  // Debounce: sync inputs to effective filters (only after init, so we don't overwrite URL state immediately)
  useEffect(() => {
    if (!isInitialized) return;
    const t = setTimeout(() => {
      setFilterCity(cityInput.trim());
      setFilterSearch(searchInput.trim());
      setFilterReferenceId(referenceIdInput.trim());
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [isInitialized, cityInput, searchInput, referenceIdInput]);

  // Push filter state to URL so the link can be shared (only after init, avoid firing before we've set state from URL)
  useEffect(() => {
    if (!isInitialized) return;
    const q = { ...router.query } as Record<string, string>;
    if (filterCity) q.city = filterCity;
    else delete q.city;
    if (filterSearch) q.search = filterSearch;
    else delete q.search;
    if (filterReferenceId) q.reference_id = filterReferenceId;
    else delete q.reference_id;
    const current = { ...router.query } as Record<string, string>;
    const same =
      current.city === (q.city ?? "") &&
      current.search === (q.search ?? "") &&
      current.reference_id === (q.reference_id ?? "");
    if (same) return;
    router.replace({ pathname: router.pathname, query: q }, undefined, { shallow: true });
  }, [isInitialized, filterCity, filterSearch, filterReferenceId]);

  return (
    <div className="bg-white card-box p0 border-20">
      <div className="pt-25 pb-3 pe-4 ps-4">
        <div className="bg-orange-three row g-3 align-items-center justify-center flex-wrap px-2 py-2 rounded-2">
          <div className="col-12 col-md-auto">
            <Form.Group>
              <Form.Label className="small text-muted mb-1">City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Filter by city"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className="form-control"
              />
            </Form.Group>
          </div>
          <div className="col-12 col-md-auto">
            <Form.Group>
              <Form.Label className="small text-muted mb-1">Search name or email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search name or email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="form-control"
              />
            </Form.Group>
          </div>
          <div className="col-12 col-md-auto">
            <Form.Group>
              <Form.Label className="small text-muted mb-1">Reference ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Filter by reference ID"
                value={referenceIdInput}
                onChange={(e) => setReferenceIdInput(e.target.value)}
                className="form-control"
              />
            </Form.Group>
          </div>
        </div>
      </div>
      <div className="table-responsive pt-0 pb-25 pe-4 ps-4">
        {!isInitialized && (
          <div className="text-center py-5 text-muted">Loading filters…</div>
        )}
        <table className="table property-list-table" style={{ visibility: isInitialized ? undefined : "hidden" }}>
          <thead>
            <tr>
              <th className="text-center" scope="col">
                Property
               
              </th>
              <th className="text-center" scope="col">
                Location
              </th>
              <th className="text-center" scope="col">
                Applicant
              </th>
              <th className="text-center" scope="col">
                Email
              </th>
              <th className="text-center" scope="col">
                Date
              </th>
              <th className="text-center" scope="col">
                Step
              </th>
              <th className="text-center" scope="col">
                Action
              </th>
            </tr>
          </thead>
          <ApplicationTableBody
            filterCity={filterCity}
            filterSearch={filterSearch}
            filterReferenceId={filterReferenceId}
            loadEnabled={isInitialized}
          />
        </table>
      </div>
    </div>
  );
};

export default ApplicationListBody;
