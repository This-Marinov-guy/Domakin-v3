import LogoLarge from "@/assets/images/logo/logo-large.svg";
import Image from "next/image";
import StepsBar from "@/components/steps/stepsBar";

export default function FirstStep({steps, currentStep}: {steps: string[], currentStep: number}) {
    return (
        <div className="list-room-modal__first-step">
            <div className="list-room-modal__first-step__header">
                <Image src={LogoLarge} alt="Logo Icon" />
            </div>
            <div className="list-room-modal__first-step__body d-flex flex-column">
                <StepsBar
                    steps={steps}
                    currentStep={currentStep}
                />
                <h2>
                    Tell us about your place
                </h2>
                <p>
                    In this step, well ask you the type of your place, the city, registration possible and address
                </p>
            </div>
        </div>
    )
}