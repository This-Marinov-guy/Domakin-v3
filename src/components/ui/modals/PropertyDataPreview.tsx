import { formatJsonKeyValuePairs } from "@/utils/helpers";
import React from "react";
import Modal from "react-bootstrap/Modal";

const PropertyDataPreview = ({ onHide, data }: any) => {
  return (
    <Modal show={!!data} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <h6>Details</h6>
      </Modal.Header>

      <Modal.Body>
        <h6>Personal Details</h6>
        <ul>
          <li>Name: {(data?.name ?? "-") + " " + (data?.surname ?? "-")}</li>
          <li>Phone: {data?.phone ?? "-"}</li>
          <li>Email: {data?.email ?? "-"}</li>
        </ul>

        <h6>Property Details</h6>
        <ul>
          <li>Title: {formatJsonKeyValuePairs(data?.title, ['en'])}</li>
          <li>City: {data?.city ?? "-"}</li>
          <li>Address: {data?.address ?? "-"}</li>
          <li>Postcode: {data?.postcode ?? "-"}</li>
          <li>Size: {data?.size ?? "-"}</li>
          <li>Rent: {data?.rent ?? "-"}</li>
          <li>Registration: {data?.registration ?? "-"}</li>
          <li>Bills: {formatJsonKeyValuePairs(data?.bills, ['en'])}</li>
          <li>Flatmates: {formatJsonKeyValuePairs(data?.flatmates, ['en'])}</li>
          <li>Period: {formatJsonKeyValuePairs(data?.period, ['en'])}</li>
          <li>Description: {formatJsonKeyValuePairs(data?.description, ['en'])}</li>
        </ul>

        <div className="row">
          {data?.images?.length > 0 &&
            data.images.map((image: string, index: number) => (
              <div
                key={index}
                className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4"
              >
                <img
                  src={image}
                  alt={`Property Image ${index + 1}`}
                  width={200}
                  height={200}
                  className="img-fluid rounded border"
                />
              </div>
            ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PropertyDataPreview;
