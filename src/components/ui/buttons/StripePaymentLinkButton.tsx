"use client";
import React from "react";
import { useStore } from "@/stores/storeContext";
import PaymentLinkModal from "../modals/PaymentLinkModal";
import { PAYMENT_LINK_MODAL } from "@/utils/defines";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

interface StripePaymentLinkButtonProps {
  propertyId: number | string;
  className?: string;
  buttonText?: string;
  small?: boolean;
}

const StripePaymentLinkButton: React.FC<StripePaymentLinkButtonProps> = ({
  propertyId,
  className = "btn btn-sm",
  small = false,
  buttonText = "Create Payment Link"
}) => {
  const { modalStore } = useStore();

  const handleClick = () => {
    modalStore.setActiveModal(PAYMENT_LINK_MODAL);
  };

  const button = (
    <button
      className={className}
      style={{ backgroundColor: "#635BFF", color: "#fff" }}
      onClick={handleClick}
      title={!small ? "Generate Stripe payment link" : undefined}
      type="button"
    >
      <i className="bi bi-stripe me-1"></i>
      {!small && buttonText}
    </button>
  );

  return (
    <>
      {small ? (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>{buttonText}</Tooltip>}
        >
          {button}
        </OverlayTrigger>
      ) : (
        button
      )}

      {/* Render the modal component */}
      <PaymentLinkModal propertyId={propertyId} />
    </>
  );
};

export default StripePaymentLinkButton;

