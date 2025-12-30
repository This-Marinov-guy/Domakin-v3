import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useMultiStep } from "@/components/steps/useMultiStep";
import StepsBar from "@/components/steps/stepsBar";
import FirstStep from "@/components/list-room-form/first-step";
import SecondStep from "@/components/list-room-form/second-step";
import ThirdStep from "@/components/list-room-form/third-step";
import FourStep from "@/components/list-room-form/fourth-step";
import FifthStep from "@/components/list-room-form/fifth-step";
import SixthStep from "@/components/list-room-form/sixth-step";
import SeventhStep from "@/components/list-room-form/seventh-step";
import EightStep from "@/components/list-room-form/eight-step";
import SuccessStep from "@/components/list-room-form/success-step";
import DraftRequestModal from "@/components/list-room-form/draft-request-modal";

interface ListRoomModalProps {
    show: boolean;
    onHide: () => void;
}

export default function ListRoomModal({ show, onHide }: ListRoomModalProps) {
    const steps = [
        'Domakin',
        'Basic Information',
        'Gallery Advice',
        'Gallery',
        'Gallery Preview',
        'Rent Information',
        'Contact Information',
        'Review & Publish',
    ];
    const { currentStep, step, next, back, goTo, isLast } = useMultiStep(steps);
    const [isCompleteForm, setIsCompleteForm] = useState(false);
    const [showDraftModal, setShowDraftModal] = useState(false);
    
    const validateStep = () => {
        if (step === "Basic Information") {
            const name = document.querySelector("#name")?.value;
            if (!name) {
                // alert("name is required");
                // return false;
            }
        }

        return true;
    };
    
    const handleNext = () => {
        if (!validateStep()) return;
        next();
    };
    
    const handleClose = () => {
        onHide();
    };
    
    const handleOpenDraftModal = () => {
        setShowDraftModal(true);
    };
    
    const getStepTitle = () => {
        switch (step) {
            case 'Domakin':
                return 'Tell us about your place';
            case 'Basic Information':
                return 'Tell us the basics. You can change these later';
            case 'Gallery Advice':
                return 'Take some nice photos';
            case 'Gallery':
                return 'Upload Photos';
            case 'Gallery Preview':
                return 'Good job! How does it look';
            case 'Rent Information':
                return 'The basics';
            case 'Contact Information':
                return 'Contact Information';
            case 'Review & Publish':
                return 'Review & Publish';
            default:
                return '';
        }
    };
    
    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                fullscreen
                className="list-room-modal"
            >

                {!isCompleteForm && (
                    <Modal.Header className="sticky-modal-header">
                        <div className="container">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="flex-grow-1">
                                    <StepsBar steps={steps} currentStep={currentStep} />
                                </div>
                                <button 
                                    type="button" 
                                    className="btn-nine" 
                                    onClick={handleOpenDraftModal}
                                >
                                    Save & exit
                                </button>
                            </div>
                            {step !== 'Domakin' && (
                                <h2 className="modal-step-title">{getStepTitle()}</h2>
                            )}
                        </div>
                    </Modal.Header>
                )}
                
                <Modal.Body>

                            {!isCompleteForm && (
                                <>
                                    {step == 'Domakin' && (
                                        <FirstStep steps={steps} currentStep={currentStep} />
                                    )}
                                    {step == 'Basic Information' && (
                                        <SecondStep steps={steps} currentStep={currentStep} />
                                    )}
                                    {step == 'Gallery Advice' && (
                                        <ThirdStep steps={steps} currentStep={currentStep} />
                                    )}
                                    {step == 'Gallery' && (
                                        <FourStep steps={steps} currentStep={currentStep} />
                                    )}
                                    {step == 'Gallery Preview' && (
                                        <FifthStep steps={steps} currentStep={currentStep} />
                                    )}
                                    {step == 'Rent Information' && (
                                        <SixthStep steps={steps} currentStep={currentStep} />
                                    )}
                                    {step == 'Contact Information' && (
                                        <SeventhStep steps={steps} currentStep={currentStep} />
                                    )}
                                    {step == 'Review & Publish' && (
                                        <EightStep steps={steps} currentStep={currentStep} />
                                    )}
                                    {isLast && (
                                        <div className="d-flex flex-column justify-content-center align-items-center mt-40 gap-2" ref={footerRef}>
                                            <button onClick={() => setIsCompleteForm(true)} type="button" className="btn btn-primary border-0">
                                                Publish Listing
                                            </button>
                                            <button type="button" className="btn btn-primary border-0 btn-draft">
                                                Save as draft
                                            </button>
                                        </div>
                                    )}
                                    
                                    {/* Sticky footer for final step */}
                                    {isLast && !isFooterVisible && (
                                        <div
                                            className="sticky-modal-footer"
                                            style={{
                                                position: "fixed",
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                backgroundColor: "white",
                                                padding: "15px 20px",
                                                boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.15)",
                                                zIndex: 1051,
                                                borderTop: "1px solid #e0e0e0",
                                                animation: "fadeInUp 0.3s ease-in-out",
                                            }}
                                        >
                                            <div className="container">
                                                <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                                                    <button 
                                                        onClick={() => setIsCompleteForm(true)} 
                                                        type="button" 
                                                        className="btn btn-primary border-0"
                                                        style={{
                                                            maxWidth: "300px",
                                                            width: "100%",
                                                        }}
                                                    >
                                                        Publish Listing
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-primary border-0 btn-draft"
                                                        style={{
                                                            maxWidth: "300px",
                                                            width: "100%",
                                                        }}
                                                    >
                                                        Save as draft
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                    {isCompleteForm && (
                        <SuccessStep />
                    )}

                </Modal.Body>

                {!isLast && !isCompleteForm && (
                    <Modal.Footer className="justify-content-between">
                        <div className="container">
                            <div className="d-flex justify-content-between align-items-center">
                                {currentStep == 0 && (
                                    <button type="button" className="btn-danger" onClick={handleClose}>
                                        Back
                                    </button>
                                )}
                                {currentStep > 0 && (
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
                        </div>
                    </Modal.Footer>
                )}
            </Modal>

            <DraftRequestModal 
                show={showDraftModal} 
                onHide={() => setShowDraftModal(false)}
                onKeepEditing={() => setShowDraftModal(false)}
            />
        </>
    );
}