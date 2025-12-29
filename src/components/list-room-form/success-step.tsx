
import logoTransparentWhite from "@/assets/img/logo.png";
import Image from "next/image";
import StepsBar from "@/components/steps/stepsBar";

export default function SuccessStep() {
    return (
        <div className="list-room-modal__first-step pt-25">
            <div className="list-room-modal__first-step__body d-flex flex-column justify-content-center">
                <h2 className="text-center pb-25">
                    Success
                </h2>
                <div className="list-room-modal__first-step__header justify-content-center">
                    <Image src={logoTransparentWhite} alt="Logo Icon" />
                </div>
                <h3 className="text-center">
                    Listing successfully <br />
                    send for review <br />
                    You will be contacted shortly!
                </h3>
                <p className="text-center">
                    If you have any questions do not
                    hesitate to contacts us at <br />
                    <strong>
                        list-my-room@domakin.nl
                    </strong>
                    <br />
                    or at
                    <strong>
                        (+31) 085 083 5000
                    </strong>
                </p>
                <p className="text-center">
                    How to get more candidates: <br />
                    add 6–10 photos, include <br />
                    dimensions, mention registration.
                </p>

                <button type="button" class="btn btn-primary border-0 btn-draft" data-bs-dismiss="modal">
                    Exit
                </button>
            </div>
        </div>
    )
}