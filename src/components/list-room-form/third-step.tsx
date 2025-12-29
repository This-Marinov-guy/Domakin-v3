import React from "react";
import StepsBar from "@/components/steps/stepsBar";

export default function ThirdStep({steps, currentStep}: {steps: string[], currentStep: number}) {
    return (
        <div className="list-room-modal__first-step">
            <div className="list-room-modal__first-step__body d-flex flex-column">
                <StepsBar
                    steps={steps}
                    currentStep={currentStep}
                />
                <h2>
                    Take some nice photos
                </h2>
                <p>
                    In this step we are going to guide you through taking pictures of your place so its stands out.
                </p>
                <p>
                    Add at least 4 photos to attract more candidates. 6–10 works best.
                </p>

            </div>
        </div>
    )
}