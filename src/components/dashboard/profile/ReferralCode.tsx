import React, { useEffect } from "react";
import DashboardFrame from "@/layouts/frames/DashboardFrame";
import { useState } from "react";
import { toast } from "react-toastify";
import { Form, InputGroup, Button } from "react-bootstrap";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";

const ReferralCode = () => {
  const [copied, setCopied] = useState(false);

  const {
    userStore: { loadReferralCode, referralCode },
  } = useStore();

  useEffect(() => {
    loadReferralCode();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
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
            <Button variant="outline-dark" onClick={handleCopy}>
              <i className="fa-regular fa-clone"></i>
            </Button>
          </InputGroup>
        </div>
      </div>
    </DashboardFrame>
  );
};

export default observer(ReferralCode);
