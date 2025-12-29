import { useMultiStep } from "@/components/steps/useMultiStep";
import FirstStep from "@/components/list-room-form/first-step";
import SecondStep from "@/components/list-room-form/second-step";
import ThirdStep from "@/components/list-room-form/third-step";
import FourStep from "@/components/list-room-form/fourth-step";
import FifthStep from "@/components/list-room-form/fifth-step";
import SixthStep from "@/components/list-room-form/sixth-step";
import SeventhStep from "@/components/list-room-form/seventh-step";
import EightStep from "@/components/list-room-form/eight-step";
import {useState} from "react";
import SuccessStep from "@/components/list-room-form/success-step";
import DraftRequestModal from "@/components/list-room-form/draft-request-modal";

export default function ListRoomModal() {
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
    const [isCompleteForm, setIsCompleteForm] = useState(false);
    return (
        <>
            <div class="modal fade list-room-modal" id="list-room-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">

                        {!isCompleteForm && (
                            <div class="modal-header m-0 border-bottom-0">
                                <button type="button" className="btn btn-sm btn-outline-secondary reminder-btn" data-bs-toggle="modal" data-bs-target="#draft-request-modal">
                                    Save & exist
                                </button>
                            </div>
                        )}
                        <div class="modal-body p-0 m-0 border-bottom-0">

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
                                        <div className="d-flex flex-column justify-content-center align-items-center mt-40 gap-2">
                                            <button onClick={() => setIsCompleteForm(true)} type="button" class="btn btn-primary border-0">
                                                Publish Listing
                                            </button>
                                            <button type="button" class="btn btn-primary border-0 btn-draft">
                                                Save as draft
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {isCompleteForm && (
                                <SuccessStep />
                            )}

                        </div>

                        {!isLast && (
                            <div class="modal-footer justify-content-between">
                                {currentStep == 0 && (
                                    <button type="button" class="btn btn-outline-secondary border-0" data-bs-dismiss="modal">
                                        Back
                                    </button>
                                )}
                                {currentStep > 0 && (
                                    <button type="button" class="btn btn-outline-secondary border-0" onClick={back}>
                                        Back
                                    </button>
                                )}
                                {!isLast && (
                                    <button type="button" class="btn btn-primary border-0" onClick={handleNext}>
                                        Next
                                    </button>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>

            <DraftRequestModal />
        </>
    );
}