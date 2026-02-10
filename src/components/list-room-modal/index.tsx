"use client";

import React, { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import StepsBar from "@/components/steps/stepsBar";
import SuccessStep from "@/components/list-room-form/success-step";
import DraftRequestModal from "@/components/list-room-form/draft-request-modal";
import useStickyFooter from "@/hooks/useStickyFooter";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import FifthStep from "../list-room-form/fifth-step";
import FirstStep from "../list-room-form/first-step";
import SecondStep from "../list-room-form/second-step";
import ThirdStep from "../list-room-form/third-step";
import FourthStep from "../list-room-form/fourth-step";
import SixthStep from "../list-room-form/sixth-step";

interface ListRoomModalProps {
    show: boolean;
    onHide: () => void;
}

function ListRoomModal({ show, onHide }: ListRoomModalProps) {
    const {
        listRoomStore: {
            steps,
            currentStepIndex,
            currentStep,
            isLast,
            isCompleteForm,
            showDraftModal,
            next,
            back,
            openDraftModal,
            closeDraftModal,
            setCompleteForm,
            reset,
        },
    } = useStore();

    const footerRef = useRef<HTMLDivElement>(null);

    const [transitionDirection, setTransitionDirection] = useState<
        "forward" | "backward" | null
    >(null);
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

    // Use the sticky footer hook to detect if footer is visible
    const isFooterVisible = useStickyFooter(footerRef, {
        isActive: show,
        threshold: 20, // Higher threshold to ensure footer is truly out of view
        initialDelay: 50,
    });

    const validateStep = () => {
        if (currentStep === 2) {
            const nameInput = document.querySelector("#name") as HTMLInputElement | null;
            const name = nameInput?.value;
            if (!name) {
                // validation placeholder
            }
        }

        return true;
    };

    const handleNext = () => {
        if (!validateStep()) return;
        next();
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
                <button type="button" className="btn-thirteen" onClick={handleNext}>
                    Next
                </button>
            )}
        </div>
    );

    const lastStepButtons = (
        <div className="d-flex justify-content-between align-items-center gap-5 m-auto mb-3" style={{ maxWidth: "20em" }}>
            <button type="button" className="btn-danger" onClick={back}>
                Back
            </button>
            <button type="button" className="btn-thirteen" onClick={handleNext}>
                Submit
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
                                    <StepsBar steps={steps} currentStep={currentStepIndex} />
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
                                        <FirstStep steps={steps} currentStep={currentStepIndex} />
                                    )}
                                    {currentStep === 2 && (
                                        <SecondStep steps={steps} currentStep={currentStepIndex} />
                                    )}
                                    {currentStep === 3 && (
                                        <ThirdStep steps={steps} currentStep={currentStepIndex} />
                                    )}
                                    {currentStep === 4 && (
                                        <FourthStep steps={steps} currentStep={currentStepIndex} />
                                    )}
                                    {currentStep === 5 && (
                                        <FifthStep steps={steps} currentStep={currentStepIndex} />
                                    )}
                                    {currentStep === 6 && (
                                        <SixthStep steps={steps} currentStep={currentStepIndex} />
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
        </>
    );
}

export default observer(ListRoomModal);
