"use client";

import React, { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import StepsBar from "@/components/steps/stepsBar";
import SuccessStep from "@/components/list-room-form/success-step";
import DraftRequestModal from "@/components/list-room-form/draft-request-modal";
import useStickyFooter from "@/hooks/useStickyFooter";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import { useServer } from "@/hooks/useServer";
import { useRouter } from "next/router";
import FifthStep from "../list-room-form/fifth-step";
import FirstStep from "../list-room-form/first-step";
import SecondStep from "../list-room-form/second-step";
import ThirdStep from "../list-room-form/third-step";
import FourthStep from "../list-room-form/fourth-step";
import SixthStep from "../list-room-form/sixth-step";
import SubmitListingModal, { type SubmitListingStatus } from "@/components/ui/modals/SubmitListingModal";
import { LISTING_REFERENCE_ID } from "@/utils/defines";

interface ListRoomModalProps {
    show: boolean;
    onHide: () => void;
}

const VALIDATE_STEP_INDEXES = [2, 3, 4, 5];

function ListRoomModal({ show, onHide }: ListRoomModalProps) {
    const {
        listRoomStore: {
            isCompleteForm,
            showDraftModal,
            openDraftModal,
            closeDraftModal,
            setCompleteForm,
            reset,
        },
        propertyStore: {
            addErrorFields,
            referenceId,
            setReferenceId,
            addListingSteps,
            addListingCurrentStepIndex: currentStepIndex,
            addListingCurrentStep: currentStep,
            addListingIsLast: isLast,
            nextAddListingStep,
            backAddListingStep: back,
            getListingApplicationPayload,
            resetListRoomModal
        },
    } = useStore();

    const router = useRouter();
    const { sendRequest, loading } = useServer();
    const footerRef = useRef<HTMLDivElement>(null);

    const [transitionDirection, setTransitionDirection] = useState<
        "forward" | "backward" | null
    >(null);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<SubmitListingStatus>("loading");
    const lastStepIndexRef = useRef(currentStepIndex);

    useEffect(() => {
        const last = lastStepIndexRef.current;
        if (currentStepIndex > last) {
            setTransitionDirection("forward");
        } else if (currentStepIndex < last) {
            setTransitionDirection("backward");
        }
        lastStepIndexRef.current = currentStepIndex;
    }, [currentStepIndex]);

    // Sync referenceId from URL query when modal is open (e.g. user landed with ?reference_id=xxx)
    useEffect(() => {
        if (!show || typeof window === "undefined") return;
        const q = router?.query;
        const refId = q?.referenceId;
        if (refId && typeof refId === "string") {
            setReferenceId(refId);
        }
    }, [show, router?.query, setReferenceId]);


    const handleNext = async () => {
        addErrorFields([]);
        const formData = getListingApplicationPayload({ step: currentStep });
        const res = await sendRequest(
            `/listing-application/validate/step-${currentStep}`,
            "POST",
            formData,
        );
        if (res?.status) {
            addErrorFields([]);
            if (res.data.referenceId) {
                setReferenceId(res.data.referenceId);
                router.replace(
                    { pathname: router.pathname, query: { ...router.query, reference_id: res.data.referenceId } },
                    undefined,
                    { shallow: true }
                );
            }
            nextAddListingStep();
        } else if (res?.invalid_fields) {
            addErrorFields(res.invalid_fields);
        }
    };

    const runSubmitRequest = async () => {
        addErrorFields([]);
        const formData = getListingApplicationPayload({ step: currentStep });
        const res = await sendRequest(
            "/listing-application/submit",
            "POST",
            formData
        );
        if (res?.status) {
            setSubmitStatus("success");
            addErrorFields([]);
            const { reference_id, referenceId, ...rest } = router.query;
            router.replace(
                { pathname: router.pathname, query: rest },
                undefined,
                { shallow: true }
            );
            resetListRoomModal();
            onHide();
        } else {
            setSubmitStatus("error");
            if (res?.invalid_fields) addErrorFields(res.invalid_fields);
        }
    };

    const handleSubmit = async () => {
        setShowSubmitModal(true);
        setSubmitStatus("loading");
        await runSubmitRequest();
    };

    const handleSubmitModalClose = () => {
        setShowSubmitModal(false);
        if (submitStatus === "success") {
            resetListRoomModal();
            onHide();
        }
    };

    const handleSubmitRetry = async () => {
        setSubmitStatus("loading");
        await runSubmitRequest();
    };

    const handleClose = () => {
        reset();
        onHide();
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 1:
                return "Welcome to the property uploading";
            case 2:
                return "Fill the contact details";
            case 3:
                return "Tell us the basics";
            case 4:
                return "Lets give some more details";
            case 5:
                return "Take some nice photos";
            case 6:
                return "Review & Publish";
            default:
                return "";
        }
    };

    const actionButtons = (
        <div className="d-flex justify-content-between align-items-center gap-5 m-auto">
            {currentStepIndex === 0 && (
                <button type="button" className="btn-danger" onClick={handleClose}>
                    Back
                </button>
            )}
            {currentStepIndex > 0 && (
                <button type="button" className="btn-danger" onClick={back}>
                    Back
                </button>
            )}
            {!isLast && (
                <button
                    type="button"
                    className="btn-thirteen"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <Spinner size="sm" animation="border" />
                    ) : (
                        "Next"
                    )}
                </button>
            )}
        </div>
    );

    const lastStepButtons = (
        <div className="d-flex justify-content-between align-items-center gap-5 m-auto mb-3" style={{ maxWidth: "20em" }}>
            <button type="button" className="btn-danger" onClick={back} disabled={loading}>
                Back
            </button>
            <button
                type="button"
                className="btn-thirteen"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <Spinner size="sm" animation="border" />
                ) : (
                    "Submit"
                )}
            </button>
        </div>
    );

    return (
        <>
            <Modal
                id="list-room-modal"
                show={show}
                onHide={handleClose}
                fullscreen
                centered
            >
                {!isCompleteForm && (
                    <Modal.Header className="sticky-modal-header">
                        <div className="container">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="flex-grow-1">
                                    <StepsBar steps={addListingSteps} currentStep={currentStepIndex} />
                                </div>
                                {(currentStep > 1 && currentStep < 6) && <button
                                    type="button"
                                    className="btn-nine mb-2"
                                    onClick={openDraftModal}
                                >
                                    Save & exit
                                </button>}
                            </div>
                            <h5 className="modal-step-title">{getStepTitle()}</h5>
                        </div>
                    </Modal.Header>
                )}

                <Modal.Body style={{ padding: 0, minHeight: "75vh" }}>
                    {!isCompleteForm && (
                        <>
                            <div className="list-room-step-transition">
                                <div
                                    key={currentStep}
                                    className={`list-room-step-transition__inner ${transitionDirection === "forward"
                                        ? "list-room-step-transition__inner--forward"
                                        : transitionDirection === "backward"
                                            ? "list-room-step-transition__inner--backward"
                                            : ""
                                        }`}
                                >
                                    {currentStep === 1 && (
                                        <FirstStep steps={addListingSteps} currentStep={currentStepIndex} />
                                    )}
                                    {currentStep === 2 && (
                                        <SecondStep steps={addListingSteps} currentStep={currentStepIndex} />
                                    )}
                                    {currentStep === 3 && (
                                        <ThirdStep steps={addListingSteps} currentStep={currentStepIndex} />
                                    )}
                                    {currentStep === 4 && (
                                        <FourthStep steps={addListingSteps} currentStep={currentStepIndex} />
                                    )}
                                    {currentStep === 5 && (
                                        <FifthStep steps={addListingSteps} currentStep={currentStepIndex} />
                                    )}
                                    {currentStep === 6 && (
                                        <SixthStep steps={addListingSteps} currentStep={currentStepIndex} />
                                    )}
                                </div>
                            </div>

                            {/* Sticky footer for final step */}
                            {isLast &&
                                <div className="container">
                                    {lastStepButtons}
                                </div>
                            }
                        </>
                    )}

                    {isCompleteForm && <SuccessStep />}
                </Modal.Body>

                {!isLast && !isCompleteForm && (
                    <Modal.Footer className="justify-content-between" ref={footerRef}>
                        {actionButtons}
                    </Modal.Footer>
                )}
            </Modal>

            <DraftRequestModal
                show={showDraftModal}
                onHide={closeDraftModal}
                onKeepEditing={closeDraftModal}
            />

            <SubmitListingModal
                show={showSubmitModal}
                status={submitStatus}
                onClose={handleSubmitModalClose}
                onRetry={handleSubmitRetry}
                loadingMessages={[
                    "Submitting your listing…",
                    "Almost there…",
                    "Publishing your room…",
                ]}
                successTitle="Listing submitted"
                successMessage="Your listing has been published successfully."
                errorTitle="Something went wrong"
                errorMessage="We couldn't submit your listing. Please try again."
            />
        </>
    );
}

export default observer(ListRoomModal);
