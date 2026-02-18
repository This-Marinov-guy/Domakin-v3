import LogoLarge from "@/assets/images/logo/logo-large.svg";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";

export default function FirstStep({ steps, currentStep }: { steps: (string | number)[]; currentStep: number }) {
    const { t } = useTranslation("translations");
    return (
        <div className="list-room-modal__first-step d-flex flex-column">
            <Image className="m-auto" src={LogoLarge} alt="Logo Icon" style={{height: '200px', width: '200px', borderRadius: '20px'}}/>
            <div className="d-flex flex-column items-center justify-center text-center mx-auto mt-80">
                {/* <h2>
                    Welcome to the property uploading
                </h2> */}
                <p>
                    {t("list_room_steps.first.intro")}
                </p>
                <h5>{t("list_room_steps.first.start")}</h5>
            </div>
        </div>
    )
}