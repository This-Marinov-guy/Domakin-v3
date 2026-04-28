"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Form from "react-bootstrap/Form";
import ViewingsTableBody from "./ViewingsTableBody";

const DEBOUNCE_MS = 400;

const ViewingsListBody = () => {
  const router = useRouter();
  const [cityInput, setCityInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [referenceIdInput, setReferenceIdInput] = useState("");

  const [filterCity, setFilterCity] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [filterReferenceId, setFilterReferenceId] = useState("");

  const [isInitialized, setIsInitialized] = useState(false);
  const hasInitializedFromUrl = useRef(false);

  useEffect(() => {
    if (!router.isReady || hasInitializedFromUrl.current) return;

    hasInitializedFromUrl.current = true;
    const q = router.query;
    const city = typeof q.city === "string" ? q.city : "";
    const search = typeof q.search === "string" ? q.search : "";
    const referenceId = typeof q.reference_id === "string" ? q.reference_id : "";

    setCityInput(city);
    setSearchInput(search);
    setReferenceIdInput(referenceId);

    setFilterCity(city);
    setFilterSearch(search);
    setFilterReferenceId(referenceId);
    setIsInitialized(true);
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!isInitialized) return;

    const timeoutId = setTimeout(() => {
      setFilterCity(cityInput.trim());
      setFilterSearch(searchInput.trim());
      setFilterReferenceId(referenceIdInput.trim());
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [isInitialized, cityInput, searchInput, referenceIdInput]);

  useEffect(() => {
    if (!isInitialized) return;

    const q = { ...router.query } as Record<string, string>;
    const current = { ...router.query } as Record<string, string>;
    const set = (key: string, value: string) => {
      if (value) q[key] = value;
      else delete q[key];
    };

    set("city", filterCity);
    set("search", filterSearch);
    set("reference_id", filterReferenceId);

    const same =
      (current.city ?? "") === (q.city ?? "") &&
      (current.search ?? "") === (q.search ?? "") &&
      (current.reference_id ?? "") === (q.reference_id ?? "");

    if (same) return;

    router.replace({ pathname: router.pathname, query: q }, undefined, {
      shallow: true,
    });
  }, [isInitialized, filterCity, filterSearch, filterReferenceId, router]);

  return (
    <div className="bg-white card-box p0 border-20">
      <div className="pt-25 pb-3 pe-4 ps-4">
        <div className="bg-orange-three row g-3 align-items-end flex-wrap px-2 py-2 rounded-2">
          <div className="col-12 col-md-auto">
            <Form.Group>
              <Form.Label className="small text-muted mb-1">City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Filter by city"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
              />
            </Form.Group>
          </div>
          <div className="col-12 col-md-auto">
            <Form.Group>
              <Form.Label className="small text-muted mb-1">Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name, surname or email"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </Form.Group>
          </div>
          <div className="col-12 col-md-auto">
            <Form.Group>
              <Form.Label className="small text-muted mb-1">Reference ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Viewing ID"
                value={referenceIdInput}
                onChange={(e) => setReferenceIdInput(e.target.value)}
              />
            </Form.Group>
          </div>
        </div>
      </div>

      <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
        {!isInitialized && (
          <div className="text-center py-5 text-muted">Loading filters...</div>
        )}
        <table
          className="table property-list-table"
          style={{ visibility: isInitialized ? undefined : "hidden" }}
        >
          <thead>
            <tr>
              <th className="text-center" scope="col">ID</th>
              <th className="text-center" scope="col">Applicant</th>
              <th className="text-center" scope="col">Email</th>
              <th className="text-center" scope="col">Location</th>
              <th className="text-center" scope="col">Appointment</th>
              <th className="text-center" scope="col">Status</th>
              <th className="text-center" scope="col">Internal note</th>
              <th className="text-center" scope="col">Created</th>
              <th className="text-center" scope="col">Actions</th>
            </tr>
          </thead>
          <ViewingsTableBody
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

export default ViewingsListBody;
