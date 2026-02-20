"use client";

import React from "react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

interface StepTransitionLoadingModalProps {
  show: boolean;
  message?: string;
}

const StepTransitionLoadingModal = ({
  show,
  message = "Loading…",
}: StepTransitionLoadingModalProps) => {
  return (
    <Modal
      show={show}
      backdrop="static"
      backdropClassName="step-transition-loading-modal-backdrop"
      keyboard={false}
      centered
      size="sm"
      contentClassName="border-0 shadow"
      className="step-transition-loading-modal"
    >
      <Modal.Body className="d-flex text-center rounded-3 flex-column align-items-center justify-content-center py-4" style={{ backgroundColor: "#004aad", color: "#fff" }}>
        <Spinner animation="border" role="status" className="mb-3" style={{ color: "#ff914d" }}/>
        <p className="mb-0 small">{message}</p>
      </Modal.Body>
    </Modal>
  );
};

export default StepTransitionLoadingModal;
