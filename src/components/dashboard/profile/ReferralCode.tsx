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
  REFERRAL_BONUS_OTHERS,
  REFERRAL_BONUS_LISTING,
} from "@/utils/defines";
import Modal from "react-bootstrap/Modal";
import { removeProtocolFromLink } from "@/utils/helpers";

const ReferralCode = () => {
  const [copied, setCopied] = useState(false);
  const [termsModal, setTermsModal] = useState(false);

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
          Share about Domakin with the world and earn a bonus when someone uses
          one of our services with your referral code. Check the full terms in
          the link below.
        </p>

        <button onClick={() => setTermsModal(true)} className="btn-eleven">
          Read the full terms and conditions
        </button>

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
        <div className="mt-20 d-flex flex-column flex-lg-row align-items-start gap-2">
          <ul>
            <li>
              <p>
                Add Listing:{" "}
                <strong
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    handleCopy(ADD_LISTING_URL + `?ref=${referralCode}`)
                  }
                >
                  <u>
                    {removeProtocolFromLink(ADD_LISTING_URL) +
                      `?ref=${referralCode}`}
                  </u>
                </strong>
              </p>
            </li>
            <li>
              <p>
                Viewing:{" "}
                <strong
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    handleCopy(VIEWING_URL + `?ref=${referralCode}`)
                  }
                >
                  <u>
                    {removeProtocolFromLink(VIEWING_URL) +
                      `?ref=${referralCode}`}
                  </u>
                </strong>
              </p>
            </li>
            <li>
              <p>
                Renting a room:{" "}
                <strong
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    handleCopy(RENTING_URL + `?ref=${referralCode}`)
                  }
                >
                  <u>
                    {removeProtocolFromLink(RENTING_URL) +
                      `?ref=${referralCode}`}
                  </u>
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
                  <u>
                    {removeProtocolFromLink(SEARCH_RENTING) +
                      `?ref=${referralCode}`}
                  </u>
                </strong>
              </p>
            </li>
          </ul>

          <div className="gradient-blue-card mx-auto">
            <p>
              Refer a listed room:{" "}
              <strong>{REFERRAL_BONUS_LISTING} euro</strong>
            </p>
            <p>
              All other referrals: <strong>{REFERRAL_BONUS_OTHERS} euro</strong>
            </p>
          </div>
        </div>
      </div>
      <Modal show={termsModal} onHide={() => setTermsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Terms & Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted">
            <small>Last updated: 25 April 2025</small>
          </p>
          <ol>
            <li className="mb-3">
              Referring person is a person who gives out a referral code
              generated on the platform of Domakin.
            </li>
            <li className="mb-3">
              A referred person is a person using someone else’s referral code.
            </li>
            <li className="mb-3">
              The referring person and the referred person cannot be the same.
            </li>
            <li className="mb-3">
              There is no limit to the number of people the referring person can
              share the code with.
            </li>
            <li className="mb-3">
              The referring person will receive flat amount on successfully
              serviced client - {REFERRAL_BONUS_LISTING} euro for listed room
              that was taken from our client and {REFERRAL_BONUS_OTHERS} euro
              for all other services.
            </li>
            <li className="mb-3">
              The referring person will receive the credits once the referred
              person completes a transaction after using one of our services.
            </li>
            <li className="mb-3">
              The referring person will receive the bonus only if the referred
              person used their referral code.
            </li>
          </ol>
        </Modal.Body>
      </Modal>
    </DashboardFrame>
  );
};

export default observer(ReferralCode);
