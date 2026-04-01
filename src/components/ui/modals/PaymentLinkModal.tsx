"use client";
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useServer } from "@/hooks/useServer";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/storeContext";
import { showGeneralError, showStandardNotification } from "@/utils/helpers";
import { PAYMENT_LINK_MODAL } from "@/utils/defines";

const PaymentLinkModal: any = () => {
  const { modalStore, userStore } = useStore();
  const { sendRequest, loading } = useServer();

  const propertyId = modalStore.modalSettings?.propertyId;
  const isAdmin = userStore.isAdmin;

  const [customerName, setCustomerName] = useState<string>("");
  const [paymentLink, setPaymentLink] = useState<string>("");
  const [productTitle, setProductTitle] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (propertyId == null) return;

    const body: Record<string, any> = {
      id: propertyId,
      name: customerName.trim() || undefined,
    };

    if (isAdmin) {
      if (productTitle.trim()) body.custom_title = productTitle.trim();
      if (paymentAmount !== "") {
        const parsed = parseFloat(paymentAmount);
        if (!isNaN(parsed) && parsed > 0) body.custom_amount = parsed;
      }
    }

    try {
      const response = await sendRequest(
        "/property/payment/create-link",
        "POST",
        body,
        {},
        {
          withError: true,
          withLoading: true,
        }
      );

      if (response?.status && response?.data?.payment_link) {
        setPaymentLink(response.data.payment_link);
      } else {
        showGeneralError("Failed to generate payment link");
      }
    } catch (error) {
      showGeneralError("Failed to generate payment link");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paymentLink);
      showStandardNotification("info", "Payment link copied to clipboard");
    } catch (error) {
      showStandardNotification("error", "Failed to copy payment link");
    }
  };

  const handleClose = () => {
    modalStore.closeAll();
    setCustomerName("");
    setPaymentLink("");
    setProductTitle("");
    setPaymentAmount("");
  };

  return (
    <Modal
      show={modalStore.modals[PAYMENT_LINK_MODAL]}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Generate Payment Link</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!paymentLink ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="customerName">
              <Form.Label>Customer Name (Optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <Form.Text className="text-muted">
                Customer name will be added to the payment link title.
              </Form.Text>
            </Form.Group>

            {isAdmin && (
              <>
                <hr className="my-3" />
                <p className="text-muted small mb-3 fw-semibold">Admin Settings</p>

                <Form.Group className="mb-3" controlId="productTitle">
                  <Form.Label>Product Title (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Override default payment link title"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Replaces the auto-generated title in Stripe.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="paymentAmount">
                  <Form.Label>Payment Amount in € (Optional)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Override default rent amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Overrides the property rent amount used for this link.
                  </Form.Text>
                </Form.Group>
              </>
            )}

            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                style={{ backgroundColor: "#635BFF", borderColor: "#635BFF" }}
              >
                {loading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  <>
                    <i className="bi bi-stripe me-1"></i> Generate Payment Link
                  </>
                )}
              </Button>
            </div>
          </Form>
        ) : (
          <div className="payment-link-container">
            <p className="mb-2">Your payment link has been generated:</p>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                value={paymentLink}
                readOnly
              />
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleCopy}
                style={{ backgroundColor: "#0d6efd", borderColor: "#0d6efd" }}
              >
                <i className="bi bi-clipboard"></i> Copy
              </button>
            </div>
            <div className="text-center mt-3">
              <Button
                variant="success"
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="me-2"
              >
                <i className="bi bi-box-arrow-up-right me-1"></i> Open Link
              </Button>
              <Button
                variant="primary-outlined"
                onClick={() => {
                  setPaymentLink("");
                  setCustomerName("");
                  setProductTitle("");
                  setPaymentAmount("");
                }}
              >
                Generate Another
              </Button>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default observer(PaymentLinkModal);

