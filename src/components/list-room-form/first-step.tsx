import LogoLarge from "@/assets/images/logo/logo-large.svg";
import Image from "next/image";
import StepsBar from "@/components/steps/stepsBar";

export default function FirstStep({ steps, currentStep }: { steps: (string | number)[]; currentStep: number }) {
    return (
        <div className="list-room-modal__first-step d-flex flex-column">
            <Image className="m-auto" src={LogoLarge} alt="Logo Icon" style={{height: '200px', width: '200px', borderRadius: '20px'}}/>
            <div className="d-flex flex-column items-center justify-center text-center mx-auto mt-80">
                {/* <h2>
                    Welcome to the property uploading
                </h2> */}
                <p>
                    In the next few steps, we are going to collect some information about the property and essential contact details. The process is easy and you can save and come back from where you were at any moment.
                </p>
                <h5>Let's start!</h5>
            </div>
        </div>
    )
}