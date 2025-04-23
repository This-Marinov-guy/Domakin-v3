import React, { useEffect } from "react";
import DashboardFrame from "@/layouts/frames/DashboardFrame";
import { useState } from "react";
import { toast } from "react-toastify";
import { Form, InputGroup, Button } from "react-bootstrap";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import {
  VIEWING_URL,
  RENTING_URL,
  ADD_LISTING_URL,
  SEARCH_RENTING,
} from "@/utils/defines";

const ReferralCode = () => {
  const [copied, setCopied] = useState(false);

  const {
    userStore: { loadReferralCode, referralCode },
  } = useStore();

  useEffect(() => {
    loadReferralCode();
  }, []);

  const handleCopy = (link = "") => {
    navigator.clipboard.writeText(link || referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast.info("Copied to clipboard", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  return (
    <DashboardFrame title="Referral Code">
      <div className="flex flex-col gap-4 mt-20">
        <p>
          Share our services to the world and earn credits. By successfully
          attracting clients that finalize the whole process of the given
          service, you will receive a % from the revenue.
        </p>

        <div className="bg-orange px-20 py-20 d-flex flex-column flex-md-row justify-content-center align-items-center gap-4 mt-40 border rounded">
          <h6 className="text-lg font-semibold">Your Referral Code</h6>
          <InputGroup style={{ maxWidth: "14em" }}>
            <Form.Control type="text" readOnly value={referralCode} />
            <Button variant="outline-dark" onClick={() => handleCopy()}>
              <i className="fa-regular fa-clone"></i>
            </Button>
          </InputGroup>
        </div>

        <h5 className="mt-40">Quick links of our services - click to copy</h5>
        <ul className="mt-20">
          <li>
            <p>
              Add Listing:{" "}
              <strong
                style={{ cursor: "pointer" }}
                onClick={() =>
                  handleCopy(ADD_LISTING_URL + `?ref=${referralCode}`)
                }
              >
                <u>{ADD_LISTING_URL + `?ref=${referralCode}`}</u>
              </strong>
            </p>
          </li>
          <li>
            <p>
              Viewing:{" "}
              <strong
                style={{ cursor: "pointer" }}
                onClick={() => handleCopy(VIEWING_URL + `?ref=${referralCode}`)}
              >
                <u>{VIEWING_URL + `?ref=${referralCode}`}</u>
              </strong>
            </p>
          </li>
          <li>
            <p>
              Renting a room:{" "}
              <strong
                style={{ cursor: "pointer" }}
                onClick={() => handleCopy(RENTING_URL + `?ref=${referralCode}`)}
              >
                <u>{RENTING_URL + `?ref=${referralCode}`}</u>
              </strong>
            </p>
          </li>
          <li>
            <p>
              Room searching:{" "}
              <strong
                style={{ cursor: "pointer" }}
                onClick={() =>
                  handleCopy(SEARCH_RENTING + `?ref=${referralCode}`)
                }
              >
                <u>{SEARCH_RENTING + `?ref=${referralCode}`}</u>
              </strong>
            </p>
          </li>
        </ul>
      </div>
    </DashboardFrame>
  );
};

export default observer(ReferralCode);
