import React from "react";
import DashboardFrame from "@/layouts/frames/DashboardFrame";
import { useState } from "react";
import { toast } from "react-toastify";
import { Form, InputGroup, Button } from "react-bootstrap";

const ReferralCode = () => {
  const [copied, setCopied] = useState(false);
  const code = "Vladislav-312341";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
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
          Share our service to the world and end earn credits. By successfully
          attracting clients that finalize the whole process of the given
          service, you will receive a % from the revenue.
        </p>

        <div className="d-flex justify-center align-items-center gap-2 mt-40">
          <h6 className="text-lg font-semibold">Your Referral Code</h6>
          <InputGroup style={{ width: "14em" }}>
            <Form.Control type="text" readOnly value={code} />
            <Button variant="outline-dark" onClick={handleCopy}>
              <i className="fa-regular fa-clone"></i>
            </Button>
          </InputGroup>
        </div>
      </div>
    </DashboardFrame>
  );
};

export default ReferralCode;
