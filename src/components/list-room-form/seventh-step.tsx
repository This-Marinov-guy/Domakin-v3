import React from "react";
import StepsBar from "@/components/steps/stepsBar";
import Form from "react-bootstrap/Form";

export default function SeventhStep({steps, currentStep}: {steps: string[], currentStep: number}) {
    return (
        <div className="list-room-modal__first-step">
            <div className="list-room-modal__first-step__body d-flex flex-column">
                <StepsBar
                    steps={steps}
                    currentStep={currentStep}
                />
                <h2>
                    Contact
                </h2>

                <div className="form-group">
                    <Form.Control
                        type="text"
                        placeholder="Full Name"
                        className="py-2"
                    />
                </div>

                <div className="form-group">
                    <Form.Control
                        type="text"
                        placeholder="Phone number"
                        className="py-2"
                    />
                </div>

                <div className="form-group">
                    <Form.Control
                        type="email"
                        placeholder="Email"
                        className="py-2"
                    />
                </div>

                <div className="form-group form-radio-group d-flex flex-row align-items-center">
                    <Form.Check
                        type="checkbox"
                        name="terms-and-condition"
                        id="terms-and-condition"
                    />
                    <label htmlFor="terms-and-condition">
                        I agree to the Terms & Policy.
                    </label>
                </div>

                <div className="form-group form-radio-group d-flex flex-row align-items-center">
                    <Form.Check
                        type="checkbox"
                        name="collect-tenant"
                        id="collect-tenant"
                    />
                    <label htmlFor="collect-tenant">
                        €200 is paid after the new tenant signs.
                        We’ll collect payout details then.
                    </label>
                </div>

            </div>
        </div>
    )
}