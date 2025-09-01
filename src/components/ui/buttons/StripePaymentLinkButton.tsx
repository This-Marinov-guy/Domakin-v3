"use client";
import React from "react";
import { useStore } from "@/stores/storeContext";
import PaymentLinkModal from "../modals/PaymentLinkModal";
import { PAYMENT_LINK_MODAL } from "@/utils/defines";

interface StripePaymentLinkButtonProps {
  propertyId: number | string;
  className?: string;
  buttonText?: string;
}

const StripePaymentLinkButton: React.FC<StripePaymentLinkButtonProps> = ({
  propertyId,
  className = "btn btn-sm",
  buttonText = "Create Payment Link"
}) => {
  const { modalStore } = useStore();

  const handleClick = () => {
    modalStore.setActiveModal(PAYMENT_LINK_MODAL);
  };

  return (
    <>
      <button
        className={className}
        style={{ backgroundColor: "#635BFF", color: "#fff" }}
        onClick={handleClick}
        title="Generate Stripe payment link"
        type="button"
      >
        <i className="bi bi-stripe me-1"></i>
        {buttonText}
      </button>

      {/* Render the modal component */}
      <PaymentLinkModal propertyId={propertyId} />
    </>
  );
};

export default StripePaymentLinkButton;

