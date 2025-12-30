import React from "react";

type StepsBarProps = {
    steps: string[];
    currentStep: number;
};

export default function StepsBar({ steps, currentStep }: StepsBarProps) {
    const totalSteps = steps.length;
    const current = currentStep + 1;

    return (
        <div className="steps">
            <div className="">
                Step {current} / {totalSteps}
            </div>
        </div>
    );
}
