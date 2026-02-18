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
import useTranslation from "next-translate/useTranslation";
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

function ListRoomModal({ show, onHide }: ListRoomModalProps) {
    const { t } = useTranslation("translations");
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
            hasNewImages,
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
            resetListRoomModal,
            setHasNewImages
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
    const [showStepTransitionModal, setShowStepTransitionModal] = useState(false);
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
        if (currentStep === 1) {
            nextAddListingStep();
            return;
        }

        // only show step transition modal if leaving fifth step and there are new images
        const isLeavingFifthStep = currentStep === 5;
        if (isLeavingFifthStep && hasNewImages) setShowStepTransitionModal(true);

        addErrorFields([]);
        const formData = getListingApplicationPayload({ step: currentStep });
        try {
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

                if (currentStep === 5) setHasNewImages(false);
            } else if (res?.invalid_fields) {
                addErrorFields(res.invalid_fields);
            }
        } finally {
            if (isLeavingFifthStep) setShowStepTransitionModal(false);
        }
    };

    const successCallback = () => {
        addErrorFields([]);
        const { reference_id, referenceId, ...rest } = router.query;
        router.replace(
            { pathname: router.pathname, query: rest },
            undefined,
            { shallow: true }
        );
        resetListRoomModal();
        onHide();
    }

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
                return t("list_room_modal.step_titles.welcome");
            case 2:
                return t("list_room_modal.step_titles.contact");
            case 3:
                return t("list_room_modal.step_titles.basics");
            case 4:
                return t("list_room_modal.step_titles.details");
            case 5:
                return t("list_room_modal.step_titles.photos");
            case 6:
                return t("list_room_modal.step_titles.review_publish");
            default:
                return "";
        }
    };

    const actionButtons = (
        <div className="d-flex justify-content-between align-items-center gap-5 m-auto">
            {currentStepIndex === 0 && (
                <button type="button" className="btn-danger" onClick={handleClose}>
                    {t("common.back")}
                </button>
            )}
            {currentStepIndex > 0 && (
                <button type="button" className="btn-danger" onClick={back}>
                    {t("common.back")}
                </button>
            )}
            {!isLast && (
                <button
                    type="button"
                    className="btn-thirteen"
                    onClick={handleNext}
                    disabled={loading}
                >
                    {loading ? (
                        <Spinner size="sm" animation="border" />
                    ) : (
                        t("common.next")
                    )}
                </button>
            )}
        </div>
    );

    const lastStepButtons = (
        <div className="d-flex justify-content-between align-items-center gap-5 m-auto mb-3" style={{ maxWidth: "20em" }}>
            <button type="button" className="btn-danger" onClick={back} disabled={loading}>
                {t("common.back")}
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
                    t("common.submit")
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
                                {(currentStep > 2 && currentStep < 6) && <button
                                    type="button"
                                    className="btn-nine mb-2"
                                    onClick={openDraftModal}
                                >
                                    {t("list_room_modal.save_exit")}
                                </button>}
                            </div>
                            <h5 className="modal-step-title">{getStepTitle()}</h5>
                        </div>
                    </Modal.Header>
                )}

                <Modal.Body>
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
                        </>
                    )}

                    {isCompleteForm && <SuccessStep />}
                </Modal.Body>

                <Modal.Footer className="justify-content-between" ref={footerRef}>
                    {isLast ? lastStepButtons : actionButtons}
                </Modal.Footer>
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
                successCallback={successCallback}
                loadingMessages={[
                    t("list_room_modal.submit_modal.loading_1"),
                    t("list_room_modal.submit_modal.loading_2"),
                    t("list_room_modal.submit_modal.loading_3"),
                ]}
                successTitle={t("list_room_modal.submit_modal.success_title")}
                successMessage={t("list_room_modal.submit_modal.success_message")}
                errorTitle={t("list_room_modal.submit_modal.error_title")}
                errorMessage={t("list_room_modal.submit_modal.error_message")}
            />
            <Modal
                show={showStepTransitionModal}
                backdrop="static"
                backdropClassName="step-transition-loading-modal-backdrop"
                keyboard={false}
                centered
                size="sm"
                contentClassName="border-0 shadow"
                className="step-transition-loading-modal"
            >
                <Modal.Body className="d-flex text-center flex-column align-items-center justify-content-center py-4">
                    <Spinner animation="border" role="status" className="mb-3" />
                    <p className="mb-0 text-muted small">{t("list_room_modal.loading_next_step")}</p>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default observer(ListRoomModal);
