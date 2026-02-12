"use client";

import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

export type SubmitListingStatus = "loading" | "success" | "error";

const DEFAULT_LOADING_MESSAGES = [
    "Submitting your listing…",
    "Almost there…",
    "Publishing your room…",
];

interface SubmitListingModalProps {
    show: boolean;
    status: SubmitListingStatus;
    onClose: () => void;
    onRetry?: () => void;
    loadingMessages?: string[];
    successTitle?: string;
    successMessage?: string;
    errorTitle?: string;
    errorMessage?: string;
    successCallback?: () => void;
}

export default function SubmitListingModal({
    show,
    status,
    onClose,
    onRetry,
    successCallback,
    loadingMessages = DEFAULT_LOADING_MESSAGES,
    successTitle = "Listing submitted",
    successMessage = "Your listing has been published successfully.",
    errorTitle = "Something went wrong",
    errorMessage = "We couldn't submit your listing. Please try again or contact support.",
}: SubmitListingModalProps) {
    const [messageIndex, setMessageIndex] = useState(0);
    const autoSuccessTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!show || status !== "loading" || loadingMessages.length === 0) return;
        const interval = setInterval(() => {
            setMessageIndex((i) => (i + 1) % loadingMessages.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [show, status]);

    useEffect(() => {
        // Schedule auto-close callback on success
        if (status === "success" && successCallback) {
            autoSuccessTimeoutRef.current = setTimeout(() => {
                autoSuccessTimeoutRef.current = null;
                successCallback();
            }, 5000);
        }

        // Cleanup: cancel pending timeout when status changes or component unmounts
        return () => {
            if (autoSuccessTimeoutRef.current) {
                clearTimeout(autoSuccessTimeoutRef.current);
                autoSuccessTimeoutRef.current = null;
            }
        };
    }, [status, successCallback]);

    const handleClose = () => {
        // If user closes manually, cancel any scheduled auto-callback
        if (autoSuccessTimeoutRef.current) {
            clearTimeout(autoSuccessTimeoutRef.current);
            autoSuccessTimeoutRef.current = null;
        }

        if (status === "success" && successCallback) {
            successCallback();
        } else {
            onClose();
        }
    };

    return (
        <Modal
            show={show}
            size="lg"
            centered
            backdrop="static"
            keyboard={false}
            onHide={handleClose}
            className="submit-listing-modal"
            backdropClassName="submit-listing-modal-backdrop"
        >
            <Modal.Body className="text-center py-5 px-4">
                {status === "loading" && (
                    <>
                        <h4>Application Submission</h4>
                        <Spinner
                            animation="border"
                            role="status"
                            className="mb-4"
                            style={{ width: "3rem", height: "3rem", color: '#ff914d' }}
                        />
                        <div
                            className="submit-listing-modal__carousel small text-muted"
                            style={{ minHeight: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <span
                                key={messageIndex}
                                className="d-block animate-slide-up"
                                style={{
                                    animation: "submitListingSlideUp 0.35s ease-out",
                                    color: '#004aad',
                                }}
                            >
                                {loadingMessages[messageIndex]}
                            </span>
                        </div>
                    </>
                )}

                {status === "success" && (
                    <>
                        <img
                            src="/assets/images/icon/payment-success.svg"
                            alt=""
                            width={100}
                            height={100}
                            className="mb-3 m-auto"
                        />
                        <h5 className="text-success mb-2">{successTitle}</h5>
                        <p className="text-muted mb-4">{successMessage}</p>
                        <button type="button" className="btn-two" onClick={handleClose}>
                            Close
                        </button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <img
                            src="/assets/images/icon/payment-failure.svg"
                            alt=""
                            width={100}
                            height={100}
                            className="mb-3 m-auto"
                        />
                        <h5 className="text-danger mb-2">{errorTitle}</h5>
                        <p className="text-muted mb-4">{errorMessage}</p>
                        <div className="d-flex gap-3 justify-content-center flex-wrap">
                            {onRetry && (
                                <button type="button" className="btn-two" onClick={onRetry}>
                                    Retry
                                </button>
                            )}
                            <button type="button" className="btn-danger" onClick={handleClose}>
                                Close
                            </button>
                        </div>
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
}
