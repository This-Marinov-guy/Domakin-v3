import React from "react";
import Modal from "react-bootstrap/Modal";

const PropertyUserPreview = ({ data, onHide }: any) => {
  return (
    <Modal show={!!data} onHide={onHide} size="sm" centered>
      <Modal.Header closeButton>
        <h6>Personal Data</h6>
      </Modal.Header>

      <Modal.Body>
        <ul>
          <li>Name: {data?.name ?? "-" + " " + data?.surname ?? "-"}</li>
          <li>Phone: {data?.phone ?? "-"}</li>
          <li>Email: {data?.email ?? "-"}</li>
        </ul>
      </Modal.Body>
    </Modal>
  );
};

export default PropertyUserPreview;
