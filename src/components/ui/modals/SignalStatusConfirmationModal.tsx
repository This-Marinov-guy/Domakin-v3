import React from "react";
import Modal from "react-bootstrap/Modal";

interface SignalStatusConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
}

const SignalStatusConfirmationModal: React.FC<
  SignalStatusConfirmationModalProps
> = ({ show, onHide, onConfirm }) => {
  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        centered
        backdrop="static"
        style={{ zIndex: 1060 }}
        backdropClassName="confirmation-modal-backdrop"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You are about to submit this property to Signal App, but the
            property status is not set to <strong>Active</strong> (Release date
            might also be missing).
          </p>
          <p>Are you sure you want to proceed?</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            onClick={onHide}
            className="btn-danger text-uppercase rounded-3 fw-normal"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn-nine text-uppercase rounded-3 fw-normal"
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>

      <style jsx global>{`
        .confirmation-modal-backdrop {
          z-index: 1059 !important;
          background-color: rgba(0, 0, 0, 0.7) !important;
        }
      `}</style>
    </>
  );
};

export default SignalStatusConfirmationModal;

