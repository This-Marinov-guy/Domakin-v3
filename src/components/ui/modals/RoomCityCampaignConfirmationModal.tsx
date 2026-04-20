import React from "react";
import Modal from "react-bootstrap/Modal";

interface RoomCityCampaignConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  propertyTitle: string;
  city?: string;
  totalRecipients: number;
  isSubmitting?: boolean;
}

const RoomCityCampaignConfirmationModal: React.FC<RoomCityCampaignConfirmationModalProps> = ({
  show,
  onHide,
  onConfirm,
  propertyTitle,
  city,
  totalRecipients,
  isSubmitting = false,
}) => {
  const emailLabel = `${totalRecipients} email${totalRecipients === 1 ? "" : "s"}`;

  return (
    <>
      <Modal
        show={show}
        onHide={() => !isSubmitting && onHide()}
        centered
        backdrop="static"
        style={{ zIndex: 1060 }}
        backdropClassName="confirmation-modal-backdrop"
      >
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>Confirm Campaign</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You are about to send the room city campaign for{" "}
            <strong>{propertyTitle}</strong>
            {city ? ` in ${city}` : ""}.
          </p>
          <p>
            <strong>{emailLabel}</strong> will be sent, including{" "}
            <strong>info@domakin.nl</strong>.
          </p>
          <p>Do you want to queue this campaign now?</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            onClick={onHide}
            className="btn-danger text-uppercase rounded-3 fw-normal"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn-nine text-uppercase rounded-3 fw-normal"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Queueing..." : "Queue Campaign"}
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

export default RoomCityCampaignConfirmationModal;
