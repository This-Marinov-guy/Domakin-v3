"use client";
import React from "react";
import { showStandardNotification } from "@/utils/helpers";

interface StripePaymentLinkButtonProps {
  paymentLink: string;
  className?: string;
}

const StripePaymentLinkButton: React.FC<StripePaymentLinkButtonProps> = ({
  paymentLink,
  className = "btn btn-sm",
}) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paymentLink);
      showStandardNotification("info", "Payment link copied to clipboard");
    } catch (error) {
      showStandardNotification("error", "Failed to copy payment link");
    }
  };

  return (
    <button
      className={className}
      style={{ backgroundColor: "#635BFF", color: "#fff" }}
      onClick={handleCopy}
      title="Copy Stripe payment link"
    >
      <i className="bi bi-stripe me-1"></i>
      Stripe
    </button>
  );
};

export default StripePaymentLinkButton;


